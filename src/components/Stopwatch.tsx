import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, Flag } from 'lucide-react';
import { getFromLocalStorage, setToLocalStorage } from '../utils/localStorage';

interface Lap {
  id: number;
  time: number;
  lapTime: number;
}

const Stopwatch: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [lastSavedTime, setLastSavedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedTime = getFromLocalStorage<number>('stopwatch_lastTime', 0);
    setLastSavedTime(savedTime);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
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
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning && time > 0) {
      setToLocalStorage('stopwatch_lastTime', time);
      setLastSavedTime(time);
    }
  }, [isRunning, time]);

  const formatTime = (timeInMs: number): string => {
    const minutes = Math.floor(timeInMs / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    const milliseconds = Math.floor((timeInMs % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const start = () => {
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const stop = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    setToLocalStorage('stopwatch_lastTime', 0);
    setLastSavedTime(0);
  };

  const addLap = () => {
    if (time > 0) {
      const lapTime = laps.length > 0 ? time - laps[laps.length - 1].time : time;
      const newLap: Lap = {
        id: laps.length + 1,
        time: time,
        lapTime: lapTime,
      };
      setLaps([...laps, newLap]);
    }
  };

  const getBestLap = (): Lap | null => {
    if (laps.length === 0) return null;
    return laps.reduce((best, current) => 
      current.lapTime < best.lapTime ? current : best
    );
  };

  const getWorstLap = (): Lap | null => {
    if (laps.length === 0) return null;
    return laps.reduce((worst, current) => 
      current.lapTime > worst.lapTime ? current : worst
    );
  };

  const bestLap = getBestLap();
  const worstLap = getWorstLap();

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Main Timer Display */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-12 rounded-2xl mb-8 shadow-2xl">
        <div className="text-6xl font-mono font-bold mb-4">
          {formatTime(time)}
        </div>
        
        <div className="flex justify-center space-x-4">
          {!isRunning ? (
            <button
              onClick={start}
              className="flex items-center px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold text-lg"
            >
              <Play size={24} className="mr-2" />
              Start
            </button>
          ) : (
            <button
              onClick={pause}
              className="flex items-center px-8 py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-semibold text-lg"
            >
              <Pause size={24} className="mr-2" />
              Pause
            </button>
          )}
          
          <button
            onClick={stop}
            className="flex items-center px-8 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold text-lg"
          >
            <Square size={24} className="mr-2" />
            Stop
          </button>
          
          <button
            onClick={reset}
            className="flex items-center px-8 py-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold text-lg"
          >
            <RotateCcw size={24} className="mr-2" />
            Reset
          </button>
        </div>
      </div>

      {/* Lap Button */}
      <div className="mb-8">
        <button
          onClick={addLap}
          disabled={time === 0}
          className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
        >
          <Flag size={20} className="mr-2" />
          Lap
        </button>
      </div>

      {/* Last Saved Time */}
      {lastSavedTime > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Last Saved Time</h3>
          <div className="text-2xl font-mono font-bold text-blue-600">
            {formatTime(lastSavedTime)}
          </div>
        </div>
      )}

      {/* Laps */}
      {laps.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Laps ({laps.length})</h3>
          
          {/* Lap Statistics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-sm text-green-600 font-medium">Best Lap</div>
              <div className="text-lg font-mono font-bold text-green-800">
                {bestLap ? formatTime(bestLap.lapTime) : '--:--:--'}
              </div>
              {bestLap && (
                <div className="text-xs text-green-600">Lap #{bestLap.id}</div>
              )}
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-sm text-red-600 font-medium">Worst Lap</div>
              <div className="text-lg font-mono font-bold text-red-800">
                {worstLap ? formatTime(worstLap.lapTime) : '--:--:--'}
              </div>
              {worstLap && (
                <div className="text-xs text-red-600">Lap #{worstLap.id}</div>
              )}
            </div>
          </div>

          {/* Lap List */}
          <div className="max-h-64 overflow-y-auto">
            <div className="space-y-2">
              {laps.slice().reverse().map((lap) => (
                <div
                  key={lap.id}
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    lap.id === bestLap?.id
                      ? 'bg-green-50 border border-green-200'
                      : lap.id === worstLap?.id
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 w-12">
                      #{lap.id}
                    </span>
                    <span className="text-lg font-mono font-semibold text-gray-800">
                      {formatTime(lap.lapTime)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 font-mono">
                    {formatTime(lap.time)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stopwatch;