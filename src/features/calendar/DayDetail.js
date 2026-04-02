// features/calendar/DayDetail.js — Detail panel for a selected calendar day.
// Session exists: shows plan name + exercise list + delete button.
// No session: dropdown to assign an existing plan.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function fmt(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString('it-IT', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
}

/**
 * @param {{
 *   date: string,
 *   session: object|undefined,
 *   plans: object[],
 *   onAssign: Function,
 *   onRemove: Function,
 *   onClose: Function,
 * }} props
 */
function DayDetail({ date, session, plans, onAssign, onRemove, onClose }) {
    const [selectedPlanId, setSelectedPlanId] = useState('');

    function handleAssign() {
        const plan = plans.find((p) => p.id === selectedPlanId);
        if (!plan) return;
        onAssign(date, plan);
        setSelectedPlanId('');
    }

    return (
        <div className="card exercise-card mt-3">
            <div className="card-body">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <p className="small text-light opacity-75 mb-0">Dettaglio giorno</p>
                        <p className="fw-semibold text-white mb-0" style={{ textTransform: 'capitalize' }}>
                            {fmt(date)}
                        </p>
                    </div>
                    <button className="btn btn-sm btn-dark" onClick={onClose} title="Chiudi">
                        <i className="bi bi-x-lg" />
                    </button>
                </div>

                {session ? (
                    /* ── Session exists ── */
                    <>
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <i className="bi bi-lightning-fill text-primary" />
                            <strong className="text-white">{session.planName}</strong>
                        </div>

                        {Array.isArray(session.exercises) && session.exercises.length > 0 && (
                            <ul className="list-unstyled mb-3">
                                {session.exercises.map((name, i) => (
                                    <li key={i} className="small text-light opacity-75 py-1 d-flex gap-2 align-items-center
                                                border-bottom border-secondary">
                                        <i className="bi bi-check-circle-fill text-success small flex-shrink-0" />
                                        {name}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                                if (window.confirm('Rimuovere questa sessione?')) onRemove(date);
                            }}
                        >
                            <i className="bi bi-trash me-1" />Rimuovi sessione
                        </button>
                    </>
                ) : (
                    /* ── No session ── */
                    <>
                        <p className="small text-light opacity-75 mb-2">Nessun allenamento registrato.</p>

                        {plans.length > 0 ? (
                            <div className="d-flex gap-2 align-items-center flex-wrap">
                                <select
                                    className="form-select form-select-sm gym-input flex-grow-1"
                                    value={selectedPlanId}
                                    onChange={(e) => setSelectedPlanId(e.target.value)}
                                >
                                    <option value="">Seleziona piano…</option>
                                    {plans.map((p) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                                <button
                                    className="btn btn-sm btn-primary"
                                    disabled={!selectedPlanId}
                                    onClick={handleAssign}
                                >
                                    <i className="bi bi-plus-lg me-1" />Assegna
                                </button>
                            </div>
                        ) : (
                            <p className="small text-light opacity-75">
                                Nessun piano disponibile.{' '}
                                <Link to="/plans" className="text-primary">Creane uno</Link>.
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default DayDetail;
