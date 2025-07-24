import React, { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "@/index.css";
import Tasks from "@/components/pages/Tasks";
import Calendar from "@/components/pages/Calendar";
import Dashboard from "@/components/pages/Dashboard";
import Reports from "@/components/pages/Reports";
import Settings from "@/components/pages/Settings";
import Projects from "@/components/pages/Projects";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";

// Layout Components

// Page Components

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
                    title="Pannello di Controllo" 
                    subtitle="Bentornato! Ecco cosa sta succedendo con i tuoi progetti oggi."
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
                    title="Progetti" 
                    subtitle="Gestisci le tue campagne di marketing e il lavoro per i clienti."
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
                    title="Attività" 
                    subtitle="Aggiungi e gestisci le tue attività quotidiane con input in linguaggio naturale."
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
                    title="Calendario" 
                    subtitle="Visualizza e gestisci le tue attività programmate e la disponibilità."
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
                    title="Rapporti" 
                    subtitle="Monitora la produttività e analizza le prestazioni dei progetti."
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
                    title="Impostazioni" 
                    subtitle="Configura le tue preferenze e orario di lavoro."
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