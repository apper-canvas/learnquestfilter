import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "Nothing here yet!", 
  message = "Start your learning adventure to see progress here.",
  actionText = "Start Learning",
  onAction,
  icon = "BookOpen"
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="text-center max-w-md mx-auto">
        <div className="relative mb-6">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full flex items-center justify-center">
            <ApperIcon name={icon} size={48} className="text-primary" />
          </div>
          <div className="absolute -top-2 -right-4">
            <div className="w-8 h-8 bg-accent rounded-full animate-bounce flex items-center justify-center">
              <ApperIcon name="Sparkles" size={16} className="text-primary" />
            </div>
          </div>
        </div>
        
        <h3 className="text-2xl font-display text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 font-body mb-6">{message}</p>
        
        {onAction && (
          <button
            onClick={onAction}
            className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 hover:-translate-y-1"
          >
            <ApperIcon name="Play" size={20} className="inline mr-2" />
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;