import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';

interface TimeOptionsProps {
  times: string[];
  selectedTime: string;
  onSelectTime: (time: string) => void;
}

const TimeOptions = ({ times, selectedTime, onSelectTime }: TimeOptionsProps) => {
  const [displayedTimes, setDisplayedTimes] = useState<string[]>([]);
  const [baseTime, setBaseTime] = useState<string>("");
  const [isGridSelection, setIsGridSelection] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  
  // Initialize displayed times on first load or when available times change
  useEffect(() => {
    if (times.length === 0) return;
    
    if (isInitialLoad || !baseTime) {
      // For initial load, use the selected time as base
      const initialBaseTime = selectedTime || times[0];
      setBaseTime(initialBaseTime);
      
      // Calculate displayed times
      generateDisplayedTimes(times, initialBaseTime);
      setIsInitialLoad(false);
      
      // For smoother initial rendering - use requestAnimationFrame
      requestAnimationFrame(() => {
        setIsLoaded(true);
      });
    }
  }, [times, isInitialLoad]);
  
  // Only update displayed times when baseTime changes (from dropdown)
  useEffect(() => {
    if (!baseTime || times.length === 0) return;
    
    // Generate displayed times based on dropdown selection
    generateDisplayedTimes(times, baseTime);
    
    // Use requestAnimationFrame for smoother transition
    requestAnimationFrame(() => {
      setIsLoaded(true);
    });
  }, [baseTime, times]);

  // Effect to update baseTime when selectedTime is changed ONLY from dropdown, not from grid
  useEffect(() => {
    // Skip if this is a grid selection
    if (isGridSelection) {
      setIsGridSelection(false);
      return;
    }

    // Only update baseTime when the selected time is not from grid selection
    if (selectedTime !== baseTime) {
      // Check if the selected time is a 30-minute interval (XX:00 or XX:30)
      const isHalfHourTime = selectedTime.endsWith(':00') || selectedTime.endsWith(':30');
      
      // If it's a 30-minute interval, update the baseTime to recenter the grid
      if (isHalfHourTime) {
        setBaseTime(selectedTime);
      }
    }
  }, [selectedTime]);
  
  // Function to calculate displayed times with selected time in the center
  const generateDisplayedTimes = (availableTimes: string[], centerTime: string) => {
    if (availableTimes.length === 0) return;
    
    const centerIndex = availableTimes.indexOf(centerTime);
    const slotsToShow = 9;
    
    if (centerIndex !== -1) {
      // Center exists in times array
      const slotsOnEachSide = Math.floor((slotsToShow - 1) / 2);
      
      let startIndex = Math.max(0, centerIndex - slotsOnEachSide);
      let endIndex = Math.min(availableTimes.length - 1, startIndex + slotsToShow - 1);
      
      // Adjust start index if we hit the end boundary
      if (endIndex - startIndex < slotsToShow - 1) {
        startIndex = Math.max(0, endIndex - slotsToShow + 1);
      }
      
      const timesToShow = availableTimes.slice(startIndex, endIndex + 1);
      setDisplayedTimes(timesToShow);
    } else {
      // Find closest time if center time not in array
      const [centerHour, centerMinute] = centerTime.split(':').map(Number);
      const centerTotalMinutes = centerHour * 60 + centerMinute;
      
      let closestIndex = 0;
      let minDiff = Number.MAX_SAFE_INTEGER;
      
      availableTimes.forEach((time, index) => {
        const [hour, minute] = time.split(':').map(Number);
        const totalMinutes = hour * 60 + minute;
        const diff = Math.abs(totalMinutes - centerTotalMinutes);
        
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = index;
        }
      });
      
      // Generate around closest time
      let startIndex = Math.max(0, closestIndex - 4);
      let endIndex = Math.min(availableTimes.length - 1, startIndex + slotsToShow - 1);
      
      // Adjust start index if we hit the end boundary
      if (endIndex - startIndex < slotsToShow - 1) {
        startIndex = Math.max(0, endIndex - slotsToShow + 1);
      }
      
      const timesToShow = availableTimes.slice(startIndex, endIndex + 1);
      setDisplayedTimes(timesToShow);
    }
  };
  
  // This handler prevents form validation by stopping event propagation
  const handleTimeSelection = (time: string, event: React.MouseEvent) => {
    // Prevent the event from bubbling up to any parent form elements
    event.preventDefault();
    
    // Check if the time is disabled first
    if (isDisabledTime(time)) {
      return; // Do nothing if time is disabled
    }
    
    // Mark that this selection came from the grid
    setIsGridSelection(true);
    
    // Update the selected time
    onSelectTime(time);
  };

  // Check if today is Sunday
  const isSunday = new Date().getDay() === 0;

  // Function to check if a time slot should be disabled
  const isDisabledTime = (time: string): boolean => {
    return isSunday && (time === "14:30" || time === "22:00");
  };
  
  // Function to check if a time is already selected and not disabled
  const isSelectedAndNotDisabled = (time: string): boolean => {
    return selectedTime === time && !isDisabledTime(time);
  };

  // When disabled time is selected, force select the first available time
  useEffect(() => {
    if (isDisabledTime(selectedTime) && times.length > 0) {
      // Find the first non-disabled time
      const firstAvailableTime = times.find(time => !isDisabledTime(time));
      if (firstAvailableTime) {
        onSelectTime(firstAvailableTime);
      }
    }
  }, [selectedTime, times]);

  if (times.length === 0) {
    return (
      <div className="mt-6 mb-10">
        <div className="h-px bg-gray-200 mb-6"></div>
        <div className="text-center text-gray-500 py-6 bg-gray-50 rounded-lg">
          Das Restaurant ist an diesem Tag geschlossen.
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-6 mb-10">
      <div className="h-px bg-gray-200 mb-6"></div>
      <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
        {displayedTimes.map((time, index) => {
          const isDisabled = isDisabledTime(time);
          
          return (
            <Button
              key={time}
              variant={isSelectedAndNotDisabled(time) ? "default" : "outline"}
              className={`h-16 text-lg font-medium rounded-xl will-change-transform
                ${isSelectedAndNotDisabled(time) 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md transform hover:scale-105 hover:shadow-lg' 
                  : isDisabled 
                    ? 'bg-gray-700 text-gray-300 cursor-not-allowed hover:bg-gray-700 border-none' 
                    : 'bg-white text-blue-500 hover:bg-blue-50 border border-gray-200 hover:scale-105 hover:shadow-md'
                }
                ${isLoaded ? 'time-button-enter-active' : 'time-button-enter'}
                transition-property: transform, opacity, background-color, box-shadow;
                transition-duration: 180ms;`}
              onClick={(e) => handleTimeSelection(time, e)}
              disabled={isDisabled}
              type="button" // Explicitly set to button type to prevent form submission
              style={{
                transitionDelay: `${Math.min(index * 15, 120)}ms`,
              }}
            >
              {time}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeOptions;
