// features/progress/ProgressChart.js — Line chart showing load progression over time
// for a single exercise. Built with chart.js + react-chartjs-2.
// Receives an array of { date, load } records as props.

import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

/**
 * @param {{ records: Array<{ date: string, load: number }>, exerciseName: string }} props
 */
function ProgressChart({ records = [], exerciseName = '' }) {
    const data = {
        labels: records.map((r) => new Date(r.date).toLocaleDateString('it-IT')),
        datasets: [
            {
                label: `${exerciseName} (kg)`,
                data: records.map((r) => r.load),
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(13,110,253,0.15)',
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            x: { ticks: { color: '#aaa' }, grid: { color: '#2c2c2c' } },
            y: { ticks: { color: '#aaa' }, grid: { color: '#2c2c2c' } },
        },
    };

    if (!records.length) return <p className="text-muted small">Nessun dato registrato.</p>;

    return <Line data={data} options={options} />;
}

export default ProgressChart;
