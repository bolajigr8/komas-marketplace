import { Filter, Search } from "lucide-react";

interface HeaderProps {
  currentCategory?: string;
  searchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  currentCategory,
  searchTerm,
  onSearch,
  showFilters,
  setShowFilters,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
      <h1 className="text-2xl font-bold">
        {currentCategory || "All Products"}
      </h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={onSearch}
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 border rounded-full w-64"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border rounded-full"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
