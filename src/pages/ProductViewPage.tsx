import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { addToCart } from "@/lib/cartStorage";
import { getProductById, getProducts } from "@/utils/productStorage";

export default function ProductViewPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();

  const product = id ? getProductById(id) : null;

  const related = useMemo(() => {
    if (!product) return [];
    return getProducts().slice(0, 4);
  }, [product]);

  if (!product) return <div>Not found</div>;

  return (
    <div>
      <h1>{product.name}</h1>

      <Button onClick={() => addToCart(product.id, 1)}>
        Add to cart
      </Button>

      <Button onClick={() => nav(`/chat?seller=${product.sellerId}`)}>
        Chat Seller
      </Button>
    </div>
  );
}
