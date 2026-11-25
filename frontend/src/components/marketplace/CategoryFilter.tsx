import { CATEGORIES } from "@/types";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  listingType: "product" | "service" | null;
  onTypeChange: (type: "product" | "service" | null) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
}

const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
  listingType,
  onTypeChange,
  priceRange,
  onPriceRangeChange,
}: CategoryFilterProps) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <aside className="space-y-6">
      {/* Type filter */}
      <div>
        <h3 className="font-display font-bold text-sm mb-3">Browse</h3>
        <div className="flex gap-2">
          <Button
            variant={listingType === "product" ? "default" : "outline"}
            size="sm"
            onClick={() => onTypeChange(listingType === "product" ? null : "product")}
          >
            🛒 Buy Products
          </Button>
          <Button
            variant={listingType === "service" ? "default" : "outline"}
            size="sm"
            onClick={() => onTypeChange(listingType === "service" ? null : "service")}
          >
            🔧 Hire Services
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-display font-bold text-sm mb-3">Categories</h3>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <div key={cat.id}>
              <button
                onClick={() => {
                  onCategoryChange(selectedCategory === cat.id ? null : cat.id);
                  setExpanded(expanded === cat.id ? null : cat.id);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-primary/20 text-foreground font-medium"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
              {expanded === cat.id && (
                <div className="ml-8 mt-1 space-y-1 animate-fade-in">
                  {cat.subcategories.map((sub) => (
                    <button
                      key={sub}
                      className="block w-full text-left px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:bg-muted transition-colors"
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-display font-bold text-sm mb-3">Price Range</h3>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={priceRange}
          onValueChange={(v) => onPriceRangeChange(v as [number, number])}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Location filter placeholder */}
      <div>
        <h3 className="font-display font-bold text-sm mb-3">Location</h3>
        <div className="px-3 py-4 rounded-xl bg-muted/50 border border-dashed border-border text-center">
          <p className="text-xs text-muted-foreground">Location filter will use Google Maps API</p>
        </div>
      </div>
    </aside>
  );
};

export default CategoryFilter;
