import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const ReadingQuestion = ({ question, onAnswer }) => {
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

  const playAudio = () => {
    // In a real app, this would play audio for the question
    console.log("Playing audio for:", question.question);
  };

  const getAnswerButtonClass = (answer) => {
    if (!showFeedback) return "bg-white border-2 border-gray-200 text-gray-800 hover:border-secondary hover:bg-secondary/5";
    
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
        <div className="flex items-center justify-center space-x-4 mb-6">
<h2 className="text-3xl font-display text-gray-800">{question.question_c}</h2>
        </div>
        
{/* Visual aid */}
        {question.image_c && (
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-secondary/20 to-info/20 rounded-2xl flex items-center justify-center mb-3">
              <ApperIcon name={question.image_c} size={48} className="text-secondary" />
            </div>
          </div>
        )}

        {question.description_c && (
          <p className="text-gray-600 text-lg">{question.description_c}</p>
        )}
      </Card>

      {/* Answer Options */}
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            className={`p-4 rounded-xl text-xl font-body transition-all duration-200 text-left ${getAnswerButtonClass(option)}`}
            onClick={() => handleAnswerClick(option)}
            disabled={showFeedback}
            whileHover={{ scale: showFeedback ? 1 : 1.01 }}
            whileTap={{ scale: showFeedback ? 1 : 0.99 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold">
                {String.fromCharCode(65 + index)}
              </div>
              <span>{option}</span>
            </div>
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
              <ApperIcon name="CheckCircle" size={32} className="text-success mx-auto" />
              <p className="text-success font-bold text-xl mt-2">Correct!</p>
              <p className="text-gray-600">Well done! You got it right!</p>
            </div>
          ) : (
            <div className="text-center">
              <ApperIcon name="XCircle" size={32} className="text-error mx-auto" />
              <p className="text-error font-bold text-xl mt-2">Keep practicing!</p>
              <p className="text-gray-600">The correct answer is "{question.correct_answer_c}"</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ReadingQuestion;