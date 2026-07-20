import {differenceInCalendarDays, format, isValid, parse} from 'date-fns';

const DISPLAY_FORMAT = 'dd/MM/yyyy';
const DISPLAY_LENGTH = 10;

export function maskDate(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 4),
    digits.slice(4, 8),
  ].filter(Boolean);
  return parts.join('/');
}

export function isValidMaskedDate(value: string): boolean {
  if (value.length !== DISPLAY_LENGTH) {
    return false;
  }

  return isValid(parse(value, DISPLAY_FORMAT, new Date()));
}

export function maskedDateToISO(value: string): string {
  return format(parse(value, DISPLAY_FORMAT, new Date()), 'yyyy-MM-dd');
}

export function formatISODate(value: string): string {
  return format(new Date(`${value}T00:00:00`), DISPLAY_FORMAT);
}

export type ExpirationStatus = 'expired' | 'expiring' | 'ok';

export function getExpirationStatus(
  expirationDateISO: string,
): ExpirationStatus {
  const days = differenceInCalendarDays(
    new Date(`${expirationDateISO}T00:00:00`),
    new Date(),
  );

  if (days < 0) {
    return 'expired';
  }

  if (days <= 7) {
    return 'expiring';
  }

  return 'ok';
}
