import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OrderService } from "../services/order.service";
import type { OrderDto, OrderStatus } from "../dtos/order.dto";

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

// usado pelo Kanban: o cartão muda de coluna na hora (otimista) e a API grava em seguida
export function useMoveOrder() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
            OrderService.updateStatus(id, status),
        onMutate: async ({ id, status }) => {
            await queryClient.cancelQueries({ queryKey: ['orders'] })
            const previous = queryClient.getQueryData<OrderDto[]>(['orders'])

            queryClient.setQueryData<OrderDto[]>(['orders'], (old) =>
                old?.map((order) => (order.id === id ? { ...order, status } : order)),
            )

            return { previous }
        },
        onError: (_error, _variables, context) => {
            // se a API recusar, o cartão volta para a coluna de origem
            if (context?.previous) {
                queryClient.setQueryData(['orders'], context.previous)
            }
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['orders'] })
    })
}