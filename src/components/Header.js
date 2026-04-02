// components/Header.js — Top header bar.
// Shows the app title and a hamburger button for mobile sidebar toggle.

import React from 'react';

function Header({ onToggleSidebar }) {
    return (
        <header className="d-flex align-items-center px-3 py-2 border-bottom"
            style={{ backgroundColor: 'var(--gym-surface)', borderColor: 'var(--gym-border) !important' }}>
            <button
                className="btn btn-sm btn-dark d-md-none me-3"
                onClick={onToggleSidebar}
                aria-label="Toggle sidebar"
            >
                <i className="bi bi-list fs-5" />
            </button>
            <span className="fw-semibold text-white">
                <i className="bi bi-activity text-primary me-2" />
                Gym App
            </span>
        </header>
    );
}

export default Header;
