import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import { useAuth } from "@/layouts/Root";
const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Students", href: "/students", icon: "Users" },
    { name: "Teachers", href: "/teachers", icon: "UserCheck" },
    { name: "Departments", href: "/departments", icon: "Building" },
    { name: "Curriculum", href: "/curriculum", icon: "BookOpen" },
    { name: "Activities", href: "/activities", icon: "Calendar" },
  ];

  // Desktop sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:w-60 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-primary-700 pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <ApperIcon name="GraduationCap" className="h-8 w-8 text-white" />
          <span className="ml-2 text-lg font-semibold text-white">
            EduTrack Nashik
          </span>
        </div>
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary-800 text-white"
                    : "text-primary-100 hover:bg-primary-600 hover:text-white"
                )}
              >
                <ApperIcon
                  name={item.icon}
                  className={cn(
                    "mr-3 flex-shrink-0 h-5 w-5",
                    isActive ? "text-white" : "text-primary-300 group-hover:text-white"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="px-2 mt-auto">
          <button
            onClick={logout}
            className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-primary-100 hover:bg-primary-600 hover:text-white transition-colors"
          >
            <ApperIcon name="LogOut" className="mr-3 flex-shrink-0 h-5 w-5 text-primary-300 group-hover:text-white" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  // Mobile sidebar overlay
  const MobileSidebar = () => (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          "lg:hidden fixed inset-0 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div 
          className="absolute inset-0 bg-gray-600 bg-opacity-75"
          onClick={onClose}
        />
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-60 bg-primary-700 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center justify-between flex-shrink-0 px-4">
            <div className="flex items-center">
              <ApperIcon name="GraduationCap" className="h-8 w-8 text-white" />
              <span className="ml-2 text-lg font-semibold text-white">
                EduTrack Nashik
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-primary-200 hover:text-white"
            >
              <ApperIcon name="X" className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary-800 text-white"
                      : "text-primary-100 hover:bg-primary-600 hover:text-white"
                  )}
                >
                  <ApperIcon
                    name={item.icon}
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5",
                      isActive ? "text-white" : "text-primary-300 group-hover:text-white"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="px-2 mt-auto">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-primary-100 hover:bg-primary-600 hover:text-white transition-colors"
            >
              <ApperIcon name="LogOut" className="mr-3 flex-shrink-0 h-5 w-5 text-primary-300 group-hover:text-white" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;