interface SubcategoryListProps {
  categories: ReadonlyArray<{ id: string; name: string }>;
}

const SubcategoryList: React.FC<SubcategoryListProps> = ({ categories }) => {
  return (
    <div className="flex gap-4 mb-6">
      {categories.map((category) => (
        <button
          key={category.id}
          className="px-4 py-2 border rounded-full hover:bg-gray-50"
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default SubcategoryList;
