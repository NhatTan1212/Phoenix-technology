import React from 'react';
import { Bar } from 'react-chartjs-2';
import { subDays, format, set } from 'date-fns';

import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    TimeScale,

    PointElement,
    defaults, Title
} from 'chart.js';

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    TimeScale,
    Tooltip,
    Legend,
    PointElement, Title
)

defaults.maintainAspectRatio = false
defaults.responsive = true

const ChartTotal = () => {
    const labels = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i); // Trừ đi 6 - i để tính ngược lại từ ngày hôm nay
        return format(date, 'yyyy-MM-dd'); // Format ngày theo định dạng mong muốn
    });

    const dataTotal = {
        labels: labels,
        datasets: [{
            label: 'Tổng doanh thu',
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
            ],
            borderWidth: 1,
            borderRadius: 5,
        }],
    };

    const optionsTotal = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            title: {
                display: true,
                align: 'start',
                text: "Tổng doanh thu",
                font: {
                    size: '20px'
                }
            },
            legend: {
                display: true,
                position: 'top',
                align: "end"
            },

        }
    };

    return (
        <Bar
            data={dataTotal}
            options={optionsTotal}
        />
    );
};

export default ChartTotal;
