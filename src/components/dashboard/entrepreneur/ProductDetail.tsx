import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Mock product for now
const mockProduct = {
  id: "prod-001",
  name: "Inception Blu-ray",
  price: "4500",
  category: "Movies / Blu-ray",
  description:
    "Inception (2010) directed by Christopher Nolan. High-definition Blu-ray for film enthusiasts.",
  imageUrl: "https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_SL1500_.jpg",
  seller: "James Samuel",
  sellerId: "seller-123",
};

export default function ProductDetail() {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-4 mt-6">
      <img
        src={mockProduct.imageUrl}
        alt={mockProduct.name}
        className="w-full max-h-72 object-cover rounded-lg"
      />

      <h1 className="text-2xl font-bold">{mockProduct.name}</h1>
      <p className="text-lg font-semibold text-primary">₦{mockProduct.price}</p>
      <p className="text-sm text-muted-foreground">
        Category: {mockProduct.category}
      </p>
      <p className="text-base">{mockProduct.description}</p>
      <p className="text-sm text-muted-foreground">Sold by: {mockProduct.seller}</p>

      {/* Chat button */}
      <Button
        onClick={() => navigate(`/dashboard/entrepreneur/chat/${mockProduct.sellerId}`)}
        className="w-full"
      >
        Chat with Seller
      </Button>
    </div>
  );
}
