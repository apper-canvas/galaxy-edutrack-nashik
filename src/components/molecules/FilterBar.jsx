import React from "react";
import { cn } from "@/utils/cn";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  className 
}) => {
  const hasActiveFilters = Object.values(filters).some(value => value && value !== "");

  return (
    <div className={cn("flex flex-wrap gap-4 items-center", className)}>
      {filters.class !== undefined && (
        <Select
          value={filters.class}
          onChange={(e) => onFilterChange("class", e.target.value)}
          className="min-w-[120px]"
        >
          <option value="">All Classes</option>
          <option value="10th">10th</option>
          <option value="11th">11th</option>
          <option value="12th">12th</option>
        </Select>
      )}
      
      {filters.department !== undefined && (
        <Select
          value={filters.department}
          onChange={(e) => onFilterChange("department", e.target.value)}
          className="min-w-[140px]"
        >
          <option value="">All Departments</option>
          <option value="Science">Science</option>
          <option value="Commerce">Commerce</option>
          <option value="Arts">Arts</option>
          <option value="Computer Science">Computer Science</option>
        </Select>
      )}
      
      {filters.status !== undefined && (
        <Select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="min-w-[120px]"
        >
          <option value="">All Status</option>
          <option value="Planned">Planned</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </Select>
      )}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
        >
          <ApperIcon name="X" className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
};

export default FilterBar;