import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="w-16 h-16 bg-gradient-to-br from-error/20 to-error/30 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
      </div>
      
      <div className="text-center max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>
        
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="primary"
            className="inline-flex items-center space-x-2"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4" />
            <span>Try Again</span>
          </Button>
        )}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  );
};

export default Error;