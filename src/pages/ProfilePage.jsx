import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useChild } from "@/contexts/ChildContext";
import activitiesService from "@/services/api/activitiesService";
import childrenService from "@/services/api/childrenService";
import progressService from "@/services/api/progressService";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Avatar from "@/components/molecules/Avatar";
import ProgressBar from "@/components/molecules/ProgressBar";
import StarRating from "@/components/molecules/StarRating";
const ProfilePage = () => {
const { activeChild, refreshChildren } = useChild();
  const [activities, setActivities] = useState([]);
  const [progress, setProgress] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState("1");
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    loadProfileData();
  }, []);

const loadProfileData = async () => {
    if (!activeChild) return;

    try {
      setLoading(true);
      setError("");

      setSelectedAvatar(activeChild.avatarId || "1");
      setNewName(activeChild.name || "");

      const childActivities = await activitiesService.getByChildId(activeChild.Id);
      setActivities(childActivities);

      const childProgress = await progressService.getByChildId(activeChild.Id);
      setProgress(childProgress);
    } catch (err) {
      setError("Failed to load profile data. Please try again.");
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  };

const handleAvatarChange = async (avatarId) => {
    try {
      setSelectedAvatar(avatarId);
      if (activeChild) {
        await childrenService.update(activeChild.Id, { avatarId });
        await refreshChildren();
        toast.success('Avatar updated successfully!');
      }
    } catch (err) {
      console.error("Error updating avatar:", err);
      toast.error('Failed to update avatar');
    }
  };

const handleNameChange = async () => {
    try {
      if (activeChild && newName.trim()) {
        await childrenService.update(activeChild.Id, { name: newName.trim() });
        await refreshChildren();
        setIsEditingName(false);
        toast.success('Name updated successfully!');
      }
    } catch (err) {
      console.error("Error updating name:", err);
      toast.error('Failed to update name');
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProfileData} />;

  const totalStars = activities.reduce((sum, activity) => sum + activity.starsEarned, 0);
  const perfectScores = activities.filter(activity => activity.starsEarned === 3).length;
  const averageScore = activities.length > 0 
    ? Math.round(activities.reduce((sum, activity) => sum + (activity.correctAnswers / activity.totalQuestions * 100), 0) / activities.length)
    : 0;

  const mathProgress = progress.filter(p => p.subject === "math");
  const readingProgress = progress.filter(p => p.subject === "reading");

  const avatarOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-info/10 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card className="p-8 text-center bg-gradient-to-br from-info/5 to-primary/5">
          <div className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block"
            >
              <Avatar avatarId={selectedAvatar} size="xl" className="shadow-2xl" />
            </motion.div>

            <div>
              {isEditingName ? (
                <div className="flex items-center justify-center space-x-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="text-2xl font-display text-center border-b-2 border-primary bg-transparent focus:outline-none"
                    onBlur={handleNameChange}
                    onKeyPress={(e) => e.key === "Enter" && handleNameChange()}
                    autoFocus
                  />
                  <Button size="sm" onClick={handleNameChange}>
                    <ApperIcon name="Check" size={16} />
                  </Button>
                </div>
) : (
                <div className="flex items-center justify-center space-x-2">
                  <h1 className="text-3xl font-display text-gray-800">{activeChild?.name}</h1>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsEditingName(true)}
                  >
                    <ApperIcon name="Edit2" size={16} />
                  </Button>
                </div>
              )}
              <p className="text-gray-600">Age {activeChild?.age} • Level {activeChild?.currentLevel}</p>
            </div>

            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <ApperIcon name="Star" className="text-accent fill-accent" size={20} />
                  <span className="text-2xl font-display text-accent">{totalStars}</span>
                </div>
                <p className="text-sm text-gray-600">Total Stars</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <ApperIcon name="Target" className="text-success" size={20} />
                  <span className="text-2xl font-display text-success">{perfectScores}</span>
                </div>
                <p className="text-sm text-gray-600">Perfect Scores</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <ApperIcon name="TrendingUp" className="text-primary" size={20} />
                  <span className="text-2xl font-display text-primary">{averageScore}%</span>
                </div>
                <p className="text-sm text-gray-600">Average Score</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Avatar Selection */}
        <Card className="p-6">
          <h2 className="text-2xl font-display text-gray-800 mb-4">Choose Your Avatar</h2>
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-4">
            {avatarOptions.map((avatarId) => (
              <motion.button
                key={avatarId}
                onClick={() => handleAvatarChange(avatarId)}
                className={`relative p-2 rounded-2xl transition-all duration-200 ${
                  selectedAvatar === avatarId
                    ? "bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary"
                    : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Avatar avatarId={avatarId} size="md" />
                {selectedAvatar === avatarId && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <ApperIcon name="Check" size={12} className="text-white" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </Card>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="Calculator" size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-display text-gray-800">Math Skills</h3>
                <p className="text-gray-600">{mathProgress.length} skills practiced</p>
              </div>
            </div>

            <div className="space-y-3">
              {mathProgress.map((skill) => (
                <div key={`${skill.subject}-${skill.skillArea}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {skill.skillArea}
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {skill.masteryLevel}%
                    </span>
                  </div>
                  <ProgressBar 
                    progress={skill.masteryLevel} 
                    max={100} 
                    showPercentage={false}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-secondary/5 to-secondary/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-info rounded-xl flex items-center justify-center">
                <ApperIcon name="BookOpen" size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-display text-gray-800">Reading Skills</h3>
                <p className="text-gray-600">{readingProgress.length} skills practiced</p>
              </div>
            </div>

            <div className="space-y-3">
              {readingProgress.map((skill) => (
                <div key={`${skill.subject}-${skill.skillArea}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {skill.skillArea}
                    </span>
                    <span className="text-sm font-semibold text-secondary">
                      {skill.masteryLevel}%
                    </span>
                  </div>
                  <ProgressBar 
                    progress={skill.masteryLevel} 
                    max={100} 
                    showPercentage={false}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card className="p-6">
          <h2 className="text-2xl font-display text-gray-800 mb-6">Recent Activities</h2>
          
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Play" className="text-gray-400 mx-auto mb-4" size={48} />
              <p className="text-gray-600">No activities completed yet. Start learning to see your progress!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.slice(-10).reverse().map((activity, index) => (
                <motion.div
                  key={activity.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      parseInt(activity.levelId) <= 5 
                        ? "bg-gradient-to-br from-primary to-secondary" 
                        : "bg-gradient-to-br from-secondary to-info"
                    }`}>
                      <ApperIcon 
                        name={parseInt(activity.levelId) <= 5 ? "Calculator" : "BookOpen"} 
                        size={16} 
                        className="text-white" 
                      />
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-800">
                        Level {activity.levelId}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.correctAnswers}/{activity.totalQuestions} correct • {Math.round(activity.timeSpent / 60)} min
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <StarRating earned={activity.starsEarned} total={3} size={16} />
                    <span className="text-xs text-gray-500">
                      {new Date(activity.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;