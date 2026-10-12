import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import DataHistory from './pages/DataHistory';
import ActionHistory from './pages/ActionHistory';
import Profile from './pages/Profile';
import { mockLatestSensors } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // KHỞI TẠO LUỒNG GIẢ LẬP DỮ LIỆU CẢM BIẾN TOÀN CỤC (MOCK BG SERVICE)
  useEffect(() => {
    // Tự động khởi tạo dữ liệu ban đầu vào LocalStorage nếu chưa có
    // if (!localStorage.getItem('sensor_history_data')) {
    //   const initData = [
    //     { id: 101, type: "Nhiệt độ", value: "29.5°C", numValue: 29.5, time: "2026-10-25 10:05:22" },
    //     { id: 102, type: "Ánh sáng", value: "500 lux", numValue: 500, time: "2026-10-25 10:05:20" },
    //     { id: 103, type: "Độ ẩm", value: "61%", numValue: 61, time: "2026-10-25 10:05:18" },
    //   ];
    //   localStorage.setItem('sensor_history_data', JSON.stringify(initData));
    // }

    // Luồng sinh dữ liệu tự động 2 giây/lần chạy ngầm toàn ứng dụng
    // === Khi kết nối Backend thật, thay đoạn setInterval dưới đây ===
    // === bằng kết nối WebSocket: socket.on('sensor_data', (data) => { ... }) ===
    const interval = setInterval(() => {
      const now = new Date();

      let seconds = now.getSeconds();
      if (seconds % 2 !== 0) {
        seconds -= 1;
      }
      now.setSeconds(seconds);

      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0];
      const fullTimeStr = `${dateStr} ${timeStr}`;

      const newTemp = parseFloat((27 + Math.random() * 3.5).toFixed(1));
      const newHum = Math.floor(55 + Math.random() * 10);
      const newLux = Math.floor(480 + Math.random() * 60);

      // Cập nhật Stat Cards mới nhất
      const latest = {
        temperature: { current: newTemp, max_today: 35.0, unit: "°C" },
        light: { current: newLux, unit: "lux" },
        humidity: { current: newHum, max_today: 75.0, unit: "%" }
      };
      localStorage.setItem('latest_sensor_stat', JSON.stringify(latest));

      // Tạo 3 bản ghi cảm biến mới
      const newSensorLogs = [
        { id: Date.now(), type: 'Nhiệt độ', value: `${newTemp}°C`, numValue: newTemp, time: fullTimeStr },
        { id: Date.now() + 1, type: 'Độ ẩm', value: `${newHum}%`, numValue: newHum, time: fullTimeStr },
        { id: Date.now() + 2, type: 'Ánh sáng', value: `${newLux} lux`, numValue: newLux, time: fullTimeStr }
      ];

      const existingLogs = JSON.parse(localStorage.getItem('sensor_history_data') || '[]');
      const updatedLogs = [...newSensorLogs, ...existingLogs].slice(0, 300); // Giữ tối đa 300 bản ghi
      localStorage.setItem('sensor_history_data', JSON.stringify(updatedLogs));

      // Báo tín hiệu cập nhật toàn ứng dụng
      window.dispatchEvent(new Event('global_sensor_data_updated'));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 font-sans antialiased pb-12">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'sensor-history' && <DataHistory />}
        {activeTab === 'action-history' && <ActionHistory />}
        {activeTab === 'profile' && <Profile />}
      </main>
    </div>
  );
}