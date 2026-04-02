// features/workouts/ExerciseCard.js — Card component for a single exercise within a plan.
// All fields are editable inline: name, sets, reps, load (kg), rest (seconds).
// Has a Delete button and optional Notes field (textarea).
// If progress tracking is enabled: shows "Record load" button and a "Show progress" toggle
// that renders the ProgressChart component inside the card.
// Supports single exercise or superset (two exercises grouped).

import React from 'react';

/**
 * @param {{
 *   exercise: { id: string, name: string, sets: number, reps: number, load: number, rest: number, notes: string },
 *   planId: string,
 *   onUpdate: Function,
 *   onDelete: Function,
 *   trackingEnabled: boolean,
 *   onRecordLoad: Function,
 * }} props
 */
function ExerciseCard({ exercise, planId, onUpdate, onDelete, trackingEnabled, onRecordLoad }) {
    // TODO: implement inline editing, notes, progress toggle, ProgressChart
    return (
        <div className="card exercise-card mb-2">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                    <strong>{exercise.name}</strong>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(planId, exercise.id)}>
                        <i className="bi bi-trash-fill" />
                    </button>
                </div>
                <small className="text-muted">
                    {exercise.sets} serie × {exercise.reps} rip — {exercise.load} kg — riposo: {exercise.rest}s
                </small>
            </div>
        </div>
    );
}

export default ExerciseCard;
