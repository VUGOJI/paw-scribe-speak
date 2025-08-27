import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // This function is called via RPC from other edge functions
    // It increments treat points for a user
    const { user_uuid, points }: { user_uuid: string, points: number } = await req.json()

    const { data, error } = await supabaseClient
      .from('profiles')
      .update({ treat_points: supabaseClient.raw('treat_points + ?', [points]) })
      .eq('id', user_uuid)
      .select('treat_points')
      .single()

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, newTotal: data.treat_points }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error incrementing treat points:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to increment treat points' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})