import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { taskService, projectService } from "@/services/api";
import { toast } from "react-toastify";

const Calendar = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("week"); // week, day

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [tasksData, projectsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ]);
      
      // Filter tasks that have scheduled dates
      const scheduledTasks = tasksData.filter(task => 
        task.scheduledDate && task.status !== "completed"
      );
      
      setTasks(scheduledTasks);
      setProjects(projectsData);
    } catch (err) {
      setError("Failed to load calendar data. Please try again.");
      console.error("Error loading calendar data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(currentWeek, i));
    }
    return days;
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => 
      task.scheduledDate && isSameDay(new Date(task.scheduledDate), date)
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "urgent": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-blue-500";
      case "low": return "bg-gray-400";
      default: return "bg-blue-500";
    }
  };

  const handleTaskClick = (task) => {
    toast.info(`Task: ${task.title}`);
  };

  const handleReschedule = (task, newDate) => {
    toast.info("Reschedule functionality coming soon!");
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error 
        title="Failed to load calendar"
        message={error}
        onRetry={loadData}
      />
    );
  }

  const weekDays = getWeekDays();
  const todayTasks = getTasksForDate(selectedDate);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
<div>
          <h1 className="text-2xl font-bold text-gray-900">Calendario</h1>
          <p className="text-gray-600 mt-1">Programma e gestisci le tue attività</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView("week")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                view === "week" 
                  ? "bg-white text-primary-600 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
>
              Settimana
            </button>
            <button
              onClick={() => setView("day")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                view === "day" 
                  ? "bg-white text-primary-600 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
>
              Giorno
            </button>
          </div>
          
          <Button variant="ghost" size="sm" icon="ChevronLeft" />
          <Button variant="ghost" size="sm" icon="ChevronRight" />
<Button variant="primary" size="sm" icon="Plus">
            Aggiungi Attività
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {format(currentWeek, "MMMM yyyy")}
            </h2>
<Badge variant="primary" size="sm">
              {tasks.length} attività programmate
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon="RefreshCw"
              onClick={loadData}
>
              Aggiorna
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCurrentWeek(startOfWeek(new Date()));
                setSelectedDate(new Date());
              }}
>
              Oggi
            </Button>
          </div>
        </div>
      </Card>

      {view === "week" ? (
        /* Week View */
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {weekDays.map((day, index) => {
            const dayTasks = getTasksForDate(day);
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDate);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`p-4 cursor-pointer transition-all duration-200 ${
                    isSelected ? "ring-2 ring-primary-500" : ""
                  } ${isToday ? "bg-gradient-to-br from-primary-50 to-secondary-50" : ""}`}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="text-center mb-4">
                    <p className="text-sm font-medium text-gray-600">
                      {format(day, "EEE")}
                    </p>
                    <p className={`text-2xl font-bold ${
                      isToday ? "text-primary-600" : "text-gray-900"
                    }`}>
                      {format(day, "d")}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.Id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskClick(task);
                        }}
                        className="p-2 bg-white rounded border-l-4 border-l-blue-500 text-xs cursor-pointer hover:shadow-sm transition-shadow"
                        style={{ borderLeftColor: getPriorityColor(task.priority).replace("bg-", "#") }}
                      >
                        <p className="font-medium text-gray-900 line-clamp-1">
                          {task.title}
                        </p>
                        <p className="text-gray-500 flex items-center">
                          <ApperIcon name="Clock" className="w-3 h-3 mr-1" />
                          {Math.round(task.estimatedMinutes / 60)}h
                        </p>
                      </div>
                    ))}
                    
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-center text-gray-500 py-1">
                        +{dayTasks.length - 3} more
                      </div>
                    )}
                    
{dayTasks.length === 0 && (
                      <div className="text-xs text-center text-gray-400 py-4">
                        Nessuna attività
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Day View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Time Slots */}
<Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {format(selectedDate, "EEEE, d MMMM", { locale: { localize: { day: (n) => ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'][n], month: (n) => ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'][n] } } })}
            </h3>
            
<div className="space-y-2">
              {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => {
                const isLunchBreak = hour >= 12 && hour < 14; // Lunch break from 12:00 to 14:00
                return (
                  <div key={hour} className="flex items-center space-x-4 py-3 border-b border-gray-100">
                    <div className="w-16 text-sm text-gray-500">
                      {hour}:00
                      {isLunchBreak && <div className="text-xs text-orange-600">Pausa</div>}
                    </div>
                    <div className="flex-1">
                      {isLunchBreak ? (
                        <div className="p-2 bg-orange-50 rounded border-l-4 border-l-orange-400 mb-2">
                          <p className="font-medium text-orange-800">Pausa Pranzo</p>
                          <p className="text-sm text-orange-600">Orario non lavorativo</p>
                        </div>
                      ) : (
                        todayTasks
                          .filter(task => task.scheduledTime && parseInt(task.scheduledTime.split(":")[0]) === hour)
                          .map(task => (
                            <div
                              key={task.Id}
                              className="p-2 bg-primary-50 rounded border-l-4 border-l-primary-500 mb-2"
                            >
                              <p className="font-medium text-gray-900">{task.title}</p>
                              <p className="text-sm text-gray-600">{Math.round(task.estimatedMinutes / 60)}ore</p>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                );
              })}
              ))}
            </div>
          </Card>
          
          {/* Task Details */}
          <div className="space-y-6">
<Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Attività di Oggi ({todayTasks.length})
              </h3>
              
              {todayTasks.length === 0 ? (
<Empty 
                  title="Nessuna attività programmata"
                  message="Hai una giornata libera! Considera di programmare alcune attività o prenditi una pausa ben meritata."
                  icon="Calendar"
                />
              ) : (
                <div className="space-y-3">
                  {todayTasks.map((task) => {
                    const project = projects.find(p => p.Id === task.projectId);
                    return (
                      <div
                        key={task.Id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                        onClick={() => handleTaskClick(task)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{task.title}</h4>
                          <Badge variant={task.priority?.toLowerCase() || "medium"} size="sm">
                            {task.priority || "Medium"}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          {project && (
                            <div className="flex items-center">
                              <ApperIcon name="Folder" className="w-4 h-4 mr-1" />
                              {project.name}
                            </div>
                          )}
                          
                          <div className="flex items-center">
<ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                            {Math.round(task.estimatedMinutes / 60)}ore
                          </div>
                          
                          {task.scheduledTime && (
                            <div className="flex items-center">
                              <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                              {task.scheduledTime}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
            
            {/* Team Availability */}
<Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Disponibilità del Team</h3>
              
              <div className="space-y-3">
{[
                  { name: "Sara (Designer)", available: "9:00 - 17:00", tasks: 4 },
                  { name: "Marco (Sviluppatore)", available: "10:00 - 18:00", tasks: 6 },
                  { name: "Lisa (Manager)", available: "8:00 - 16:00", tasks: 3 }
                ].map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.available}</p>
                    </div>
<Badge variant="primary" size="sm">
                      {member.tasks} attività
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Calendar;