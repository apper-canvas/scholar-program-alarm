import React from "react";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ title, onMenuClick, searchValue, onSearchChange, showSearch = false }) => {
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
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;