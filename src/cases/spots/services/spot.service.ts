import { api } from "@/lib/axios"
import type { SpotDto } from "../dtos/spot.dto"
import type { CreateSpotDto } from "../dtos/create-spot.dto"
import type { UpdateSpotDto } from "../dtos/update-spot.dto"

const ENDPOINT = "/spots"

export const SpotService = {
    async listAll(): Promise<SpotDto[]> {
        const result = await api.get<SpotDto[]>(ENDPOINT)
        return result.data
    },
    async findOne(id: string): Promise<SpotDto> {
        const result = await api.get<SpotDto>(`${ENDPOINT}/${id}`)
        return result.data
    },
    async create(spot: CreateSpotDto): Promise<SpotDto> {
        const result = await api.post<SpotDto>(ENDPOINT, spot)
        return result.data
    },
    async update(id: string, spot: UpdateSpotDto): Promise<SpotDto> {
        const result = await api.patch<SpotDto>(`${ENDPOINT}/${id}`, spot)
        return result.data
    },
    async delete(id: string): Promise<void> {
        await api.delete(`${ENDPOINT}/${id}`)
    }
}