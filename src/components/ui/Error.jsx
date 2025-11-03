import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Oops! Something went wrong", onRetry }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="text-center max-w-md mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-error/20 to-error/10 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" size={40} className="text-error" />
        </div>
        
        <h3 className="text-xl font-display text-gray-800 mb-2">Oops!</h3>
        <p className="text-gray-600 font-body mb-6">{message}</p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <ApperIcon name="RotateCcw" size={20} className="inline mr-2" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default Error;