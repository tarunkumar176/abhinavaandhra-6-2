import { format, subDays, isToday, isYesterday, parseISO } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
};

export const formatDisplayDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(dateObj)) {
    return 'Today';
  }

  if (isYesterday(dateObj)) {
    return 'Yesterday';
  }

  return format(dateObj, 'MMM dd, yyyy');
};

export const formatLongDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatTeluguDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd/MM/yyyy');
};

export const getRecentDates = (days: number = 7): string[] => {
  const dates: string[] = [];
  for (let i = 0; i < days; i++) {
    const date = subDays(new Date(), i);
    dates.push(formatDate(date));
  }
  return dates;
};

export const getTodayDate = (): string => {
  return formatDate(new Date());
};

export const isValidDate = (dateString: string): boolean => {
  const date = parseISO(dateString);
  return !isNaN(date.getTime());
};