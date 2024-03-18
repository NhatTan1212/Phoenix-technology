import React from 'react';
import { Bar } from 'react-chartjs-2';
import { subDays, format, set } from 'date-fns';
import { Select } from 'antd';

import {
    Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, TimeScale, PointElement, defaults, Title, ArcElement
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, TimeScale, Tooltip, Legend, PointElement, Title, ArcElement
)

defaults.maintainAspectRatio = false
defaults.responsive = true

const ChartFavoriteBrands = ({ data }) => {
    const labels = data.favoriteDataBrands.map(item => {
        return item.name
    });
    const dataFavoriteBrands = data.favoriteDataBrands.map(item => {
        return item.total_success_products
    });

    const progressBar = {
        id: 'progressBar',
        beforeDraw(chart, args, pluginOptions) {
            const { ctx, data, chartArea: { top, bottom, left, right, width, height }, scales: { x, y } } = chart;
            const fontSizeLabel = 12;
            ctx.save();
            // Vòng lặp qua từng dữ liệu để hiển thị nhãn lên trên các thanh dữ liệu
            data.labels.forEach((label, index) => {
                const yPos = y.getPixelForValue(index) - fontSizeLabel - 5;
                ctx.fillStyle = 'rgba(102, 102, 102, 1)';
                ctx.font = `${fontSizeLabel}px sans-serif`;
                ctx.textAlign = 'left';
                ctx.textBaseLine = 'middle'
                ctx.fillText(label, left, yPos);
            });

            data.datasets[0].data.forEach((data, index) => {
                const yPos = y.getPixelForValue(index) - fontSizeLabel - 5;
                ctx.fillStyle = 'rgba(102, 102, 102, 1)';
                ctx.font = `${fontSizeLabel}px sans-serif`;
                ctx.textAlign = 'right';
                ctx.textBaseLine = 'middle'
                ctx.fillText(data, right, yPos);
            });

            ctx.restore();
        }
    };



    const dataTotal = {
        labels: labels,
        datasets: [{
            label: 'Thương hiệu bán chạy',
            data: dataFavoriteBrands,
            backgroundColor: [
                'rgb(100, 150, 200)',
                'rgb(50, 200, 100)',
                'rgb(220, 120, 180)',
                'rgb(180, 60, 240)',
                'rgb(20, 180, 220)',
                'rgb(25, 280, 220)',
                'rgb(230, 123, 220)',
                'rgb(210, 10, 220)',
            ],
            borderColor: [
                'rgb(100, 150, 200)',
                'rgb(50, 200, 100)',
                'rgb(220, 120, 180)',
                'rgb(180, 60, 240)',
                'rgb(20, 180, 220)',
                'rgb(25, 280, 220)',
                'rgb(230, 123, 220)',
                'rgb(210, 10, 220)',
            ],
            borderWidth: 1,
            borderRadius: 5,
            borderSkipped: false,
            barPercentage: 0.2,
            categoryPercentage: 0.8
        }],
    };

    const optionsTotal = {
        indexAxis: 'y', // Xác định trục chính là trục y để thanh biểu đồ ngang
        scales: {
            x: {
                display: false,
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    display: false
                }
            },
            y: {
                display: false,
                beginAtZero: true,
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    display: false
                }
            },
        },
        plugins: {
            title: {
                display: true,
                align: 'start',
                text: "Thương hiệu bán chạy",
                font: {
                    size: '20px'
                },
                padding: {
                    top: 16,
                }
            },
            legend: {
                display: false,
                position: 'bottom',
                align: "center"
            },

        },
    };

    return (
        <div className='relative px-5'>
            <Select
                className='absolute right-2 top-2'
                value={data.daysFavoriteBrandsSelected || 7}
                options={[
                    {
                        value: 7,
                        label: 'Xem theo tuần'
                    },
                    {
                        value: 30,
                        label: 'Xem theo tháng'
                    },
                    {
                        value: 365,
                        label: 'Xem theo năm'
                    },
                ]}
                onChange={(e) => {
                    data.setDaysFavoriteBrandsSelected(e)
                }}
            ></Select>
            <Bar
                className='w-full h-[500px]'
                data={dataTotal}
                options={optionsTotal}
                plugins={[progressBar]}
            />
        </div>
    );
};

export default ChartFavoriteBrands;
