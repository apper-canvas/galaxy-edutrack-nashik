import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const DataTable = ({ 
  columns, 
  data, 
  onEdit, 
  onDelete,
  className 
}) => {
  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.title}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
{data.map((row, index) => (
              <tr key={row.id || index} className="hover:bg-gray-50 transition-colors">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? (
                      column.render(row[column.key], row)
                    ) : column.key === "profilePhoto" && row[column.key] ? (
                      <img
                        src={row[column.key]}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : column.key === "subjects" && Array.isArray(row[column.key]) ? (
                      <div className="flex flex-wrap gap-1">
                        {row[column.key].map((subject, i) => (
                          <Badge key={i} variant="primary" size="sm">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    ) : column.key === "status" ? (
                      <Badge 
                        variant={
                          row[column.key] === "Completed" ? "success" :
                          row[column.key] === "Ongoing" ? "warning" : "default"
                        }
                      >
                        {row[column.key]}
                      </Badge>
                    ) : (
                      <span className="text-sm text-gray-900">
                        {row[column.key] || "-"}
                      </span>
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(row)}
                    >
                      <ApperIcon name="Edit" className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(row)}
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;