import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AddProduct = () => {
const [name, setName] = useState("");
const [price, setPrice] = useState("");
const [imageUrl, setImageUrl] = useState("");
const [category, setCategory] = useState("");
const [description, setDescription] = useState("");

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Next step: we'll save this to storage/database
    console.log({ name, price, imageUrl, category, description });

    // Clear form
    setName("");
    setPrice("");
    setImageUrl("");
    setCategory("");
    setDescription("");
};

return (
    <div className="max-w-xl space-y-4">
    <h1 className="text-2xl font-semibold">Add Product</h1>

    <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded-xl border">
        <Input placeholder="Product name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input placeholder="Price (e.g. 3500)" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <Input placeholder="Image URL (optional)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        <Input placeholder="Category (e.g. Fashion, Food)" value={category} onChange={(e) => setCategory(e.target.value)} />

        <textarea
        className="w-full border rounded-lg p-3 text-sm min-h-[120px]"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        />

        <Button type="submit" className="w-full">
        Save Product
        </Button>
    </form>
    </div>
);
};

export default AddProduct;