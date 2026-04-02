// features/profile/DataExport.js — "Esporta dati" section in the Profile page.
// Renders a button that triggers the CSV download via csvExport utility.

import React from 'react';
import { exportAllDataAsCSV } from '../../utils/csvExport';

function DataExport() {
    return (
        <div className="mb-3">
            <button className="btn btn-primary" onClick={exportAllDataAsCSV}>
                <i className="bi bi-download me-2" />
                Esporta dati CSV
            </button>
        </div>
    );
}

export default DataExport;
