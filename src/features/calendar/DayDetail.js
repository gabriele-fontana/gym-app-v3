// features/calendar/DayDetail.js — Shows details for a selected calendar day.
// If a session exists: displays plan name and exercises performed.
// If empty: offers a dropdown to assign an existing plan, or a link to create a new one.

import React from 'react';

/** @param {{ date: string, session: object|undefined, plans: object[], onAssign: Function }} props */
function DayDetail({ date, session, plans, onAssign }) {
    // TODO: implement session detail and assignment UI
    return (
        <div className="text-muted">
            <strong>{date}</strong> — DayDetail placeholder
        </div>
    );
}

export default DayDetail;
