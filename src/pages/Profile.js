// pages/Profile.js — "Profilo" page.
// Sections:
//   - Progress tracking toggle (enables record-load buttons on ExerciseCards)
//   - Weight tracking log with a mini chart
//   - Overview of workout plans
//   - Overview of calendar sessions
//   - Export all data as CSV
//   - "Reset all data" button (clears local storage after confirmation)

import React from 'react';

function Profile() {
    return (
        <div>
            <h2 className="mb-4">
                <i className="bi bi-person-circle me-2 text-primary" />
                Profilo
            </h2>
            {/* TODO: implement profile sections */}
            <p className="text-muted">Sezione profilo in costruzione.</p>
        </div>
    );
}

export default Profile;
