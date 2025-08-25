import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";

const Header = ({ title, onMenuClick, searchValue, onSearchChange, showSearch = false }) => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            type="button"
            className="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            onClick={onMenuClick}
          >
            <ApperIcon name="Menu" className="h-6 w-6" />
          </button>
          <div className="lg:ml-0 ml-4">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
        </div>
        
        {showSearch && (
          <div className="flex-1 max-w-lg mx-4">
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              placeholder="Search students, grades, attendance..."
              className="w-full"
            />
          </div>
        )}

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors duration-200">
            <ApperIcon name="Bell" className="h-6 w-6" />
          </button>
          
          {isAuthenticated && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.firstName || user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.emailAddress || user?.email || ''}
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="small"
                onClick={handleLogout}
                className="inline-flex items-center space-x-1 text-gray-600 hover:text-error"
              >
                <ApperIcon name="LogOut" className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
