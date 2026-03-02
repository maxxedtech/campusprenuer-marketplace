import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const DashboardHome = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Welcome, {user?.name || "Entrepreneur"} 👋</h1>
        <p className="text-muted-foreground">
          Manage your products, update listings, and grow your sales.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Products</div>
            <div className="text-2xl font-semibold">—</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Views</div>
            <div className="text-2xl font-semibold">—</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Messages</div>
            <div className="text-2xl font-semibold">—</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
