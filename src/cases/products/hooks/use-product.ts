import { useQuery } from "@tanstack/react-query";
import { ProductService } from "../services/product-service";

export function useProducts() {
    return useQuery({
        queryKey: ['products'], //esse é o identificador único da query, que será usado para armazenar e recuperar os dados em cache
        queryFn: ProductService.listAll //essa função é responsável por buscar todos os produtos
    })
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: ['products', id], //. assim cada produto tem o seu próprio cache
        queryFn: () => ProductService.findOne(id), //virou arrow function para passar o id como parâmetro para o service.
        enabled: !!id //requisição não roda até que o id seja válido (diferente de null ou undefined). Isso evita que a requisição seja feita com um id inválido.
    })
}