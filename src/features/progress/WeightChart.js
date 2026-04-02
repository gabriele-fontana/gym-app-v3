// features/progress/WeightChart.js — Line chart for body weight over time.

import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

/** @param {{ weightLog: Array<{ date: string, weight: number }> }} props */
function WeightChart({ weightLog = [] }) {
    const data = {
        labels: weightLog.map((e) => new Date(e.date).toLocaleDateString('it-IT')),
        datasets: [
            {
                label: 'Peso (kg)',
                data: weightLog.map((e) => e.weight),
                borderColor: '#20c997',
                backgroundColor: 'rgba(32,201,151,0.15)',
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

    if (!weightLog.length) return <p className="text-light small opacity-75">Nessun dato di peso registrato.</p>;

    return <Line data={data} options={options} />;
}

export default WeightChart;
