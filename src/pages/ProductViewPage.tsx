import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cartStorage";
import { readAuth } from "@/lib/authStorage";
import { getProductById, getProducts } from "@/utils/productStorage";

export default function ProductViewPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = readAuth();

  const product = id ? getProductById(id) : null;

  const related = useMemo(() => {
    if (!product) return [];
    return getProducts()
      .filter(
        (p) =>
          p.id !== product.id &&
          ((p.category || "") === (product.category || "") ||
            (p.seller || "") === (product.seller || ""))
      )
      .slice(0, 4);
  }, [product]);

  const formatPrice = (price: any) => Number(price || 0).toLocaleString();

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card border rounded-xl p-10 text-center">
          <h1 className="text-2xl font-bold mb-2">Product not found</h1>
          <p className="text-muted-foreground mb-4">
            This product may have been removed.
          </p>
          <Button asChild>
            <Link to="/marketplace">Back to Marketplace</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (user?.role !== "customer") {
      alert("Only customers can add to cart.");
      return;
    }

    try {
      addToCart(product.id, 1);
      nav("/cart");
    } catch (error: any) {
      alert(error?.message || "Unable to add to cart");
    }
  };

  const handleMessageSeller = () => {
    if (!user) {
      nav("/login");
      return;
    }

    nav(`/chat?seller=${encodeURIComponent(product.seller || "")}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8">
        <div className="bg-card border rounded-xl p-4">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-[420px] object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-[420px] rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">
            {product.category || "Uncategorized"}
          </p>

          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

          <div className="text-2xl font-semibold mb-4">
            ₦{formatPrice(product.price)}
          </div>

          <p className="text-muted-foreground leading-7 mb-6">
            {product.description}
          </p>

          <div className="bg-card border rounded-xl p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-1">Seller</p>
            <p className="font-semibold">{product.seller || "Entrepreneur"}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleAddToCart}>Add to Cart</Button>
            <Button variant="outline" onClick={handleMessageSeller}>
              Message Seller
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/marketplace">Back</Link>
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Related Products</h2>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {related.map((item) => (
              <button
                key={item.id}
                onClick={() => nav(`/product/${item.id}`)}
                className="text-left bg-card border rounded-xl overflow-hidden hover:shadow-sm transition"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-muted flex items-center justify-center text-sm text-muted-foreground">
                    No image
                  </div>
                )}

                <div className="p-4">
                  <div className="font-medium line-clamp-1">{item.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    ₦{formatPrice(item.price)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
