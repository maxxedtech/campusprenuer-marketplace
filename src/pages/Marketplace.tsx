import { useState } from "react";
import CategoryFilter from "@/components/marketplace/CategoryFilter";
import ListingCard from "@/components/dashboard/ListingCard";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Listing } from "@/types";

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [listingType, setListingType] = useState<"product" | "service" | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [search, setSearch] = useState("");

  // Listings will come from API — empty state for now
  const listings: Listing[] = [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-display font-bold">Marketplace</h1>
        <div className="flex-1 max-w-md ml-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products & services..."
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
          listingType={listingType}
          onTypeChange={setListingType}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
        />

        <div>
          {listings.length === 0 ? (
            <div className="card-soft text-center py-16">
              <p className="text-muted-foreground">No listings available yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Listings will appear here when businesses add them.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {listings.map((l) => (
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
