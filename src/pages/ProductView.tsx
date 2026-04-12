import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/supabase";

export default function ProductView() {
  const { id } = useParams();
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

  return <h1>{product.title}</h1>;
}
