// pages/EditPlans.js — "Piani" page.
// Main section for managing workout plans:
//   - List all plans, each as a WorkoutCard
//   - Add a new plan via a form/button
//   - Click a plan to expand its exercises
//   - Each exercise is shown in an ExerciseCard (editable, deletable)
//   - If progress tracking is enabled (from ProfileContext), show record-load button and graph toggle

import React from 'react';

function EditPlans() {
    return (
        <div>
            <h2 className="mb-4">
                <i className="bi bi-journal-text me-2 text-primary" />
                Piani di allenamento
            </h2>
            {/* TODO: render list of WorkoutCards from WorkoutContext */}
            <p className="text-muted">Nessun piano ancora. Aggiungine uno!</p>
        </div>
    );
}

export default EditPlans;
