// pages/EditPlans.js — Manage workout plans.
// Lists all plans as collapsible WorkoutCards.
// Add new plan inline. Tracking toggle enables Record load on exercises.

import React, { useState } from 'react';
import WorkoutCard from '../features/workouts/WorkoutCard';
import { useWorkoutContext } from '../context/WorkoutContext';
import { useProgressContext } from '../context/ProgressContext';

function EditPlans() {
    const { plans, addPlan } = useWorkoutContext();
    const { trackingEnabled, setTrackingEnabled } = useProgressContext();

    const [showAddForm, setShowAddForm] = useState(false);
    const [newPlanName, setNewPlanName] = useState('');

    function handleAddPlan() {
        const name = newPlanName.trim();
        if (!name) return;
        addPlan({ name });
        setNewPlanName('');
        setShowAddForm(false);
    }

    return (
        <div>
            {/* Page title + tracking toggle */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
                <h2 className="mb-0">
                    <i className="bi bi-journal-text me-2 text-primary" />
                    Piani di allenamento
                </h2>
                <div className="form-check form-switch mb-0">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="tracking-toggle"
                        checked={trackingEnabled}
                        onChange={(e) => setTrackingEnabled(e.target.checked)}
                    />
                    <label className="form-check-label text-light" htmlFor="tracking-toggle">
                        <i className="bi bi-graph-up me-1" />Tracking carico
                    </label>
                </div>
            </div>

            {trackingEnabled && (
                <div className="alert alert-info py-2 px-3 mb-3 d-flex align-items-center gap-2 small">
                    <i className="bi bi-info-circle-fill flex-shrink-0" />
                    Tracking attivo — usa <strong className="mx-1">Record load</strong> sugli esercizi per salvare il carico odierno.
                </div>
            )}

            {/* Plan list */}
            {plans.length === 0 && !showAddForm ? (
                <div className="text-center py-5">
                    <i className="bi bi-journal-x display-3 text-secondary mb-3 d-block" />
                    <p className="text-light opacity-75">Nessun piano ancora.<br />Creane uno per iniziare!</p>
                </div>
            ) : (
                plans.map((plan) => <WorkoutCard key={plan.id} plan={plan} />)
            )}

            {/* Add plan form / button */}
            {showAddForm ? (
                <div className="card exercise-card mt-3">
                    <div className="card-body">
                        <p className="small text-light fw-semibold opacity-75 mb-2">Nuovo piano</p>
                        <div className="d-flex gap-2">
                            <input
                                autoFocus
                                className="form-control gym-input"
                                placeholder="Nome piano *"
                                value={newPlanName}
                                onChange={(e) => setNewPlanName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddPlan();
                                    if (e.key === 'Escape') { setShowAddForm(false); setNewPlanName(''); }
                                }}
                            />
                            <button className="btn btn-primary" onClick={handleAddPlan}>
                                <i className="bi bi-plus-lg me-1" />Crea
                            </button>
                            <button className="btn btn-secondary" onClick={() => { setShowAddForm(false); setNewPlanName(''); }}>
                                Annulla
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <button
                    className="btn btn-primary mt-3"
                    onClick={() => setShowAddForm(true)}
                >
                    <i className="bi bi-plus-lg me-1" />Nuovo piano
                </button>
            )}
        </div>
    );
}

export default EditPlans;
