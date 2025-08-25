import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue,
  gradient = "from-primary to-secondary",
  className = "" 
}) => {
  return (
    <Card className={`hover-scale transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-gray-600">
          {title}
        </div>
        <div className={`p-2 rounded-full bg-gradient-to-br ${gradient} bg-opacity-10`}>
          <ApperIcon name={icon} className="w-5 h-5 text-primary" />
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold gradient-text mb-1">
            {value}
          </div>
          {trend && trendValue && (
            <div className={`flex items-center text-sm ${
              trend === "up" ? "text-success" : 
              trend === "down" ? "text-error" : "text-gray-600"
            }`}>
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"} 
                className="w-4 h-4 mr-1" 
              />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;