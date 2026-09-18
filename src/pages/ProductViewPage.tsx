import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/lib/products";
import { addToCart } from "@/lib/cartStorage";
import type { LocalProduct } from "@/types/local";

export default function ProductViewPage() { const { id } = useParams(); const nav = useNavigate(); const [product, setProduct] = useState<LocalProduct | null>(null); useEffect(() => { if (id) getProductById(id).then(setProduct); }, [id]); if (!product) return <div className="p-6">Product not found.</div>; return <div className="max-w-3xl mx-auto p-6 space-y-4">{product.image_url ? <img src={product.image_url} className="w-full h-80 object-cover rounded" /> : <div className="w-full h-80 bg-muted rounded flex items-center justify-center">No image</div>}<h1 className="text-2xl font-bold">{product.title}</h1><p className="text-xl">₦{product.price.toLocaleString()}</p><p>{product.description}</p><p className="text-sm text-muted-foreground">Seller: {product.owner_name}</p><div className="flex gap-3"><Button onClick={() => { addToCart(product.id); nav("/cart"); }}>Add to Cart</Button><Button variant="outline" onClick={() => nav(`/chat-room?seller=${product.owner_id}&name=${encodeURIComponent(product.owner_name)}`)}>Chat Seller</Button></div></div>; }
