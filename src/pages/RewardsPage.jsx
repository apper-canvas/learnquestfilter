import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import StarRating from "@/components/molecules/StarRating";
import Avatar from "@/components/molecules/Avatar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import childrenService from "@/services/api/childrenService";
import activitiesService from "@/services/api/activitiesService";
import progressService from "@/services/api/progressService";

const RewardsPage = () => {
  const [child, setChild] = useState(null);
  const [activities, setActivities] = useState([]);
  const [progress, setProgress] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRewardsData();
  }, []);

  const loadRewardsData = async () => {
    try {
      setLoading(true);
      setError("");

      const children = await childrenService.getAll();
      const currentChild = children[0];
      setChild(currentChild);

      if (currentChild) {
        const childActivities = await activitiesService.getByChildId(currentChild.Id);
        setActivities(childActivities);

        const childProgress = await progressService.getByChildId(currentChild.Id);
        setProgress(childProgress);

        // Calculate achievements based on activities and progress
        calculateAchievements(childActivities, childProgress);
      }
    } catch (err) {
      setError("Failed to load rewards data. Please try again.");
      console.error("Error loading rewards:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAchievements = (activities, progressData) => {
    const totalStars = activities.reduce((sum, activity) => sum + activity.starsEarned, 0);
    const perfectScores = activities.filter(activity => activity.starsEarned === 3).length;
    const mastery80Plus = progressData.filter(p => p.masteryLevel >= 80).length;
    const mathActivities = activities.filter(a => parseInt(a.levelId) <= 5).length;
    const readingActivities = activities.filter(a => parseInt(a.levelId) > 5).length;

    const achievementsList = [
      {
        id: 1,
        title: "First Star",
        description: "Earned your very first star!",
        icon: "Star",
        color: "accent",
        unlocked: totalStars >= 1,
        requirement: "Earn 1 star"
      },
      {
        id: 2,
        title: "Star Collector",
        description: "Collected 10 stars",
        icon: "Award",
        color: "primary",
        unlocked: totalStars >= 10,
        requirement: "Earn 10 stars"
      },
      {
        id: 3,
        title: "Superstar",
        description: "Collected 25 stars",
        icon: "Trophy",
        color: "success",
        unlocked: totalStars >= 25,
        requirement: "Earn 25 stars"
      },
      {
        id: 4,
        title: "Perfect Score",
        description: "Got a perfect score on a level",
        icon: "Target",
        color: "accent",
        unlocked: perfectScores >= 1,
        requirement: "Score 100% on any level"
      },
      {
        id: 5,
        title: "Math Whiz",
        description: "Completed 5 math activities",
        icon: "Calculator",
        color: "primary",
        unlocked: mathActivities >= 5,
        requirement: "Complete 5 math levels"
      },
      {
        id: 6,
        title: "Reading Master",
        description: "Completed 5 reading activities",
        icon: "BookOpen",
        color: "secondary",
        unlocked: readingActivities >= 5,
        requirement: "Complete 5 reading levels"
      },
      {
        id: 7,
        title: "Skill Master",
        description: "Achieved 80% mastery in any skill",
        icon: "Zap",
        color: "warning",
        unlocked: mastery80Plus >= 1,
        requirement: "Reach 80% mastery"
      },
      {
        id: 8,
        title: "Learning Streak",
        description: "Completed activities for 7 days",
        icon: "Flame",
        color: "error",
        unlocked: false, // This would require date tracking
        requirement: "Learn for 7 days in a row"
      }
    ];

    setAchievements(achievementsList);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadRewardsData} />;

  const totalStars = activities.reduce((sum, activity) => sum + activity.starsEarned, 0);
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const recentActivities = activities.slice(-5).reverse();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-accent to-warning rounded-full flex items-center justify-center shadow-xl">
            <ApperIcon name="Award" size={40} className="text-white" />
          </div>
          
          <div>
            <h1 className="text-4xl font-display text-gray-800 mb-2">Your Rewards</h1>
            <p className="text-lg text-gray-600">Celebrate all your amazing achievements!</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 text-center bg-gradient-to-br from-accent/10 to-accent/5">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <ApperIcon name="Star" className="text-accent fill-accent" size={24} />
              <span className="text-3xl font-display text-accent">{totalStars}</span>
            </div>
            <p className="text-gray-600 font-medium">Total Stars</p>
          </Card>

          <Card className="p-6 text-center bg-gradient-to-br from-success/10 to-success/5">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <ApperIcon name="Trophy" className="text-success" size={24} />
              <span className="text-3xl font-display text-success">{unlockedAchievements.length}</span>
            </div>
            <p className="text-gray-600 font-medium">Achievements</p>
          </Card>

          <Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <ApperIcon name="Activity" className="text-primary" size={24} />
              <span className="text-3xl font-display text-primary">{activities.length}</span>
            </div>
            <p className="text-gray-600 font-medium">Completed</p>
          </Card>

          <Card className="p-6 text-center bg-gradient-to-br from-info/10 to-info/5">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <ApperIcon name="TrendingUp" className="text-info" size={24} />
              <span className="text-3xl font-display text-info">
                {Math.round(progress.reduce((sum, p) => sum + p.masteryLevel, 0) / Math.max(progress.length, 1))}%
              </span>
            </div>
            <p className="text-gray-600 font-medium">Avg Mastery</p>
          </Card>
        </div>

        {/* Achievement Showcase */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display text-gray-800">Achievement Gallery</h2>
            <Badge variant="success">{unlockedAchievements.length}/{achievements.length} Unlocked</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-4 text-center ${
                  achievement.unlocked 
                    ? `bg-gradient-to-br from-${achievement.color}/10 to-${achievement.color}/5 border-${achievement.color}/20` 
                    : "bg-gray-50 border-gray-200"
                }`}>
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                    achievement.unlocked
                      ? `bg-gradient-to-br from-${achievement.color} to-${achievement.color} shadow-lg`
                      : "bg-gray-300"
                  }`}>
                    <ApperIcon 
                      name={achievement.unlocked ? achievement.icon : "Lock"} 
                      size={24} 
                      className={achievement.unlocked ? "text-white" : "text-gray-500"} 
                    />
                  </div>
                  
                  <h3 className={`font-display text-lg mb-1 ${
                    achievement.unlocked ? "text-gray-800" : "text-gray-500"
                  }`}>
                    {achievement.title}
                  </h3>
                  
                  <p className={`text-sm mb-3 ${
                    achievement.unlocked ? "text-gray-600" : "text-gray-400"
                  }`}>
                    {achievement.unlocked ? achievement.description : achievement.requirement}
                  </p>

                  {achievement.unlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      <Badge variant={achievement.color} className="text-xs">
                        Unlocked!
                      </Badge>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="p-6">
          <h2 className="text-2xl font-display text-gray-800 mb-6">Recent Star Wins</h2>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    parseInt(activity.levelId) <= 5 
                      ? "bg-gradient-to-br from-primary to-secondary" 
                      : "bg-gradient-to-br from-secondary to-info"
                  }`}>
                    <ApperIcon 
                      name={parseInt(activity.levelId) <= 5 ? "Calculator" : "BookOpen"} 
                      size={20} 
                      className="text-white" 
                    />
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-800">
                      Level {activity.levelId} - {activity.correctAnswers}/{activity.totalQuestions} correct
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(activity.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <StarRating earned={activity.starsEarned} total={3} size={16} />
                  <Badge 
                    variant={activity.starsEarned === 3 ? "success" : activity.starsEarned === 2 ? "warning" : "primary"}
                  >
                    +{activity.starsEarned}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Motivational Section */}
        <Card className="p-6 text-center bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Avatar avatarId={child?.avatarId} size="lg" />
            <ApperIcon name="Sparkles" className="text-accent" size={32} />
          </div>
          
          <h3 className="text-2xl font-display text-gray-800 mb-2">
            You're Amazing, {child?.name}!
          </h3>
          
          <p className="text-gray-600 mb-4">
            Look at all the progress you've made! Keep learning and you'll unlock even more rewards.
          </p>
          
          {unlockedAchievements.length < achievements.length && (
            <div className="bg-white rounded-xl p-4 inline-block">
              <p className="text-sm text-gray-600 mb-2">Next achievement to unlock:</p>
              <p className="font-display text-primary">
                {achievements.find(a => !a.unlocked)?.title}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RewardsPage;