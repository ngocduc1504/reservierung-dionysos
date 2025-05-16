
import React, { useState } from 'react';
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  isHoliday?: (date: Date) => boolean;
}

const DateSelector = ({ selectedDate, onSelect, isHoliday }: DateSelectorProps) => {
  const [open, setOpen] = useState(false);
  
  // Format the date to display "Heute" for today
  const displayDate = isToday(selectedDate) 
    ? "Heute" 
    : format(selectedDate, "d. MMMM", { locale: de });

  // Check if selected date is a holiday
  const holidayStatus = isHoliday && isHoliday(selectedDate) 
    ? " (Feiertag)" 
    : "";

  // Disable dates before today
  const disableDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="mb-6">
      <div className="section-title">Datum</div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="select-container w-full justify-between"
          >
            <span>
              {displayDate}
              {holidayStatus && (
                <span className="ml-1 text-red-500 font-medium">{holidayStatus}</span>
              )}
            </span>
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                onSelect(date);
                setOpen(false);
              }
            }}
            disabled={disableDates}
            initialFocus
            locale={de}
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

// Helper function to check if date is today
function isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}

export default DateSelector;
