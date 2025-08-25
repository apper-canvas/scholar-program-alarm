import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item.",
  actionLabel = "Add Item",
  onAction,
  icon = "Package",
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-primary" />
      </div>
      
      <div className="text-center max-w-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {title}
        </h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {description}
        </p>
        
        {onAction && actionLabel && (
          <Button 
            onClick={onAction}
            variant="primary"
            size="large"
            className="inline-flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            <span>{actionLabel}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;