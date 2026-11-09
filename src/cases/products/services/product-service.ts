import { api } from "@/lib/axios"
import type { ProductDto } from "../dtos/product.dto"

const ENDPOINT = "/products"

export const ProductService = {
    async listAll(): Promise<ProductDto[]> {
        const result = await api.get<ProductDto[]>(ENDPOINT)
        return result.data
    },
    async findOne(id: string): Promise<ProductDto> {
        const result = await api.get<ProductDto>(`${ENDPOINT}/${id}`)
        return result.data
    }
}