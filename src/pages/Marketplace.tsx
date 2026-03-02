import { useMemo, useState } from "react";
import CategoryFilter from "@/components/marketplace/CategoryFilter";
import ListingCard from "@/components/dashboard/ListingCard";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Listing } from "@/types";
import { getProducts } from "@/utils/productStorage";

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Load products
  const products = useMemo(() => {
    const all = getProducts();
    return [...all].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, []);

  // Convert Product -> Listing
  const listings: Listing[] = useMemo(() => {
    return products.map((p) => ({
      id: p.id,
      title: p.name,
      description: p.description,
      price: Number(String(p.price).replace(/[^\d.]/g, "")) || 0,
      category: p.category || "Uncategorized",
      type: "product",
      image: p.imageUrl || "",
      sellerName: p.seller || "Entrepreneur",
      createdAt: p.createdAt,
    })) as Listing[];
  }, [products]);

  // Apply filters
  const filteredListings = useMemo(() => {
    const q = search.trim().toLowerCase();

    return listings.filter((l) => {
      if (selectedCategory && l.category !== selectedCategory) {
        return false;
      }

      if (
        q &&
        !(
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q)
        )
      ) {
        return false;
      }

      return true;
    });
  }, [listings, selectedCategory, search]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-display font-bold">Marketplace</h1>

        <div className="flex-1 max-w-md ml-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          listingType={null}
          onTypeChange={() => {}}
          priceRange={[0, 0]}
          onPriceRangeChange={() => {}}
        />

        <div>
          {filteredListings.length === 0 ? (
            <div className="card-soft text-center py-16">
              <p className="text-muted-foreground">
                No products available yet.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Products will appear here when entrepreneurs add them.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredListings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
