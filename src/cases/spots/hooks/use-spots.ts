import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SpotService } from "../services/spot.service";
import type { CreateSpotDto } from "../dtos/create-spot.dto";
import type { UpdateSpotDto } from "../dtos/update-spot.dto";

export function useSpots() {
    return useQuery({
        queryKey: ['spots'],
        queryFn: SpotService.listAll
    })
}

export function useCreateSpot() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateSpotDto) => SpotService.create(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['spots'] })
    })
}

export function useUpdateSpot() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateSpotDto }) =>
            SpotService.update(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['spots'] })
    })
}

export function useDeleteSpot() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => SpotService.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['spots'] })
    })
}