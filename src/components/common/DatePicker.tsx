import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  required?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date (MM/DD/YYYY)",
  className = "",
  disabled = false,
  minDate = "1900-01-01",
  maxDate,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Convert YYYY-MM-DD to MM/DD/YYYY for display
  const formatDateForDisplay = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Convert MM/DD/YYYY to YYYY-MM-DD for storage
  const parseDisplayDate = (displayStr: string): string => {
    if (!displayStr) return "";
    
    // Handle MM/DD/YYYY format
    const mmddyyyyMatch = displayStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (mmddyyyyMatch) {
      const [, month, day, year] = mmddyyyyMatch;
      const monthNum = parseInt(month, 10);
      const dayNum = parseInt(day, 10);
      const yearNum = parseInt(year, 10);
      
      // Validate month and day
      if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
        return "";
      }
      
      // Create date and validate
      const date = new Date(yearNum, monthNum - 1, dayNum);
      if (date.getMonth() !== monthNum - 1 || date.getDate() !== dayNum) {
        return "";
      }
      
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    return "";
  };

  // Initialize display value and selected date
  useEffect(() => {
    if (value) {
      setDisplayValue(formatDateForDisplay(value));
      setSelectedDate(new Date(value));
      setCurrentMonth(new Date(value));
    } else {
      setDisplayValue("");
      setSelectedDate(null);
    }
  }, [value]);

  // Handle manual input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);
    
    // Try to parse the input
    const parsedDate = parseDisplayDate(inputValue);
    if (parsedDate) {
      onChange(parsedDate);
    }
  };

  // Handle date selection from calendar
  const handleDateSelect = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    onChange(dateStr);
    setIsOpen(false);
  };

  // Handle input blur - validate and format
  const handleInputBlur = () => {
    if (displayValue) {
      const parsedDate = parseDisplayDate(displayValue);
      if (parsedDate) {
        setDisplayValue(formatDateForDisplay(parsedDate));
      } else {
        // Reset to current value if invalid
        setDisplayValue(formatDateForDisplay(value));
      }
    }
  };

  // Calendar navigation
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    const minDateObj = new Date(minDate);
    const maxDateObj = maxDate ? new Date(maxDate) : today;
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const isDisabled = date < minDateObj || date > maxDateObj;
      
      days.push({
        date,
        isCurrentMonth,
        isToday,
        isSelected,
        isDisabled
      });
    }
    
    return days;
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const days = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed ${className}`}
          disabled={disabled}
          required={required}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
        >
          <Calendar className="w-5 h-5" />
        </button>
      </div>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 min-w-[280px]">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <button
                key={index}
                type="button"
                onClick={() => !day.isDisabled && handleDateSelect(day.date)}
                disabled={day.isDisabled}
                className={`
                  w-8 h-8 text-sm rounded hover:bg-blue-100 transition-colors
                  ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                  ${day.isToday ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                  ${day.isSelected ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                  ${day.isDisabled ? 'text-gray-300 cursor-not-allowed hover:bg-transparent' : ''}
                `}
              >
                {day.date.getDate()}
              </button>
            ))}
          </div>

          {/* Year Navigation */}
          <div className="mt-4 flex items-center justify-center space-x-2">
            <button
              type="button"
              onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear() - 1, prev.getMonth()))}
              className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              {currentMonth.getFullYear() - 1}
            </button>
            <div className="px-3 py-1 text-sm font-medium text-gray-900">
              {currentMonth.getFullYear()}
            </div>
            <button
              type="button"
              onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear() + 1, prev.getMonth()))}
              className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              {currentMonth.getFullYear() + 1}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
