
import React from 'react';
import { Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeSelectorProps {
  selectedTime: string;
  onSelect: (time: string) => void;
  selectedDate: Date;
  availableTimes: string[];
}

const TimeSelector = ({ selectedTime, onSelect, availableTimes }: TimeSelectorProps) => {
  // Filter times to only show 30-minute intervals (XX:00 and XX:30) in the dropdown
  // Plus explicitly include 22:30 if it's in availableTimes
  const filteredTimes = availableTimes.filter(time => {
    const parts = time.split(':');
    return parts.length === 2 && (parts[1] === '00' || parts[1] === '30');
  });

  // Find the nearest 30-minute interval for dropdown display
  const findNearestHalfHour = (time: string): string => {
    if (!time) {
      return filteredTimes.length > 0 ? filteredTimes[0] : '';
    }
    
    // If the time is already in the filtered list, use it
    if (filteredTimes.includes(time)) {
      return time;
    }

    // For other times, find the nearest 30-minute interval
    const [hoursStr, minutesStr] = time.split(':');
    const hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr);
    const totalMinutes = hours * 60 + minutes;
    
    // Find closest time in the filtered list
    let closestTime = filteredTimes[0];
    let minDiff = Number.MAX_SAFE_INTEGER;
    
    filteredTimes.forEach((timeOption) => {
      const [h, m] = timeOption.split(':').map(Number);
      const timeTotalMinutes = h * 60 + m;
      const diff = Math.abs(timeTotalMinutes - totalMinutes);
      
      if (diff < minDiff) {
        minDiff = diff;
        closestTime = timeOption;
      }
    });
    
    return closestTime;
  };

  // Get the nearest time for the dropdown display
  const displayTime = findNearestHalfHour(selectedTime);
  
  // Handle time selection without triggering form validation
  const handleTimeSelect = (time: string) => {
    onSelect(time);
  };
  
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-5 w-5 text-blue-500" />
        <div className="text-lg font-medium text-gray-700">Uhrzeit</div>
      </div>
      
      {filteredTimes.length > 0 ? (
        <Select value={displayTime} onValueChange={handleTimeSelect}>
          <SelectTrigger className="select-container bg-white hover:bg-gray-50 transition-colors">
            <SelectValue placeholder="Wählen Sie eine Uhrzeit" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {filteredTimes.map((time) => (
              <SelectItem key={time} value={time} className="text-base">
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="select-container text-gray-500 bg-gray-50">
          Geschlossen an diesem Tag
        </div>
      )}
    </div>
  );
};

export default TimeSelector;
