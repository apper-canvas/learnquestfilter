import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import GameHeader from "@/components/molecules/GameHeader";
import MathQuestion from "@/components/organisms/MathQuestion";
import ReadingQuestion from "@/components/organisms/ReadingQuestion";
import StarRating from "@/components/molecules/StarRating";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import levelsService from "@/services/api/levelsService";
import questionsService from "@/services/api/questionsService";
import activitiesService from "@/services/api/activitiesService";
import childrenService from "@/services/api/childrenService";
import progressService from "@/services/api/progressService";

const GamePage = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  
  const [level, setLevel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState("loading"); // loading, playing, completed
  const [starsEarned, setStarsEarned] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadGameData();
  }, [levelId]);

  useEffect(() => {
    let timer;
    if (gameState === "playing" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameState === "playing") {
      // Time's up - treat as incorrect answer
      handleAnswer(false, null);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  const loadGameData = async () => {
    try {
      setLoading(true);
      setError("");

      const levelData = await levelsService.getById(levelId);
      if (!levelData) {
        setError("Level not found");
        return;
      }

      const questionsData = await questionsService.getByLevelId(levelId);
      if (questionsData.length === 0) {
        setError("No questions available for this level");
        return;
      }

      setLevel(levelData);
      setQuestions(questionsData);
      setGameState("playing");
      setTimeLeft(30);
    } catch (err) {
      setError("Failed to load game data. Please try again.");
      console.error("Error loading game:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (isCorrect, selectedAnswer) => {
    const newAnswer = {
      questionId: questions[currentQuestionIndex].Id,
      isCorrect,
      selectedAnswer,
      timeSpent: 30 - timeLeft
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(30);
    } else {
      completeGame(newAnswers);
    }
  };

  const completeGame = async (finalAnswers) => {
    try {
      setGameState("completed");
      
      const correctCount = finalAnswers.filter(a => a.isCorrect).length;
      const totalQuestions = questions.length;
      const accuracy = (correctCount / totalQuestions) * 100;
      
      // Calculate stars based on accuracy and time
      let stars = 0;
      if (accuracy >= 90) stars = 3;
      else if (accuracy >= 70) stars = 2;
      else if (accuracy >= 50) stars = 1;
      
      setStarsEarned(stars);

      // Save activity
      const children = await childrenService.getAll();
      const currentChild = children[0];
      
      if (currentChild) {
        await activitiesService.create({
          levelId: levelId,
          childId: currentChild.Id.toString(),
          starsEarned: stars,
          correctAnswers: correctCount,
          totalQuestions: totalQuestions,
          timeSpent: finalAnswers.reduce((sum, a) => sum + a.timeSpent, 0)
        });

        // Update progress
        await progressService.updateProgress(
          currentChild.Id,
          level.subject,
          level.type,
          Math.round(accuracy)
        );

        // Update child's total stars and level
        const newTotalStars = currentChild.totalStars + stars;
        const newCurrentLevel = Math.max(currentChild.currentLevel, level.orderIndex);
        
        await childrenService.update(currentChild.Id, {
          totalStars: newTotalStars,
          currentLevel: newCurrentLevel
        });

        toast.success(`Great job! You earned ${stars} star${stars !== 1 ? 's' : ''}!`);
      }

      setShowResults(true);
    } catch (err) {
      console.error("Error completing game:", err);
      toast.error("Failed to save your progress. Please try again.");
    }
  };

  const handleExit = () => {
    if (level) {
      navigate(level.subject === "math" ? "/math" : "/reading");
    } else {
      navigate("/");
    }
  };

  const playAgain = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setTimeLeft(30);
    setStarsEarned(0);
    setShowResults(false);
    setGameState("playing");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadGameData} />;

  if (showResults) {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const accuracy = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-success to-accent rounded-full flex items-center justify-center shadow-xl mb-6">
                <ApperIcon name="Trophy" size={64} className="text-white" />
              </div>
            </motion.div>

            <div>
              <h1 className="text-3xl font-display text-gray-800 mb-2">Level Complete!</h1>
              <p className="text-lg text-gray-600">Awesome job on Level {level?.orderIndex}!</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <StarRating earned={starsEarned} total={3} size={32} showAnimation={true} />
              </div>
              
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <p className="text-3xl font-display text-success">{correctCount}/{questions.length}</p>
                  <p className="text-sm text-gray-600">Correct Answers</p>
                </div>
                <div>
                  <p className="text-3xl font-display text-info">{accuracy}%</p>
                  <p className="text-sm text-gray-600">Accuracy</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={playAgain} size="lg" className="w-full">
                <ApperIcon name="RotateCcw" className="mr-2" />
                Play Again
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" onClick={() => navigate("/rewards")}>
                  <ApperIcon name="Award" className="mr-2" />
                  View Rewards
                </Button>
                <Button variant="outline" onClick={handleExit}>
                  <ApperIcon name="ArrowLeft" className="mr-2" />
                  Back to Levels
                </Button>
              </div>
            </div>

            {starsEarned === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="bg-gradient-to-r from-accent/20 to-success/20 border border-accent/30 rounded-xl p-4"
              >
                <p className="text-accent font-display text-lg">⭐ Perfect Score! ⭐</p>
                <p className="text-gray-600 text-sm">You're a learning superstar!</p>
              </motion.div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      <GameHeader
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        timeLeft={timeLeft}
        starsEarned={starsEarned}
        onExit={handleExit}
      />

      <div className="p-4 lg:p-8 mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {level?.subject === "math" ? (
              <MathQuestion
                question={currentQuestion}
                onAnswer={handleAnswer}
              />
            ) : (
              <ReadingQuestion
                question={currentQuestion}
                onAnswer={handleAnswer}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GamePage;