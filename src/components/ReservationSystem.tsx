
import React, { useState, useEffect } from 'react';
import PersonSelector from './PersonSelector';
import DateSelector from './DateSelector';
import TimeSelector from './TimeSelector';
import TimeOptions from './TimeOptions';
import PhoneCodeSelector from './PhoneCodeSelector';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Mail, MessageSquare, Calendar, User, Phone, UserCircle, Check, Loader2 } from 'lucide-react';
import { toast } from './ui/sonner';

interface OpeningHours {
  [key: string]: string[][];
}

// German holidays in Gotha, Thuringia for 2024 and 2025
const holidays = [
  // 2024 holidays
  '2024-01-01', // New Year's Day
  '2024-03-29', // Good Friday
  '2024-04-01', // Easter Monday
  '2024-05-01', // Labor Day
  '2024-05-09', // Ascension Day
  '2024-05-20', // Whit Monday
  '2024-10-03', // German Unity Day
  '2024-10-31', // Reformation Day (Thuringia)
  '2024-12-25', // Christmas Day
  '2024-12-26', // Boxing Day
  
  // 2025 holidays
  '2025-01-01', // New Year's Day
  '2025-04-18', // Good Friday
  '2025-04-21', // Easter Monday
  '2025-05-01', // Labor Day
  '2025-05-29', // Ascension Day
  '2025-06-09', // Whit Monday
  '2025-10-03', // German Unity Day
  '2025-10-31', // Reformation Day (Thuringia)
  '2025-12-25', // Christmas Day
  '2025-12-26', // Boxing Day
];

const ReservationSystem = () => {
  const [people, setPeople] = useState(2);
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  
  // Contact information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneCode, setPhoneCode] = useState('+49');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  // Form submission state
  const [attempted, setAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Restaurant opening hours by day of week - Updated Sunday hours
  const openingHours: OpeningHours = {
    // 0 = Sunday, 1 = Monday, etc.
    0: [['11:30', '14:30'], ['17:00', '22:00']], // Sunday
    1: [], // Monday - Geschlossen (unless it's a holiday)
    2: [['17:00', '22:30']], // Tuesday
    3: [['17:00', '22:30']], // Wednesday
    4: [['17:00', '22:30']], // Thursday
    5: [['17:00', '22:30']], // Friday
    6: [['17:00', '22:30']], // Saturday
  };

  // Set current time as initial selected time
  useEffect(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = Math.floor(now.getMinutes() / 15) * 15;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const currentTime = `${hours}:${formattedMinutes}`;
    setSelectedTime(currentTime);
  }, []);

  // Check if a date is a holiday in Gotha
  const isHoliday = (date: Date): boolean => {
    const dateString = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    return holidays.includes(dateString);
  };

  // Generate time slots with 15 min intervals for the selected date
  useEffect(() => {
    const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
    let dayHours = openingHours[dayOfWeek];
    
    // Special case: If it's Monday (dayOfWeek === 1) and it's a holiday, use Sunday hours
    if (dayOfWeek === 1 && isHoliday(date)) {
      dayHours = [['17:00', '22:00']]; // Holiday Monday hours (like weekend hours)
      toast.info(
        "Feiertag erkannt", 
        { 
          description: "Das Restaurant ist an diesem Feiertag geöffnet.", 
          duration: 4000 
        }
      );
    }
    
    let times: string[] = [];

    // If restaurant is closed that day
    if (!dayHours || dayHours.length === 0) {
      setAvailableTimes([]);
      return;
    }

    // Generate time slots for each opening period
    dayHours.forEach(period => {
      const [startStr, endStr] = period;
      
      // Parse start and end times
      const [startHour, startMinute] = startStr.split(':').map(Number);
      const [endHour, endMinute] = endStr.split(':').map(Number);
      
      // Convert to minutes for easier calculation
      let startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;
      
      // Generate slots every 15 minutes
      while (startTimeInMinutes <= endTimeInMinutes) {
        const hour = Math.floor(startTimeInMinutes / 60);
        const minute = startTimeInMinutes % 60;
        times.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
        startTimeInMinutes += 15;
      }
    });
    
    // Add specific times for Sunday
    if (dayOfWeek === 0) {
      // Check if 14:30 isn't already in the list (it should be, but just to be safe)
      if (!times.includes('14:30')) {
        times.push('14:30');
      }
      
      // Add 22:00 if it's not already in the list
      if (!times.includes('22:00')) {
        times.push('22:00');
      }
      
      // Sort the times to ensure they appear in chronological order
      times.sort();
    }
    
    // Ensure 22:30 is included for Tuesday through Saturday
    if (dayOfWeek >= 2 && dayOfWeek <= 6 && !times.includes('22:30')) {
      times.push('22:30');
      // Sort times after adding the 22:30 slot
      times.sort();
    }
    
    // Filter times based on current time if date is today
    const today = new Date();
    if (date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()) {
      
      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute + 30; // Add 30 min buffer
      
      times = times.filter(time => {
        const [hour, minute] = time.split(':').map(Number);
        const timeInMinutes = hour * 60 + minute;
        return timeInMinutes > currentTimeInMinutes;
      });
    }
    
    setAvailableTimes(times);
    
    // Only set default time if there is no selection or current selection is not available
    if (times.length > 0 && !times.includes(selectedTime)) {
      setSelectedTime(times[0]);
    }
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    
    // Validation
    if (!firstName || !lastName || !phone || !email) {
      toast.error("Bitte alle Felder ausfüllen", {
        description: "Alle Kontaktdaten müssen ausgefüllt werden",
        duration: 4000,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate reservation processing
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Show success notification
      toast.success(
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-semibold">Reservierung erfolgreich!</span>
            <div className="flex-shrink-0 bg-green-100 p-1 rounded-full">
              <Check className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-gray-600">
            Reservierung für {firstName} {lastName} am {date.toLocaleDateString('de-DE')} um {selectedTime} Uhr für {people} Personen
          </p>
          <p className="text-gray-600">
            Kontakt: {phoneCode} {phone} / {email}
          </p>
        </div>,
        {
          duration: 6000,
          className: "p-4 max-w-md w-full",
        }
      );
      
      // Reset form
      setFirstName('');
      setLastName('');
      setPhoneCode('+49');
      setPhone('');
      setEmail('');
      setMessage('');
      setAttempted(false);
    }, 1500);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="reservation-container bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <PersonSelector 
          selectedPeople={people} 
          onSelect={setPeople} 
        />
        
        <div className="md:col-span-2">
          <DateSelector 
            selectedDate={date} 
            onSelect={setDate} 
            isHoliday={isHoliday}
          />
        </div>
      </div>
      
      <TimeSelector 
        selectedTime={selectedTime} 
        onSelect={setSelectedTime}
        availableTimes={availableTimes}
        selectedDate={date}
      />
      
      <TimeOptions 
        times={availableTimes} 
        selectedTime={selectedTime} 
        onSelectTime={setSelectedTime} 
      />
      
      {/* Contact Information Section - Improved design */}
      <div className="mt-12 border-t border-gray-200 pt-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Kontaktdaten</h2>
        <p className="text-gray-600 mb-8">Bitte alle Felder mit * ausfüllen</p>
        
        <div className="space-y-6">
          {/* Name fields with improved design */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-medium">
                <UserCircle className="h-4 w-4 text-blue-500" />
                <span>Name *</span>
              </label>
              <Input
                type="text"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`w-full bg-white border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition duration-200 ${attempted && !firstName ? 'border-red-500' : ''}`}
                placeholder="Vorname"
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-medium">
                <User className="h-4 w-4 text-blue-500" />
                <span>Nachname *</span>
              </label>
              <Input
                type="text"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`w-full bg-white border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition duration-200 ${attempted && !lastName ? 'border-red-500' : ''}`}
                placeholder="Nachname"
              />
            </div>
          </div>
          
          {/* Phone number with improved design and country code selector */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <Phone className="h-4 w-4 text-blue-500" />
              <span>Telefonnummer *</span>
            </label>
            <div className="flex">
              <PhoneCodeSelector 
                value={phoneCode} 
                onChange={setPhoneCode}
              />
              <Input
                type="tel"
                name="phone"
                placeholder="Telefonnummer"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`flex-1 rounded-l-none border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition duration-200 ${attempted && !phone ? 'border-red-500' : ''}`}
              />
            </div>
          </div>
          
          {/* Email with improved design */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <Mail className="h-4 w-4 text-blue-500" />
              <span>Email *</span>
            </label>
            <Input
              type="email"
              name="email"
              placeholder="beispiel@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full bg-white border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition duration-200 ${attempted && !email ? 'border-red-500' : ''}`}
            />
          </div>
          
          {/* Message with improved design */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span>Nachricht (optional)</span>
            </label>
            <Textarea
              name="message"
              placeholder="Haben Sie spezielle Wünsche oder Anmerkungen für das Restaurant?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-white border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 transition duration-200"
              rows={4}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="py-6 px-10 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg font-medium rounded-md flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          {isSubmitting ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Calendar className="h-6 w-6" />
          )}
          {isSubmitting ? 'Wird gesendet...' : 'Reservierung'}
        </Button>
      </div>
    </form>
  );
};

export default ReservationSystem;
