import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
;
import type { CreateProductDto } from "../dtos/create-product.dto";
import type { UpdateProductDto } from "../dtos/update-product.dto";
import { ProductService } from "../services/product-service";

// o categoryId entra na chave: cada categoria tem o seu cache
export function useProducts(categoryId?: string) {
    return useQuery({
        queryKey: ['products', categoryId],
        queryFn: () => ProductService.listAll(categoryId)
    })
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: ['products', id],
        queryFn: () => ProductService.findOne(id),
        enabled: !!id
    })
}

export function useCreateProduct() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateProductDto) => ProductService.create(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
    })
}

export function useUpdateProduct() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
            ProductService.update(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
    })
}

export function useDeleteProduct() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => ProductService.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
    })
}