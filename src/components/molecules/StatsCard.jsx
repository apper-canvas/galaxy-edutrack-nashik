import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color = "primary",
  subtitle,
  onClick,
  className 
}) => {
  const colors = {
    primary: "text-primary-600 bg-primary-50",
    success: "text-green-600 bg-green-50",
    warning: "text-amber-600 bg-amber-50",
    error: "text-red-600 bg-red-50",
    info: "text-blue-600 bg-blue-50",
    purple: "text-purple-600 bg-purple-50",
  };

  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={cn(
        "bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-all duration-200",
        onClick && "hover:shadow-md hover:scale-[1.02] cursor-pointer",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-gray-600">{title}</div>
        {icon && (
          <div className={cn("p-2 rounded-lg", colors[color])}>
            <ApperIcon name={icon} className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      {subtitle && (
        <div className="text-sm text-gray-500">{subtitle}</div>
      )}
    </Component>
  );
};

export default StatsCard;