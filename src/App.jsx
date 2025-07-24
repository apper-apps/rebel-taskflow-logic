import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";

// Layout Components
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

// Page Components
import Dashboard from "@/components/pages/Dashboard";
import Projects from "@/components/pages/Projects";
import Tasks from "@/components/pages/Tasks";
import Calendar from "@/components/pages/Calendar";
import Reports from "@/components/pages/Reports";
import Settings from "@/components/pages/Settings";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-surface to-primary-50">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
            <Routes>
              <Route path="/" element={
                <>
                  <Header 
                    title="Dashboard" 
                    subtitle="Welcome back! Here's what's happening with your projects today."
                    onMenuClick={handleMenuClick} 
                  />
                  <main className="flex-1 overflow-y-auto p-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Dashboard />
                    </motion.div>
                  </main>
                </>
              } />
              
              <Route path="/projects" element={
                <>
                  <Header 
                    title="Projects" 
                    subtitle="Manage your marketing campaigns and client work."
                    onMenuClick={handleMenuClick} 
                  />
                  <main className="flex-1 overflow-y-auto p-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Projects />
                    </motion.div>
                  </main>
                </>
              } />
              
              <Route path="/tasks" element={
                <>
                  <Header 
                    title="Tasks" 
                    subtitle="Add and manage your daily tasks with natural language input."
                    onMenuClick={handleMenuClick} 
                  />
                  <main className="flex-1 overflow-y-auto p-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Tasks />
                    </motion.div>
                  </main>
                </>
              } />
              
              <Route path="/calendar" element={
                <>
                  <Header 
                    title="Calendar" 
                    subtitle="View and manage your scheduled tasks and availability."
                    onMenuClick={handleMenuClick} 
                  />
                  <main className="flex-1 overflow-y-auto p-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Calendar />
                    </motion.div>
                  </main>
                </>
              } />
              
              <Route path="/reports" element={
                <>
                  <Header 
                    title="Reports" 
                    subtitle="Track productivity and analyze project performance."
                    onMenuClick={handleMenuClick} 
                  />
                  <main className="flex-1 overflow-y-auto p-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Reports />
                    </motion.div>
                  </main>
                </>
              } />
              
              <Route path="/settings" element={
                <>
                  <Header 
                    title="Settings" 
                    subtitle="Configure your preferences and work schedule."
                    onMenuClick={handleMenuClick} 
                  />
                  <main className="flex-1 overflow-y-auto p-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Settings />
                    </motion.div>
                  </main>
                </>
              } />
            </Routes>
          </div>
        </div>

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;