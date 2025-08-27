import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createPet, getUserPets, updatePet, type Pet } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const usePets = () => {
  return useQuery({
    queryKey: ['pets'],
    queryFn: async () => {
      const { data, error } = await getUserPets()
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
      const { data, error } = await createPet(newPet)
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
      const { data, error } = await updatePet(petId, updates)
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