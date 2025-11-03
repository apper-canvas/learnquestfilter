import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Sidebar from "@/components/organisms/Sidebar";
import MobileNav from "@/components/organisms/MobileNav";
import ChildSelector from "@/components/organisms/ChildSelector";
import Avatar from "@/components/molecules/Avatar";
import { useChild } from "@/contexts/ChildContext";

const Layout = () => {
const { activeChild } = useChild();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChildSelectorOpen, setIsChildSelectorOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5">
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex">
          <Sidebar />
        </div>

<div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-white shadow-sm border-b border-gray-200">
            {activeChild && (
              <div className="flex items-center space-x-3">
                <Avatar avatarId={activeChild?.avatar_id_c} size="sm" />
                <div>
                  <span className="font-medium text-gray-800">
                    {activeChild?.name_c}
                  </span>
                  <span className="text-sm text-gray-600 ml-2">
                    (Age {activeChild?.age})
                  </span>
                </div>
              </div>
            )}
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
        
          <main className="pb-16 lg:pb-0">
            <Outlet />
          </main>
        </div>
      </div>

      <ChildSelector
        isOpen={isChildSelectorOpen}
        onClose={() => setIsChildSelectorOpen(false)}
      />
    </div>
  );
};
export default Layout;