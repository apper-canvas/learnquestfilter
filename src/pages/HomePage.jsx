import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useChild } from "@/contexts/ChildContext";
import activitiesService from "@/services/api/activitiesService";
import progressService from "@/services/api/progressService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Avatar from "@/components/molecules/Avatar";
import StarRating from "@/components/molecules/StarRating";
const HomePage = () => {
  const navigate = useNavigate();
const { activeChild } = useChild();
  const [recentActivities, setRecentActivities] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

const loadDashboardData = async () => {
    if (!activeChild) return;

    try {
      setLoading(true);
      setError("");

      // Load recent activities for active child
      const activities = await activitiesService.getByChildId(activeChild.Id);
      const sortedActivities = activities.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
      setRecentActivities(sortedActivities.slice(0, 3));

      // Load progress for active child
      const childProgress = await progressService.getByChildId(activeChild.Id);
      setProgress(childProgress);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getDailyGoal = () => {
    const completedToday = recentActivities.filter(activity => {
      const today = new Date().toDateString();
      const activityDate = new Date(activity.completedAt).toDateString();
      return today === activityDate;
    }).length;

    return Math.max(3 - completedToday, 0);
  };

  const getRandomEncouragement = () => {
    const messages = [
      "You're doing amazing!",
      "Keep up the great work!",
      "You're a learning star!",
      "Ready for more fun?",
      "Let's learn together!",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
<div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <Avatar avatarId={activeChild?.avatarId} size="xl" />
            <div>
              <h1 className="text-3xl lg:text-4xl font-display text-gray-800">
                {getGreeting()}, {activeChild?.name}!
              </h1>
              <p className="text-lg text-gray-600">{getRandomEncouragement()}</p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-8 text-center">
            <div>
              <div className="flex items-center justify-center space-x-1">
                <ApperIcon name="Star" className="text-accent fill-accent" size={20} />
                <span className="text-2xl font-display text-accent">{activeChild?.totalStars}</span>
              </div>
              <p className="text-sm text-gray-600">Total Stars</p>
            </div>
            
            <div>
              <div className="flex items-center justify-center space-x-1">
                <ApperIcon name="TrendingUp" className="text-success" size={20} />
                <span className="text-2xl font-display text-success">Level {activeChild?.currentLevel}</span>
              </div>
              <p className="text-sm text-gray-600">Current Level</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                <ApperIcon name="Calculator" size={28} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-display text-gray-800">Math Zone</h3>
                <p className="text-gray-600">Practice numbers, counting, and math skills</p>
                <Button 
                  onClick={() => navigate("/math")}
                  className="mt-3"
                  size="sm"
                >
                  Start Math Adventure
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-info rounded-2xl flex items-center justify-center shadow-lg">
                <ApperIcon name="BookOpen" size={28} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-display text-gray-800">Reading Zone</h3>
                <p className="text-gray-600">Learn letters, words, and reading skills</p>
                <Button 
                  onClick={() => navigate("/reading")}
                  variant="secondary"
                  className="mt-3"
                  size="sm"
                >
                  Start Reading Adventure
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Daily Progress */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display text-gray-800">Today's Goal</h2>
            <ApperIcon name="Target" className="text-accent" size={24} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Complete 3 activities</span>
              <span className="text-sm font-semibold text-primary">
                {3 - getDailyGoal()} / 3 completed
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000"
                style={{ width: `${((3 - getDailyGoal()) / 3) * 100}%` }}
              />
            </div>

            {getDailyGoal() === 0 && (
              <div className="bg-gradient-to-r from-success/10 to-success/5 border border-success/20 rounded-xl p-4 text-center">
                <ApperIcon name="CheckCircle" className="text-success mx-auto mb-2" size={32} />
                <p className="text-success font-display text-lg">Great job! You completed today's goal!</p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Activities */}
        {recentActivities.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display text-gray-800">Recent Activities</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/profile")}
              >
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={activity.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === 0 ? "bg-gradient-to-r from-primary to-secondary" :
                      index === 1 ? "bg-gradient-to-r from-secondary to-info" :
                      "bg-gradient-to-r from-accent to-warning"
                    }`}>
                      <ApperIcon 
                        name={activity.levelId <= "5" ? "Calculator" : "BookOpen"} 
                        size={18} 
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
                  
                  <StarRating earned={activity.starsEarned} total={3} size={16} />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <ApperIcon name="Trophy" className="text-accent mx-auto mb-2" size={24} />
            <p className="text-2xl font-display text-gray-800">{recentActivities.length}</p>
            <p className="text-sm text-gray-600">Activities</p>
          </Card>

          <Card className="p-4 text-center">
            <ApperIcon name="Flame" className="text-primary mx-auto mb-2" size={24} />
            <p className="text-2xl font-display text-gray-800">7</p>
            <p className="text-sm text-gray-600">Day Streak</p>
          </Card>

          <Card className="p-4 text-center">
            <ApperIcon name="Clock" className="text-info mx-auto mb-2" size={24} />
            <p className="text-2xl font-display text-gray-800">
              {Math.round(recentActivities.reduce((sum, a) => sum + a.timeSpent, 0) / 60)}
            </p>
            <p className="text-sm text-gray-600">Minutes Today</p>
          </Card>

          <Card className="p-4 text-center">
            <ApperIcon name="Award" className="text-success mx-auto mb-2" size={24} />
            <p className="text-2xl font-display text-gray-800">
              {progress.filter(p => p.masteryLevel >= 80).length}
            </p>
            <p className="text-sm text-gray-600">Skills Mastered</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;