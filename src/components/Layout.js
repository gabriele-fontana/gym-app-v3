// components/Layout.js — Shell layout component.
// Renders the Sidebar and Header around the current page content.
// Handles hamburger toggle state for mobile.

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="gym-wrapper">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="d-flex flex-column flex-grow-1">
                <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
                <main className="gym-main">{children}</main>
            </div>
        </div>
    );
}

export default Layout;
