import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, isWithinInterval } from 'date-fns';
import 'react-day-picker/dist/style.css';

interface DateRangePickerProps {
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateRangeChange }) => {
  const [range, setRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;

    if (!range.from || (range.from && range.to)) {
      setRange({ from: date, to: null });
      onDateRangeChange(date, null);
    } else if (date < range.from) {
      setRange({ from: date, to: range.from });
      onDateRangeChange(date, range.from);
    } else {
      setRange({ from: range.from, to: date });
      onDateRangeChange(range.from, date);
    }
  };

  const modifiers = {
    selected: (date: Date) => {
      if (!range.from || !range.to) return false;
      return isWithinInterval(date, { start: range.from, end: range.to });
    },
  };

  return (
    <div className="date-range-picker">
      <DayPicker
        mode="single"
        selected={range.from}
        onSelect={handleSelect}
        modifiers={modifiers}
        className="rounded-lg border border-gray-200 p-4"
      />
      <div className="mt-2 text-sm text-gray-600">
        {range.from && (
          <p>Start: {format(range.from, 'PPP')}</p>
        )}
        {range.to && (
          <p>End: {format(range.to, 'PPP')}</p>
        )}
      </div>
    </div>
  );
};

export default DateRangePicker; 