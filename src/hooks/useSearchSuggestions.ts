// import { useMemo } from 'react';

// type SearchableItem = {
//   _id: string;
//   name: string;
//   [key: string]: any;
// };

// type SearchConfig<T> = {
//   items: T[];
//   searchTerm: string;
//   searchKeys?: (keyof T)[];
//   limit?: number;
//   minSearchLength?: number;
//   transformResult?: (item: T) => any;
// };

// export function useSearchSuggestions<T extends SearchableItem>({
//   items,
//   searchTerm,
//   searchKeys = ['name'],
//   limit = 10,
//   minSearchLength = 2,
//   transformResult,
// }: SearchConfig<T>) {
//   const suggestions = useMemo(() => {
//     if (!searchTerm || searchTerm.length < minSearchLength || !items.length) {
//       return [];
//     }

//     const term = searchTerm.toLowerCase();
    
//     const filteredItems = items.filter(item => {
//       return searchKeys.some(key => {
//         const value = item[key];
//         return value && value.toString().toLowerCase().includes(term);
//       });
//     });

//     const limitedItems = filteredItems.slice(0, limit);

//     if (transformResult) {
//       return limitedItems.map(transformResult);
//     }

//     return limitedItems.map(item => ({
//       id: item._id,
//       text: item.name,
//       originalItem: item
//     }));
//   }, [items, searchTerm, searchKeys, limit, minSearchLength, transformResult]);

//   return suggestions;
// }

import { useMemo } from 'react';

type SearchableItem = {
  _id: string;
  name: string;
  [key: string]: any;
};

type SearchConfig<T> = {
  items: T[];
  searchTerm: string;
  searchKeys?: (keyof T)[];
  limit?: number;
  minSearchLength?: number;
  transformResult?: (item: T) => any;
};

export function useSearchSuggestions<T extends SearchableItem>({
  items,
  searchTerm,
  searchKeys = ['name'],
  limit = 10,
  minSearchLength = 2,
  transformResult,
}: SearchConfig<T>) {
  const suggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < minSearchLength || !items?.length) {
      return [];
    }

    const term = searchTerm.toLowerCase().trim();
    
    const filteredItems = items.filter(item => {
      return searchKeys.some(key => {
        const value = item[key];
        return value && value.toString().toLowerCase().includes(term);
      });
    });

    const limitedItems = filteredItems.slice(0, limit);

    if (transformResult) {
      return limitedItems.map(transformResult);
    }

    return limitedItems.map(item => ({
      id: item._id,
      text: item.name,
      originalItem: item
    }));
  }, [items, searchTerm, searchKeys, limit, minSearchLength, transformResult]);

  return suggestions;
}