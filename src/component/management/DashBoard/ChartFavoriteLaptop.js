import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, TimeScale, PointElement, defaults, Title } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, TimeScale, Tooltip, Legend, PointElement, Title)

defaults.maintainAspectRatio = false
defaults.responsive = true

const images = [
    'http://localhost:8000/upload/1690807304036-2320_laptopaz_acer_nitro_5_an515_57_1.jpg',
    'http://localhost:8000/upload/1690807275761-29171-laptop_asus_gaming_rog.jpg',
    'http://localhost:8000/upload/1705125871316-dell-vostro-i5-1.jpg',
    'http://localhost:8000/upload/1690802127060-acer_nitro5_515_56.jpg',
    'http://localhost:8000/upload/1690807519733-macbookpro14.jpg'
]
    .map(png => {
        const image = new Image();
        image.src = png;
        return image;
    });

const ChartFavoriteLaptop = () => {
    const labels = ['laptop bán chạy']

    const dataTotal = {
        labels: labels,
        datasets: [
            {
                label: 'acer',
                data: [5],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                ],
                borderWidth: 1,
                borderRadius: 5,
            },
            {
                label: 'asus',
                data: [10],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                ],
                borderWidth: 1,
                borderRadius: 5,
            },
            {
                label: 'dell',
                data: [15],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                ],
                borderWidth: 1,
                borderRadius: 5,
            },
            {
                label: 'lenovo',
                data: [20],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                ],
                borderWidth: 1,
                borderRadius: 5,
            },
            {
                label: 'macbook',
                data: [25],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                ],
                borderWidth: 1,
                borderRadius: 5,
            },
        ]
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
                text: "Laptop bán chạy",
                font: {
                    size: '20px'
                }
            },
            legend: {
                display: true,
                position: 'top',
                align: "end"
            },
            labels: {
                render: 'image',
                images: [{
                    src: 'http://localhost:8000/upload/1690807519733-macbookpro14.jpg',
                    height: 25,
                    width: 25
                },
                {
                    src: 'http://localhost:8000/upload/1690802127060-acer_nitro5_515_56.jpg',
                    height: 25,
                    width: 25
                },
                {
                    src: 'http://localhost:8000/upload/1705125871316-dell-vostro-i5-1.jpg',
                    height: 25,
                    width: 25
                },
                {
                    src: 'http://localhost:8000/upload/1690807275761-29171-laptop_asus_gaming_rog.jpg',
                    height: 25,
                    width: 25
                },
                {
                    src: 'http://localhost:8000/upload/1690807304036-2320_laptopaz_acer_nitro_5_an515_57_1.jpg',
                    height: 25,
                    width: 25
                },
                ]
            }
        }
    };

    return (
        <Bar
            data={dataTotal}
            options={optionsTotal}
        />
    );
};

export default ChartFavoriteLaptop;
