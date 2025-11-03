import React from "react";
import ApperIcon from "@/components/ApperIcon";
import ProgressBar from "@/components/molecules/ProgressBar";

const GameHeader = ({ 
  currentQuestion = 1, 
  totalQuestions = 10,
  timeLeft = 30,
  starsEarned = 0,
  onExit 
}) => {
  return (
    <div className="bg-white shadow-lg p-4 rounded-b-2xl">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onExit}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ApperIcon name="ArrowLeft" size={20} />
          <span className="font-medium">Exit</span>
        </button>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Clock" size={16} className="text-info" />
            <span className="font-semibold text-info">{timeLeft}s</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <ApperIcon name="Star" size={16} className="text-accent" />
            <span className="font-semibold text-accent">{starsEarned}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestion} of {totalQuestions}
          </span>
          <span className="text-sm font-semibold text-primary">
            {Math.round((currentQuestion / totalQuestions) * 100)}%
          </span>
        </div>
        <ProgressBar 
          progress={currentQuestion} 
          max={totalQuestions} 
          showPercentage={false}
        />
      </div>
    </div>
  );
};

export default GameHeader;