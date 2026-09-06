import React, { useState } from 'react';
import { format, parse, isValid } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

/** Kurdish day names, in the order the week is written locally (Saturday first). */
export const KURDISH_DAYS: { value: string; en: string }[] = [
  { value: 'شەممە', en: 'Saturday' },
  { value: 'یەک شەممە', en: 'Sunday' },
  { value: 'دوو شەممە', en: 'Monday' },
  { value: 'سێ شەممە', en: 'Tuesday' },
  { value: 'چوار شەممە', en: 'Wednesday' },
  { value: 'پێنج شەممە', en: 'Thursday' },
  { value: 'هەینی', en: 'Friday' },
];

/** JS getDay() (0 = Sunday) to the matching Kurdish day name. */
const kurdishDayFromDate = (d: Date) => {
  const byJsIndex = ['یەک شەممە', 'دوو شەممە', 'سێ شەممە', 'چوار شەممە', 'پێنج شەممە', 'هەینی', 'شەممە'];
  return byJsIndex[d.getDay()];
};

interface DayOfWeekSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/** Dropdown of the seven days; stores the Kurdish name (what the templates print). */
export const DayOfWeekSelect = ({ value, onChange, placeholder = 'ڕۆژ هەڵبژێرە (Select a day)' }: DayOfWeekSelectProps) => {
  // Keep a previously typed custom value selectable so old data still shows.
  const options = value && !KURDISH_DAYS.some((d) => d.value === value)
    ? [{ value, en: '' }, ...KURDISH_DAYS]
    : KURDISH_DAYS;

  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((d) => (
          <SelectItem key={d.value} value={d.value}>
            <span className="flex items-center gap-3">
              <span>{d.value}</span>
              {d.en && <span className="text-xs text-gray-500">{d.en}</span>}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const DATE_FORMAT = 'dd/MM/yyyy';

const parseStoredDate = (value: string): Date | undefined => {
  if (!value) return undefined;
  for (const fmt of [DATE_FORMAT, 'yyyy-MM-dd', 'd/M/yyyy']) {
    const d = parse(value, fmt, new Date());
    if (isValid(d)) return d;
  }
  return undefined;
};

interface DatePickerFieldProps {
  value: string;
  onChange: (value: string) => void;
  /** Called with the Kurdish day name when a date is picked, so the day field can follow automatically. */
  onDayOfWeek?: (day: string) => void;
  placeholder?: string;
}

/** Button that opens a calendar; stores the date as dd/MM/yyyy (what the templates print). */
export const DatePickerField = ({ value, onChange, onDayOfWeek, placeholder = 'بەروار هەڵبژێرە (Pick a date)' }: DatePickerFieldProps) => {
  const [open, setOpen] = useState(false);
  const selected = parseStoredDate(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground')}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          {value || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" dir="ltr">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          onSelect={(d) => {
            if (!d) return;
            onChange(format(d, DATE_FORMAT));
            onDayOfWeek?.(kurdishDayFromDate(d));
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
