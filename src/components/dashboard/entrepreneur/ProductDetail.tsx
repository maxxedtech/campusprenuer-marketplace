// src/components/dashboard/entrepreneur/ProductDetail.tsx

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { supabase } from "@/supabase";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        if (!id) return;

        // 🔥 get product
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !data) throw new Error("Product not found");

        setProduct(data);

        // 🔥 get more from same seller
        const { data: more } = await supabase
          .from("products")
          .select("*")
          .eq("owner_id", data.owner_id)
          .neq("id", data.id)
          .limit(4);

        setRelated(more || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;

  if (!product) {
    return (
      <div className="p-6">
        <p>Product not found.</p>
        <Button onClick={() => navigate("/marketplace")}>
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      <div className="grid md:grid-cols-2 gap-6">

        {/* IMAGE */}
        <div>
          {product.image_url ? (
            <img
              src={product.image_url}
              className="w-full h-[350px] object-cover rounded"
            />
          ) : (
            <div className="h-[350px] bg-gray-200 flex items-center justify-center">
              No Image
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>

          <p className="text-lg mt-2">
            ₦{Number(product.price).toLocaleString()}
          </p>

          <p className="mt-4">{product.description}</p>

          <p className="mt-4 text-sm text-gray-500">
            Seller: {product.owner_name}
          </p>

          <div className="mt-6 flex gap-3">
            <Button>Chat Seller</Button>

            <Button variant="outline" asChild>
              <Link to="/marketplace">Back</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <div className="mt-10">

          <h2 className="text-xl font-bold mb-4">
            More from this seller
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="border rounded-lg overflow-hidden hover:shadow"
              >

                {p.image_url ? (
                  <img
                    src={p.image_url}
                    className="h-32 w-full object-cover"
                  />
                ) : (
                  <div className="h-32 bg-gray-200 flex items-center justify-center">
                    No Image
                  </div>
                )}

                <div className="p-2">
                  <p className="font-medium">{p.title}</p>
                  <p className="text-sm">
                    ₦{Number(p.price).toLocaleString()}
                  </p>
                </div>

              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
