import React, { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const Settings = () => {
  const [userSettings, setUserSettings] = useState({
    name: "Agency User",
    email: "user@agency.com",
    timezone: "America/New_York",
    workHours: {
      monday: { start: "09:00", end: "17:00", enabled: true },
      tuesday: { start: "09:00", end: "17:00", enabled: true },
      wednesday: { start: "09:00", end: "17:00", enabled: true },
      thursday: { start: "09:00", end: "17:00", enabled: true },
      friday: { start: "09:00", end: "17:00", enabled: true },
      saturday: { start: "10:00", end: "14:00", enabled: false },
      sunday: { start: "10:00", end: "14:00", enabled: false }
    },
    notifications: {
      taskReminders: true,
      projectDeadlines: true,
      teamUpdates: true,
      emailNotifications: false
    },
    preferences: {
      theme: "light",
      defaultView: "dashboard",
      taskSorting: "priority",
      autoSchedule: true
    }
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved successfully!");
    }, 1000);
  };

  const handleWorkHourChange = (day, field, value) => {
    setUserSettings(prev => ({
      ...prev,
      workHours: {
        ...prev.workHours,
        [day]: {
          ...prev.workHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleNotificationChange = (key, value) => {
    setUserSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setUserSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const daysOfWeek = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-4xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and preferences</p>
        </div>
        <Button
          variant="primary"
          loading={saving}
          onClick={handleSave}
          icon="Save"
        >
          Save Changes
        </Button>
      </div>

      {/* Profile Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="User" className="w-5 h-5 mr-2" />
          Profile Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            value={userSettings.name}
            onChange={(e) => setUserSettings(prev => ({ ...prev, name: e.target.value }))}
          />
          
          <Input
            label="Email Address"
            type="email"
            value={userSettings.email}
            onChange={(e) => setUserSettings(prev => ({ ...prev, email: e.target.value }))}
          />
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={userSettings.timezone}
              onChange={(e) => setUserSettings(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Work Hours */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="Clock" className="w-5 h-5 mr-2" />
          Work Hours
        </h3>
        
        <div className="space-y-4">
          {daysOfWeek.map((day) => (
            <div key={day.key} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-24">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={userSettings.workHours[day.key].enabled}
                    onChange={(e) => handleWorkHourChange(day.key, "enabled", e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">{day.label}</span>
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  value={userSettings.workHours[day.key].start}
                  onChange={(e) => handleWorkHourChange(day.key, "start", e.target.value)}
                  disabled={!userSettings.workHours[day.key].enabled}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-400"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="time"
                  value={userSettings.workHours[day.key].end}
                  onChange={(e) => handleWorkHourChange(day.key, "end", e.target.value)}
                  disabled={!userSettings.workHours[day.key].enabled}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-400"
                />
              </div>
              
              {userSettings.workHours[day.key].enabled && (
                <span className="text-sm text-gray-500">
                  ({Math.round(
                    (new Date(`2000-01-01T${userSettings.workHours[day.key].end}`) - 
                     new Date(`2000-01-01T${userSettings.workHours[day.key].start}`)) / 1000 / 60 / 60
                  )} hours)
                </span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="Bell" className="w-5 h-5 mr-2" />
          Notifications
        </h3>
        
        <div className="space-y-4">
          {[
            { key: "taskReminders", label: "Task Reminders", description: "Get notified about upcoming task deadlines" },
            { key: "projectDeadlines", label: "Project Deadlines", description: "Receive alerts for project milestones" },
            { key: "teamUpdates", label: "Team Updates", description: "Stay informed about team activity and changes" },
            { key: "emailNotifications", label: "Email Notifications", description: "Receive notifications via email" }
          ].map((notification) => (
            <div key={notification.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{notification.label}</p>
                <p className="text-sm text-gray-600">{notification.description}</p>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={userSettings.notifications[notification.key]}
                  onChange={(e) => handleNotificationChange(notification.key, e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Preferences */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="Settings" className="w-5 h-5 mr-2" />
          Preferences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default View
            </label>
            <select
              value={userSettings.preferences.defaultView}
              onChange={(e) => handlePreferenceChange("defaultView", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="dashboard">Dashboard</option>
              <option value="tasks">Tasks</option>
              <option value="calendar">Calendar</option>
              <option value="projects">Projects</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Sorting
            </label>
            <select
              value={userSettings.preferences.taskSorting}
              onChange={(e) => handlePreferenceChange("taskSorting", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="priority">Priority</option>
              <option value="dueDate">Due Date</option>
              <option value="project">Project</option>
              <option value="created">Date Created</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={userSettings.preferences.autoSchedule}
              onChange={(e) => handlePreferenceChange("autoSchedule", e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-3"
            />
            <div>
              <p className="font-medium text-gray-900">Auto-schedule tasks</p>
              <p className="text-sm text-gray-600">Automatically schedule tasks based on priority and availability</p>
            </div>
          </label>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="Database" className="w-5 h-5 mr-2" />
          Data Management
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button variant="secondary" icon="Download" className="justify-start">
            Export Data
          </Button>
          <Button variant="secondary" icon="Upload" className="justify-start">
            Import Data
          </Button>
          <Button variant="secondary" icon="Archive" className="justify-start">
            Archive Completed
          </Button>
        </div>
        
        <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <h4 className="font-medium text-red-900 mb-2">Danger Zone</h4>
          <p className="text-sm text-red-700 mb-4">
            These actions cannot be undone. Please proceed with caution.
          </p>
          <Button variant="danger" size="sm" icon="Trash2">
            Delete All Data
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default Settings;