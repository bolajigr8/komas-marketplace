import { Product } from "@/lib/types";
import ProductGridSkeleton from "./ProductGridSkeleton";

interface ProductGridProps {
  products: Product[];
  viewMode: "grid" | "list";
  loading: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  viewMode,
  loading,
}) => {
  if (loading) {
    return <ProductGridSkeleton viewMode={viewMode} />;
  }

  return (
    <div
      className={`
        ${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-6"
        }
      `}
    >
      {products.map((product) => (
        <ProductCard key={product._id} product={product} viewMode={viewMode} />
      ))}
    </div>
  );
};

const ProductCard: React.FC<{
  product: Product;
  viewMode: "grid" | "list";
}> = ({ product, viewMode }) => {
  const isGrid = viewMode === "grid";

  return (
    <div
      className={`
        bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow
        ${isGrid ? "" : "flex"}
      `}
    >
      <div className={`relative ${isGrid ? "aspect-square" : "w-1/3"}`}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className={`p-4 ${isGrid ? "" : "w-2/3"}`}>
        <div className="text-sm text-gray-500 mb-1">
          {typeof product.brand === "string"
            ? product.brand
            : product.brand.name}
        </div>
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>

        {!isGrid && (
          <p className="text-gray-600 mb-4 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto">
          <span className="text-[#3bb77e] font-bold">${product.price}</span>
          <button className="bg-[#3bb77e]/10 text-[#3bb77e] px-4 py-2 rounded-full hover:bg-[#3bb77e]/20 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
