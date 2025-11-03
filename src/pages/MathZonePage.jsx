import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import GameBoard from "@/components/organisms/GameBoard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import levelsService from "@/services/api/levelsService";
import activitiesService from "@/services/api/activitiesService";
import childrenService from "@/services/api/childrenService";

const MathZonePage = () => {
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMathData();
  }, []);

  const loadMathData = async () => {
    try {
      setLoading(true);
      setError("");

      // Load current child
      const children = await childrenService.getAll();
      const currentChild = children[0];
      setChild(currentChild);

      // Load math levels
      const mathLevels = await levelsService.getBySubject("math");
      
      // Update lock status based on stars earned
      if (currentChild) {
        const activities = await activitiesService.getByChildId(currentChild.Id);
        const totalStars = activities.reduce((sum, activity) => sum + activity.starsEarned, 0);
        
        const updatedLevels = mathLevels.map(level => ({
          ...level,
          isLocked: totalStars < level.requiredStars
        }));
        
        setLevels(updatedLevels);
        setCompletedLevels(activities);
      } else {
        setLevels(mathLevels);
      }
    } catch (err) {
      setError("Failed to load math levels. Please try again.");
      console.error("Error loading math data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLevelClick = (level) => {
    navigate(`/game/${level.Id}`);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadMathData} />;

  const completedCount = completedLevels.filter(cl => 
    levels.some(l => l.Id.toString() === cl.levelId)
  ).length;

  const totalStars = completedLevels.reduce((sum, cl) => sum + cl.starsEarned, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-xl">
            <ApperIcon name="Calculator" size={40} className="text-white" />
          </div>
          
          <div>
            <h1 className="text-4xl font-display text-gray-800 mb-2">Math Zone</h1>
            <p className="text-lg text-gray-600">Practice numbers, counting, and math skills!</p>
          </div>

          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <ApperIcon name="CheckCircle" className="text-success" size={20} />
                <span className="text-2xl font-display text-success">{completedCount}</span>
              </div>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <ApperIcon name="Star" className="text-accent fill-accent" size={20} />
                <span className="text-2xl font-display text-accent">{totalStars}</span>
              </div>
              <p className="text-sm text-gray-600">Stars Earned</p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display text-gray-800">Your Math Journey</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/progress")}
            >
              View Progress
            </Button>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000"
              style={{ width: `${(completedCount / levels.length) * 100}%` }}
            />
          </div>
          
          <p className="text-sm text-gray-600 text-center">
            {completedCount} of {levels.length} levels completed
          </p>
        </Card>

        {/* Difficulty Sections */}
        <div className="space-y-8">
          {["easy", "medium", "hard"].map(difficulty => {
            const difficultyLevels = levels.filter(level => level.difficulty === difficulty);
            if (difficultyLevels.length === 0) return null;

            const difficultyColors = {
              easy: "from-success/10 to-success/5 border-success/20",
              medium: "from-warning/10 to-warning/5 border-warning/20",
              hard: "from-error/10 to-error/5 border-error/20"
            };

            const difficultyIcons = {
              easy: "Smile",
              medium: "Zap",
              hard: "Flame"
            };

            return (
              <div key={difficulty}>
                <Card className={`p-6 bg-gradient-to-br ${difficultyColors[difficulty]}`}>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      difficulty === "easy" ? "bg-success" :
                      difficulty === "medium" ? "bg-warning" : "bg-error"
                    }`}>
                      <ApperIcon name={difficultyIcons[difficulty]} size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display text-gray-800 capitalize">{difficulty} Level</h3>
                      <p className="text-gray-600">
                        {difficultyLevels.length} levels available
                      </p>
                    </div>
                  </div>

                  <GameBoard
                    levels={difficultyLevels}
                    completedLevels={completedLevels}
                    onLevelClick={handleLevelClick}
                  />
                </Card>
              </div>
            );
          })}
        </div>

        {/* Motivational Section */}
        <Card className="p-6 text-center bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <ApperIcon name="Trophy" className="text-accent mx-auto mb-4" size={48} />
          <h3 className="text-2xl font-display text-gray-800 mb-2">Keep Going!</h3>
          <p className="text-gray-600 mb-4">
            You're doing amazing! Every problem you solve makes you smarter.
          </p>
          <Button 
            variant="accent"
            onClick={() => {
              const nextLevel = levels.find(level => !level.isLocked && !completedLevels.find(cl => cl.levelId === level.Id.toString()));
              if (nextLevel) {
                handleLevelClick(nextLevel);
              }
            }}
          >
            Continue Learning
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default MathZonePage;