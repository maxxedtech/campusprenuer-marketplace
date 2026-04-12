import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { addToCart } from "@/lib/cartStorage";
import { getProducts } from "@/utils/productStorage";

export default function ProductView() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();

  const product = useMemo(() => {
    return getProducts().find((p) => p.id === id);
  }, [id]);

  const [qty, setQty] = useState(1);

  if (!product) return <div>Not found</div>;

  return (
    <div>
      <h1>{product.name}</h1>

      <Input
        type="number"
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
      />

      <Button onClick={() => addToCart(product.id, qty)}>
        Add to cart
      </Button>
    </div>
  );
}
