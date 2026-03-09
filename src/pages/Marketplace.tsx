import { useEffect, useMemo, useState } from "react";
import {
  Search,
  X,
  MessageCircle,
  ShieldCheck,
  Package,
  Store,
  MapPin,
  Phone,
  CalendarDays,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  readAuth,
  readUsers,
  type StoredUser,
} from "@/lib/authStorage";
import { addToCart } from "@/lib/cartStorage";
import {
  getProducts,
  type Product,
  getProductCountBySeller,
} from "@/utils/productStorage";

function findSellerUser(products: Product[], sellerName: string): StoredUser | null {
  const users = readUsers();

  const normalizedSeller = sellerName.trim().toLowerCase();

  const sellerProduct = products.find(
    (p) => (p.seller || "").trim().toLowerCase() === normalizedSeller
  );

  if (sellerProduct?.sellerId) {
    const byId = users.find((u) => u.id === sellerProduct.sellerId);
    if (byId) {
      return {
        id: byId.id,
        name: byId.name,
        email: byId.email,
        role: byId.role,
        phone: byId.phone,
        address: byId.address,
        businessName: byId.businessName,
        badge: byId.badge,
        verified: byId.verified,
        bio: byId.bio,
        createdAt: byId.createdAt,
      };
    }
  }

  const byName = users.find(
    (u) =>
      u.role === "entrepreneur" &&
      u.name.trim().toLowerCase() === normalizedSeller
  );

  if (!byName) return null;

  return {
    id: byName.id,
    name: byName.name,
    email: byName.email,
    role: byName.role,
    phone: byName.phone,
    address: byName.address,
    businessName: byName.businessName,
    badge: byName.badge,
    verified: byName.verified,
    bio: byName.bio,
    createdAt: byName.createdAt,
  };
}

function getSellerProfile(products: Product[], sellerName: string) {
  const sellerProducts = products.filter(
    (p) => (p.seller || "").trim().toLowerCase() === sellerName.trim().toLowerCase()
  );

  const sellerUser = findSellerUser(products, sellerName);

  const avatarName = sellerUser?.businessName || sellerUser?.name || sellerName;

  return {
    id: sellerUser?.id || "",
    name: sellerUser?.name || sellerName,
    businessName: sellerUser?.businessName || "",
    email: sellerUser?.email || "",
    phone: sellerUser?.phone || "",
    address: sellerUser?.address || "",
    bio:
      sellerUser?.bio?.trim() ||
      `Campus entrepreneur selling ${sellerProducts.length} product${
        sellerProducts.length === 1 ? "" : "s"
      } on CampusPrenuer.`,
    verified: Boolean(sellerUser?.verified),
    badge: sellerUser?.badge || "",
    createdAt: sellerUser?.createdAt || "",
    productCount: sellerProducts.length,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      avatarName
    )}&background=f3f4f6&color=111827&size=128`,
  };
}

function SellerPopup({
  sellerName,
  products,
  onClose,
  onMessage,
  onViewProducts,
}: {
  sellerName: string;
  products: Product[];
  onClose: () => void;
  onMessage: () => void;
  onViewProducts: () => void;
}) {
  const sellerData = getSellerProfile(products, sellerName);
  const productCount = getProductCountBySeller(sellerName);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-background border rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-24 bg-primary relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full bg-background/20 hover:bg-background/30 text-primary-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="relative -mt-12 mb-4 flex justify-center">
            <img
              src={sellerData.avatar}
              alt={sellerData.name}
              className="w-24 h-24 rounded-full border-4 border-background shadow-lg"
            />

            {sellerData.verified && (
              <div className="absolute bottom-0 right-1/3 bg-primary text-primary-foreground p-1 rounded-full">
                <ShieldCheck className="w-4 h-4" />
              </div>
            )}
          </div>

          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold text-foreground">
              {sellerData.businessName || sellerData.name}
            </h3>

            <p className="text-sm text-muted-foreground">
              {sellerData.name}
            </p>

            <div className="flex items-center justify-center gap-4 mt-3 text-sm flex-wrap">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Package className="w-4 h-4" />
                <span>{productCount} products</span>
              </div>

              {sellerData.createdAt && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <CalendarDays className="w-4 h-4" />
                  <span>
                    Since {new Date(sellerData.createdAt).getFullYear()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground text-center leading-relaxed">
            {sellerData.bio}
          </p>

          <div className="mt-4 space-y-2">
            {sellerData.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded-lg px-3 py-2">
                <Phone className="w-4 h-4" />
                <span>{sellerData.phone}</span>
              </div>
            )}

            {sellerData.address && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded-lg px-3 py-2">
                <MapPin className="w-4 h-4" />
                <span>{sellerData.address}</span>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-2">
            <Button className="w-full gap-2" onClick={onMessage}>
              <MessageCircle className="w-4 h-4" />
              Message Seller
            </Button>

            <Button variant="outline" className="w-full" onClick={onViewProducts}>
              View All Products
            </Button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            {sellerData.verified ? (
              <>
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Campus Entrepreneur</span>
              </>
            ) : (
              <span>Campus Entrepreneur</span>
            )}
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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [qtyMap, setQtyMap] = useState<Record<string, number>>({});
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);

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
        const hay =
          `${p.name} ${p.description} ${cat} ${p.seller}`.toLowerCase();

        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [products, search, selectedCategory]);

  const canAddToCart = user?.role === "customer";

  const setQty = (id: string, value: number) => {
    const n = Number.isFinite(value) ? value : 1;

    setQtyMap((m) => ({
      ...m,
      [id]: Math.max(1, Math.floor(n)),
    }));
  };

  const onAddToCart = (productId: string) => {
    if (!canAddToCart) {
      alert("Only customers can add to cart.");
      return;
    }

    try {
      addToCart(productId, qtyMap[productId] ?? 1);
      nav("/cart");
    } catch (error: any) {
      alert(error?.message || "Unable to add to cart");
    }
  };

  const goToProduct = (id: string) => nav(`/product/${id}`);

  const formatPrice = (price: any) => Number(price || 0).toLocaleString();

  const handleMessageSeller = () => {
    if (!user) {
      alert("Please login to message seller");
      nav("/login");
      return;
    }

    nav(`/chat?seller=${encodeURIComponent(selectedSeller || "")}`);
    setSelectedSeller(null);
  };

  const handleViewSellerProducts = () => {
    if (!selectedSeller) return;

    setSearch(selectedSeller);
    setSelectedCategory("All");
    setSelectedSeller(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {selectedSeller && (
        <SellerPopup
          sellerName={selectedSeller}
          products={products}
          onClose={() => setSelectedSeller(null)}
          onMessage={handleMessageSeller}
          onViewProducts={handleViewSellerProducts}
        />
      )}

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

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="text-sm text-muted-foreground">
          Total products: <b>{products.length}</b> • Showing: <b>{filtered.length}</b>
        </div>

        <div className="sm:ml-auto">
          <select
            className="border rounded-lg px-3 py-2 text-sm bg-background"
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
        <div className="bg-card border rounded-xl p-10 text-center">
          <p className="text-muted-foreground">No products available yet.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Add products from the entrepreneur dashboard.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-card border rounded-xl overflow-hidden hover:shadow-sm transition cursor-pointer"
              onClick={() => goToProduct(p.id)}
            >
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-44 object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-44 bg-muted flex items-center justify-center text-sm text-muted-foreground">
                  <Store className="w-5 h-5 mr-2" />
                  No photo
                </div>
              )}

              <div className="p-4 space-y-2">
                <div className="font-semibold text-lg">{p.name}</div>

                <div className="text-sm text-muted-foreground">
                  ₦{formatPrice(p.price)}
                </div>

                <div className="text-sm text-muted-foreground line-clamp-2">
                  {p.description}
                </div>

                <div
                  className="text-xs text-muted-foreground flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSeller(p.seller || "Entrepreneur");
                  }}
                >
                  <span>by</span>

                  <button className="font-medium text-primary hover:underline flex items-center gap-1">
                    {p.seller || "Entrepreneur"}
                    <ShieldCheck className="w-3 h-3 text-primary" />
                  </button>
                </div>

                <div
                  className="pt-2 flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Qty</span>

                    <Input
                      type="number"
                      min={1}
                      value={qtyMap[p.id] ?? 1}
                      onChange={(e) => setQty(p.id, Number(e.target.value))}
                      className="w-20 h-9"
                    />
                  </div>

                  <Button
                    className="ml-auto h-9"
                    onClick={() => onAddToCart(p.id)}
                    disabled={!canAddToCart}
                  >
                    Add to cart
                  </Button>
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
