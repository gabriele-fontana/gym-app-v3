// features/calendar/CalendarGrid.js — Week/month calendar UI.
// Renders a grid of day cells; highlighted cells have a saved workout session.
// Clicking a highlighted day shows session details.
// Clicking an empty day opens a modal to assign a plan or add a new one.

import React from 'react';

/** @param {{ sessions: object, onDayClick: Function }} props */
function CalendarGrid({ sessions, onDayClick }) {
    // TODO: implement calendar grid rendering
    return (
        <div className="text-muted">
            <i className="bi bi-calendar3 me-2" />
            CalendarGrid placeholder
        </div>
    );
}

export default CalendarGrid;
