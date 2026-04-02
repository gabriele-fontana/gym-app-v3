// pages/Workout.js — Active workout session page.
// Flow: select plan → execute exercises set by set → rest countdown → save session.
// Supports both regular exercises and supersets.

import React, { useState, useEffect } from 'react';
import { useWorkoutContext } from '../context/WorkoutContext';
import { useCalendar } from '../hooks/useCalendar';

// ── Helpers ────────────────────────────────────────────────────────────────────

function totalSets(entry) {
    if (entry.type === 'superset') return Number(entry.exerciseA.sets);
    return Number(entry.sets);
}

function entryDisplayName(entry) {
    if (entry.type === 'superset') return `${entry.exerciseA.name} + ${entry.exerciseB.name}`;
    return entry.name;
}

// ── Plan selection screen ──────────────────────────────────────────────────────

function SelectPlanScreen({ plans, onStart }) {
    return (
        <div>
            <h2 className="mb-4">
                <i className="bi bi-lightning-fill me-2 text-primary" />
                Inizia Workout
            </h2>

            {plans.length === 0 ? (
                <div className="text-center py-5">
                    <i className="bi bi-journal-x display-3 text-secondary mb-3 d-block" />
                    <p className="text-light opacity-75">
                        Nessun piano trovato.<br />
                        Creane uno in <strong>Piani</strong> prima di iniziare.
                    </p>
                </div>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {plans.map((plan) => (
                        <div key={plan.id} className="card exercise-card">
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="fw-semibold text-white mb-1">{plan.name}</p>
                                    <span className="badge bg-secondary">
                                        {plan.exercises.length}{' '}
                                        {plan.exercises.length === 1 ? 'elemento' : 'elementi'}
                                    </span>
                                </div>
                                <button
                                    className="btn btn-primary px-4"
                                    onClick={() => onStart(plan)}
                                    disabled={plan.exercises.length === 0}
                                >
                                    <i className="bi bi-play-fill me-1" />Inizia
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Exercise info card (read-only) ────────────────────────────────────────────

function ExerciseStat({ label, ex }) {
    return (
        <div className="superset-panel flex-fill">
            <div className="d-flex align-items-center gap-2 mb-1">
                <span className={`superset-letter superset-letter--${label.toLowerCase()}`}>{label}</span>
                <strong className="text-white">{ex.name}</strong>
            </div>
            <div className="d-flex flex-wrap gap-2 small text-light opacity-75">
                <span><i className="bi bi-layers me-1" />{ex.sets} serie</span>
                <span><i className="bi bi-arrow-repeat me-1" />{ex.reps} rip.</span>
                <span><i className="bi bi-box me-1" />{ex.load} kg</span>
            </div>
        </div>
    );
}

function ExerciseInfo({ entry }) {
    if (entry.type === 'superset') {
        return (
            <>
                <div className="mb-2">
                    <span className="superset-badge">
                        <i className="bi bi-intersect me-1" />Superset
                    </span>
                </div>
                <div className="d-flex flex-column flex-md-row gap-3">
                    <ExerciseStat label="A" ex={entry.exerciseA} />
                    <div className="superset-vs-divider align-self-center">VS</div>
                    <ExerciseStat label="B" ex={entry.exerciseB} />
                </div>
                <p className="small text-light opacity-75 mt-2 mb-0">
                    <i className="bi bi-hourglass-split me-1" />Riposo: {entry.rest}s
                </p>
            </>
        );
    }

    return (
        <>
            <h4 className="text-white mb-2">{entry.name}</h4>
            <div className="d-flex flex-wrap gap-3 mb-1">
                <span className="text-light">
                    <i className="bi bi-layers me-1 text-primary" />{entry.sets} serie
                </span>
                <span className="text-light">
                    <i className="bi bi-arrow-repeat me-1 text-primary" />{entry.reps} rip.
                </span>
                <span className="text-light">
                    <i className="bi bi-box me-1 text-primary" />{entry.load} kg
                </span>
            </div>
            {entry.notes && (
                <p className="small text-secondary fst-italic mb-1">
                    <i className="bi bi-sticky me-1" />{entry.notes}
                </p>
            )}
            <p className="small text-light opacity-75 mb-0">
                <i className="bi bi-hourglass-split me-1" />Riposo: {entry.rest}s
            </p>
        </>
    );
}

// ── Active workout screen ──────────────────────────────────────────────────────

function ActiveScreen({ entry, setIndex, planName, entryIndex, totalEntries, onNextSet, onAbort }) {
    const sets = totalSets(entry);
    const isLastSet = setIndex + 1 >= sets;
    const isLastEntry = entryIndex + 1 >= totalEntries;
    const isLastOverall = isLastSet && isLastEntry;

    return (
        <div>
            {/* Top bar */}
            <div className="d-flex align-items-start justify-content-between mb-3">
                <div>
                    <p className="text-light small mb-0 opacity-75">{planName}</p>
                    <p className="text-light small mb-0 opacity-75">
                        Esercizio {entryIndex + 1} / {totalEntries}
                    </p>
                </div>
                <button className="btn btn-sm btn-outline-danger" onClick={onAbort}>
                    <i className="bi bi-x-lg me-1" />Abbandona
                </button>
            </div>

            {/* Set progress */}
            <div className="card exercise-card mb-3 p-3 text-center">
                <div className="display-5 fw-bold text-white">
                    {setIndex + 1}
                    <span className="fs-5 text-light opacity-50"> / {sets}</span>
                </div>
                <div className="small text-light opacity-75 mb-2">serie</div>
                {/* Dot indicators */}
                <div className="d-flex justify-content-center gap-1">
                    {Array.from({ length: sets }).map((_, i) => (
                        <span
                            key={i}
                            className="rounded-circle d-inline-block"
                            style={{
                                width: 10, height: 10,
                                backgroundColor: i < setIndex ? '#198754' : i === setIndex ? '#0d6efd' : '#444',
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Exercise info */}
            <div className="card exercise-card mb-4 p-3">
                <ExerciseInfo entry={entry} />
            </div>

            {/* Action */}
            <div className="d-grid">
                <button className="btn btn-primary btn-lg" onClick={onNextSet}>
                    {isLastOverall
                        ? <><i className="bi bi-flag-fill me-2" />Fine workout</>
                        : isLastSet
                            ? <><i className="bi bi-skip-forward-fill me-2" />Prossimo esercizio</>
                            : <><i className="bi bi-check-lg me-2" />Prossima serie</>
                    }
                </button>
            </div>
        </div>
    );
}

// ── Rest countdown screen ──────────────────────────────────────────────────────

function RestScreen({ timeLeft, totalTime, onSkip, nextEntry, nextSetIndex, nextSets }) {
    const pct = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const timeStr = mins > 0 ? `${mins}:${String(secs).padStart(2, '0')}` : `${secs}s`;
    const isUrgent = timeLeft <= 5;

    return (
        <div className="text-center py-3">
            <p className="text-light mb-4 opacity-75 fs-5">Riposo</p>

            {/* Circular countdown */}
            <div className="mb-3">
                <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center border border-3 mx-auto"
                    style={{
                        width: 150, height: 150,
                        borderColor: isUrgent ? '#dc3545' : '#0d6efd',
                        background: 'var(--gym-surface)',
                        transition: 'border-color 0.3s',
                    }}
                >
                    <span
                        className="display-5 fw-bold"
                        style={{ color: isUrgent ? '#dc3545' : '#0d6efd', transition: 'color 0.3s' }}
                    >
                        {timeStr}
                    </span>
                </div>

                {/* Progress bar */}
                <div className="progress mt-3 mx-auto" style={{ height: 6, maxWidth: 200 }}>
                    <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                            width: `${pct}%`,
                            backgroundColor: isUrgent ? '#dc3545' : '#0d6efd',
                            transition: 'width 0.9s linear, background-color 0.3s',
                        }}
                    />
                </div>
            </div>

            {/* Next up preview */}
            {nextEntry && (
                <div className="card exercise-card mb-4 mx-auto text-start" style={{ maxWidth: 340 }}>
                    <div className="card-body py-2">
                        <p className="small text-light opacity-75 mb-1">Prossimo:</p>
                        <p className="fw-semibold text-white mb-0">
                            {entryDisplayName(nextEntry)}
                            <span className="text-light opacity-50 fw-normal">
                                {' '}— serie {nextSetIndex + 1}/{nextSets}
                            </span>
                        </p>
                    </div>
                </div>
            )}

            <button className="btn btn-outline-secondary" onClick={onSkip}>
                <i className="bi bi-skip-forward-fill me-1" />Salta riposo
            </button>
        </div>
    );
}

// ── Finished screen ────────────────────────────────────────────────────────────

function FinishedScreen({ planName, completedNames, onSave, onDiscard }) {
    return (
        <div className="text-center py-3">
            <i className="bi bi-trophy-fill display-2 text-warning mb-3 d-block" />
            <h2 className="text-white mb-1">Workout completato!</h2>
            <p className="text-light opacity-75 mb-4">{planName}</p>

            <div className="card exercise-card mb-4 mx-auto text-start" style={{ maxWidth: 400 }}>
                <div className="card-body">
                    <p className="small text-light opacity-75 fw-semibold mb-2">Esercizi completati:</p>
                    <ul className="list-unstyled mb-0">
                        {completedNames.map((name, i) => (
                            <li
                                key={i}
                                className="text-light py-1 d-flex align-items-center gap-2 border-bottom border-secondary"
                                style={{ borderColor: 'var(--gym-border) !important' }}
                            >
                                <i className="bi bi-check-circle-fill text-success small flex-shrink-0" />
                                {name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                <button className="btn btn-success btn-lg" onClick={onSave}>
                    <i className="bi bi-calendar-check me-2" />Salva sessione
                </button>
                <button className="btn btn-outline-secondary" onClick={onDiscard}>
                    <i className="bi bi-x-lg me-1" />Esci senza salvare
                </button>
            </div>
        </div>
    );
}

// ── Main component ─────────────────────────────────────────────────────────────

function Workout() {
    const { plans } = useWorkoutContext();
    const { addSession } = useCalendar();

    const [phase, setPhase] = useState('selecting'); // 'selecting' | 'active' | 'resting' | 'finished'
    const [activePlan, setActivePlan] = useState(null);
    const [entryIndex, setEntryIndex] = useState(0);
    const [setIndex, setSetIndex] = useState(0);
    const [restTimeLeft, setRestTimeLeft] = useState(0);
    const [restTotalTime, setRestTotalTime] = useState(0);
    const [restType, setRestType] = useState('set'); // 'set' = between sets | 'exercise' = between exercises
    const [completedNames, setCompletedNames] = useState([]);

    // Rest countdown — advances automatically when it reaches 0
    useEffect(() => {
        if (phase !== 'resting') return;

        if (restTimeLeft === 0) {
            if (restType === 'set') {
                setSetIndex((i) => i + 1);
            } else {
                setEntryIndex((i) => i + 1);
                setSetIndex(0);
            }
            setPhase('active');
            return;
        }

        const id = setTimeout(() => setRestTimeLeft((t) => t - 1), 1000);
        return () => clearTimeout(id);
    }, [phase, restTimeLeft, restType]);

    function startWorkout(plan) {
        setActivePlan(plan);
        setEntryIndex(0);
        setSetIndex(0);
        setCompletedNames([]);
        setPhase('active');
    }

    function currentEntry() {
        return activePlan?.exercises[entryIndex] ?? null;
    }

    function handleNextSet() {
        const entry = currentEntry();
        if (!entry) return;
        const sets = totalSets(entry);
        const restSecs = Number(entry.rest ?? 60);
        const isLastSet = setIndex + 1 >= sets;
        const isLastEntry = entryIndex + 1 >= activePlan.exercises.length;

        if (isLastSet && isLastEntry) {
            setCompletedNames((prev) => [...prev, entryDisplayName(entry)]);
            setPhase('finished');
        } else if (isLastSet) {
            setCompletedNames((prev) => [...prev, entryDisplayName(entry)]);
            setRestType('exercise');
            setRestTotalTime(restSecs);
            setRestTimeLeft(restSecs);
            setPhase('resting');
        } else {
            setRestType('set');
            setRestTotalTime(restSecs);
            setRestTimeLeft(restSecs);
            setPhase('resting');
        }
    }

    function handleSaveSession() {
        const date = new Date().toISOString().split('T')[0];
        addSession(date, {
            planId: activePlan.id,
            planName: activePlan.name,
            date,
            exercises: completedNames,
        });
        setPhase('selecting');
        setActivePlan(null);
    }

    function handleDiscard() {
        setPhase('selecting');
        setActivePlan(null);
    }

    // ── Render phases ──

    if (phase === 'selecting') {
        return <SelectPlanScreen plans={plans} onStart={startWorkout} />;
    }

    if (phase === 'finished') {
        return (
            <FinishedScreen
                planName={activePlan.name}
                completedNames={completedNames}
                onSave={handleSaveSession}
                onDiscard={handleDiscard}
            />
        );
    }

    const entry = currentEntry();

    if (phase === 'resting') {
        const nextIsNextSet = restType === 'set';
        const nextSetIdx = nextIsNextSet ? setIndex + 1 : 0;
        const nextEntryIdx = nextIsNextSet ? entryIndex : entryIndex + 1;
        const nextEntry = activePlan.exercises[nextEntryIdx] ?? null;
        const nextSets = nextEntry ? totalSets(nextEntry) : 0;

        return (
            <RestScreen
                timeLeft={restTimeLeft}
                totalTime={restTotalTime}
                onSkip={() => setRestTimeLeft(0)}
                nextEntry={nextEntry}
                nextSetIndex={nextSetIdx}
                nextSets={nextSets}
            />
        );
    }

    // phase === 'active'
    return (
        <ActiveScreen
            entry={entry}
            setIndex={setIndex}
            planName={activePlan.name}
            entryIndex={entryIndex}
            totalEntries={activePlan.exercises.length}
            onNextSet={handleNextSet}
            onAbort={handleDiscard}
        />
    );
}

export default Workout;
