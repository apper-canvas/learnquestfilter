import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Avatar from "@/components/molecules/Avatar";
import { useChild } from "@/contexts/ChildContext";

const ChildSelector = ({ isOpen, onClose }) => {
  const { activeChild, allChildren, switchChild } = useChild();

  const handleChildSelect = (child) => {
    switchChild(child);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display text-gray-800">
              Select Child Profile
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          <div className="space-y-3">
{allChildren.map((child) => (
              <motion.div
                key={child.Id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChildSelect(child)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  activeChild?.Id === child.Id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Avatar avatarId={child.avatar_id_c} size="md" />
                  <div className="flex-1">
                    <h3 className="font-display text-lg text-gray-800">
                      {child.name_c}
                    </h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <span>Age {child.age_c}</span>
                      <span>Level {child.current_level_c}</span>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Star" size={14} className="text-accent" />
                        <span>{child.total_stars_c}</span>
                      </div>
                    </div>
                  </div>
                  {activeChild?.Id === child.Id && (
                    <ApperIcon 
                      name="Check" 
                      size={20} 
                      className="text-primary"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                // Navigate to child management
                onClose();
                window.location.href = '/parent/manage-children';
              }}
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Manage Children
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChildSelector;