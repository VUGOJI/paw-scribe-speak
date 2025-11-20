// Import and re-export the official Supabase client
import { supabase } from '@/integrations/supabase/client'
export { supabase }

// Database types
export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  treat_points: number
  is_premium: boolean
  premium_expires_at: string | null
  daily_streak: number
  last_translation_date: string | null
  created_at: string
  updated_at: string
}

export interface Pet {
  id: string
  user_id: string
  name: string
  type: 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'other'
  breed: string | null
  birthday: string | null
  photo_url: string | null
  is_active: boolean
  favorite_mode: string | null
  personality_traits: string[] | null
  created_at: string
  updated_at: string
}

export interface Translation {
  id: string
  user_id: string
  pet_id: string
  original_audio_url: string | null
  translation_text: string
  translation_mode: string | null
  confidence_score: number | null
  audio_duration_seconds: number | null
  voice_type: string
  is_shared: boolean
  treat_points_earned: number
  created_at: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: string
  requirement_type: string
  requirement_value: number | null
  is_premium_only: boolean
  created_at: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
  badge: Badge
}

// Auth helper functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Pet management functions
export const createPet = async (pet: Omit<Pet, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('pets')
    .insert(pet)
    .select()
    .single()
  
  return { data, error }
}

export const getUserPets = async () => {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const updatePet = async (petId: string, updates: Partial<Pet>) => {
  const { data, error } = await supabase
    .from('pets')
    .update(updates)
    .eq('id', petId)
    .select()
    .single()
  
  return { data, error }
}

// Translation functions
export const translatePetSound = async (
  petType: string, 
  petId: string, 
  mode?: string, 
  audioUrl?: string
) => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    throw new Error('User not authenticated')
  }

  const response = await fetch('/functions/v1/translate-pet-sound', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      petType,
      petId,
      mode,
      audioUrl,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to translate pet sound')
  }

  return response.json()
}

export const getUserTranslations = async (limit?: number) => {
  let query = supabase
    .from('translations')
    .select(`
      *,
      pets (name, type, photo_url)
    `)
    .order('created_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query
  return { data, error }
}

// Badge functions
export const getUserBadges = async () => {
  const { data, error } = await supabase
    .from('user_badges')
    .select(`
      *,
      badges (*)
    `)
    .order('earned_at', { ascending: false })
  
  return { data, error }
}

export const getAllBadges = async () => {
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .order('category', { ascending: true })
  
  return { data, error }
}

// Profile functions
export const getUserProfile = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .single()
  
  return { data, error }
}

export const updateUserProfile = async (updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .select()
    .single()
  
  return { data, error }
}