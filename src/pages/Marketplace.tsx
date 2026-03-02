import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getProducts, Product } from "@/utils/productStorage";

const Marketplace = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [products, setProducts] = useState<Product[]>([]);

  // Load products (and keep it fresh when you open the page)
  useEffect(() => {
    const all = getProducts();
    const sorted = [...all].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    setProducts(sorted);
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add((p.category || "Uncategorized").trim() || "Uncategorized"));
    return ["All", ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return products.filter((p) => {
      const cat = (p.category || "Uncategorized").trim() || "Uncategorized";

      if (selectedCategory !== "All" && cat !== selectedCategory) return false;

      if (q) {
        const hay = `${p.name} ${p.description} ${cat} ${p.seller}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [products, search, selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <h1 className="text-2xl font-display font-bold">Marketplace</h1>

        <div className="flex-1 md:max-w-md md:ml-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Debug + Category */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="text-sm text-muted-foreground">
          Total products: <b>{products.length}</b> • Showing: <b>{filtered.length}</b>
        </div>

        <div className="sm:ml-auto">
          <select
            className="border rounded-lg px-3 py-2 text-sm bg-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border rounded-xl p-10 text-center">
          <p className="text-muted-foreground">No products available yet.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Add products from the entrepreneur dashboard.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white border rounded-xl overflow-hidden">
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-44 object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-44 bg-gray-100 flex items-center justify-center text-sm text-muted-foreground">
                  No photo
                </div>
              )}

              <div className="p-4 space-y-2">
                <div className="font-semibold text-lg">{p.name}</div>

                <div className="text-sm text-muted-foreground">
                  ₦{p.price} {p.category ? `• ${p.category}` : ""}
                </div>

                <div className="text-sm text-muted-foreground line-clamp-2">
                  {p.description}
                </div>

                <div className="text-xs text-muted-foreground">
                  Seller: <b>{p.seller || "Entrepreneur"}</b>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
