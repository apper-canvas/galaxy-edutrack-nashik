import { useState, useMemo } from "react";

export const useSearch = (data, searchFields = ["name"]) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    return data.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchQuery.toLowerCase());
        }
        if (Array.isArray(value)) {
          return value.some(v => 
            typeof v === "string" && v.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        return false;
      })
    );
  }, [data, searchQuery, searchFields]);

  return {
    searchQuery,
    setSearchQuery,
    filteredData
  };
};