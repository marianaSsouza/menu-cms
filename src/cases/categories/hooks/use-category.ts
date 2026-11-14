import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "../services/category.service";
import type { UpdateCategoryDto } from "../dtos/update-category.dto";
import type { CreateCategoryDto } from "../dtos/create-category.dto";

export function useCategories(){
    return useQuery({
        queryKey: ['categories'],
        queryFn: CategoryService.listAll
    })
}

export function useCreateCategory() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateCategoryDto) => CategoryService.create(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
    })
}

export function useUpdateCategory() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
            CategoryService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            queryClient.invalidateQueries({ queryKey: ['products'] })
        }
    })
}

export function useDeleteCategory() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => CategoryService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            queryClient.invalidateQueries({ queryKey: ['products'] })
        }
    })
}