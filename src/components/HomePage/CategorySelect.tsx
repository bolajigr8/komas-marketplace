"use client";
import React, { useDeferredValue, useState } from "react";
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@nextui-org/autocomplete";
import { useGetCategories } from "@/hooks/queries";

type PropsType = {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
};

const CategorySelect = ({ selected, setSelected }: PropsType) => {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const { data, isLoading, refetch } = useGetCategories(deferredSearch);

  return (
    <div className="bg-white flex items-center rounded-l-lg p-1">
      <Autocomplete
        placeholder="All Categories"
        className="w-[150px] md:w-[200px]"
        classNames={{
          base: "!bg-white",
          selectorButton: "bg-white",
        }}
        defaultItems={data?.data || []}
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(key?.toString() || "")}
        size="lg"
      >
        {(category) => (
          <AutocompleteItem key={category._id}>
            {category.name}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
};

export default CategorySelect;
