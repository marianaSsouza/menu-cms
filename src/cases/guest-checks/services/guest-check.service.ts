import { api } from "@/lib/axios"
import type { GuestCheckDto, GuestCheckStatus } from "../dtos/guest-check.dto"

const ENDPOINT = "/guest-checks"

export const GuestCheckService = {
    async listAll(status?: GuestCheckStatus): Promise<GuestCheckDto[]> {
        const result = await api.get<GuestCheckDto[]>(ENDPOINT, {
            params: status ? { status } : undefined,
        })
        return result.data
    }
}