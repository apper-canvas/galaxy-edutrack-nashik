import { useState, useMemo } from "react";

export const usePagination = (data, itemsPerPage = 20) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Reset to first page when data changes
  useMemo(() => {
    setCurrentPage(1);
  }, [data]);

  return {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    setCurrentPage
  };
};