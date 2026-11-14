import { api } from "@/lib/axios"
import type { CategoryDto } from "../dtos/category.dto"
import type { CreateCategoryDto } from "../dtos/create-category.dto"
import type { UpdateCategoryDto } from "../dtos/update-category.dto"

const ENDPOINT = "/categories"

export const CategoryService = {
    async listAll(): Promise<CategoryDto[]> {
        const result = await api.get<CategoryDto[]>(ENDPOINT)
        return result.data
    },
    async findOne(id: string): Promise<CategoryDto> {
        const result = await api.get<CategoryDto>(`${ENDPOINT}/${id}`)
        return result.data
    },
    async create(category: CreateCategoryDto): Promise<CategoryDto> {
        const result = await api.post<CategoryDto>(ENDPOINT, category)
        return result.data
    },
    async update(id: string, category: UpdateCategoryDto): Promise<CategoryDto> {
        const result = await api.patch<CategoryDto>(`${ENDPOINT}/${id}`, category)
        return result.data
    },
    async delete(id: string): Promise<void> {
        await api.delete(`${ENDPOINT}/${id}`)
    }
}