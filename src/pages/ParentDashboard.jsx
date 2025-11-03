import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ProgressBar from "@/components/molecules/ProgressBar";
import Avatar from "@/components/molecules/Avatar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { useChild } from "@/contexts/ChildContext";
import activitiesService from "@/services/api/activitiesService";
import progressService from "@/services/api/progressService";
import { format, subDays, isAfter } from "date-fns";
const ParentDashboard = () => {
const navigate = useNavigate();
  const { activeChild, allChildren } = useChild();
  const [activities, setActivities] = useState([]);
  const [progress, setProgress] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeFilter, setTimeFilter] = useState("week"); // week, month, all

  useEffect(() => {
loadDashboardData();
  }, [activeChild]);

  const loadDashboardData = async () => {
    if (!activeChild) return;

    try {
      setLoading(true);
      setError("");

      const childActivities = await activitiesService.getByChildId(activeChild.Id);
      setActivities(childActivities);

      const childProgress = await progressService.getByChildId(activeChild.Id);
      setProgress(childProgress);

      generateWeeklyData(childActivities);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateWeeklyData = (activities) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayActivities = activities.filter(activity => {
        const activityDate = new Date(activity.completedAt);
        return activityDate.toDateString() === date.toDateString();
      });

      return {
        date: format(date, "MMM dd"),
        day: format(date, "EEE"),
        activities: dayActivities.length,
        stars: dayActivities.reduce((sum, a) => sum + a.starsEarned, 0),
        timeSpent: dayActivities.reduce((sum, a) => sum + a.timeSpent, 0)
      };
    });

    setWeeklyData(last7Days);
  };

  const getFilteredActivities = () => {
    const now = new Date();
    const filterDate = timeFilter === "week" 
      ? subDays(now, 7) 
      : timeFilter === "month" 
      ? subDays(now, 30) 
      : new Date(0);

    return activities.filter(activity => 
      isAfter(new Date(activity.completedAt), filterDate)
    );
  };

  const getTimeSpentToday = () => {
    const today = new Date().toDateString();
    const todayActivities = activities.filter(activity => 
      new Date(activity.completedAt).toDateString() === today
    );
    return todayActivities.reduce((sum, a) => sum + a.timeSpent, 0);
  };

  const getStrengthsAndWeaknesses = () => {
    if (progress.length === 0) return { strengths: [], weaknesses: [] };

    const sorted = [...progress].sort((a, b) => b.masteryLevel - a.masteryLevel);
    return {
      strengths: sorted.slice(0, 3),
      weaknesses: sorted.slice(-3).reverse()
    };
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const filteredActivities = getFilteredActivities();
  const totalTimeSpent = filteredActivities.reduce((sum, a) => sum + a.timeSpent, 0);
  const totalStars = filteredActivities.reduce((sum, a) => sum + a.starsEarned, 0);
  const averageScore = filteredActivities.length > 0
    ? Math.round(filteredActivities.reduce((sum, a) => sum + (a.correctAnswers / a.totalQuestions * 100), 0) / filteredActivities.length)
    : 0;

  const { strengths, weaknesses } = getStrengthsAndWeaknesses();
  const todayMinutes = Math.round(getTimeSpentToday() / 60);

  return (
<div className="min-h-screen bg-gradient-to-br from-background to-warning/10 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar avatarId={activeChild?.avatarId} size="lg" />
            <div>
              <h1 className="text-3xl font-display text-gray-800">
                {activeChild?.name}'s Progress Dashboard
              </h1>
              <p className="text-gray-600">Parent view • Last updated just now</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/parent/manage-children')}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Settings" size={16} />
              <span>Manage Children</span>
            </Button>
            {["week", "month", "all"].map((filter) => (
              <Button
                key={filter}
                variant={timeFilter === filter ? "primary" : "ghost"}
                size="sm"
                onClick={() => setTimeFilter(filter)}
                className="capitalize"
              >
                {filter === "all" ? "All Time" : `This ${filter}`}
              </Button>
            ))}
          </div>
        </div>

        {/* Children Summary Cards */}
        {allChildren.length > 1 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allChildren.map((child) => (
              <motion.div
                key={child.Id}
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className={`p-4 ${activeChild?.Id === child.Id ? 'border-primary bg-primary/5' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <Avatar avatarId={child.avatarId} size="md" />
                    <div className="flex-1">
                      <h3 className="font-display text-lg text-gray-800">
                        {child.name}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span>Level {child.currentLevel}</span>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Star" size={12} className="text-accent" />
                          <span>{child.totalStars}</span>
                        </div>
                      </div>
                    </div>
                    {activeChild?.Id === child.Id && (
                      <ApperIcon name="Eye" size={16} className="text-primary" />
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <ApperIcon name="Clock" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-display text-primary">
                  {Math.round(totalTimeSpent / 60)} min
                </p>
                <p className="text-gray-600 text-sm">Total Learning Time</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                <ApperIcon name="Star" size={24} className="text-gray-800" />
              </div>
              <div>
                <p className="text-2xl font-display text-accent">{totalStars}</p>
                <p className="text-gray-600 text-sm">Stars Earned</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-display text-success">{averageScore}%</p>
                <p className="text-gray-600 text-sm">Average Score</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-info/10 to-info/5">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-info rounded-xl flex items-center justify-center">
                <ApperIcon name="Activity" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-display text-info">{filteredActivities.length}</p>
                <p className="text-gray-600 text-sm">Activities Completed</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Weekly Activity Chart */}
        <Card className="p-6">
          <h2 className="text-2xl font-display text-gray-800 mb-6">Weekly Activity</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2 text-center">
              {weeklyData.map((day, index) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="text-sm font-medium text-gray-600">{day.day}</div>
                  <div 
                    className={`w-full h-24 rounded-xl flex items-end justify-center p-2 ${
                      day.activities > 0 
                        ? "bg-gradient-to-t from-primary to-primary/50" 
                        : "bg-gray-100"
                    }`}
                  >
                    {day.activities > 0 && (
                      <div className="text-center">
                        <div className="text-white font-display text-lg">{day.activities}</div>
                        <div className="text-white/80 text-xs">
                          {day.stars}★ • {Math.round(day.timeSpent / 60)}m
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">{day.date}</div>
                </motion.div>
              ))}
            </div>

            {todayMinutes > 0 && (
              <div className="bg-gradient-to-r from-success/10 to-success/5 border border-success/20 rounded-xl p-4 text-center">
<ApperIcon name="CheckCircle" className="text-success mx-auto mb-2" size={24} />
                <p className="text-success font-medium">
                  Great job today! {activeChild?.name} practiced for {todayMinutes} minutes.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Skills Analysis */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-display text-gray-800 mb-4">
              <ApperIcon name="Trophy" className="inline text-success mr-2" size={20} />
              Strengths
            </h3>
            
            <div className="space-y-4">
              {strengths.map((skill) => (
                <div key={`${skill.subject}-${skill.skillArea}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <ApperIcon 
                        name={skill.subject === "math" ? "Calculator" : "BookOpen"} 
                        size={16} 
                        className={skill.subject === "math" ? "text-primary" : "text-secondary"} 
                      />
                      <span className="font-medium capitalize">{skill.skillArea}</span>
                    </div>
                    <span className="text-success font-semibold">{skill.masteryLevel}%</span>
                  </div>
                  <ProgressBar progress={skill.masteryLevel} max={100} showPercentage={false} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-display text-gray-800 mb-4">
              <ApperIcon name="Target" className="inline text-warning mr-2" size={20} />
              Areas to Practice
            </h3>
            
            <div className="space-y-4">
              {weaknesses.map((skill) => (
                <div key={`${skill.subject}-${skill.skillArea}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <ApperIcon 
                        name={skill.subject === "math" ? "Calculator" : "BookOpen"} 
                        size={16} 
                        className={skill.subject === "math" ? "text-primary" : "text-secondary"} 
                      />
                      <span className="font-medium capitalize">{skill.skillArea}</span>
                    </div>
                    <span className="text-warning font-semibold">{skill.masteryLevel}%</span>
                  </div>
                  <ProgressBar progress={skill.masteryLevel} max={100} showPercentage={false} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="p-6 bg-gradient-to-br from-info/5 to-info/10 border-info/20">
          <h2 className="text-2xl font-display text-gray-800 mb-4">
            <ApperIcon name="Lightbulb" className="inline text-info mr-2" size={24} />
            Recommendations
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-display text-lg text-gray-800">Learning Tips</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <ApperIcon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>Keep practice sessions to 15-20 minutes for optimal focus</span>
                </li>
                <li className="flex items-start space-x-2">
                  <ApperIcon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>Celebrate progress and effort, not just perfect scores</span>
                </li>
                <li className="flex items-start space-x-2">
                  <ApperIcon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>Practice weaker skills more frequently but keep it fun</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-display text-lg text-gray-800">Next Steps</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <ApperIcon name="ArrowRight" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>Focus on {weaknesses[0]?.skillArea || "new challenges"} this week</span>
                </li>
                <li className="flex items-start space-x-2">
                  <ApperIcon name="ArrowRight" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>Try to maintain daily 15-minute practice sessions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <ApperIcon name="ArrowRight" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>Unlock new levels by earning more stars</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ParentDashboard;