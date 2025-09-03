import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register plugin
Chart.register(ChartDataLabels);

// --- Mock Mood Data ---
const moodData = {
    '😊': { label: 'Happy', color: '#FFD700', value: 5 },
    '😌': { label: 'Calm', color: '#87CEEB', value: 4 },
    '🤔': { label: 'Confused', color: '#D3D3D3', value: 3 },
    '😟': { label: 'Anxious', color: '#B2A1C7', value: 2 },
    '😢': { label: 'Sad', color: '#6495ED', value: 1 },
    '😔': { label: 'Depressed', color: '#4682B4', value: 0 },
};

// --- Mock Weekly Data ---
const weeklyData = [
    { week: 'Week 1', moods: ['😌', '😊', '🤔', '😌', '😟', '😊', '😊'] },
    { week: 'Week 2', moods: ['😟', '😢', '🤔', '😌', '😌', '😊', '😌'] },
    { week: 'Week 3', moods: ['😊', '😊', '😌', '😊', '😌', '🤔', '😊'] },
    { week: 'Week 4', moods: ['🤔', '😟', '😌', '😢', '😌', '😊', '😌'] },
];

// --- Sub-components ---
const ProfileHeader = () => (
    <section className="text-center md:text-left flex flex-col md:flex-row items-center gap-6">
        <img
            src="https://placehold.co/100x100/A27D4C/FFFFFF?text=JD"
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white object-cover ring-2 ring-[#A27D4C]/50"
        />
        <div>
            <h1 className="text-2xl font-bold font-serif text-[#3A3833]">Jane Doe</h1>
            <p className="text-sm text-[#5F6C66] mt-1">Member since Aug 2024</p>
        </div>
    </section>
);

const StreakCard = ({ icon, value, label, isCurrent }) => (
    <div className="bg-gradient-to-br from-[#E0DCD5]/80 to-white/50 p-4 rounded-xl text-center soft-shadow">
        <div className={`relative w-16 h-16 mx-auto ${isCurrent ? 'bg-[#A27D4C] pulse' : 'bg-[#5F6C66]'} rounded-full flex items-center justify-center text-white`}>
            {icon}
        </div>
        <p className={`mt-3 text-2xl font-bold ${isCurrent ? 'text-[#A27D4C]' : 'text-[#3A3833]'}`}>{value}</p>
        <p className="text-xs text-[#5F6C66]">{label}</p>
    </div>
);

const RecentMood = () => (
    <section>
        <h2 className="text-xl font-semibold font-serif mb-4 text-[#3A3833]">Recent Mood</h2>
        <div className="bg-gradient-to-br from-[#E0DCD5]/80 to-white/50 p-5 rounded-xl text-center soft-shadow">
            <p className="text-5xl">😌</p>
            <p className="mt-2 font-semibold text-[#3A3833]">Calm</p>
            <p className="text-xs text-[#5F6C66]">Today's dominant mood</p>
        </div>
    </section>
);

const WeeklyMoodChart = ({ onWeekClick }) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const ctx = chartRef.current.getContext('2d');

        const mainChartData = weeklyData.map(w => {
            const totalValue = w.moods.reduce((sum, mood) => sum + moodData[mood].value, 0);
            return totalValue / w.moods.length;
        });

        const dominantEmojis = weeklyData.map(w => {
            const counts = w.moods.reduce((acc, mood) => ({ ...acc, [mood]: (acc[mood] || 0) + 1 }), {});
            return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        });

        if (chartInstanceRef.current) chartInstanceRef.current.destroy();

        chartInstanceRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: weeklyData.map(w => w.week),
                datasets: [{
                    label: 'Average Mood',
                    data: mainChartData,
                    borderColor: '#A27D4C',
                    backgroundColor: 'rgba(162,125,76,0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: dominantEmojis.map(emoji => moodData[emoji].color),
                    pointRadius: 8,
                    pointHoverRadius: 12,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                    datalabels: {
                        formatter: (value, context) => dominantEmojis[context.dataIndex],
                        font: { size: 18 },
                        align: 'center',
                        anchor: 'center',
                    }
                },
                scales: {
                    y: { display: false, beginAtZero: true, max: 5 },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#5F6C66', font: { family: "'Inter', sans-serif" } }
                    }
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) onWeekClick(weeklyData[elements[0].index]);
                },
                onHover: (event, chartElement) => {
                    event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
                }
            }
        });

        return () => {
            if (chartInstanceRef.current) chartInstanceRef.current.destroy();
        };
    }, [onWeekClick]);

    return (
        <div className="md:col-span-2 bg-gradient-to-br from-[#E0DCD5]/80 to-white/50 p-6 rounded-2xl soft-shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold font-serif text-[#3A3833]">Weekly Mood</h2>
                <span className="text-sm text-[#5F6C66]">Last 4 Weeks</span>
            </div>
            <canvas ref={chartRef} className="w-full h-64"></canvas>
        </div>
    );
};

const DetailModal = ({ isOpen, onClose, weekData }) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        if (!isOpen || !weekData || !chartRef.current) return;

        const ctx = chartRef.current.getContext('2d');
        if (chartInstanceRef.current) chartInstanceRef.current.destroy();

        chartInstanceRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
                datasets: [{
                    label: 'Daily Mood',
                    data: weekData.moods.map(m => moodData[m].value),
                    backgroundColor: weekData.moods.map(m => moodData[m].color),
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: (context) => {
                                const moodEmoji = weekData.moods[context.dataIndex];
                                return `${moodEmoji} ${moodData[moodEmoji].label}`;
                            }
                        }
                    },
                    datalabels: {
                        formatter: (value, context) => weekData.moods[context.dataIndex],
                        font: { size: 18 },
                        color: '#3A3833',
                        anchor: 'end',
                        align: 'top',
                    }
                },
                scales: {
                    y: { display: false, max: 5.5 },
                    x: { grid: { display: false }, ticks: { color: '#5F6C66' } }
                }
            }
        });

        return () => {
            if (chartInstanceRef.current) chartInstanceRef.current.destroy();
        };
    }, [isOpen, weekData]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl soft-shadow p-8 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold font-serif text-[#3A3833]">{weekData.week} Mood Detail</h2>
                    <button onClick={onClose} className="text-2xl text-[#5F6C66] hover:text-[#3A3833]">&times;</button>
                </div>
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
};

// --- Main Profile Page ---
export default function ProfilePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWeek, setSelectedWeek] = useState(null);

    const handleWeekClick = (weekData) => {
        setSelectedWeek(weekData);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => { setIsModalOpen(false); setSelectedWeek(null); };

    const streakIcons = {
        current: <span>🔥</span>,
        longest: <span>🏆</span>
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6" style={{ fontFamily: "'Inter', sans-serif", background: 'linear-gradient(135deg, #E0DCD5, #f5f3f0)' }}>
            <main className="w-full max-w-5xl bg-white/60 backdrop-blur-lg rounded-3xl soft-shadow p-6 sm:p-8 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    <aside className="md:col-span-1 space-y-8">
                        <ProfileHeader />
                        <section>
                            <h2 className="text-xl font-semibold font-serif mb-4 text-[#3A3833]">Your Journey</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <StreakCard icon={streakIcons.current} value="18" label="Current Streak" isCurrent />
                                <StreakCard icon={streakIcons.longest} value="42" label="Longest Streak" />
                            </div>
                        </section>
                        <RecentMood />
                    </aside>
                    <WeeklyMoodChart onWeekClick={handleWeekClick} />
                </div>
            </main>
            <DetailModal isOpen={isModalOpen} onClose={handleCloseModal} weekData={selectedWeek} />
        </div>
    );
}
