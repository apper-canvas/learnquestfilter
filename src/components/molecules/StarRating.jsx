import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const StarRating = ({ earned = 0, total = 3, size = 24, showAnimation = false }) => {
  const stars = Array.from({ length: total }, (_, index) => {
    const isFilled = index < earned;
    
    return (
      <motion.div
        key={index}
        initial={showAnimation ? { scale: 0, rotate: 0 } : false}
        animate={showAnimation && isFilled ? { 
          scale: 1, 
          rotate: 360,
        } : { scale: 1, rotate: 0 }}
        transition={{ 
          delay: showAnimation ? index * 0.2 : 0,
          duration: 0.6,
          ease: "easeOut"
        }}
        className="relative"
      >
        {isFilled ? (
          <ApperIcon 
            name="Star" 
            size={size} 
            className="text-accent fill-accent drop-shadow-sm" 
          />
        ) : (
          <ApperIcon 
            name="Star" 
            size={size} 
            className="text-gray-300" 
          />
        )}
        
        {showAnimation && isFilled && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
            transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <ApperIcon name="Sparkles" size={size * 0.6} className="text-accent" />
          </motion.div>
        )}
      </motion.div>
    );
  });

  return (
    <div className="flex items-center space-x-1">
      {stars}
    </div>
  );
};

export default StarRating;