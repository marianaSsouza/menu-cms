import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "../services/product-service";
import type { CreateProductDto } from "../dtos/create-product.dto";
import type { UpdateProductDto } from "../dtos/update-product.dto";

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
export function useCreateProduct() {
    const queryClient = useQueryClient() //useQueryClient dá acesso ao cache, e é por ele que a invalidação é feita.
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
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }) //onSuccess com invalidateQueries marca como desatualizado tudo que começa com ['products']. O TanStack Query refaz a busca da lista e a tela atualiza sozinha. O enunciado pede exatamente isso.
    })
}

export function useDeleteProduct() {
    const queryClient = useQueryClient()
    return useMutation({ //useMutation é o useQuery das gravações. Em vez de buscar sozinho quando a tela abre, ele devolve uma função (mutate) que você chama quando quer gravar, por exemplo no clique do botão Salvar.
        mutationFn: (id: string) => ProductService.delete(id), //mutationFn é o que a mutação executa. Aqui ela chama o service. No update ela recebe um objeto { id, data }, porque mutate aceita um argumento só, então os dois valores vão juntos.
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
    })
}
