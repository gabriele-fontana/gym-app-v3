// features/calendar/CalendarGrid.js — Month calendar grid.
// Highlighted days have a saved session. Click any day to inspect or assign.

import React from 'react';

const DAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

/** Returns ISO date string YYYY-MM-DD for a given Date object */
function toISO(d) {
    return d.toISOString().split('T')[0];
}

/**
 * Returns an array of Date objects for all days visible in the month grid
 * (including leading/trailing days to fill full weeks, Mon-start).
 */
function buildGrid(year, month) {
    // month is 0-indexed
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    // Mon=0 … Sun=6
    const startOffset = (firstDay.getDay() + 6) % 7;
    const endOffset = (7 - ((lastDay.getDay() + 6) % 7 + 1)) % 7;

    const days = [];
    for (let i = startOffset; i > 0; i--) {
        days.push(new Date(year, month, 1 - i));
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
        days.push(new Date(year, month, d));
    }
    for (let i = 1; i <= endOffset; i++) {
        days.push(new Date(year, month + 1, i));
    }
    return days;
}

/**
 * @param {{
 *   year: number,
 *   month: number,
 *   sessions: object,
 *   selectedDate: string|null,
 *   onDayClick: Function
 * }} props
 */
function CalendarGrid({ year, month, sessions, selectedDate, onDayClick }) {
    const grid = buildGrid(year, month);
    const today = toISO(new Date());

    return (
        <div>
            {/* Day-of-week header */}
            <div className="calendar-header">
                {DAYS.map((d) => (
                    <div key={d} className="calendar-dow">{d}</div>
                ))}
            </div>

            {/* Day cells */}
            <div className="calendar-grid">
                {grid.map((date) => {
                    const iso = toISO(date);
                    const isCurrentMonth = date.getMonth() === month;
                    const hasSession = Boolean(sessions[iso]);
                    const isToday = iso === today;
                    const isSelected = iso === selectedDate;

                    let cellClass = 'calendar-cell';
                    if (!isCurrentMonth) cellClass += ' calendar-cell--other';
                    if (hasSession) cellClass += ' calendar-cell--session';
                    if (isToday) cellClass += ' calendar-cell--today';
                    if (isSelected) cellClass += ' calendar-cell--selected';

                    return (
                        <button
                            key={iso}
                            className={cellClass}
                            onClick={() => onDayClick(iso)}
                        >
                            <span className="calendar-day-num">{date.getDate()}</span>
                            {hasSession && <span className="calendar-dot" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default CalendarGrid;
