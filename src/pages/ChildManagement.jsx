import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useChild } from '@/contexts/ChildContext';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Avatar from '@/components/molecules/Avatar';
import Loading from '@/components/ui/Loading';
import childrenService from '@/services/api/childrenService';

const ChildManagement = () => {
  const navigate = useNavigate();
  const { allChildren, refreshChildren } = useChild();
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    avatarId: '1'
  });

  const avatarOptions = ['1', '2', '3', '4', '5', '6'];

  const handleCreateChild = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.age) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await childrenService.create({
        name: formData.name.trim(),
        age: parseInt(formData.age),
        avatarId: formData.avatarId,
        currentLevel: 1,
        totalStars: 0
      });
      
      await refreshChildren();
      setIsCreating(false);
      setFormData({ name: '', age: '', avatarId: '1' });
      toast.success('Child profile created successfully!');
    } catch (error) {
      toast.error('Failed to create child profile');
      console.error('Error creating child:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateChild = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.age) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await childrenService.update(editingChild.Id, {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        avatarId: formData.avatarId
      });
      
      await refreshChildren();
      setEditingChild(null);
      setFormData({ name: '', age: '', avatarId: '1' });
      toast.success('Child profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update child profile');
      console.error('Error updating child:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChild = async (child) => {
    if (!confirm(`Are you sure you want to delete ${child.name}'s profile? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      await childrenService.delete(child.Id);
      await refreshChildren();
      toast.success('Child profile deleted successfully');
    } catch (error) {
      toast.error('Failed to delete child profile');
      console.error('Error deleting child:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (child) => {
    setEditingChild(child);
    setFormData({
      name: child.name,
      age: child.age.toString(),
      avatarId: child.avatarId
    });
  };

  const cancelForm = () => {
    setIsCreating(false);
    setEditingChild(null);
    setFormData({ name: '', age: '', avatarId: '1' });
  };

  if (loading && allChildren.length === 0) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-warning/10 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display text-gray-800">
              Manage Children
            </h1>
            <p className="text-gray-600 mt-2">
              Create and manage profiles for your children
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('/parent')}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            <span>Back to Dashboard</span>
          </Button>
        </div>

        {/* Children List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {allChildren.map((child) => (
            <motion.div
              key={child.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
            >
              <Card className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar avatarId={child.avatarId} size="lg" />
                  <div>
                    <h3 className="font-display text-xl text-gray-800">
                      {child.name}
                    </h3>
                    <p className="text-gray-600">Age {child.age}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>Level {child.currentLevel}</span>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Star" size={14} className="text-accent" />
                    <span>{child.totalStars}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditing(child)}
                    className="flex-1"
                  >
                    <ApperIcon name="Edit" size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteChild(child)}
                    className="px-3 text-error hover:text-error hover:border-error"
                  >
                    <ApperIcon name="Trash2" size={14} />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}

          {/* Add New Child Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
          >
            <Card 
              className="p-6 border-2 border-dashed border-gray-300 hover:border-primary cursor-pointer transition-colors"
              onClick={() => setIsCreating(true)}
            >
              <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-[200px]">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <ApperIcon name="Plus" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-gray-800">
                    Add New Child
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Create a new profile
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Create/Edit Form Modal */}
        {(isCreating || editingChild) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={cancelForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-display text-gray-800 mb-6">
                {editingChild ? 'Edit Child Profile' : 'Create New Child Profile'}
              </h2>

              <form onSubmit={editingChild ? handleUpdateChild : handleCreateChild} className="space-y-4">
                <Input
                  label="Child's Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter child's name"
                  required
                />

                <Input
                  label="Age"
                  type="number"
                  min="3"
                  max="12"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  placeholder="Enter child's age"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose Avatar
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {avatarOptions.map((avatarId) => (
                      <button
                        key={avatarId}
                        type="button"
                        className={`p-2 rounded-lg border-2 transition-colors ${
                          formData.avatarId === avatarId
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-primary/50'
                        }`}
                        onClick={() => setFormData({...formData, avatarId})}
                      >
                        <Avatar avatarId={avatarId} size="sm" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelForm}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? 'Saving...' : editingChild ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChildManagement;