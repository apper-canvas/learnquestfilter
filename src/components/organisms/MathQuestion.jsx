import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const MathQuestion = ({ question, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswerClick = (answer) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answer);
    setShowFeedback(true);

    const isCorrect = answer === question.correctAnswer;
    
    setTimeout(() => {
      onAnswer(isCorrect, answer);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }, 1500);
  };

  const getAnswerButtonClass = (answer) => {
    if (!showFeedback) return "bg-white border-2 border-gray-200 text-gray-800 hover:border-primary hover:bg-primary/5";
    
    if (answer === question.correctAnswer) {
      return "bg-success border-success text-white";
    }
    
    if (answer === selectedAnswer && answer !== question.correctAnswer) {
      return "bg-error border-error text-white";
    }
    
    return "bg-gray-100 border-gray-300 text-gray-500";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Question */}
      <Card className="p-8 text-center">
        <h2 className="text-4xl font-display text-gray-800 mb-4">{question.question}</h2>
        {question.image && (
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl flex items-center justify-center mb-4">
            <ApperIcon name={question.image} size={48} className="text-primary" />
          </div>
        )}
        {question.description && (
          <p className="text-gray-600 text-lg">{question.description}</p>
        )}
      </Card>

      {/* Answer Options */}
      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            className={`p-6 rounded-2xl text-2xl font-display transition-all duration-200 ${getAnswerButtonClass(option)}`}
            onClick={() => handleAnswerClick(option)}
            disabled={showFeedback}
            whileHover={{ scale: showFeedback ? 1 : 1.02 }}
            whileTap={{ scale: showFeedback ? 1 : 0.98 }}
          >
            {option}
          </motion.button>
        ))}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          {selectedAnswer === question.correctAnswer ? (
            <div className="flex items-center justify-center space-x-2 text-success">
              <ApperIcon name="CheckCircle" size={32} />
              <span className="text-2xl font-display">Great job!</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2 text-error">
              <ApperIcon name="XCircle" size={32} />
              <span className="text-2xl font-display">Try again next time!</span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default MathQuestion;