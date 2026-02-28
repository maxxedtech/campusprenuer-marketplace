import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Product = {
  id: string;
  ownerEmail: string;
  name: string;
  price: string;
  description: string;
  createdAt: number;
};

type StoredUser = {
  email?: string;
  role?: string;
  fullName?: string;
  name?: string;
};

const PRODUCTS_KEY = "products";

function readUser(): StoredUser | null {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function loadProducts(): Product[] {
  const raw = localStorage.getItem(PRODUCTS_KEY);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveProducts(products: Product[]) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export default function EntrepreneurDashboard() {
  const user = useMemo(() => readUser(), []);
  const ownerEmail = user?.email || "unknown@user";

  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setProducts(loadProducts());
  }, []);

  const myProducts = useMemo(() => {
    return products
      .filter((p) => p.ownerEmail === ownerEmail)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [products, ownerEmail]);

  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setEditingId(null);
  };

  const onSubmit = () => {
    if (!name.trim() || !price.trim()) return;

    const next = [...products];

    if (editingId) {
      const idx = next.findIndex((p) => p.id === editingId);
      if (idx >= 0) {
        next[idx] = {
          ...next[idx],
          name: name.trim(),
          price: price.trim(),
          description: description.trim(),
        };
      }
    } else {
      next.push({
        id: crypto.randomUUID(),
        ownerEmail,
        name: name.trim(),
        price: price.trim(),
        description: description.trim(),
        createdAt: Date.now(),
      });
    }

    setProducts(next);
    saveProducts(next);
    resetForm();
  };

  const onEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setPrice(p.price);
    setDescription(p.description);
  };

  const onDelete = (id: string) => {
    const next = products.filter((p) => p.id !== id);
    setProducts(next);
    saveProducts(next);
    if (editingId === id) resetForm();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Entrepreneur Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your goods: add, edit, and delete products.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {/* Form */}
        <div className="md:col-span-1 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-semibold">
            {editingId ? "Edit Product" : "Add Product"}
          </h2>

          <div className="mt-4 grid gap-3">
            <Input
              placeholder="Product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Price (e.g. ₦1500)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <Input
              placeholder="Short description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex gap-2">
              <Button onClick={onSubmit} className="flex-1">
                {editingId ? "Update" : "Add"}
              </Button>
              {editingId && (
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>

            <div className="text-xs text-muted-foreground">
              Owner: {ownerEmail}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="md:col-span-2 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-semibold">My Products</h2>

          {myProducts.length === 0 ? (
            <div className="mt-4 text-sm text-muted-foreground">
              You haven’t added any products yet.
            </div>
          ) : (
            <div className="mt-4 grid gap-3">
              {myProducts.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {p.price} • {p.description || "No description"}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => onEdit(p)}>
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => onDelete(p.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 text-xs text-muted-foreground">
            Note: This dashboard uses localStorage for now. If you already have a backend,
            we can connect these actions to your API.
          </div>
        </div>
      </div>
    </div>
  );
}
