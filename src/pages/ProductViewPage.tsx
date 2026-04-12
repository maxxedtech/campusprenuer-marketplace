import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabase";

export default function ProductViewPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      setProduct(data);
    };

    load();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h1>{product.title}</h1>

      <p>₦{product.price}</p>

      <Button onClick={() => nav(`/chat?seller=${product.owner_id}`)}>
        Chat Seller
      </Button>
    </div>
  );
}
