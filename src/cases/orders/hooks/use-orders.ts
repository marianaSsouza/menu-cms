import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OrderService } from "../services/order.service";
import type { OrderStatus } from "../dtos/order.dto";

export function useOrders() {
    return useQuery({
        queryKey: ['orders'],
        queryFn: OrderService.listAll
    })
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
            OrderService.updateStatus(id, status),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] })
    })
}