import { useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ordersForSeller, updateOrderStatus } from "@/lib/ordersStorage";
import { Button } from "@/components/ui/button";

export default function EntrepreneurOrders() {
  const { user } = useAuth();
  const [refresh, setRefresh] = useState(0);

  const orders = useMemo(() => {
    if (!user) return [];
    return ordersForSeller(user.id);
  }, [user, refresh]);

  const setStatus = async (id: string, status: any) => {
    await updateOrderStatus(id, status);
    setRefresh((x) => x + 1);
  };

  if (!user) return null;

  return (
    <div>
      <h2>Orders</h2>

      {orders.map((o) => (
        <div key={o.id}>
          <p>{o.customerName}</p>

          <Button onClick={() => setStatus(o.id, "confirmed")}>
            Confirm
          </Button>
        </div>
      ))}
    </div>
  );
}
