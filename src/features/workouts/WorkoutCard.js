// features/workouts/WorkoutCard.js — Collapsible card for a workout plan.
// Header: name, exercise count, inline rename, delete.
// Body: list of ExerciseCards / SupersetCards + add forms.

import React, { useState } from 'react';
import ExerciseCard from './ExerciseCard';
import SupersetCard from './SupersetCard';
import { useWorkoutContext } from '../../context/WorkoutContext';

const EMPTY_EXERCISE = { name: '', sets: 3, reps: 10, load: 0, rest: 60 };
const EMPTY_SUPERSET = {
    exerciseA: { name: '', sets: 3, reps: 10, load: 0 },
    exerciseB: { name: '', sets: 3, reps: 10, load: 0 },
    rest: 60,
};

function WorkoutCard({ plan }) {
    const { updatePlan, deletePlan, addExercise, updateExercise, deleteExercise, addSuperset } = useWorkoutContext();

    const [isOpen, setIsOpen] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [nameInput, setNameInput] = useState(plan.name);
    // 'none' | 'exercise' | 'superset'
    const [addMode, setAddMode] = useState('none');
    const [newEx, setNewEx] = useState(EMPTY_EXERCISE);
    const [newSS, setNewSS] = useState(EMPTY_SUPERSET);

    function handleRename() {
        const trimmed = nameInput.trim();
        if (trimmed) updatePlan(plan.id, { name: trimmed });
        setIsRenaming(false);
    }

    function handleAddExercise() {
        if (!newEx.name.trim()) return;
        addExercise(plan.id, {
            name: newEx.name.trim(),
            sets: Number(newEx.sets),
            reps: Number(newEx.reps),
            load: Number(newEx.load),
            rest: Number(newEx.rest),
            notes: '',
        });
        setNewEx(EMPTY_EXERCISE);
        setAddMode('none');
    }

    function handleAddSuperset() {
        if (!newSS.exerciseA.name.trim() || !newSS.exerciseB.name.trim()) return;
        addSuperset(plan.id, {
            exerciseA: {
                name: newSS.exerciseA.name.trim(),
                sets: Number(newSS.exerciseA.sets),
                reps: Number(newSS.exerciseA.reps),
                load: Number(newSS.exerciseA.load),
            },
            exerciseB: {
                name: newSS.exerciseB.name.trim(),
                sets: Number(newSS.exerciseB.sets),
                reps: Number(newSS.exerciseB.reps),
                load: Number(newSS.exerciseB.load),
            },
            rest: Number(newSS.rest),
        });
        setNewSS(EMPTY_SUPERSET);
        setAddMode('none');
    }

    function cancelAdd() {
        setAddMode('none');
        setNewEx(EMPTY_EXERCISE);
        setNewSS(EMPTY_SUPERSET);
    }

    // Helper for updating a field on one side of the superset form
    function setSupersetSide(side, field, value) {
        setNewSS((prev) => ({ ...prev, [side]: { ...prev[side], [field]: value } }));
    }

    const headerStyle = { backgroundColor: 'var(--gym-surface)', borderColor: 'var(--gym-border)' };
    const count = plan.exercises.length;

    return (
        <div className="card exercise-card mb-3">
            {/* Header */}
            <div className="card-header d-flex align-items-center gap-2 flex-wrap" style={headerStyle}>
                <button
                    className="btn btn-sm btn-link text-light p-0"
                    onClick={() => setIsOpen((v) => !v)}
                    title={isOpen ? 'Comprimi' : 'Espandi'}
                >
                    <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`} />
                </button>

                {isRenaming ? (
                    <>
                        <input
                            autoFocus
                            className="form-control form-control-sm gym-input flex-grow-1"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleRename();
                                if (e.key === 'Escape') setIsRenaming(false);
                            }}
                        />
                        <button className="btn btn-sm btn-primary" onClick={handleRename} title="Conferma">
                            <i className="bi bi-check-lg" />
                        </button>
                        <button className="btn btn-sm btn-secondary" onClick={() => setIsRenaming(false)} title="Annulla">
                            <i className="bi bi-x-lg" />
                        </button>
                    </>
                ) : (
                    <>
                        <span
                            className="fw-semibold text-white flex-grow-1"
                            role="button"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setIsOpen((v) => !v)}
                        >
                            {plan.name}
                        </span>
                        <span className="badge bg-secondary">
                            {count} {count === 1 ? 'esercizio' : 'esercizi'}
                        </span>
                        <button
                            className="btn btn-sm btn-secondary"
                            title="Rinomina"
                            onClick={() => { setNameInput(plan.name); setIsRenaming(true); }}
                        >
                            <i className="bi bi-pencil-fill" />
                        </button>
                        <button
                            className="btn btn-sm btn-danger"
                            title="Elimina piano"
                            onClick={() => {
                                if (window.confirm(`Eliminare il piano "${plan.name}"?`)) deletePlan(plan.id);
                            }}
                        >
                            <i className="bi bi-trash-fill" />
                        </button>
                    </>
                )}
            </div>

            {/* Collapsible body */}
            {isOpen && (
                <div className="card-body">
                    {plan.exercises.length === 0 && addMode === 'none' && (
                        <p className="text-light small opacity-75 mb-3">Nessun esercizio. Aggiungine uno!</p>
                    )}

                    {plan.exercises.map((entry) =>
                        entry.type === 'superset' ? (
                            <SupersetCard key={entry.id} entry={entry} planId={plan.id} />
                        ) : (
                            <ExerciseCard
                                key={entry.id}
                                exercise={entry}
                                planId={plan.id}
                                onUpdate={updateExercise}
                                onDelete={deleteExercise}
                            />
                        )
                    )}

                    {/* ── Add exercise form ── */}
                    {addMode === 'exercise' && (
                        <div className="card exercise-card mt-2">
                            <div className="card-body">
                                <p className="small text-light fw-semibold opacity-75 mb-2">Nuovo esercizio</p>
                                <div className="row g-2 mb-2">
                                    <div className="col-12">
                                        <input
                                            autoFocus
                                            className="form-control form-control-sm gym-input"
                                            placeholder="Nome esercizio *"
                                            value={newEx.name}
                                            onChange={(e) => setNewEx((p) => ({ ...p, name: e.target.value }))}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleAddExercise();
                                                if (e.key === 'Escape') cancelAdd();
                                            }}
                                        />
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <label className="form-label small text-light mb-1 opacity-75">Serie</label>
                                        <input type="number" min="1" className="form-control form-control-sm gym-input"
                                            value={newEx.sets} onChange={(e) => setNewEx((p) => ({ ...p, sets: e.target.value }))} />
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <label className="form-label small text-light mb-1 opacity-75">Rip.</label>
                                        <input type="number" min="1" className="form-control form-control-sm gym-input"
                                            value={newEx.reps} onChange={(e) => setNewEx((p) => ({ ...p, reps: e.target.value }))} />
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <label className="form-label small text-light mb-1 opacity-75">Carico (kg)</label>
                                        <input type="number" min="0" step="0.5" className="form-control form-control-sm gym-input"
                                            value={newEx.load} onChange={(e) => setNewEx((p) => ({ ...p, load: e.target.value }))} />
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <label className="form-label small text-light mb-1 opacity-75">Riposo (s)</label>
                                        <input type="number" min="0" className="form-control form-control-sm gym-input"
                                            value={newEx.rest} onChange={(e) => setNewEx((p) => ({ ...p, rest: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-primary" onClick={handleAddExercise}>
                                        <i className="bi bi-plus-lg me-1" />Aggiungi
                                    </button>
                                    <button className="btn btn-sm btn-secondary" onClick={cancelAdd}>Annulla</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Add superset form ── */}
                    {addMode === 'superset' && (
                        <div className="card superset-card mt-2">
                            <div className="card-body">
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <span className="superset-badge">
                                        <i className="bi bi-intersect me-1" />Nuovo superset
                                    </span>
                                </div>
                                <div className="d-flex flex-column flex-md-row gap-3 mb-3">
                                    {/* Exercise A */}
                                    <div className="flex-fill">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <span className="superset-letter superset-letter--a">A</span>
                                            <input
                                                autoFocus
                                                className="form-control form-control-sm gym-input flex-grow-1"
                                                placeholder="Esercizio A *"
                                                value={newSS.exerciseA.name}
                                                onChange={(e) => setSupersetSide('exerciseA', 'name', e.target.value)}
                                            />
                                        </div>
                                        <div className="row g-1">
                                            <div className="col-4">
                                                <input type="number" min="1" className="form-control form-control-sm gym-input" placeholder="Serie"
                                                    value={newSS.exerciseA.sets} onChange={(e) => setSupersetSide('exerciseA', 'sets', e.target.value)} />
                                            </div>
                                            <div className="col-4">
                                                <input type="number" min="1" className="form-control form-control-sm gym-input" placeholder="Rip."
                                                    value={newSS.exerciseA.reps} onChange={(e) => setSupersetSide('exerciseA', 'reps', e.target.value)} />
                                            </div>
                                            <div className="col-4">
                                                <input type="number" min="0" step="0.5" className="form-control form-control-sm gym-input" placeholder="kg"
                                                    value={newSS.exerciseA.load} onChange={(e) => setSupersetSide('exerciseA', 'load', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="superset-vs-divider align-self-center">VS</div>

                                    {/* Exercise B */}
                                    <div className="flex-fill">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <span className="superset-letter superset-letter--b">B</span>
                                            <input
                                                className="form-control form-control-sm gym-input flex-grow-1"
                                                placeholder="Esercizio B *"
                                                value={newSS.exerciseB.name}
                                                onChange={(e) => setSupersetSide('exerciseB', 'name', e.target.value)}
                                            />
                                        </div>
                                        <div className="row g-1">
                                            <div className="col-4">
                                                <input type="number" min="1" className="form-control form-control-sm gym-input" placeholder="Serie"
                                                    value={newSS.exerciseB.sets} onChange={(e) => setSupersetSide('exerciseB', 'sets', e.target.value)} />
                                            </div>
                                            <div className="col-4">
                                                <input type="number" min="1" className="form-control form-control-sm gym-input" placeholder="Rip."
                                                    value={newSS.exerciseB.reps} onChange={(e) => setSupersetSide('exerciseB', 'reps', e.target.value)} />
                                            </div>
                                            <div className="col-4">
                                                <input type="number" min="0" step="0.5" className="form-control form-control-sm gym-input" placeholder="kg"
                                                    value={newSS.exerciseB.load} onChange={(e) => setSupersetSide('exerciseB', 'load', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Shared rest */}
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <label className="small text-light mb-0">
                                        <i className="bi bi-hourglass-split me-1" />Riposo (s):
                                    </label>
                                    <input
                                        type="number" min="0"
                                        className="form-control form-control-sm gym-input"
                                        style={{ width: '90px' }}
                                        value={newSS.rest}
                                        onChange={(e) => setNewSS((p) => ({ ...p, rest: e.target.value }))}
                                    />
                                </div>

                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-primary" onClick={handleAddSuperset}>
                                        <i className="bi bi-plus-lg me-1" />Aggiungi superset
                                    </button>
                                    <button className="btn btn-sm btn-secondary" onClick={cancelAdd}>Annulla</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Add buttons (shown when no form is open) ── */}
                    {addMode === 'none' && (
                        <div className="d-flex gap-2 mt-2">
                            <button className="btn btn-sm btn-primary" onClick={() => setAddMode('exercise')}>
                                <i className="bi bi-plus-lg me-1" />Esercizio
                            </button>
                            <button className="btn btn-sm btn-outline-info" onClick={() => setAddMode('superset')}>
                                <i className="bi bi-intersect me-1" />Superset
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default WorkoutCard;
