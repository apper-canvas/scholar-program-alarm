import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Students", href: "/students", icon: "Users" },
    { name: "Grades", href: "/grades", icon: "BookOpen" },
    { name: "Attendance", href: "/attendance", icon: "Calendar" },
    { name: "Reports", href: "/reports", icon: "FileText" }
  ];

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.href || 
                    (item.href !== "/" && location.pathname.startsWith(item.href));
    
    return (
      <NavLink
        to={item.href}
        onClick={onClose}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-r-2 border-primary"
            : "text-gray-700 hover:bg-gray-100 hover:text-primary"
        }`}
      >
        <ApperIcon name={item.icon} className="mr-3 h-5 w-5" />
        {item.name}
      </NavLink>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col min-h-0 flex-1 bg-white border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                  <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">Scholar Hub</h1>
                  <p className="text-xs text-gray-500">Student Management</p>
                </div>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <div className={`fixed inset-0 flex z-40 lg:hidden ${isOpen ? "" : "pointer-events-none"}`}>
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={onClose}
        />
        
        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transform ease-in-out duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={onClose}
            >
              <ApperIcon name="X" className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Scholar Hub</h1>
                <p className="text-xs text-gray-500">Student Management</p>
              </div>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;