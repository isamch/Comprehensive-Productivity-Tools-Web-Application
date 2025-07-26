import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Coffee, Focus } from 'lucide-react';
import { getFromLocalStorage, setToLocalStorage } from '../utils/localStorage';

interface PomodoroSettings {
  workTime: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
}

interface PomodoroState {
  timeLeft: number;
  isActive: boolean;
  mode: 'work' | 'shortBreak' | 'longBreak';
  completedSessions: number;
  totalSessions: number;
}

const PomodoroTimer: React.FC = () => {
  const [settings, setSettings] = useState<PomodoroSettings>({
    workTime: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
  });
  
  const [state, setState] = useState<PomodoroState>({
    timeLeft: 25 * 60,
    isActive: false,
    mode: 'work',
    completedSessions: 0,
    totalSessions: 0,
  });
  
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const savedSettings = getFromLocalStorage<PomodoroSettings>('pomodoroSettings', settings);
    const savedState = getFromLocalStorage<PomodoroState>('pomodoroState', state);
    
    setSettings(savedSettings);
    setState(savedState);
  }, []);

  useEffect(() => {
    setToLocalStorage('pomodoroSettings', settings);
  }, [settings]);

  useEffect(() => {
    setToLocalStorage('pomodoroState', state);
  }, [state]);

  useEffect(() => {
    if (state.isActive) {
      intervalRef.current = setInterval(() => {
        setState(prev => {
          if (prev.timeLeft <= 1) {
            const newCompletedSessions = prev.mode === 'work' ? prev.completedSessions + 1 : prev.completedSessions;
            const newTotalSessions = prev.mode === 'work' ? prev.totalSessions + 1 : prev.totalSessions;
            
            let newMode: 'work' | 'shortBreak' | 'longBreak';
            let newTimeLeft: number;
            
            if (prev.mode === 'work') {
              if (newCompletedSessions % settings.longBreakInterval === 0) {
                newMode = 'longBreak';
                newTimeLeft = settings.longBreak * 60;
              } else {
                newMode = 'shortBreak';
                newTimeLeft = settings.shortBreak * 60;
              }
            } else {
              newMode = 'work';
              newTimeLeft = settings.workTime * 60;
            }
            
            return {
              ...prev,
              timeLeft: newTimeLeft,
              isActive: false,
              mode: newMode,
              completedSessions: newCompletedSessions,
              totalSessions: newTotalSessions,
            };
          }
          
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isActive, settings]);

  const toggleTimer = () => {
    setState(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const resetTimer = () => {
    setState(prev => ({
      ...prev,
      timeLeft: settings.workTime * 60,
      isActive: false,
      mode: 'work',
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeConfig = () => {
    switch (state.mode) {
      case 'work':
        return { 
          title: 'Focus Time', 
          icon: Focus, 
          color: 'from-red-500 to-red-600',
          bgColor: 'from-red-50 to-red-100' 
        };
      case 'shortBreak':
        return { 
          title: 'Short Break', 
          icon: Coffee, 
          color: 'from-green-500 to-green-600',
          bgColor: 'from-green-50 to-green-100' 
        };
      case 'longBreak':
        return { 
          title: 'Long Break', 
          icon: Coffee, 
          color: 'from-blue-500 to-blue-600',
          bgColor: 'from-blue-50 to-blue-100' 
        };
    }
  };

  const modeConfig = getModeConfig();
  const ModeIcon = modeConfig.icon;

  return (
    <div className="max-w-2xl mx-auto text-center">
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Timer Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Time (minutes)
                </label>
                <input
                  type="number"
                  value={settings.workTime}
                  onChange={(e) => setSettings({ ...settings, workTime: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Break (minutes)
                </label>
                <input
                  type="number"
                  value={settings.shortBreak}
                  onChange={(e) => setSettings({ ...settings, shortBreak: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Long Break (minutes)
                </label>
                <input
                  type="number"
                  value={settings.longBreak}
                  onChange={(e) => setSettings({ ...settings, longBreak: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Long Break Interval
                </label>
                <input
                  type="number"
                  value={settings.longBreakInterval}
                  onChange={(e) => setSettings({ ...settings, longBreakInterval: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSettings(false);
                  resetTimer();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Save & Reset
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`bg-gradient-to-br ${modeConfig.bgColor} p-8 rounded-2xl mb-8`}>
        <div className="flex items-center justify-center mb-4">
          <ModeIcon size={32} className="mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">{modeConfig.title}</h2>
        </div>
        
        <div className="text-8xl font-bold text-gray-800 mb-8 font-mono">
          {formatTime(state.timeLeft)}
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={toggleTimer}
            className={`flex items-center px-8 py-4 bg-gradient-to-r ${modeConfig.color} text-white rounded-lg hover:shadow-lg transition-all duration-200 text-lg font-semibold`}
          >
            {state.isActive ? (
              <>
                <Pause size={24} className="mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play size={24} className="mr-2" />
                Start
              </>
            )}
          </button>
          
          <button
            onClick={resetTimer}
            className="flex items-center px-6 py-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <RotateCcw size={20} className="mr-2" />
            Reset
          </button>
          
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center px-6 py-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Settings size={20} className="mr-2" />
            Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {state.completedSessions}
          </div>
          <div className="text-gray-600">Completed Sessions</div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {state.totalSessions}
          </div>
          <div className="text-gray-600">Total Sessions</div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;