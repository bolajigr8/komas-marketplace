// import { Grid, List } from "lucide-react";

// interface ViewControlsProps {
//   viewMode: "grid" | "list";
//   setViewMode: (mode: "grid" | "list") => void;
//   currentSort: string;
//   onSortChange: (sort: string) => void;
//   totalProducts: number;
// }

// const ViewControls: React.FC<ViewControlsProps> = ({
//   viewMode,
//   setViewMode,
//   currentSort,
//   onSortChange,
//   totalProducts,
// }) => {
//   return (
//     <div className="flex justify-between items-center mb-6">
//       <div className="flex items-center gap-4">
//         <button
//           onClick={() => setViewMode("grid")}
//           className={`p-2 ${viewMode === "grid" ? "text-[#3bb77e]" : ""}`}
//         >
//           <Grid className="w-5 h-5" />
//         </button>
//         <button
//           onClick={() => setViewMode("list")}
//           className={`p-2 ${viewMode === "list" ? "text-[#3bb77e]" : ""}`}
//         >
//           <List className="w-5 h-5" />
//         </button>
//         <span className="text-sm text-gray-500">
//           Showing {totalProducts} products
//         </span>
//       </div>
//       <select
//         value={currentSort}
//         onChange={(e) => onSortChange(e.target.value)}
//         className="border rounded-full px-4 py-2"
//       >
//         <option value="featured">Featured</option>
//         <option value="topSales">Top Sales</option>
//         <option value="recent">Recent</option>
//         <option value="priceLow">Price: Low to High</option>
//         <option value="priceHigh">Price: High to Low</option>
//       </select>
//     </div>
//   );
// };
// export default ViewControls;

import { ELECTRONICS_FILTERS } from "@/types/category";
import { Grid, List } from "lucide-react";

interface ViewControlsProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export const ViewControls: React.FC<ViewControlsProps> = ({
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setViewMode("grid")}
          className={`p-2 rounded-full ${
            viewMode === "grid"
              ? "bg-[#3bb77e]/10 text-[#3bb77e]"
              : "text-gray-500"
          }`}
        >
          <Grid className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`p-2 rounded-full ${
            viewMode === "list"
              ? "bg-[#3bb77e]/10 text-[#3bb77e]"
              : "text-gray-500"
          }`}
        >
          <List className="w-5 h-5" />
        </button>
      </div>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3bb77e]"
      >
        {ELECTRONICS_FILTERS.sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
