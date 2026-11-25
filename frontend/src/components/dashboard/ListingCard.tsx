import type { Listing } from "@/types";
import { FeaturedBadge } from "@/components/common/Badges";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ImageIcon } from "lucide-react";

interface ListingCardProps {
  listing: Listing;
  editable?: boolean;
  onEdit?: (listing: Listing) => void;
  onDelete?: (id: string) => void;
  onToggleAvailability?: (id: string, available: boolean) => void;
}

const ListingCard = ({ listing, editable, onEdit, onDelete, onToggleAvailability }: ListingCardProps) => (
  <div className="card-soft flex flex-col animate-fade-in">
    {/* Image */}
    <div className="relative w-full aspect-[4/3] rounded-xl bg-muted overflow-hidden mb-3">
      {listing.images[0] ? (
        <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ImageIcon className="w-10 h-10 text-muted-foreground/40" />
        </div>
      )}
      {listing.isFeatured && (
        <div className="absolute top-2 left-2">
          <FeaturedBadge />
        </div>
      )}
      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-card/80 backdrop-blur text-xs font-medium">
        {listing.type === "product" ? "🛒 Product" : "🔧 Service"}
      </span>
    </div>

    <h3 className="font-display font-bold text-sm line-clamp-1">{listing.title}</h3>
    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{listing.description}</p>
    <p className="font-bold text-lg mt-2">${listing.price.toFixed(2)}</p>

    {editable && (
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <Switch
            checked={listing.available}
            onCheckedChange={(v) => onToggleAvailability?.(listing.id, v)}
          />
          <span className="text-xs text-muted-foreground">
            {listing.available ? "Available" : "Unavailable"}
          </span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit?.(listing)}>
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete?.(listing.id)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    )}
  </div>
);

export default ListingCard;
