// pages/Profile.js — Profile page with tracking toggle, weight log,
// stats overview, CSV export and data reset.

import React, { useState } from 'react';
import WeightChart from '../features/progress/WeightChart';
import DataExport from '../features/profile/DataExport';
import ResetData from '../features/profile/ResetData';
import { useProgressContext } from '../context/ProgressContext';
import { useWorkoutContext } from '../context/WorkoutContext';
import { useCalendar } from '../hooks/useCalendar';

// ── Section wrapper ────────────────────────────────────────────────────────────
function Section({ icon, title, children }) {
    return (
        <div className="card exercise-card mb-4">
            <div className="card-header" style={{ backgroundColor: 'var(--gym-surface)', borderColor: 'var(--gym-border)' }}>
                <span className="fw-semibold text-white">
                    <i className={`bi ${icon} me-2 text-primary`} />{title}
                </span>
            </div>
            <div className="card-body">{children}</div>
        </div>
    );
}

function Profile() {
    const {
        trackingEnabled, setTrackingEnabled,
        weightLog, addWeightEntry, deleteWeightEntry,
        progress, clearAllProgress,
    } = useProgressContext();
    const { plans } = useWorkoutContext();
    const { sessions } = useCalendar();

    const [weightInput, setWeightInput] = useState('');

    function handleAddWeight() {
        const val = parseFloat(weightInput);
        if (!val || val <= 0) return;
        addWeightEntry(val);
        setWeightInput('');
    }

    const totalExercises = plans.reduce((n, p) => n + p.exercises.length, 0);
    const sessionDates = Object.keys(sessions).sort().reverse();
    const trackedCount = Object.keys(progress).length;

    return (
        <div>
            <h2 className="mb-4">
                <i className="bi bi-person-circle me-2 text-primary" />
                Profilo
            </h2>

            {/* ── Overview stats ── */}
            <div className="row g-3 mb-4">
                {[
                    { icon: 'bi-journal-text', label: 'Piani', value: plans.length },
                    { icon: 'bi-list-check', label: 'Esercizi', value: totalExercises },
                    { icon: 'bi-calendar-check', label: 'Sessioni', value: sessionDates.length },
                    { icon: 'bi-graph-up', label: 'Tracciati', value: trackedCount },
                ].map(({ icon, label, value }) => (
                    <div key={label} className="col-6 col-md-3">
                        <div className="card exercise-card text-center p-3">
                            <i className={`bi ${icon} fs-3 text-primary mb-1`} />
                            <div className="display-6 fw-bold text-white">{value}</div>
                            <div className="small text-light opacity-75">{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Tracking toggle ── */}
            <Section icon="bi-graph-up" title="Tracking carico">
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="profile-tracking"
                        checked={trackingEnabled}
                        onChange={(e) => setTrackingEnabled(e.target.checked)}
                    />
                    <label className="form-check-label text-light" htmlFor="profile-tracking">
                        {trackingEnabled ? 'Tracking attivo' : 'Tracking disattivo'}
                    </label>
                </div>
                <p className="small text-light opacity-75 mt-2 mb-0">
                    Quando attivo, ogni esercizio mostra il pulsante <strong>Record load</strong> e il grafico progressi.
                </p>
                {trackingEnabled && trackedCount > 0 && (
                    <button
                        className="btn btn-sm btn-outline-warning mt-3"
                        onClick={() => { if (window.confirm('Cancellare tutto il tracking?')) clearAllProgress(); }}
                    >
                        <i className="bi bi-trash me-1" />Azzera progressi
                    </button>
                )}
            </Section>

            {/* ── Weight log ── */}
            <Section icon="bi-speedometer2" title="Peso corporeo">
                <div className="d-flex gap-2 mb-3">
                    <input
                        type="number"
                        min="20"
                        max="300"
                        step="0.1"
                        className="form-control form-control-sm gym-input"
                        style={{ maxWidth: 140 }}
                        placeholder="Peso (kg)"
                        value={weightInput}
                        onChange={(e) => setWeightInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddWeight()}
                    />
                    <button className="btn btn-sm btn-primary" onClick={handleAddWeight}>
                        <i className="bi bi-plus-lg me-1" />Aggiungi
                    </button>
                </div>

                <WeightChart weightLog={weightLog} />

                {weightLog.length > 0 && (
                    <div className="mt-3">
                        <p className="small text-light fw-semibold opacity-75 mb-2">Ultime misurazioni:</p>
                        <ul className="list-unstyled mb-0">
                            {[...weightLog].reverse().slice(0, 5).map((entry, i) => (
                                <li
                                    key={i}
                                    className="d-flex justify-content-between align-items-center py-1
                                               border-bottom small text-light"
                                    style={{ borderColor: 'var(--gym-border)' }}
                                >
                                    <span>
                                        <i className="bi bi-calendar3 me-1 opacity-50" />
                                        {new Date(entry.date).toLocaleDateString('it-IT')}
                                    </span>
                                    <span className="fw-semibold">{entry.weight} kg</span>
                                    <button
                                        className="btn btn-sm btn-link text-danger p-0"
                                        onClick={() => deleteWeightEntry(weightLog.length - 1 - i)}
                                        title="Rimuovi"
                                    >
                                        <i className="bi bi-x-lg" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Section>

            {/* ── Recent sessions ── */}
            <Section icon="bi-calendar-check" title="Sessioni recenti">
                {sessionDates.length === 0 ? (
                    <p className="small text-light opacity-75 mb-0">Nessuna sessione registrata.</p>
                ) : (
                    <ul className="list-unstyled mb-0">
                        {sessionDates.slice(0, 7).map((date) => {
                            const s = sessions[date];
                            return (
                                <li
                                    key={date}
                                    className="d-flex justify-content-between align-items-center py-2
                                               border-bottom small text-light"
                                    style={{ borderColor: 'var(--gym-border)' }}
                                >
                                    <span>
                                        <i className="bi bi-calendar3 me-1 opacity-50" />
                                        {new Date(date).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })}
                                    </span>
                                    <span className="text-white fw-semibold">{s.planName}</span>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </Section>

            {/* ── Data management ── */}
            <Section icon="bi-database" title="Gestione dati">
                <div className="d-flex flex-wrap gap-3">
                    <DataExport />
                    <ResetData />
                </div>
            </Section>
        </div>
    );
}

export default Profile;
