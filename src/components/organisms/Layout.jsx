import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-surface">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Header 
          title="Scholar Hub"
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-surface">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;