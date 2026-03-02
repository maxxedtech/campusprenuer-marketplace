import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const MyProducts = () => {
  // Next step: load real products for THIS entrepreneur
  const products: any[] = [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Products</h1>
        <Link to="/dashboard/entrepreneur/add">
          <Button>Add New</Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border rounded-xl p-6 text-sm text-muted-foreground">
          No products yet. Click <b>Add New</b> to create your first listing.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4 space-y-2">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-muted-foreground">₦{p.price}</div>

                <div className="flex gap-2">
                  <Link to={`/dashboard/entrepreneur/products/${p.id}/edit`}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                  <Button variant="destructive">Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;