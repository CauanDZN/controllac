import {addDays, format} from 'date-fns';

import {
  formatISODate,
  getExpirationStatus,
  isValidMaskedDate,
  maskDate,
  maskedDateToISO,
} from '@/utils/date';

describe('maskDate', () => {
  it('inserts slashes as the user types digits', () => {
    expect(maskDate('1')).toBe('1');
    expect(maskDate('12')).toBe('12');
    expect(maskDate('123')).toBe('12/3');
    expect(maskDate('12032026')).toBe('12/03/2026');
  });

  it('strips non-numeric characters', () => {
    expect(maskDate('12a03b2026')).toBe('12/03/2026');
  });

  it('ignores digits beyond dd/MM/yyyy', () => {
    expect(maskDate('120320269999')).toBe('12/03/2026');
  });
});

describe('isValidMaskedDate', () => {
  it('accepts a well-formed, real calendar date', () => {
    expect(isValidMaskedDate('12/03/2026')).toBe(true);
  });

  it('rejects an incomplete date', () => {
    expect(isValidMaskedDate('12/03/20')).toBe(false);
  });

  it('rejects a date that does not exist on the calendar', () => {
    expect(isValidMaskedDate('31/02/2026')).toBe(false);
  });

  it('rejects non-date garbage of the right length', () => {
    expect(isValidMaskedDate('aa/bb/cccc')).toBe(false);
  });
});

describe('maskedDateToISO / formatISODate', () => {
  it('round-trips a masked date through ISO and back', () => {
    const iso = maskedDateToISO('05/01/2026');
    expect(iso).toBe('2026-01-05');
    expect(formatISODate(iso)).toBe('05/01/2026');
  });
});

describe('getExpirationStatus', () => {
  it('flags a past date as expired', () => {
    const past = format(addDays(new Date(), -1), 'yyyy-MM-dd');
    expect(getExpirationStatus(past)).toBe('expired');
  });

  it('flags today as expiring', () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    expect(getExpirationStatus(today)).toBe('expiring');
  });

  it('flags a date within 7 days as expiring', () => {
    const soon = format(addDays(new Date(), 7), 'yyyy-MM-dd');
    expect(getExpirationStatus(soon)).toBe('expiring');
  });

  it('flags a date more than 7 days away as ok', () => {
    const later = format(addDays(new Date(), 8), 'yyyy-MM-dd');
    expect(getExpirationStatus(later)).toBe('ok');
  });
});
