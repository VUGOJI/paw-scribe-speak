import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TranslationRequest {
  petType: string;
  mode?: string;
  audioUrl?: string;
  petId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    )

    // Get user from authorization header
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const { petType, mode, audioUrl, petId }: TranslationRequest = await req.json()

    // Generate fun pet translations based on type and mode
    const translations = {
      dog: {
        hungry: [
          "I smell treats in the kitchen! Time for dinner?",
          "My bowl is suspiciously empty, human!",
          "Remember when you used to feed me? Good times...",
          "I haven't eaten in... *checks watch* ...20 minutes!"
        ],
        playful: [
          "BALL! Did someone say BALL?!",
          "Zoomies time! Clear the living room!",
          "I challenge you to a game of tug-of-war!",
          "Let's go outside and chase ALL the squirrels!"
        ],
        moody: [
          "You're home late. I'm not happy about this.",
          "The cat got my favorite spot on the couch again.",
          "I saw you pet the neighbor's dog. We need to talk.",
          "My kibble better be the good brand today."
        ],
        sleepy: [
          "Five more minutes... just five more...",
          "The sun spot on the carpet is calling my name.",
          "I'm not lazy, I'm energy efficient.",
          "Nap time is the best time of day."
        ],
        default: [
          "I love you so much, human!",
          "Today is the BEST day ever!",
          "I wonder what adventure we'll have today?",
          "You're the best pack leader ever!"
        ]
      },
      cat: {
        hungry: [
          "My food bowl is merely half full. This is unacceptable.",
          "I require the finest tuna, served at room temperature.",
          "Human, your services are needed in the kitchen.",
          "That's not the good food. I want the GOOD food."
        ],
        playful: [
          "I shall now demonstrate my hunting prowess on this feather.",
          "Time to knock everything off the counter!",
          "The red dot has returned! My nemesis!",
          "I must investigate this suspicious cardboard box."
        ],
        moody: [
          "I am displeased with your recent performance, human.",
          "You may pet me... but only on MY terms.",
          "The dog looked at me funny. This cannot stand.",
          "I require immediate attention, but don't you dare actually touch me."
        ],
        sleepy: [
          "I shall grace this sunbeam with my presence.",
          "Do not disturb. I am conducting important cat business.",
          "The world can wait. I have napping to do.",
          "This warm laptop keyboard is the perfect pillow."
        ],
        default: [
          "I suppose you're adequate, human.",
          "You may continue to serve me.",
          "I acknowledge your existence.",
          "Perhaps we can coexist peacefully today."
        ]
      },
      bird: {
        hungry: [
          "Seeds! Beautiful, delicious seeds!",
          "My crops need filling, stat!",
          "Time for breakfast, lunch, and dinner!",
          "I spy with my little eye... FOOD!"
        ],
        playful: [
          "Let's sing the song of our people!",
          "Watch me do barrel rolls around the cage!",
          "Mirror bird, we meet again!",
          "Time to show off my dance moves!"
        ],
        moody: [
          "I demand to speak to the manager!",
          "This cage is clearly too small for my magnificence.",
          "Where's my privacy? A bird needs space!",
          "I'm filing a complaint with bird resources."
        ],
        sleepy: [
          "One eye open, watching for predators...",
          "Perch time is sacred time.",
          "Tucking my head under my wing now.",
          "The early bird can wait until tomorrow."
        ],
        default: [
          "Hello! Hello! Pretty bird!",
          "The view from up here is fantastic!",
          "I love singing in the morning!",
          "Flight patterns are looking good today!"
        ]
      }
    }

    // Get translations for the pet type
    const petTranslations = translations[petType as keyof typeof translations] || translations.dog
    const modeTranslations = petTranslations[mode as keyof typeof petTranslations] || petTranslations.default
    
    // Pick a random translation
    const translation = modeTranslations[Math.floor(Math.random() * modeTranslations.length)]

    // Calculate confidence score (simulate AI confidence)
    const confidence = Math.random() * 0.3 + 0.7 // Between 70-100%

    // Get pet info for personalized response
    const { data: pet } = await supabaseClient
      .from('pets')
      .select('name, type, breed')
      .eq('id', petId)
      .eq('user_id', user.id)
      .single()

    let personalizedTranslation = translation
    if (pet?.name) {
      // Add pet's name to some translations
      if (Math.random() > 0.3) {
        personalizedTranslation = `${pet.name} says: "${translation}"`
      }
    }

    // Save translation to database
    const { data: savedTranslation, error: saveError } = await supabaseClient
      .from('translations')
      .insert({
        user_id: user.id,
        pet_id: petId,
        original_audio_url: audioUrl,
        translation_text: personalizedTranslation,
        translation_mode: mode || 'default',
        confidence_score: confidence,
        treat_points_earned: 10
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving translation:', saveError)
    }

    // Update user's treat points
    await supabaseClient.rpc('increment_treat_points', { 
      user_uuid: user.id, 
      points: 10 
    })

    // Update daily streak
    await supabaseClient.rpc('update_daily_streak', { 
      user_uuid: user.id 
    })

    // Check and award badges
    await supabaseClient.rpc('check_and_award_badges', { 
      user_uuid: user.id 
    })

    return new Response(
      JSON.stringify({
        success: true,
        translation: personalizedTranslation,
        confidence,
        treatPointsEarned: 10,
        translationId: savedTranslation?.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Translation error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to translate pet sound',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})