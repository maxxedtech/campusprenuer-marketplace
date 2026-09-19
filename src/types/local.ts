export type LocalProduct = {
  id: string;
  owner_id: string;
  owner_name: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  created_at: string;
  category?: string;
  views_count?: number;
  cart_add_count?: number;
  sales_count?: number;
};
