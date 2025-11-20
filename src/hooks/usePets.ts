import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface Pet {
  id: string
  user_id: string
  name: string
  type: 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'other'
  breed?: string | null
  birthday?: string | null
  photo_url?: string | null
  is_active: boolean
  favorite_mode?: string | null
  personality_traits?: string[] | null
  created_at: string
  updated_at: string
}

export const usePets = () => {
  return useQuery({
    queryKey: ['pets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
  })
}

export const useCreatePet = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (newPet: Omit<Pet, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('pets')
        .insert([{ ...newPet, user_id: user.id }])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] })
      toast({
        title: "Pet added! 🐾",
        description: "Your new furry friend is ready for translation!",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add pet",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export const useUpdatePet = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ petId, updates }: { petId: string; updates: Partial<Pet> }) => {
      const { data, error } = await supabase
        .from('pets')
        .update(updates)
        .eq('id', petId)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] })
      toast({
        title: "Pet updated! ✅",
        description: "Your pet's information has been saved.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update pet",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}