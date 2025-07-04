import { CategoryFilters, ELECTRONICS_FILTERS } from "@/types/category";
import { X } from "lucide-react";

interface FilterSidebarProps {
  filters: CategoryFilters;
  onChange: (filters: CategoryFilters) => void;
  onClose: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onClose,
}) => {
  const handleCheckboxChange = (
    filterType: keyof CategoryFilters,
    value: string,
    checked: boolean
  ) => {
    const currentValues = filters[filterType] as string[];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);

    onChange({ ...filters, [filterType]: newValues });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Filters</h2>
        <button onClick={onClose} className="lg:hidden">
          <X className="w-6 h-6" />
        </button>
      </div>

      <FilterSection title="Price Range">
        {ELECTRONICS_FILTERS.priceRanges.map((range) => (
          <FilterCheckbox
            key={range.value}
            label={range.label}
            checked={filters.priceRange.includes(range.value)}
            onChange={(checked) =>
              handleCheckboxChange("priceRange", range.value, checked)
            }
          />
        ))}
      </FilterSection>

      <FilterSection title="Rating">
        {ELECTRONICS_FILTERS.ratings.map((rating) => (
          <FilterCheckbox
            key={rating}
            label={`${rating} Stars`}
            checked={filters.ratings.includes(rating)}
            onChange={(checked) =>
              handleCheckboxChange("ratings", rating, checked)
            }
          />
        ))}
      </FilterSection>

      <FilterSection title="Features">
        {ELECTRONICS_FILTERS.features.map((feature) => (
          <FilterCheckbox
            key={feature}
            label={feature}
            checked={filters.features.includes(feature)}
            onChange={(checked) =>
              handleCheckboxChange("features", feature, checked)
            }
          />
        ))}
      </FilterSection>

      <FilterSection title="Ships From">
        {ELECTRONICS_FILTERS.shipsFrom.map((location) => (
          <FilterCheckbox
            key={location}
            label={location}
            checked={filters.shipsFrom.includes(location)}
            onChange={(checked) =>
              handleCheckboxChange("shipsFrom", location, checked)
            }
          />
        ))}
      </FilterSection>
    </div>
  );
};

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="mb-6">
    <h3 className="font-medium mb-3">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const FilterCheckbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="rounded border-gray-300 text-[#3bb77e] focus:ring-[#3bb77e]"
    />
    <span className="text-sm text-gray-600">{label}</span>
  </label>
);
