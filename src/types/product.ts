export type ProductStatus = "draft" | "published" | "archived";

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProductMedia {
  id: string;
  product_id: string;
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  folder: string | null;
  sort_order: number;
  deleted_at: string | null;
}

export interface ProductRecord {
  id: string;
  vendor_id: string;
  title: string;
  slug: string;
  category_id: string | null;
  description: string | null;
  price_kobo: number;
  stock_quantity: number;
  status: ProductStatus;
  image_url: string | null;
  category: ProductCategory | null;
  media: ProductMedia[];
  store?: { id: string; owner_id: string; store_name: string; slug: string; campus: string; status: string } | null;
  sellerName?: string;
  sellerEmail?: string;
}
