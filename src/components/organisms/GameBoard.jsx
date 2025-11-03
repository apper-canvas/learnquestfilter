import React from "react";
import { motion } from "framer-motion";
import LevelCard from "@/components/molecules/LevelCard";
import Empty from "@/components/ui/Empty";

const GameBoard = ({ levels, completedLevels, onLevelClick }) => {
  if (!levels || levels.length === 0) {
    return (
      <Empty
        title="No levels available"
        message="Come back soon for exciting new levels!"
        icon="Play"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {levels.map((level, index) => {
        const completedLevel = completedLevels.find(cl => cl.levelId === level.id);
        const isCompleted = !!completedLevel;
        const isLocked = level.isLocked;
        
        return (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <LevelCard
              level={level}
              isLocked={isLocked}
              isCompleted={isCompleted}
              starsEarned={completedLevel?.starsEarned || 0}
              onClick={() => !isLocked && onLevelClick(level)}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default GameBoard;