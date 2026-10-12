import React, { useState, useEffect } from 'react';
import {
    mockLatestSensors,
    mockInitialDevices
} from '../data/mockData';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';
import { Thermometer, Sun, Droplets, Lightbulb, Sliders, CheckCircle, AlertCircle } from 'lucide-react';

//Tạo dữ liệu ban đầu cho biểu đồ
const generateInitialChartData = () => {
    const data = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 2000);
        const timeStr = time.toTimeString().split(' ')[0];
        data.push({
            time: timeStr,
            temp: parseFloat((27.5 + Math.random() * 2).toFixed(1)),
            hum: Math.floor(58 + Math.random() * 6),
            lux: Math.floor(480 + Math.random() * 40),
        });
    }
    return data;
};

export default function Dashboard() {
    const [devices, setDevices] = useState(() => {
        const savedDevices = localStorage.getItem('user_devices_state');
        return savedDevices ? JSON.parse(savedDevices) : mockInitialDevices;
    });
    const [chartData, setChartData] = useState(generateInitialChartData);
    const [latestSensors, setLatestSensors] = useState(mockLatestSensors);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);
    //Cập nhật dữ liệu thời gian thực
    const updateDashboard = () => {
        const savedStat = JSON.parse(localStorage.getItem('latest_sensor_stat'));
        if (savedStat) setLatestSensors(savedStat);

        const savedLogs = JSON.parse(localStorage.getItem('sensor_history_data') || '[]');
        if (savedLogs.length > 0) {
            const timeGroupedMap = new Map();

            savedLogs.forEach((log) => {
                const timeKey = log.time.split(' ')[1] || log.time;
                if (!timeGroupedMap.has(timeKey)) {
                    timeGroupedMap.set(timeKey, { time: timeKey });
                }
                const currentGroup = timeGroupedMap.get(timeKey);

                if (log.type === 'Nhiệt độ') {
                    currentGroup.temp = log.numValue || parseFloat(log.value);
                } else if (log.type === 'Độ ẩm') {
                    currentGroup.hum = log.numValue || parseFloat(log.value);
                } else if (log.type === 'Ánh sáng') {
                    currentGroup.lux = log.numValue || parseFloat(log.value);
                }
            });

            const chartPoints = Array.from(timeGroupedMap.values())
                .filter(p => p.temp !== undefined || p.hum !== undefined || p.lux !== undefined)
                .reverse()
                .slice(-12);

            if (chartPoints.length > 0) {
                setChartData(chartPoints);
            }
        }
    };
    //Lắng nghe sự kiện toàn cục để cập nhật dữ liệu
    useEffect(() => {
        updateDashboard();
        window.addEventListener('global_sensor_data_updated', updateDashboard);
        return () => window.removeEventListener('global_sensor_data_updated', updateDashboard);
    }, []);
    //Xử lý bật/tắt thiết bị
    const handleToggleDevice = (id) => {
        const targetDev = devices.find((d) => d.id === id);
        if (!targetDev) return;

        const newStatus = !targetDev.status;
        const actionWord = newStatus ? 'Bật' : 'Tắt';
        const msg = `${actionWord} ${targetDev.name} thành công`;

        const updatedDevices = devices.map((dev) =>
            dev.id === id ? { ...dev, status: newStatus } : dev
        );

        setDevices(updatedDevices);
        localStorage.setItem('user_devices_state', JSON.stringify(updatedDevices));

        const now = new Date();
        const fullTimeStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;

        const newActionLog = {
            id: Date.now(),
            device: targetDev.name,
            action: `${actionWord} đèn`,
            status: 'Thành công',
            time: fullTimeStr
        };

        const existingActions = JSON.parse(localStorage.getItem('action_history_data') || '[]');
        const updatedActions = [newActionLog, ...existingActions].slice(0, 100);
        localStorage.setItem('action_history_data', JSON.stringify(updatedActions));

        window.dispatchEvent(new Event('action_data_updated'));
        setToast({ type: 'success', message: msg });
    };

    return (
        <div className="space-y-4 relative overflow-hidden">
            {toast && (
                <div className="fixed top-16 right-6 z-50 flex items-center space-x-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl transition-all animate-bounce">
                    {toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                    <span className="text-xs font-medium">{toast.message}</span>
                </div>
            )}

            {/* STAT CARDS  */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-0.5">Nhiệt độ</p>
                        <h3 className="text-2xl font-bold text-gray-900">{latestSensors.temperature.current}°C</h3>
                        <p className="text-[11px] text-gray-400 mt-1">Cao nhất hôm nay: {latestSensors.temperature.max_today}°C</p>
                    </div>
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                        <Thermometer className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-0.5">Ánh sáng</p>
                        <h3 className="text-2xl font-bold text-gray-900">{latestSensors.light.current} lux</h3>
                        <p className="text-[11px] text-gray-400 mt-1">Cao nhất hôm nay: 600 lux</p>
                    </div>
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                        <Sun className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-0.5">Độ ẩm</p>
                        <h3 className="text-2xl font-bold text-gray-900">{latestSensors.humidity.current}%</h3>
                        <p className="text-[11px] text-gray-400 mt-1">Cao nhất hôm nay: {latestSensors.humidity.max_today}%</p>
                    </div>
                    <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-500">
                        <Droplets className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* CHARTS & CONTROL */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <h4 className="text-xs font-bold text-gray-800 mb-2 tracking-wide uppercase">BIỂU ĐỒ NHIỆT ĐỘ & ĐỘ ẨM</h4>
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ right: 30 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} interval={0} minTickGap={0} />
                                    <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                                    <Tooltip />
                                    <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '11px' }} />
                                    <Line type="monotone" dataKey="temp" name="Nhiệt độ (°C)" stroke="#f97316" strokeWidth={2} isAnimationActive={false} dot={{ r: 2.5 }} />
                                    <Line type="monotone" dataKey="hum" name="Độ ẩm (%)" stroke="#06b6d4" strokeWidth={2} isAnimationActive={false} dot={{ r: 2.5 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <h4 className="text-xs font-bold text-gray-800 mb-2 tracking-wide uppercase">BIỂU ĐỒ ĐỘ SÁNG</h4>
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ right: 30 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} interval={0} minTickGap={0} />
                                    <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 1000]} />
                                    <Tooltip />
                                    <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '11px' }} />
                                    <Line type="monotone" dataKey="lux" name="Ánh sáng (lux)" stroke="#eab308" strokeWidth={2} isAnimationActive={false} dot={{ r: 2.5 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-start">
                    <div className="flex items-center space-x-2 text-blue-600 mb-4">
                        <Sliders className="w-4 h-4" />
                        <h4 className="text-xs font-bold text-gray-800 tracking-wide uppercase">ĐIỀU KHIỂN THIẾT BỊ</h4>
                    </div>

                    <div className="space-y-3">
                        {devices.map((device) => (
                            <div key={device.id} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${device.status ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'}`}>
                                        <Lightbulb className="w-4 h-4" />
                                    </div>
                                    <span className="font-semibold text-xs text-gray-700">{device.name}</span>
                                </div>
                                <button
                                    onClick={() => handleToggleDevice(device.id)}
                                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${device.status ? 'bg-blue-600' : 'bg-gray-300'}`}
                                >
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${device.status ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}