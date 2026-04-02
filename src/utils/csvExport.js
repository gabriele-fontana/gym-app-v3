// utils/csvExport.js — Generates and triggers download of a CSV file
// containing the user's gym data (plans, sessions, progress, weight log).

import { getAllData } from '../services/localStorageService';

/**
 * Triggers a browser download of all gym data serialised as CSV.
 */
export function exportAllDataAsCSV() {
    const data = getAllData();
    const rows = [['section', 'key', 'value']];

    Object.entries(data).forEach(([section, value]) => {
        rows.push([section, '', JSON.stringify(value)]);
    });

    const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gym-data-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}
