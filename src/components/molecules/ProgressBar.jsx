import React from "react";
import { motion } from "framer-motion";

const ProgressBar = ({ progress = 0, max = 100, showPercentage = true, className = "" }) => {
  const percentage = Math.min((progress / max) * 100, 100);
  
  return (
    <div className={`w-full space-y-2 ${className}`}>
      {showPercentage && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Progress</span>
          <span className="text-sm font-semibold text-primary">{Math.round(percentage)}%</span>
        </div>
      )}
      
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;