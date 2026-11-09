import { api } from "@/lib/axios"
import type { CategoryDto } from "../dtos/category.dto"

const ENDPOINT = "/categories"

export const CategoryService = {
    async listAll(): Promise<CategoryDto[]> {
        const result = await api.get<CategoryDto[]>(ENDPOINT)
        return result.data
    },
    async findOne(id: string): Promise<CategoryDto> {
        const result = await api.get<CategoryDto>(`${ENDPOINT}/${id}`)
        return result.data
    }
}