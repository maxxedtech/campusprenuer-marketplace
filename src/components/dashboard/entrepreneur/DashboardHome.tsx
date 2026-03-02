import { Card, CardContent } from "@/components/ui/card";
import { getProductsBySeller } from "@/utils/productStorage";
import { useEffect, useState } from "react";

const DashboardHome = () => {
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;

    if (user) {
      const products = getProductsBySeller(user?.email || user?.name);
      setProductCount(products.length);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Entrepreneur Overview</h1>
        <p className="text-muted-foreground">
          Manage your listings and track your activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">My Products</div>
            <div className="text-3xl font-semibold">{productCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Views</div>
            <div className="text-3xl font-semibold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Messages</div>
            <div className="text-3xl font-semibold">0</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
