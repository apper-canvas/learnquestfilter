import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import MobileNav from "@/components/organisms/MobileNav";
import ChildSelector from "@/components/organisms/ChildSelector";
import { useChild } from "@/contexts/ChildContext";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/molecules/Avatar";
import Button from "@/components/atoms/Button";

const Layout = () => {
  const { activeChild } = useChild();
  const [isChildSelectorOpen, setIsChildSelectorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileNav />
      
      {/* Child Selector Header */}
      <div className="lg:pl-64">
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {activeChild && (
                <>
                  <Avatar avatarId={activeChild.avatarId} size="sm" />
                  <div>
                    <span className="font-medium text-gray-800">
                      {activeChild.name}
                    </span>
                    <span className="text-sm text-gray-600 ml-2">
                      (Age {activeChild.age})
                    </span>
                  </div>
                </>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsChildSelectorOpen(true)}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Users" size={16} />
              <span>Switch Child</span>
            </Button>
          </div>
        </div>
        
        <main className="pb-16 lg:pb-0">
          <Outlet />
        </main>
      </div>

      <ChildSelector
        isOpen={isChildSelectorOpen}
        onClose={() => setIsChildSelectorOpen(false)}
      />
    </div>
  );
};
export default Layout;