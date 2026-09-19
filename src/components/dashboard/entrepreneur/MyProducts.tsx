import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  ShoppingCart,
  TrendingUp,
  Edit,
  Trash2,
  ExternalLink,
  Package,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMyProducts, deleteProduct } from "@/lib/products";
import { getCurrentUser } from "@/lib/auth";
import type { LocalProduct } from "@/types/local";
import { toast } from "sonner";

export default function MyProducts() {
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const user = await getCurrentUser();
      if (!user) {
        setError("You are not logged in.");
        setProducts([]);
        return;
      }
      if (user.role !== "entrepreneur") {
        setError("Only entrepreneurs can view this page.");
        setProducts([]);
        return;
      }

      const data = await getMyProducts();
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    window.addEventListener("campus-products-change", load);
    return () => window.removeEventListener("campus-products-change", load);
  }, []);

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${title}"?`);
    if (!confirmed) return;

    try {
      await deleteProduct(id);
      toast.success("Listing removed from marketplace");
      load();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy">
            My Product Inventory ({products.length})
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage your campus listings, track views, and update prices.
          </p>
        </div>

        <Button
          onClick={() => navigate("/dashboard/entrepreneur/add")}
          className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded-2xl shadow-md shadow-brand-orange/20 flex items-center gap-2 h-11"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-medium border border-red-200">
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-border shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-orange-100 text-brand-orange mx-auto flex items-center justify-center">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-lg font-bold text-brand-navy">No products yet</h3>
            <p className="text-xs text-muted-foreground">
              Add your first item to make it visible to students across campus.
            </p>
          </div>
          <Button
            onClick={() => navigate("/dashboard/entrepreneur/add")}
            className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded-2xl"
          >
            Create First Listing
          </Button>
        </div>
      )}

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-md hover:border-brand-orange/40 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Product Image & Category */}
              <div className="h-44 bg-muted relative overflow-hidden flex items-center justify-center">
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store className="w-10 h-10 text-gray-400" />
                )}
                {p.category && (
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-brand-navy text-white shadow-sm">
                    {p.category}
                  </span>
                )}
              </div>

              {/* Product Content */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-bold text-base text-brand-navy line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="text-lg font-extrabold text-brand-orange mt-0.5">
                    ₦{Number(p.price).toLocaleString()}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {p.description || "No description provided."}
                </p>

                {/* Minor Analytics Pill on Card */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-muted/30 border border-border/50 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-gray-500 block flex items-center justify-center gap-1">
                      <Eye className="w-3 h-3 text-blue-500" /> Views
                    </span>
                    <strong className="text-brand-navy font-bold">{p.views_count || 0}</strong>
                  </div>
                  <div className="border-x border-border/50">
                    <span className="text-[10px] text-gray-500 block flex items-center justify-center gap-1">
                      <ShoppingCart className="w-3 h-3 text-orange-500" /> In Cart
                    </span>
                    <strong className="text-brand-navy font-bold">{p.cart_add_count || 0}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block flex items-center justify-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-600" /> Sold
                    </span>
                    <strong className="text-green-600 font-bold">{p.sales_count || 0}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 pt-0 border-t border-border/50 grid grid-cols-3 gap-2 mt-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="text-xs h-9 rounded-xl flex items-center gap-1"
              >
                <Link to={`/product/${p.id}`}>
                  <ExternalLink className="w-3.5 h-3.5" />
                  View
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="text-xs h-9 rounded-xl border-brand-navy/30 text-brand-navy hover:bg-brand-navy hover:text-white flex items-center gap-1"
              >
                <Link to={`/dashboard/entrepreneur/products/${p.id}/edit`}>
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </Link>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(p.id, p.title)}
                className="text-xs h-9 rounded-xl border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
