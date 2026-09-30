import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  ShoppingCart,
  TrendingUp,
  Package,
  PlusCircle,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  Store,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getMyProducts } from "@/lib/products";
import { ordersForSeller } from "@/lib/ordersStorage";
import type { LocalProduct } from "@/types/local";

export default function DashboardHome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const prods = await getMyProducts();
      setProducts(prods || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    window.addEventListener("campus-products-change", load);
    window.addEventListener("campus-orders-change", load);
    return () => {
      window.removeEventListener("campus-products-change", load);
      window.removeEventListener("campus-orders-change", load);
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate Metrics
  const totalProducts = products.length;
  const totalViews = products.reduce((sum, p) => sum + (p.views_count || 0), 0);
  const totalCartAdds = products.reduce((sum, p) => sum + (p.cart_add_count || 0), 0);
  const totalSalesCount = products.reduce((sum, p) => sum + (p.sales_count || 0), 0);
  
  // Real or estimated revenue from sales
  const sellerOrders = user ? ordersForSeller(user.id) : [];
  const totalRevenue = sellerOrders.reduce((sum, order) => {
    const myItemsTotal = order.items
      .filter((item) => item.sellerId === user?.id)
      .reduce((s, i) => s + i.price * i.qty, 0);
    return sum + myItemsTotal;
  }, 0);

  // Top products sorted by sales or views
  const topProducts = [...products]
    .sort((a, b) => ((b.sales_count || 0) + (b.views_count || 0)) - ((a.sales_count || 0) + (a.views_count || 0)))
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* HEADER WITH GREETING & VERIFICATION STATUS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
              Welcome, {user?.name}
            </h1>
            {user?.verification_status === "verified" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Seller
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Here is what is happening with your campus business today.
          </p>
        </div>

        <Button
          onClick={() => navigate("/dashboard/entrepreneur/add")}
          className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold h-11 px-5 rounded-2xl shadow-md shadow-brand-orange/20 flex items-center gap-2 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Product
        </Button>
      </div>

      {/* MINOR ANALYTICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Views */}
        <div className="bg-white p-5 rounded-3xl border border-border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Views</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-brand-navy">
            {totalViews.toLocaleString()}
          </p>
          <p className="text-[11px] text-muted-foreground">Shoppers who viewed items</p>
        </div>

        {/* Added to Cart */}
        <div className="bg-white p-5 rounded-3xl border border-border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Added to Cart</span>
            <div className="p-2 rounded-xl bg-orange-50 text-brand-orange">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-brand-navy">
            {totalCartAdds.toLocaleString()}
          </p>
          <p className="text-[11px] text-muted-foreground">High buyer purchase intent</p>
        </div>

        {/* Units Sold */}
        <div className="bg-white p-5 rounded-3xl border border-border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Orders / Sold</span>
            <div className="p-2 rounded-xl bg-green-50 text-green-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-brand-navy">
            {totalSalesCount.toLocaleString()}
          </p>
          <p className="text-[11px] text-muted-foreground">Completed campus sales</p>
        </div>

        {/* Total Revenue in Naira */}
        <div className="bg-white p-5 rounded-3xl border border-border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Sales</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <span className="font-bold text-xs">₦</span>
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-brand-navy">
            ₦{totalRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-muted-foreground">Earned from store orders</p>
        </div>
      </div>

      {/* TOP SELLING & POPULAR PRODUCTS */}
      {topProducts.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <h2 className="text-lg font-bold text-brand-navy">
                Top Performing Products
              </h2>
              <p className="text-xs text-muted-foreground">
                Products attracting the most views and buyers on campus.
              </p>
            </div>
            <Link
              to="/dashboard/entrepreneur/products"
              className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topProducts.map((p) => (
              <div
                key={p.id}
                className="group rounded-2xl border border-border/80 overflow-hidden bg-muted/10 hover:border-brand-orange/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-36 bg-muted relative overflow-hidden flex items-center justify-center">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <Store className="w-8 h-8 text-gray-400" />
                    )}
                    {p.category && (
                      <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-navy/90 text-white">
                        {p.category}
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-sm text-brand-navy line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-base font-extrabold text-brand-orange">
                      ₦{Number(p.price).toLocaleString()}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-500 pt-1 border-t border-border/50">
                      <span className="flex items-center gap-1" title="Product views">
                        <Eye className="w-3.5 h-3.5 text-blue-500" />
                        {p.views_count || 0}
                      </span>
                      <span className="flex items-center gap-1" title="Added to cart">
                        <ShoppingCart className="w-3.5 h-3.5 text-orange-500" />
                        {p.cart_add_count || 0}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-green-600" title="Purchases">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {p.sales_count || 0} sold
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 pt-0 flex gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full text-xs h-8 rounded-xl"
                  >
                    <Link to={`/dashboard/entrepreneur/products/${p.id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full text-xs h-8 bg-brand-navy hover:bg-brand-navy/90 text-white rounded-xl"
                  >
                    <Link to={`/product/${p.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {products.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-border shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-orange-100 text-brand-orange mx-auto flex items-center justify-center">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-lg font-bold text-brand-navy">
              No products listed yet
            </h3>
            <p className="text-xs text-muted-foreground">
              Start building your campus store. List your physical products, digital items, or freelance services in seconds.
            </p>
          </div>
          <Button
            onClick={() => navigate("/dashboard/entrepreneur/add")}
            className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded-2xl px-6"
          >
            Create Your First Listing
          </Button>
        </div>
      )}
    </div>
  );
}
