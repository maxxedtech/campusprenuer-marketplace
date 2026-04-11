// src/pages/Marketplace.tsx

import { useEffect, useMemo, useState } from "react";
import { Search, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import { getProducts } from "@/lib/products";
import { getCurrentUser } from "@/lib/auth";

const Marketplace = () => {
  const nav = useNavigate();

  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const u = await getCurrentUser();
        setUser(u);

        const data = await getProducts();
        setProducts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return products.filter((p) => {
      return (
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.owner_name?.toLowerCase().includes(q)
      );
    });
  }, [products, search]);

  const goToProduct = (id: string) => {
    nav(`/product/${id}`);
  };

  const formatPrice = (price: number) =>
    Number(price || 0).toLocaleString();

  return (
    <div className="container mx-auto px-4 py-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <h1 className="text-2xl font-bold">Marketplace</h1>

        <div className="relative md:ml-auto md:max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />

          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* STATUS */}
      {loading && <p>Loading products...</p>}

      {!loading && filtered.length === 0 && (
        <div className="border rounded-xl p-10 text-center">
          <p>No products available yet.</p>
        </div>
      )}

      {/* PRODUCTS */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="border rounded-xl overflow-hidden cursor-pointer hover:shadow"
            onClick={() => goToProduct(p.id)}
          >

            {/* IMAGE */}
            {p.image_url ? (
              <img
                src={p.image_url}
                className="w-full h-44 object-cover"
              />
            ) : (
              <div className="h-44 flex items-center justify-center bg-gray-200">
                <Store />
              </div>
            )}

            {/* INFO */}
            <div className="p-4 space-y-2">
              <h2 className="font-bold text-lg">{p.title}</h2>

              <p className="text-sm">
                ₦{formatPrice(p.price)}
              </p>

              <p className="text-sm text-gray-500 line-clamp-2">
                {p.description}
              </p>

              <p className="text-xs text-gray-400">
                by {p.owner_name}
              </p>

              <Button
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  nav(`/product/${p.id}`);
                }}
              >
                View Product
              </Button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Marketplace;
