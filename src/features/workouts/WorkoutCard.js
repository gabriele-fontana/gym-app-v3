// features/workouts/WorkoutCard.js — Card component for a single workout plan.
// Shows plan name and a collapsible list of its ExerciseCards.
// Has Edit (rename) and Delete buttons using Bootstrap Icons.

import React from 'react';

/** @param {{ plan: object, onUpdate: Function, onDelete: Function }} props */
function WorkoutCard({ plan, onUpdate, onDelete }) {
    // TODO: implement collapsible exercise list, inline rename
    return (
        <div className="card exercise-card mb-3">
            <div className="card-body d-flex justify-content-between align-items-center">
                <span className="fw-semibold">{plan.name}</span>
                <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-secondary" onClick={() => onUpdate(plan.id)}>
                        <i className="bi bi-pencil-fill" />
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(plan.id)}>
                        <i className="bi bi-trash-fill" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WorkoutCard;
