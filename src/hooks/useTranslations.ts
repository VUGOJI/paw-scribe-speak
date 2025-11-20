import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export const useTranslations = (limit?: number) => {
  return useQuery({
    queryKey: ['translations', limit],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let query = supabase
        .from('translations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
}

export const useTranslatePetSound = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ 
      petType, 
      petId, 
      mode, 
      audioUrl 
    }: { 
      petType: string
      petId: string
      mode?: string
      audioUrl?: string 
    }) => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const response = await supabase.functions.invoke('translate-pet-sound', {
        body: { petType, petId, mode, audioUrl },
      })

      if (response.error) throw response.error
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['translations'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      
      toast({
        title: "Translation complete! 🎉",
        description: `You earned ${data.treatPoints || 1} treat points!`,
      })
    },
    onError: (error: any) => {
      toast({
        title: "Translation failed",
        description: error.message || "Failed to translate pet sound",
        variant: "destructive",
      })
    },
  })
}