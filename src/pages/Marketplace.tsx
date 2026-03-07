import { useEffect, useMemo, useState } from "react";
import { Search, X, MessageCircle, ShieldCheck, Package, Star, MapPin, Phone, Filter, ChevronRight, ShoppingCart, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { readAuth } from "@/lib/authStorage";
import { addToCart } from "@/lib/cartStorage";
import { readProducts, Product } from "@/lib/productsStorage";


// Seller Popup Card Component
function SellerPopup({ 
  sellerName, 
  sellerId,
  onClose, 
  onMessage 
}: { 
  sellerName: string;
  sellerId: string;
  onClose: () => void;
  onMessage: () => void;
}) {
  const sellerProducts = getProductsBySeller(sellerId);

  const sellerData = {
    name: sellerName,
    isVerified: true,
    course: "Computer Science",
    hostel: "Hall B",
    joined: "2024",
    rating: 4.8,
    sales: 23,
    phone: "08012345678",
    bio: "Campus entrepreneur selling quality products at affordable prices. Fast delivery within campus.",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerName)}&background=random&color=fff&size=128`
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-24 bg-gradient-to-r from-orange-500 to-red-600 relative">
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="relative -mt-12 mb-4 flex justify-center">
            <img 
              src={sellerData.avatar} 
              alt={sellerData.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            {sellerData.isVerified && (
              <div className="absolute bottom-0 right-1/3 bg-blue-500 text-white p-1 rounded-full">
                <ShieldCheck className="w-4 h-4" />
              </div>
            )}
          </div>

          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold text-gray-900">{sellerData.name}</h3>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <MapPin className="w-3 h-3" />
              <span>{sellerData.hostel}</span>
              <span>•</span>
              <span>{sellerData.course}</span>
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-3 text-sm">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold">{sellerData.rating}</span>
                <span className="text-gray-400">({sellerData.sales} sales)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Package className="w-4 h-4" />
                <span>{sellerProducts.length} products</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 text-center">
            {sellerData.bio}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-lg font-bold text-orange-600">98%</div>
              <div className="text-xs text-gray-500">Response Rate</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-lg font-bold text-orange-600">2hrs</div>
              <div className="text-xs text-gray-500">Avg. Delivery</div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Button className="w-full gap-2 bg-orange-600 hover:bg-orange-700" onClick={onMessage}>
              <MessageCircle className="w-4 h-4" />
              Message Seller
            </Button>
            <Button variant="outline" className="w-full gap-2" onClick={onClose}>
              <Phone className="w-4 h-4" />
              {sellerData.phone}
            </Button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="w-3 h-3" />
            <span>Verified Campus Entrepreneur</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Category Card
function CategoryCard({ name, icon, onClick }: { name: string; icon: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border hover:shadow-md transition min-w-[100px]"
    >
      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl">
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-700 text-center">{name}</span>
    </button>
  );
}

const Marketplace = () => {
  const nav = useNavigate();
  const { user } = readAuth();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [qtyMap, setQtyMap] = useState<Record<string, number>>({});
  const [selectedSeller, setSelectedSeller] = useState<{name: string, id: string} | null>(null);

  useEffect(() => {
    const all = getProducts();
    const sorted = [...all].sort(
      (a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0)
    );
    setProducts(sorted);

    const initial: Record<string, number> = {};
    sorted.forEach((p) => (initial[p.id] = 1));
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

  const canAddToCart = user?.role === "customer";

  const setQty = (id: string, value: number) => {
    const n = Number.isFinite(value) ? value : 1;
    setQtyMap((m) => ({ ...m, [id]: Math.max(1, Math.floor(n)) }));
  };

  const onAddToCart = (productId: string) => {
    if (!canAddToCart) {
      alert("Only customers can add to cart.");
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
    nav(`/chat?seller=${encodeURIComponent(selectedSeller?.id || "")}`);
    setSelectedSeller(null);
  };

  // Jumia-style categories with emojis
  const categoryIcons: Record<string, string> = {
    "All": "🛍️",
    "Electronics": "📱",
    "Fashion": "👕",
    "Food": "🍔",
    "Services": "💇",
    "Textbooks": "📚",
    "Beauty": "💄",
    "Sports": "⚽",
    "Uncategorized": "📦"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Jumia-style Header */}
      <div className="bg-orange-600 text-white sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold hidden md:block">CampusPrenuer</h1>
            
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search products, brands and categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-full bg-white text-gray-900 border-0 h-11"
              />
            </div>

            <div className="flex items-center gap-3">
              {user?.role === "customer" && (
                <button 
                  onClick={() => nav("/cart")}
                  className="relative p-2 hover:bg-orange-700 rounded-lg"
                >
                  <ShoppingCart className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Seller Popup */}
      {selectedSeller && (
        <SellerPopup 
          sellerName={selectedSeller.name}
          sellerId={selectedSeller.id}
          onClose={() => setSelectedSeller(null)}
          onMessage={handleMessageSeller}
        />
      )}

      {/* Categories Scroll */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <CategoryCard
                key={cat}
                name={cat}
                icon={categoryIcons[cat] || "📦"}
                onClick={() => setSelectedCategory(cat)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span>Home</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-orange-600 font-medium">Marketplace</span>
          {selectedCategory !== "All" && (
            <>
              <ChevronRight className="w-4 h-4" />
              <span className="text-orange-600 font-medium">{selectedCategory}</span>
            </>
          )}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedCategory === "All" ? "All Products" : `${selectedCategory} Products`}
          </h2>
          <span className="text-sm text-gray-500">{filtered.length} results found</span>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
              <Package className="w-12 h-12 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No products available yet</h3>
            <p className="text-gray-500 mb-4">Be the first entrepreneur to list your products!</p>
            <Button onClick={() => nav("/get-started")} className="bg-orange-600 hover:bg-orange-700">
              Start Selling
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-lg border hover:shadow-lg transition group"
              >
                {/* Image */}
                <div 
                  className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden cursor-pointer"
                  onClick={() => goToProduct(p.id)}
                >
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package className="w-12 h-12" />
                    </div>
                  )}
                  
                  {/* Wishlist button */}
                  <button 
                    className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>

                  {/* Category badge */}
                  {p.category && (
                    <Badge className="absolute bottom-2 left-2 bg-orange-600 hover:bg-orange-700">
                      {p.category}
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="p-3 space-y-2">
                  {/* Price */}
                  <div className="text-lg font-bold text-gray-900">
                    ₦{formatPrice(p.price)}
                  </div>

                  {/* Name */}
                  <h3 
                    className="text-sm text-gray-700 line-clamp-2 font-medium cursor-pointer hover:text-orange-600"
                    onClick={() => goToProduct(p.id)}
                  >
                    {p.name}
                  </h3>

                  {/* Seller */}
                  <div 
                    className="flex items-center gap-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSeller({name: p.seller, id: p.sellerId});
                    }}
                  >
                    <span className="text-gray-500">Sold by</span>
                    <button className="text-orange-600 font-medium hover:underline flex items-center gap-0.5">
                      {p.seller || "Entrepreneur"}
                      <ShieldCheck className="w-3 h-3 text-blue-500" />
                    </button>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-xs">
                    <div className="flex items-center bg-green-600 text-white px-1.5 py-0.5 rounded">
                      <span className="font-bold">4.5</span>
                      <Star className="w-3 h-3 fill-current ml-0.5" />
                    </div>
                    <span className="text-gray-400">(12 reviews)</span>
                  </div>

                  {/* Add to Cart */}
                  {canAddToCart && (
                    <Button 
                      className="w-full bg-orange-600 hover:bg-orange-700 h-9 text-sm"
                      onClick={() => onAddToCart(p.id)}
                    >
                      Add to Cart
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
