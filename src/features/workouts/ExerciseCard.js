// features/workouts/ExerciseCard.js — Fully editable card for a single exercise.
// View mode shows stats; edit mode exposes all fields inline.
// When tracking is enabled shows Record load button + optional Chart.js progress graph.

import React, { useState } from 'react';
import ProgressChart from '../progress/ProgressChart';
import { useProgressContext } from '../../context/ProgressContext';

const toDraft = (ex) => ({
    name: ex.name,
    sets: ex.sets,
    reps: ex.reps,
    load: ex.load,
    rest: ex.rest,
    notes: ex.notes ?? '',
});

function ExerciseCard({ exercise, planId, onUpdate, onDelete }) {
    const { trackingEnabled, progress, recordLoad } = useProgressContext();

    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(toDraft(exercise));
    const [showGraph, setShowGraph] = useState(false);

    const records = progress[exercise.id] ?? [];

    function handleSave() {
        onUpdate(planId, exercise.id, {
            name: draft.name.trim() || exercise.name,
            sets: Number(draft.sets),
            reps: Number(draft.reps),
            load: Number(draft.load),
            rest: Number(draft.rest),
            notes: draft.notes,
        });
        setIsEditing(false);
    }

    function handleCancel() {
        setDraft(toDraft(exercise));
        setIsEditing(false);
    }

    function handleKey(e) {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') handleCancel();
    }

    if (isEditing) {
        return (
            <div className="card exercise-card mb-2">
                <div className="card-body">
                    <div className="mb-2">
                        <input
                            autoFocus
                            className="form-control form-control-sm gym-input"
                            value={draft.name}
                            onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                            onKeyDown={handleKey}
                            placeholder="Nome esercizio"
                        />
                    </div>
                    <div className="row g-2 mb-2">
                        <div className="col-6 col-md-3">
                            <label className="form-label small text-light mb-1 opacity-75">Serie</label>
                            <input type="number" min="1" className="form-control form-control-sm gym-input"
                                value={draft.sets} onChange={(e) => setDraft((p) => ({ ...p, sets: e.target.value }))} onKeyDown={handleKey} />
                        </div>
                        <div className="col-6 col-md-3">
                            <label className="form-label small text-light mb-1 opacity-75">Ripetizioni</label>
                            <input type="number" min="1" className="form-control form-control-sm gym-input"
                                value={draft.reps} onChange={(e) => setDraft((p) => ({ ...p, reps: e.target.value }))} onKeyDown={handleKey} />
                        </div>
                        <div className="col-6 col-md-3">
                            <label className="form-label small text-light mb-1 opacity-75">Carico (kg)</label>
                            <input type="number" min="0" step="0.5" className="form-control form-control-sm gym-input"
                                value={draft.load} onChange={(e) => setDraft((p) => ({ ...p, load: e.target.value }))} onKeyDown={handleKey} />
                        </div>
                        <div className="col-6 col-md-3">
                            <label className="form-label small text-light mb-1 opacity-75">Riposo (s)</label>
                            <input type="number" min="0" className="form-control form-control-sm gym-input"
                                value={draft.rest} onChange={(e) => setDraft((p) => ({ ...p, rest: e.target.value }))} onKeyDown={handleKey} />
                        </div>
                    </div>
                    <div className="mb-3">
                        <textarea
                            className="form-control form-control-sm gym-input"
                            rows={2}
                            placeholder="Note..."
                            value={draft.notes}
                            onChange={(e) => setDraft((p) => ({ ...p, notes: e.target.value }))}
                        />
                    </div>
                    <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-primary" onClick={handleSave}>
                            <i className="bi bi-check-lg me-1" />Salva
                        </button>
                        <button className="btn btn-sm btn-secondary" onClick={handleCancel}>Annulla</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card exercise-card mb-2">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-1">
                    <strong className="text-white">{exercise.name}</strong>
                    <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-secondary" onClick={() => setIsEditing(true)} title="Modifica">
                            <i className="bi bi-pencil-fill" />
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => {
                            if (window.confirm(`Eliminare "${exercise.name}"?`)) onDelete(planId, exercise.id);
                        }} title="Elimina">
                            <i className="bi bi-trash-fill" />
                        </button>
                    </div>
                </div>

                <div className="d-flex flex-wrap gap-2 small text-light opacity-75 mb-1">
                    <span><i className="bi bi-layers me-1" />{exercise.sets} serie</span>
                    <span><i className="bi bi-arrow-repeat me-1" />{exercise.reps} rip.</span>
                    <span><i className="bi bi-box me-1" />{exercise.load} kg</span>
                    <span><i className="bi bi-hourglass-split me-1" />{exercise.rest}s riposo</span>
                </div>

                {exercise.notes ? (
                    <p className="small text-secondary fst-italic mb-1">
                        <i className="bi bi-sticky me-1" />{exercise.notes}
                    </p>
                ) : null}

                {trackingEnabled && (
                    <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
                        <button
                            className="btn btn-sm btn-success"
                            onClick={() => recordLoad(exercise.id, exercise.load)}
                            title="Registra carico odierno"
                        >
                            <i className="bi bi-plus-circle me-1" />Record load
                        </button>
                        <div className="form-check mb-0">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={`graph-${exercise.id}`}
                                checked={showGraph}
                                onChange={(e) => setShowGraph(e.target.checked)}
                            />
                            <label className="form-check-label small text-light" htmlFor={`graph-${exercise.id}`}>
                                Mostra grafico
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
                        <ProgressChart records={records} exerciseName={exercise.name} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ExerciseCard;
