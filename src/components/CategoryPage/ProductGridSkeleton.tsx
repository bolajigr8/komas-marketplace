const ProductGridSkeleton: React.FC<{ viewMode: "grid" | "list" }> = ({
  viewMode,
}) => {
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
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className={`
            bg-white rounded-lg shadow-md overflow-hidden
            ${viewMode === "grid" ? "" : "flex"}
          `}
        >
          <div
            className={`
              relative bg-gray-200 animate-pulse
              ${viewMode === "grid" ? "aspect-square" : "w-1/3"}
            `}
          />

          <div className={`p-4 ${viewMode === "grid" ? "" : "w-2/3"}`}>
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-4" />

            {viewMode === "list" && (
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
