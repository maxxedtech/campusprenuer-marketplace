import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);

  // 🔥 TEMP: empty cart (until backend cart is added)
  useEffect(() => {
    setItems([]);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Cart</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="border p-4 rounded">
              <p>{item.name}</p>
              <p>₦{item.price}</p>
            </div>
          ))}

          <Button className="mt-4">Checkout</Button>
        </div>
      )}
    </div>
  );
}
