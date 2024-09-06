import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const DefaultLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark flex flex-col h-screen">
      {/* ===== Page Wrapper Start ===== */}
      <div className="flex flex-1 overflow-hidden">
        {/* ===== Sidebar Start ===== */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* ===== Sidebar End ===== */}

        {/* ===== Content Area Start ===== */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* ===== Header Start ===== */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* ===== Header End ===== */}

          {/* ===== Main Content Start ===== */}
          <main className="flex-1">
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* ===== Main Content End ===== */}
        </div>
        {/* ===== Content Area End ===== */}
      </div>

      {/* ===== Footer Start ===== */}
      <footer className="bg-gray-200 dark:bg-boxdark p-4 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          A project by Team SurfExcel &copy; {new Date().getFullYear()}. All rights reserved.
        </p>
      </footer>
      {/* ===== Footer End ===== */}
    </div>
  );
};

export default DefaultLayout;
