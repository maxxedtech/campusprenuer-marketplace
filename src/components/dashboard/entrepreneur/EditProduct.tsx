import { useParams } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Edit Product</h1>
      <p className="text-sm text-muted-foreground">Editing product ID: {id}</p>

      {/* Next step: prefill form with product data, then update */}
    </div>
  );
};

export default EditProduct;