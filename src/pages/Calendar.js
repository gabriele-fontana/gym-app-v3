// pages/Calendar.js — Monthly calendar with session tracking.
// Navigate months, click a day to see or assign a session.

import React, { useState } from 'react';
import CalendarGrid from '../features/calendar/CalendarGrid';
import DayDetail from '../features/calendar/DayDetail';
import { useCalendar } from '../hooks/useCalendar';
import { useWorkoutContext } from '../context/WorkoutContext';

const MONTH_NAMES = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
];

function Calendar() {
    const { sessions, addSession, removeSession } = useCalendar();
    const { plans } = useWorkoutContext();

    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth());
    const [selectedDate, setSelectedDate] = useState(null);

    function prevMonth() {
        if (month === 0) { setYear((y) => y - 1); setMonth(11); }
        else setMonth((m) => m - 1);
        setSelectedDate(null);
    }

    function nextMonth() {
        if (month === 11) { setYear((y) => y + 1); setMonth(0); }
        else setMonth((m) => m + 1);
        setSelectedDate(null);
    }

    function goToday() {
        setYear(now.getFullYear());
        setMonth(now.getMonth());
        setSelectedDate(null);
    }

    function handleDayClick(iso) {
        setSelectedDate((prev) => (prev === iso ? null : iso));
    }

    function handleAssign(date, plan) {
        addSession(date, {
            planId: plan.id,
            planName: plan.name,
            date,
            exercises: plan.exercises.map((e) =>
                e.type === 'superset'
                    ? `${e.exerciseA.name} + ${e.exerciseB.name}`
                    : e.name
            ),
        });
    }

    const sessionCount = Object.keys(sessions).length;

    return (
        <div>
            <h2 className="mb-4">
                <i className="bi bi-calendar3 me-2 text-primary" />
                Calendario
            </h2>

            {/* Month navigator */}
            <div className="d-flex align-items-center justify-content-between mb-3">
                <button className="btn btn-sm btn-dark" onClick={prevMonth}>
                    <i className="bi bi-chevron-left" />
                </button>
                <div className="text-center">
                    <span className="fw-semibold text-white">{MONTH_NAMES[month]} {year}</span>
                    <div className="small text-light opacity-50">
                        {sessionCount} {sessionCount === 1 ? 'sessione' : 'sessioni'} totali
                    </div>
                </div>
                <button className="btn btn-sm btn-dark" onClick={nextMonth}>
                    <i className="bi bi-chevron-right" />
                </button>
            </div>

            {/* Today shortcut */}
            <div className="text-center mb-3">
                <button className="btn btn-sm btn-outline-secondary" onClick={goToday}>
                    <i className="bi bi-calendar-day me-1" />Oggi
                </button>
            </div>

            {/* Calendar grid */}
            <CalendarGrid
                year={year}
                month={month}
                sessions={sessions}
                selectedDate={selectedDate}
                onDayClick={handleDayClick}
            />

            {/* Day detail panel */}
            {selectedDate && (
                <DayDetail
                    date={selectedDate}
                    session={sessions[selectedDate]}
                    plans={plans}
                    onAssign={handleAssign}
                    onRemove={removeSession}
                    onClose={() => setSelectedDate(null)}
                />
            )}
        </div>
    );
}

export default Calendar;
