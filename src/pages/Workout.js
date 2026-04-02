// pages/Workout.js — "Workout" page.
// Guides the user through an active workout session:
//   - Shows one exercise at a time (or superset pair)
//   - Displays sets/reps/load for the current exercise
//   - "Next set" button advances through sets, then moves to the next exercise
//   - Between sets/exercises shows a countdown timer set to the exercise rest time
//   - At the end offers to save the session (date + exercises performed) to local storage

import React from 'react';

function Workout() {
    return (
        <div>
            <h2 className="mb-4">
                <i className="bi bi-lightning-fill me-2 text-primary" />
                Workout
            </h2>
            {/* TODO: implement active workout session logic */}
            <p className="text-muted">Seleziona un piano per iniziare il workout.</p>
        </div>
    );
}

export default Workout;
