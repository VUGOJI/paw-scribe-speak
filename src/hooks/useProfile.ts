import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserProfile, updateUserProfile, getUserBadges, type Profile } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data, error } = await getUserProfile()
      if (error) throw error
      return data
    },
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      const { data, error } = await updateUserProfile(updates)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast({
        title: "Profile updated! ✅",
        description: "Your changes have been saved.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export const useBadges = () => {
  return useQuery({
    queryKey: ['badges'],
    queryFn: async () => {
      const { data, error } = await getUserBadges()
      if (error) throw error
      return data
    },
  })
}