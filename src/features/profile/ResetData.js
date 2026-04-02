// features/profile/ResetData.js — "Cancella tutti i dati" section in the Profile page.
// Renders a danger button that clears all localStorage keys after a confirmation dialog.

import React from 'react';
import { clearAllData } from '../../services/localStorageService';

function ResetData() {
    function handleReset() {
        if (window.confirm('Sei sicuro? Tutti i dati verranno eliminati definitivamente.')) {
            clearAllData();
            window.location.reload();
        }
    }

    return (
        <div>
            <button className="btn btn-danger" onClick={handleReset}>
                <i className="bi bi-trash3-fill me-2" />
                Cancella tutti i dati
            </button>
        </div>
    );
}

export default ResetData;
