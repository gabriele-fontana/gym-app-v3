// features/workouts/SupersetCard.js — Card for a superset entry.
// A superset contains two exercises (A and B) performed back-to-back with one
// shared rest time between rounds.
//
// View mode: both exercises shown side-by-side (stacked on mobile).
// Edit mode: inline inputs for both exercises + shared rest.
// Tracking: each exercise has its own Record load button + progress chart.

import React, { useState } from 'react';
import ProgressChart from '../progress/ProgressChart';
import { useWorkoutContext } from '../../context/WorkoutContext';
import { useProgressContext } from '../../context/ProgressContext';

const toDraft = (entry) => ({
    rest: entry.rest,
    exerciseA: {
        name: entry.exerciseA.name,
        sets: entry.exerciseA.sets,
        reps: entry.exerciseA.reps,
        load: entry.exerciseA.load,
        notes: entry.exerciseA.notes ?? '',
    },
    exerciseB: {
        name: entry.exerciseB.name,
        sets: entry.exerciseB.sets,
        reps: entry.exerciseB.reps,
        load: entry.exerciseB.load,
        notes: entry.exerciseB.notes ?? '',
    },
});

// ── Mini view panel for one exercise inside the superset ──────────────────────
function ExercisePanel({ ex, side, trackingEnabled, onRecordLoad, showGraph, onToggleGraph }) {
    const letter = side === 'exerciseA' ? 'A' : 'B';
    const records = ex._records ?? [];

    return (
        <div className="superset-panel flex-fill">
            <div className="d-flex align-items-center gap-2 mb-1">
                <span className={`superset-letter superset-letter--${letter.toLowerCase()}`}>{letter}</span>
                <strong className="text-white">{ex.name}</strong>
            </div>

            <div className="d-flex flex-wrap gap-2 small text-light mb-1">
                <span><i className="bi bi-layers me-1" />{ex.sets} serie</span>
                <span><i className="bi bi-arrow-repeat me-1" />{ex.reps} rip.</span>
                <span><i className="bi bi-box me-1" />{ex.load} kg</span>
            </div>

            {ex.notes && (
                <p className="small text-secondary fst-italic mb-1">
                    <i className="bi bi-sticky me-1" />{ex.notes}
                </p>
            )}

            {trackingEnabled && (
                <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
                    <button className="btn btn-sm btn-success" onClick={onRecordLoad} title="Registra carico">
                        <i className="bi bi-plus-circle me-1" />Record load
                    </button>
                    <div className="form-check mb-0">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id={`graph-ss-${ex.id}`}
                            checked={showGraph}
                            onChange={onToggleGraph}
                        />
                        <label className="form-check-label small text-light" htmlFor={`graph-ss-${ex.id}`}>
                            Grafico
                        </label>
                    </div>
                    {records.length > 0 && (
                        <span className="badge bg-secondary ms-auto">
                            <i className="bi bi-graph-up me-1" />{records.length}
                        </span>
                    )}
                </div>
            )}

            {trackingEnabled && showGraph && (
                <div className="mt-2">
                    <ProgressChart records={records} exerciseName={ex.name} />
                </div>
            )}
        </div>
    );
}

// ── Mini edit panel for one exercise inside the superset ──────────────────────
function ExerciseEditPanel({ side, draft, onChange }) {
    const letter = side === 'exerciseA' ? 'A' : 'B';

    function handleField(field, value) {
        onChange(side, { ...draft, [field]: value });
    }

    return (
        <div className="flex-fill">
            <div className="d-flex align-items-center gap-2 mb-2">
                <span className={`superset-letter superset-letter--${letter.toLowerCase()}`}>{letter}</span>
                <input
                    className="form-control form-control-sm gym-input flex-grow-1"
                    placeholder={`Esercizio ${letter} *`}
                    value={draft.name}
                    onChange={(e) => handleField('name', e.target.value)}
                />
            </div>
            <div className="row g-1 mb-2">
                <div className="col-4">
                    <input
                        type="number" min="1"
                        className="form-control form-control-sm gym-input"
                        placeholder="Serie"
                        value={draft.sets}
                        onChange={(e) => handleField('sets', e.target.value)}
                    />
                </div>
                <div className="col-4">
                    <input
                        type="number" min="1"
                        className="form-control form-control-sm gym-input"
                        placeholder="Rip."
                        value={draft.reps}
                        onChange={(e) => handleField('reps', e.target.value)}
                    />
                </div>
                <div className="col-4">
                    <input
                        type="number" min="0" step="0.5"
                        className="form-control form-control-sm gym-input"
                        placeholder="kg"
                        value={draft.load}
                        onChange={(e) => handleField('load', e.target.value)}
                    />
                </div>
            </div>
            <textarea
                className="form-control form-control-sm gym-input"
                rows={1}
                placeholder="Note..."
                value={draft.notes}
                onChange={(e) => handleField('notes', e.target.value)}
            />
        </div>
    );
}

// ── SupersetCard ──────────────────────────────────────────────────────────────
function SupersetCard({ entry, planId }) {
    const { deleteExercise, updateSupersetExercise, updateSupersetRest } = useWorkoutContext();
    const { trackingEnabled, progress, recordLoad } = useProgressContext();

    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(toDraft(entry));
    const [showGraphA, setShowGraphA] = useState(false);
    const [showGraphB, setShowGraphB] = useState(false);

    const recordsA = progress[entry.exerciseA.id] ?? [];
    const recordsB = progress[entry.exerciseB.id] ?? [];

    function handleSideChange(side, newSideDraft) {
        setDraft((prev) => ({ ...prev, [side]: newSideDraft }));
    }

    function handleSave() {
        const toNum = (v) => Number(v);
        updateSupersetExercise(planId, entry.id, 'exerciseA', {
            name: draft.exerciseA.name,
            sets: toNum(draft.exerciseA.sets),
            reps: toNum(draft.exerciseA.reps),
            load: toNum(draft.exerciseA.load),
            notes: draft.exerciseA.notes,
        });
        updateSupersetExercise(planId, entry.id, 'exerciseB', {
            name: draft.exerciseB.name,
            sets: toNum(draft.exerciseB.sets),
            reps: toNum(draft.exerciseB.reps),
            load: toNum(draft.exerciseB.load),
            notes: draft.exerciseB.notes,
        });
        updateSupersetRest(planId, entry.id, draft.rest);
        setIsEditing(false);
    }

    function handleCancel() {
        setDraft(toDraft(entry));
        setIsEditing(false);
    }

    return (
        <div className="card superset-card mb-2">
            <div className="card-body">
                {/* ── Header row ── */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="superset-badge">
                        <i className="bi bi-intersect me-1" />Superset
                    </span>
                    <div className="d-flex gap-1">
                        <button
                            className="btn btn-sm btn-secondary"
                            title="Modifica"
                            onClick={() => { setDraft(toDraft(entry)); setIsEditing(true); }}
                        >
                            <i className="bi bi-pencil-fill" />
                        </button>
                        <button
                            className="btn btn-sm btn-danger"
                            title="Elimina superset"
                            onClick={() => {
                                if (window.confirm('Eliminare questo superset?')) {
                                    deleteExercise(planId, entry.id);
                                }
                            }}
                        >
                            <i className="bi bi-trash-fill" />
                        </button>
                    </div>
                </div>

                {isEditing ? (
                    /* ── EDIT MODE ── */
                    <>
                        <div className="d-flex flex-column flex-md-row gap-3 mb-3">
                            <ExerciseEditPanel side="exerciseA" draft={draft.exerciseA} onChange={handleSideChange} />
                            <div className="superset-vs-divider align-self-center">VS</div>
                            <ExerciseEditPanel side="exerciseB" draft={draft.exerciseB} onChange={handleSideChange} />
                        </div>
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <label className="small text-light mb-0">
                                <i className="bi bi-hourglass-split me-1" />Riposo (s):
                            </label>
                            <input
                                type="number" min="0"
                                className="form-control form-control-sm gym-input"
                                style={{ width: '90px' }}
                                value={draft.rest}
                                onChange={(e) => setDraft((p) => ({ ...p, rest: e.target.value }))}
                            />
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-primary" onClick={handleSave}>
                                <i className="bi bi-check-lg me-1" />Salva
                            </button>
                            <button className="btn btn-sm btn-secondary" onClick={handleCancel}>
                                Annulla
                            </button>
                        </div>
                    </>
                ) : (
                    /* ── VIEW MODE ── */
                    <>
                        <div className="d-flex flex-column flex-md-row gap-3 mb-2">
                            <ExercisePanel
                                ex={{ ...entry.exerciseA, _records: recordsA }}
                                side="exerciseA"
                                trackingEnabled={trackingEnabled}
                                onRecordLoad={() => recordLoad(entry.exerciseA.id, entry.exerciseA.load)}
                                showGraph={showGraphA}
                                onToggleGraph={(e) => setShowGraphA(e.target.checked)}
                            />
                            <div className="superset-vs-divider align-self-center">VS</div>
                            <ExercisePanel
                                ex={{ ...entry.exerciseB, _records: recordsB }}
                                side="exerciseB"
                                trackingEnabled={trackingEnabled}
                                onRecordLoad={() => recordLoad(entry.exerciseB.id, entry.exerciseB.load)}
                                showGraph={showGraphB}
                                onToggleGraph={(e) => setShowGraphB(e.target.checked)}
                            />
                        </div>
                        <div className="small text-light mt-2">
                            <i className="bi bi-hourglass-split me-1" />Riposo: {entry.rest}s
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default SupersetCard;
