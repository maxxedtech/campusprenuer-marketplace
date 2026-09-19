import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ShoppingCart,
  MessageCircle,
  ArrowLeft,
  ShieldCheck,
  Store,
  CheckCircle,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductById, getProducts, incrementProductViews } from "@/lib/products";
import { addToCart } from "@/lib/cartStorage";
import { getUserById } from "@/utils/userStorage";
import type { LocalProduct } from "@/types/local";
import { toast } from "sonner";

export default function ProductViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<LocalProduct | null>(null);
  const [seller, setSeller] = useState<any>(null);
  const [related, setRelated] = useState<LocalProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProductById(id).then((p) => {
      if (p) {
        setProduct(p);
        // Track analytics view
        incrementProductViews(p.id);

        // Fetch seller verification info
        const s = getUserById(p.owner_id);
        setSeller(s);

        // Fetch other products from same seller or category
        getProducts().then((all) => {
          setRelated(all.filter((item) => item.id !== p.id).slice(0, 4));
        });
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-border text-center space-y-4">
        <p className="text-gray-600 font-bold">This product is no longer available.</p>
        <Button onClick={() => navigate("/marketplace")} className="bg-brand-navy text-white rounded-2xl">
          Back to Marketplace
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product.id, 1);
    toast.success(`"${product.title}" added to your cart! 🛒`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on Campuspreneur for ₦${Number(product.price).toLocaleString()}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* TOP BAR */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/marketplace")}
            className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-brand-navy rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="rounded-full text-xs font-semibold gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </Button>
        </div>

        {/* MAIN PRODUCT CARD */}
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm grid md:grid-cols-12 gap-8">
          
          {/* IMAGE */}
          <div className="md:col-span-6">
            <div className="rounded-3xl overflow-hidden bg-muted aspect-square border border-border/80 flex items-center justify-center relative shadow-inner">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Store className="w-16 h-16 text-gray-300" />
              )}
              {product.category && (
                <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-xl bg-brand-navy text-white shadow-md">
                  {product.category}
                </span>
              )}
            </div>
          </div>

          {/* DETAILS */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy leading-tight">
                  {product.title}
                </h1>
                <p className="text-3xl font-black text-brand-orange mt-2">
                  ₦{Number(product.price).toLocaleString()}
                </p>
              </div>

              {/* SELLER INFO BOX */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-navy text-white font-bold flex items-center justify-center text-sm">
                    {seller?.avatar_url ? (
                      <img src={seller.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      product.owner_name?.[0]?.toUpperCase() || "S"
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs sm:text-sm font-bold text-brand-navy">
                        {product.owner_name}
                      </p>
                      {seller?.verification_status === "verified" && (
                        <span className="inline-flex items-center text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full" title="Verified Campus Seller">
                          <ShieldCheck className="w-3.5 h-3.5 mr-0.5" />
                          Verified
                        </span>
                      )}
                    </div>
                    {seller?.campus && (
                      <p className="text-[11px] text-muted-foreground">{seller.campus}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Product Details
                </h3>
                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                  {product.description || "No description provided by the seller."}
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-4 border-t border-border/60">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold h-12 rounded-2xl shadow-md shadow-brand-orange/25 flex items-center justify-center gap-2 active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(
                      `/chat-room?seller=${product.owner_id}&name=${encodeURIComponent(
                        product.owner_name
                      )}`
                    )
                  }
                  className="border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white font-bold h-12 rounded-2xl flex items-center justify-center gap-2 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat Seller
                </Button>
              </div>

              <p className="text-[11px] text-center text-muted-foreground">
                🔒 Safe Campus Trading • In-app Chat • Peer-to-Peer Pickup
              </p>
            </div>

          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-bold text-brand-navy">
              More Campus Discoveries
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="bg-white rounded-2xl border border-border p-3 hover:border-brand-orange/50 hover:shadow-md transition-all group"
                >
                  <div className="h-28 bg-muted rounded-xl overflow-hidden mb-2">
                    {item.image_url ? (
                      <img src={item.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Store className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-brand-navy truncate">{item.title}</h4>
                  <p className="text-xs font-extrabold text-brand-orange mt-0.5">
                    ₦{Number(item.price).toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
