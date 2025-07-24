import React, { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const Settings = () => {
const [userSettings, setUserSettings] = useState({
    name: "Utente Agenzia",
    email: "utente@agenzia.com",
    timezone: "Europe/Rome",
    workHours: {
      monday: { start: "09:00", end: "17:00", enabled: true, lunchStart: "12:00", lunchEnd: "13:00", lunchEnabled: true },
      tuesday: { start: "09:00", end: "17:00", enabled: true, lunchStart: "12:00", lunchEnd: "13:00", lunchEnabled: true },
      wednesday: { start: "09:00", end: "17:00", enabled: true, lunchStart: "12:00", lunchEnd: "13:00", lunchEnabled: true },
      thursday: { start: "09:00", end: "17:00", enabled: true, lunchStart: "12:00", lunchEnd: "13:00", lunchEnabled: true },
      friday: { start: "09:00", end: "17:00", enabled: true, lunchStart: "12:00", lunchEnd: "13:00", lunchEnabled: true },
      saturday: { start: "10:00", end: "14:00", enabled: false, lunchStart: "12:00", lunchEnd: "13:00", lunchEnabled: false },
      sunday: { start: "10:00", end: "14:00", enabled: false, lunchStart: "12:00", lunchEnd: "13:00", lunchEnabled: false }
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
      toast.success("Impostazioni salvate con successo!");
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
    { key: "monday", label: "Lunedì" },
    { key: "tuesday", label: "Martedì" },
    { key: "wednesday", label: "Mercoledì" },
    { key: "thursday", label: "Giovedì" },
    { key: "friday", label: "Venerdì" },
    { key: "saturday", label: "Sabato" },
    { key: "sunday", label: "Domenica" }
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
          <h1 className="text-2xl font-bold text-gray-900">Impostazioni</h1>
          <p className="text-gray-600 mt-1">Gestisci il tuo account e le preferenze</p>
        </div>
        <Button
          variant="primary"
          loading={saving}
          onClick={handleSave}
          icon="Save"
>
          Salva Modifiche
        </Button>
      </div>

      {/* Profile Settings */}
      <Card className="p-6">
<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="User" className="w-5 h-5 mr-2" />
          Informazioni Profilo
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<Input
            label="Nome Completo"
            value={userSettings.name}
            onChange={(e) => setUserSettings(prev => ({ ...prev, name: e.target.value }))}
          />
          
          <Input
            label="Indirizzo Email"
            type="email"
            value={userSettings.email}
            onChange={(e) => setUserSettings(prev => ({ ...prev, email: e.target.value }))}
          />
          
          <div className="md:col-span-2">
<label className="block text-sm font-medium text-gray-700 mb-2">
              Fuso Orario
            </label>
            <select
              value={userSettings.timezone}
              onChange={(e) => setUserSettings(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
<option value="America/New_York">Ora Orientale (ET)</option>
              <option value="America/Chicago">Ora Centrale (CT)</option>
              <option value="America/Denver">Ora Montana (MT)</option>
              <option value="America/Los_Angeles">Ora Pacifica (PT)</option>
              <option value="Europe/London">Londra (GMT)</option>
              <option value="Europe/Rome">Roma (CET)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Work Hours */}
<Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="Clock" className="w-5 h-5 mr-2" />
          Orari di Lavoro
        </h3>
        
<div className="space-y-4">
          {daysOfWeek.map((day) => (
            <div key={day.key} className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={userSettings.workHours[day.key].enabled}
                    onChange={(e) => handleWorkHourChange(day.key, "enabled", e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">{day.label}</span>
                </label>
                
                {userSettings.workHours[day.key].enabled && (
                  <span className="text-sm text-gray-500">
                    ({(() => {
                      const startTime = new Date(`2000-01-01T${userSettings.workHours[day.key].start}`);
                      const endTime = new Date(`2000-01-01T${userSettings.workHours[day.key].end}`);
                      let totalHours = (endTime - startTime) / 1000 / 60 / 60;
                      
                      if (userSettings.workHours[day.key].lunchEnabled) {
                        const lunchStart = new Date(`2000-01-01T${userSettings.workHours[day.key].lunchStart}`);
                        const lunchEnd = new Date(`2000-01-01T${userSettings.workHours[day.key].lunchEnd}`);
                        const lunchHours = (lunchEnd - lunchStart) / 1000 / 60 / 60;
                        totalHours -= lunchHours;
                      }
                      
                      return Math.round(totalHours * 10) / 10;
                    })()} ore lavorative)
                  </span>
                )}
              </div>
              
              {userSettings.workHours[day.key].enabled && (
                <>
                  <div className="flex items-center space-x-2">
                    <label className="text-xs text-gray-600 w-16">Lavoro:</label>
                    <input
                      type="time"
                      value={userSettings.workHours[day.key].start}
                      onChange={(e) => handleWorkHourChange(day.key, "start", e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <span className="text-gray-500 text-sm">alle</span>
                    <input
                      type="time"
                      value={userSettings.workHours[day.key].end}
                      onChange={(e) => handleWorkHourChange(day.key, "end", e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center text-xs">
                      <input
                        type="checkbox"
                        checked={userSettings.workHours[day.key].lunchEnabled}
                        onChange={(e) => handleWorkHourChange(day.key, "lunchEnabled", e.target.checked)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-1"
                      />
                      <span className="text-gray-600 w-14">Pausa:</span>
                    </label>
                    <input
                      type="time"
                      value={userSettings.workHours[day.key].lunchStart}
                      onChange={(e) => handleWorkHourChange(day.key, "lunchStart", e.target.value)}
                      disabled={!userSettings.workHours[day.key].lunchEnabled}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 disabled:text-gray-400"
                    />
                    <span className="text-gray-500 text-sm">alle</span>
                    <input
                      type="time"
                      value={userSettings.workHours[day.key].lunchEnd}
                      onChange={(e) => handleWorkHourChange(day.key, "lunchEnd", e.target.value)}
                      disabled={!userSettings.workHours[day.key].lunchEnabled}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 disabled:text-gray-400"
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Notifications */}
<Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="Bell" className="w-5 h-5 mr-2" />
          Notifiche
        </h3>
        
        <div className="space-y-4">
{[
            { key: "taskReminders", label: "Promemoria Attività", description: "Ricevi notifiche per le scadenze delle attività" },
            { key: "projectDeadlines", label: "Scadenze Progetti", description: "Ricevi avvisi per le milestone dei progetti" },
            { key: "teamUpdates", label: "Aggiornamenti Team", description: "Rimani informato sull'attività e i cambiamenti del team" },
            { key: "emailNotifications", label: "Notifiche Email", description: "Ricevi notifiche via email" }
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
          Preferenze
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vista Predefinita
            </label>
            <select
              value={userSettings.preferences.defaultView}
              onChange={(e) => handlePreferenceChange("defaultView", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
>
              <option value="dashboard">Pannello di Controllo</option>
              <option value="tasks">Attività</option>
              <option value="calendar">Calendario</option>
              <option value="projects">Progetti</option>
            </select>
          </div>
          
<div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordinamento Attività
            </label>
            <select
              value={userSettings.preferences.taskSorting}
              onChange={(e) => handlePreferenceChange("taskSorting", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
>
              <option value="priority">Priorità</option>
              <option value="dueDate">Data di Scadenza</option>
              <option value="project">Progetto</option>
              <option value="created">Data di Creazione</option>
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
              <p className="font-medium text-gray-900">Programmazione automatica attività</p>
              <p className="text-sm text-gray-600">Programma automaticamente le attività in base alla priorità e disponibilità</p>
            </div>
          </label>
        </div>
      </Card>

      {/* Data Management */}
<Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="Database" className="w-5 h-5 mr-2" />
          Gestione Dati
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
<Button variant="secondary" icon="Download" className="justify-start">
            Esporta Dati
          </Button>
          <Button variant="secondary" icon="Upload" className="justify-start">
            Importa Dati
          </Button>
          <Button variant="secondary" icon="Archive" className="justify-start">
            Archivia Completati
          </Button>
        </div>
        
<div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <h4 className="font-medium text-red-900 mb-2">Zona Pericolosa</h4>
          <p className="text-sm text-red-700 mb-4">
            Queste azioni non possono essere annullate. Procedi con cautela.
          </p>
          <Button variant="danger" size="sm" icon="Trash2">
            Elimina Tutti i Dati
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default Settings;