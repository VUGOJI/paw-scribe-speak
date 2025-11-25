import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { petType, petId, mode, audioData } = await req.json()
    console.log('Translation request:', { petType, petId, mode, hasAudio: !!audioData })

    // Get API keys from environment
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured')
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get user from request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Upload audio to storage if provided and transcribe it
    let audioUrl: string | null = null
    let audioTranscription: string | null = null
    
    if (audioData && OPENAI_API_KEY) {
      // Upload to storage
      const audioBuffer = Uint8Array.from(atob(audioData), c => c.charCodeAt(0))
      const fileName = `${user.id}/${Date.now()}.webm`
      
      const { error: uploadError } = await supabase.storage
        .from('pet-audio')
        .upload(fileName, audioBuffer, {
          contentType: 'audio/webm',
          upsert: false
        })

      if (uploadError) {
        console.error('Audio upload error:', uploadError)
      } else {
        const { data: urlData } = supabase.storage
          .from('pet-audio')
          .getPublicUrl(fileName)
        audioUrl = urlData.publicUrl
        console.log('Audio uploaded:', audioUrl)

        // Transcribe the audio using OpenAI Whisper
        try {
          console.log('Transcribing audio with Whisper...')
          const formData = new FormData()
          const blob = new Blob([audioBuffer], { type: 'audio/webm' })
          formData.append('file', blob, 'audio.webm')
          formData.append('model', 'whisper-1')
          formData.append('language', 'en')

          const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: formData,
          })

          if (transcriptionResponse.ok) {
            const transcriptionData = await transcriptionResponse.json()
            audioTranscription = transcriptionData.text
            console.log('Audio transcription:', audioTranscription)
          } else {
            console.error('Transcription failed:', await transcriptionResponse.text())
          }
        } catch (transcribeError) {
          console.error('Transcription error:', transcribeError)
        }
      }
    }

    // Build the prompt based on pet type, mode, and transcription
    let translationPrompt = `You are a professional pet translator. A ${petType} just made a sound. `
    
    if (audioTranscription) {
      translationPrompt += `The actual sounds detected were: "${audioTranscription}". `
    }
    
    if (mode === 'hungry') {
      translationPrompt += `The context suggests the pet might be hungry or wanting food. `
    } else if (mode === 'playful') {
      translationPrompt += `The context suggests the pet is playful and energetic, wanting to play. `
    } else if (mode === 'moody') {
      translationPrompt += `The context suggests the pet is moody or expressing some annoyance. `
    } else if (mode === 'sleepy') {
      translationPrompt += `The context suggests the pet is tired or sleepy. `
    }

    translationPrompt += `Based on ${audioTranscription ? 'the actual sounds and ' : ''}the ${petType}'s typical behavior, translate what they're trying to say into a short, fun, and relatable human sentence. Keep it under 20 words. Be creative and entertaining but accurate to what a ${petType} would actually be thinking or feeling in this situation.`

    // Call Lovable AI Gateway
    console.log('Calling Lovable AI Gateway for translation...')
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a pet translator that converts pet sounds and behaviors into fun, relatable human language. Keep translations short, entertaining, and accurate to the context.'
          },
          {
            role: 'user',
            content: translationPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 100,
      }),
    })

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text()
      console.error('AI Gateway error:', aiResponse.status, errorText)
      
      if (aiResponse.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.')
      }
      if (aiResponse.status === 402) {
        throw new Error('AI credits exhausted. Please add credits to continue.')
      }
      
      throw new Error(`AI Gateway error: ${aiResponse.status}`)
    }

    const aiData = await aiResponse.json()
    const translationText = aiData.choices[0].message.content.trim()

    console.log('Translation generated:', translationText)

    // Save translation to database
    const { data: translation, error: insertError } = await supabase
      .from('translations')
      .insert({
        user_id: user.id,
        pet_id: petId !== 'default' ? petId : null,
        translation_text: translationText,
        translation_mode: mode,
        original_audio_url: audioUrl,
        treat_points_earned: 1,
        confidence_score: audioTranscription ? 0.95 : 0.75,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error saving translation:', insertError)
      throw insertError
    }

    // Update user's treat points
    const { data: profile } = await supabase
      .from('profiles')
      .select('treat_points')
      .eq('id', user.id)
      .single()

    if (profile) {
      await supabase
        .from('profiles')
        .update({ 
          treat_points: (profile.treat_points || 0) + 1
        })
        .eq('id', user.id)
    }

    return new Response(
      JSON.stringify({
        translation: translationText,
        treatPoints: 1,
        translationId: translation.id,
        audioUrl: audioUrl,
        transcription: audioTranscription,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in translate-pet-sound:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Translation failed',
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
