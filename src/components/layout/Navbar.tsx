import { useEffect, useMemo, useState } from "react";
import {
  Search,
  X,
  MessageCircle,
  ShieldCheck,
  Package,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { readAuth, readUsers } from "@/lib/authStorage";
import { addToCart } from "@/lib/cartStorage";
import {
  getProducts,
  getProductCountBySeller,
  Product,
} from "@/utils/productStorage";

function SellerPopup({
  sellerName,
  sellerId,
  onClose,
  onMessage,
}: {
  sellerName: string;
  sellerId: string;
  onClose: () => void;
  onMessage: () => void;
}) {
  const users = readUsers();
  const matchedSeller = users.find((u) => u.id === sellerId);

  const sellerData = {
    name: sellerName,
    isVerified:
      matchedSeller?.verified === true ||
      matchedSeller?.badge === "verified" ||
      matchedSeller?.badge === "special",
    course: matchedSeller?.course || "Campus Seller",
    hostel: matchedSeller?.address || "Campus",
    joined: matchedSeller?.createdAt
      ? new Date(matchedSeller.createdAt).getFullYear().toString()
      : "2024",
    rating: 4.8,
    sales: 23,
    bio:
      matchedSeller?.bio ||
      "Campus entrepreneur selling quality products at affordable prices.",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      sellerName
    )}&background=random&color=fff&size=128`,
  };

  const productCount = getProductCountBySeller(sellerId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-24 bg-gradient-to-r from-indigo-500 to-purple-600">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-white/20 p-1 text-white transition hover:bg-white/30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="relative -mt-12 mb-4 flex justify-center">
            <img
              src={sellerData.avatar}
              alt={sellerData.name}
              className="h-24 w-24 rounded-full border-4 border-white shadow-lg"
            />
            {sellerData.isVerified && (
              <div className="absolute bottom-0 right-1/3 rounded-full bg-blue-500 p-1 text-white">
                <ShieldCheck className="h-4 w-4" />
              </div>
            )}
          </div>

          <div className="space-y-1 text-center">
            <h3 className="text-xl font-bold text-gray-900">{sellerData.name}</h3>
            <p className="text-sm text-gray-500">
              {sellerData.course} • {sellerData.hostel}
            </p>

            <div className="mt-3 flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-amber-500">
                <span className="font-bold">★ {sellerData.rating}</span>
                <span className="text-gray-400">({sellerData.sales} sales)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Package className="h-4 w-4" />
                <span>{productCount} products</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-sm leading-relaxed text-gray-600">
            {sellerData.bio}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-lg font-bold text-indigo-600">98%</div>
              <div className="text-xs text-gray-500">Response Rate</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-lg font-bold text-indigo-600">2hrs</div>
              <div className="text-xs text-gray-500">Avg. Delivery</div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Button className="w-full gap-2" onClick={onMessage}>
              <MessageCircle className="h-4 w-4" />
              Message Seller
            </Button>
            <Button variant="outline" className="w-full" onClick={onClose}>
              Close
            </Button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="h-3 w-3" />
            <span>
              {sellerData.isVerified
                ? "Verified Campus Entrepreneur"
                : "Campus Entrepreneur"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const Marketplace = () => {
  const nav = useNavigate();
  const { user } = readAuth();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [qtyMap, setQtyMap] = useState<Record<string, number>>({});
  const [selectedSeller, setSelectedSeller] = useState<{
    name: string;
    id: string;
  } | null>(null);

  useEffect(() => {
    const all = getProducts();
    const sorted = [...all].sort(
      (a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0)
    );
    setProducts(sorted);

    const initial: Record<string, number> = {};
    sorted.forEach((p) => {
      initial[p.id] = 1;
    });
    setQtyMap(initial);
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) =>
      set.add((p.category || "Uncategorized").trim() || "Uncategorized")
    );
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

  const canAddToCart =
    user?.role === "customer" || user?.role === "entrepreneur";

  const setQty = (id: string, value: number) => {
    const n = Number.isFinite(value) ? value : 1;
    setQtyMap((m) => ({ ...m, [id]: Math.max(1, Math.floor(n)) }));
  };

  const onAddToCart = (productId: string) => {
    if (!canAddToCart) {
      alert("Please login to add to cart.");
      return;
    }

    addToCart(productId, qtyMap[productId] ?? 1);
    nav("/cart");
  };

  const goToProduct = (id: string) => nav(`/product/${id}`);

  const formatPrice = (price: any) => Number(price || 0).toLocaleString();

  const handleMessageSeller = () => {
    if (!user) {
      alert("Please login to message seller");
      nav("/login");
      return;
    }

    nav(`/chat?seller=${encodeURIComponent(selectedSeller?.name || "")}`);
    setSelectedSeller(null);
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {selectedSeller && (
        <SellerPopup
          sellerName={selectedSeller.name}
          sellerId={selectedSeller.id}
          onClose={() => setSelectedSeller(null)}
          onMessage={handleMessageSeller}
        />
      )}

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
        <h1 className="text-xl md:text-2xl font-display font-bold">
          Marketplace
        </h1>

        <div className="relative md:ml-auto md:max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="text-sm text-muted-foreground">
          Total products: <b>{products.length}</b> • Showing: <b>{filtered.length}</b>
        </div>

        <div className="sm:ml-auto">
          <select
            className="rounded-lg border bg-white px-3 py-2 text-sm"
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
        <div className="rounded-xl border bg-white p-10 text-center">
          <p className="text-muted-foreground">No products available yet.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add products from the entrepreneur dashboard.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => {
            const displayImage =
              p.images?.[0] || p.imageUrl || "";

            return (
              <div
                key={p.id}
                className="cursor-pointer overflow-hidden rounded-xl border bg-white transition hover:shadow-sm"
                onClick={() => goToProduct(p.id)}
                role="button"
                tabIndex={0}
              >
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={p.name}
                    className="h-44 w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-44 w-full items-center justify-center bg-gray-100 text-sm text-muted-foreground">
                    No photo
                  </div>
                )}

                <div className="space-y-2 p-4">
                  <div className="text-base md:text-lg font-semibold">{p.name}</div>

                  <div className="text-sm text-muted-foreground">
                    ₦{formatPrice(p.price)} {p.category ? `• ${p.category}` : ""}
                  </div>

                  <div className="line-clamp-2 text-sm text-muted-foreground">
                    {p.description}
                  </div>

                  <div
                    className="flex items-center gap-1 text-xs text-muted-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSeller({
                        name: p.seller || "Entrepreneur",
                        id: p.sellerId,
                      });
                    }}
                  >
                    <span>by</span>
                    <button className="flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-800 hover:underline">
                      {p.seller || "Entrepreneur"}
                      <ShieldCheck className="h-3 w-3 text-blue-500" />
                    </button>
                  </div>

                  <div
                    className="flex items-center gap-2 pt-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Qty</span>
                      <Input
                        type="number"
                        min={1}
                        value={qtyMap[p.id] ?? 1}
                        onChange={(e) => setQty(p.id, Number(e.target.value))}
                        className="h-9 w-20"
                      />
                    </div>

                    <Button
                      className="ml-auto h-9"
                      onClick={() => onAddToCart(p.id)}
                      disabled={!canAddToCart}
                      title={!canAddToCart ? "Login to add to cart" : "Add to cart"}
                    >
                      Add to cart
                    </Button>
                  </div>

                  {!canAddToCart && (
                    <div
                      className="text-xs text-muted-foreground"
                      onClick={(e) => e.stopPropagation()}
                    >
                      (Login to add items to cart)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
