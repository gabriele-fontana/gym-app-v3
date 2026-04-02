// components/Sidebar.js — Navigation sidebar.
// Shows links to EditPlans, Workout, Calendar, Profile.
// Collapses on mobile; controlled by isOpen prop.
// Uses Bootstrap nav classes and Bootstrap Icons for link icons.

import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
    { to: '/plans', icon: 'bi-journal-text', label: 'Piani' },
    { to: '/workout', icon: 'bi-lightning-fill', label: 'Workout' },
    { to: '/calendar', icon: 'bi-calendar3', label: 'Calendario' },
    { to: '/profile', icon: 'bi-person-circle', label: 'Profilo' },
];

function Sidebar({ isOpen, onClose }) {
    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none"
                    style={{ zIndex: 1040 }}
                    onClick={onClose}
                />
            )}

            <nav className={`gym-sidebar d-flex flex-column p-3 ${isOpen ? 'open' : ''}`}>
                <span className="fs-5 fw-bold text-white mb-4 px-2">
                    <i className="bi bi-activity me-2 text-primary" />
                    Gym App
                </span>
                <ul className="nav nav-pills flex-column gap-1">
                    {links.map(({ to, icon, label }) => (
                        <li key={to} className="nav-item">
                            <NavLink
                                to={to}
                                className={({ isActive }) =>
                                    `nav-link text-white ${isActive ? 'active' : ''}`
                                }
                                onClick={onClose}
                            >
                                <i className={`bi ${icon} me-2`} />
                                {label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
}

export default Sidebar;
