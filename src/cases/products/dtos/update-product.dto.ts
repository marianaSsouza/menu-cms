export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  active?: boolean;
  categoryId?: string | null; // null remove a categoria
  picture?: string | null;    // null remove a imagem
}