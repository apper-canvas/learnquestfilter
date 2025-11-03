import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { format, isAfter, subDays } from "date-fns";
import activitiesService from "@/services/api/activitiesService";
import progressService from "@/services/api/progressService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Avatar from "@/components/molecules/Avatar";
import ProgressBar from "@/components/molecules/ProgressBar";
import { useChild } from "@/contexts/ChildContext";
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
// Process data for charts
      processChartData(childActivities);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (activities) => {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayActivities = activities.filter(activity => {
        const activityDate = new Date(activity.completed_at_c);
        return activityDate.toDateString() === date.toDateString();
      });
      
      return {
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        stars: dayActivities.reduce((sum, a) => sum + a.stars_earned_c, 0),
        timeSpent: dayActivities.reduce((sum, a) => sum + a.time_spent_c, 0)
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
      timeFilter === "today" ? 
        new Date(activity.completed_at_c).toDateString() === new Date().toDateString() :
      timeFilter === "week" ?
        new Date(activity.completed_at_c) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) :
        true
    );
  };

  const getTodayTime = () => {
    const today = new Date().toDateString();
    const todayActivities = activities.filter(a => new Date(a.completed_at_c).toDateString() === today);
    return todayActivities.reduce((sum, a) => sum + a.time_spent_c, 0);
  };

  const getStrengthsAndWeaknesses = () => {
    if (progress.length === 0) return { strengths: [], weaknesses: [] };

const sorted = [...progress].sort((a, b) => b.mastery_level_c - a.mastery_level_c);
    return {
      strengths: sorted.slice(0, 3),
      weaknesses: sorted.slice(-3).reverse()
    };
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const filteredActivities = getFilteredActivities();
const totalTimeSpent = filteredActivities.reduce((sum, a) => sum + a.time_spent_c, 0);
  const totalStars = filteredActivities.reduce((sum, a) => sum + a.stars_earned_c, 0);
  const averageAccuracy = filteredActivities.length > 0 
    ? Math.round(filteredActivities.reduce((sum, a) => sum + (a.correct_answers_c / a.total_questions_c * 100), 0) / filteredActivities.length)
    : 0;
const { strengths, weaknesses } = getStrengthsAndWeaknesses();
  const todayMinutes = Math.round(getTodayTime() / 60);

  return (
<div className="min-h-screen bg-gradient-to-br from-background to-warning/10 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
<Avatar avatarId={activeChild?.avatar_id_c} size="lg" />
            <div>
              <h1 className="text-3xl font-display text-gray-800">
                {activeChild?.name_c}'s Progress Dashboard
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
                    <Avatar avatarId={child.avatar_id_c} size="md" />
                    <div>
                      <h3 className="font-display text-lg text-gray-800">
                        {child.name_c}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span>Level {child.current_level_c}</span>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Star" size={14} className="text-accent" />
                          <span>{child.total_stars_c}</span>
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
<div>
                <p className="text-2xl font-display text-success">{averageAccuracy}%</p>
                <p className="text-gray-600 text-sm">Average Score</p>
              </div>
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
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="text-sm font-medium text-gray-600">{day.day}</div>
<div 
                    className={`w-full h-24 rounded-xl flex items-end justify-center p-2 ${
                      day.stars > 0 
                        ? "bg-gradient-to-t from-primary to-primary/50" 
                        : "bg-gray-100"
                    }`}
>
                    {day.stars > 0 && (
                      <div className="text-center">
                        <div className="text-white font-display text-lg">{day.stars}</div>
                        <div className="text-white/80 text-xs">
                          {Math.round(day.timeSpent / 60)}m
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">{day.day}</div>
                </motion.div>
              ))}
            </div>

            {todayMinutes > 0 && (
              <div className="bg-gradient-to-r from-success/10 to-success/5 border border-success/20 rounded-xl p-4 text-center">
<ApperIcon name="CheckCircle" className="text-success mx-auto mb-2" size={24} />
<p className="text-success font-medium">
                  Great job today! {activeChild?.name_c} practiced for {todayMinutes} minutes.
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
<div key={`${skill.subject_c}-${skill.skill_area_c}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <ApperIcon 
                        name={skill.subject_c === "math" ? "Calculator" : "BookOpen"} 
                        size={16} 
                        className={skill.subject_c === "math" ? "text-primary" : "text-secondary"} 
                      />
                      <span className="font-medium capitalize">{skill.skill_area_c}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {skill.mastery_level_c}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${skill.mastery_level_c >= 80 ? 'bg-success' : skill.mastery_level_c >= 60 ? 'bg-warning' : 'bg-primary'}`}
                      style={{ width: `${skill.mastery_level_c}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Areas for Improvement */}
          <Card className="p-6">
            <h3 className="text-xl font-display text-gray-800 mb-4">Areas to Focus On</h3>
            <div className="space-y-3">
              {weaknesses.map((skill, index) => (
                <div key={`${skill.subject_c}-${skill.skill_area_c}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <ApperIcon 
                        name={skill.subject_c === "math" ? "Calculator" : "BookOpen"} 
                        size={16} 
                        className={skill.subject_c === "math" ? "text-primary" : "text-secondary"} 
                      />
<span className="font-medium capitalize">{skill.skill_area_c}</span>
                    </div>
                    <span className="text-warning font-semibold">{skill.mastery_level_c}%</span>
                  </div>
                  <ProgressBar progress={skill.mastery_level_c} max={100} showPercentage={false} />
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
<span>Focus on {weaknesses[0]?.skill_area_c || "new challenges"} this week</span>
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