import React, { useEffect, useState } from "react";
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

const isCorrect = answer === question.correct_answer_c;
    
    setTimeout(() => {
      onAnswer(isCorrect, answer);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }, 1500);
  };

const getAnswerButtonClass = (answer) => {
    if (!showFeedback) return "bg-white border-2 border-gray-200 text-gray-800 hover:border-primary hover:bg-primary/5";
    
    if (answer === question.correct_answer_c) {
      return "bg-success border-success text-white";
    }
    
    if (answer === selectedAnswer && answer !== question.correct_answer_c) {
      return "bg-error border-error text-white";
    }
    
    return "bg-gray-100 border-gray-300 text-gray-500";
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Question */}
      <Card className="p-8 text-center">
<h2 className="text-4xl font-display text-gray-800 mb-4">{question.question_c}</h2>
{question.image_c && (
          <div className="flex justify-center mb-4">
            <ApperIcon name={question.image_c} size={48} className="text-primary" />
          </div>
        )}
        {question.description_c && (
          <p className="text-gray-600 text-lg mb-4">{question.description_c}</p>
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
{selectedAnswer === question.correct_answer_c ? (
            <div className="text-center">
              <ApperIcon name="CheckCircle" size={32} />
              <p className="text-success font-bold text-xl mt-2">Correct!</p>
              <p className="text-gray-600">Excellent work! You're awesome at math!</p>
            </div>
) : (
            <div className="text-center">
              <ApperIcon name="XCircle" size={32} />
              <p className="text-error font-bold text-xl mt-2">Not quite right</p>
              <p className="text-gray-600">The correct answer is {question.correct_answer_c}</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default MathQuestion;