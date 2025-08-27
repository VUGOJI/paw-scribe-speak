import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { translatePetSound, getUserTranslations } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useTranslations = (limit?: number) => {
  return useQuery({
    queryKey: ['translations', limit],
    queryFn: async () => {
      const { data, error } = await getUserTranslations(limit)
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
      const data = await translatePetSound(petType, petId, mode, audioUrl)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['translations'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      
      toast({
        title: "Translation complete! 🎉",
        description: `You earned ${data.treatPointsEarned} treat points!`,
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