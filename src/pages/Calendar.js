// pages/Calendar.js — "Calendario" page.
// Shows a minimalistic week/month calendar:
//   - Days with a saved workout session are highlighted
//   - Clicking a highlighted day shows session details
//   - Clicking an empty day allows the user to assign an existing plan
//     (select dropdown with an "Add new plan" option that links to /plans)

import React from 'react';

function Calendar() {
    return (
        <div>
            <h2 className="mb-4">
                <i className="bi bi-calendar3 me-2 text-primary" />
                Calendario
            </h2>
            {/* TODO: implement CalendarGrid from features/calendar */}
            <p className="text-muted">Nessun allenamento registrato.</p>
        </div>
    );
}

export default Calendar;
