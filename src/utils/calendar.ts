import { WeddingData } from '../types';

export function createGoogleCalendarUrl(weddingData: WeddingData): string {
  try {
    const startDate = new Date(weddingData.weddingDate);
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // 4 hours

    const formatGCalTime = (d: Date) => {
      return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };

    const title = encodeURIComponent(`${weddingData.groom.callingName} & ${weddingData.bride.callingName}'s Wedding & Nikah`);
    const details = encodeURIComponent(
      `Celebrating the wedding of ${weddingData.groom.fullName} and ${weddingData.bride.fullName}.\n\nVenue: ${weddingData.venueName}, ${weddingData.venueAddress}\n\nTime: ${weddingData.weddingTime}\n\nHashtag: ${weddingData.heroHashtag}`
    );
    const location = encodeURIComponent(`${weddingData.venueName}, ${weddingData.venueAddress}`);
    const dates = `${formatGCalTime(startDate)}/${formatGCalTime(endDate)}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  } catch {
    return 'https://calendar.google.com/';
  }
}

export function downloadIcsFile(weddingData: WeddingData) {
  try {
    const startDate = new Date(weddingData.weddingDate);
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);

    const pad = (n: number) => (n < 10 ? '0' + n : n);
    const formatIcsTime = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Suhail and Sana Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:wedding-${Date.now()}@weddinginvite.com`,
      `DTSTAMP:${formatIcsTime(new Date())}`,
      `DTSTART:${formatIcsTime(startDate)}`,
      `DTEND:${formatIcsTime(endDate)}`,
      `SUMMARY:${weddingData.groom.callingName} & ${weddingData.bride.callingName}'s Wedding & Nikah`,
      `DESCRIPTION:Join us to celebrate the joyous union of ${weddingData.groom.fullName} and ${weddingData.bride.fullName}.`,
      `LOCATION:${weddingData.venueName}, ${weddingData.venueAddress}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${weddingData.groom.callingName}_${weddingData.bride.callingName}_Wedding.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Failed to download calendar invite', err);
  }
}
