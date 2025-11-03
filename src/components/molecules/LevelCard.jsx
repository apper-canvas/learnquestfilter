import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import StarRating from "@/components/molecules/StarRating";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const LevelCard = ({ 
  level, 
  isLocked = false, 
  isCompleted = false, 
  starsEarned = 0,
  onClick 
}) => {
  const getSubjectIcon = (subject) => {
    switch (subject) {
      case "math": return "Calculator";
      case "reading": return "BookOpen";
      default: return "Play";
    }
  };

  const getSubjectColor = (subject) => {
    switch (subject) {
      case "math": return "from-primary to-secondary";
      case "reading": return "from-secondary to-info";
      default: return "from-accent to-warning";
    }
  };

  if (isLocked) {
    return (
      <Card className="p-4 bg-gray-100 border-gray-200">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
            <ApperIcon name="Lock" size={24} className="text-gray-500" />
          </div>
          <div>
            <h3 className="font-display text-gray-500">Level {level.orderIndex}</h3>
            <p className="text-sm text-gray-400 capitalize">{level.type}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="p-4 cursor-pointer hover:shadow-xl transition-all duration-200" onClick={onClick}>
        <div className="text-center space-y-3">
          <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${getSubjectColor(level.subject)} rounded-full flex items-center justify-center shadow-lg`}>
            <ApperIcon name={getSubjectIcon(level.subject)} size={28} className="text-white" />
          </div>
          
          <div>
            <h3 className="font-display text-lg text-gray-800">Level {level.orderIndex}</h3>
            <p className="text-sm text-gray-600 capitalize">{level.type}</p>
            <Badge variant={level.difficulty === "easy" ? "success" : level.difficulty === "medium" ? "warning" : "error"} className="mt-1">
              {level.difficulty}
            </Badge>
          </div>

          {isCompleted && (
            <div className="space-y-2">
              <StarRating earned={starsEarned} total={3} size={20} />
              <div className="flex items-center justify-center space-x-1 text-success">
                <ApperIcon name="CheckCircle" size={16} />
                <span className="text-sm font-medium">Complete!</span>
              </div>
            </div>
          )}

          {!isCompleted && (
            <Button size="sm" className="w-full">
              Start Level
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default LevelCard;