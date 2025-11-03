import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <ApperIcon name="BookOpen" size={40} className="text-white" />
          </div>
          <div className="absolute -top-2 -right-2">
            <div className="w-8 h-8 bg-accent rounded-full animate-bounce flex items-center justify-center">
              <ApperIcon name="Sparkles" size={16} className="text-primary" />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-display text-primary">Preparing Your Adventure...</h2>
          <p className="text-gray-600 font-body">Getting your learning games ready!</p>
        </div>

        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;