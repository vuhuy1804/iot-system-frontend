import React, { useState, useEffect } from 'react';
import { Search, RotateCw } from 'lucide-react';

export default function DataHistory() {
    const [dataList, setDataList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState('Tất cả');
    const [sortBy, setSortBy] = useState('time_desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Tùy chọn số dòng / trang (mặc định 10)

    const loadData = () => {
        const logs = JSON.parse(localStorage.getItem('sensor_history_data') || '[]');
        setDataList(logs);
    };

    useEffect(() => {
        loadData();
    }, []);

    // LỌC DỮ LIỆU
    const filteredData = dataList.filter((item) => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase().trim();

        if (searchCategory === 'Thời gian') {
            const timeTokens = term.split(/[\s,]+/).filter(Boolean);
            const itemTimeLower = item.time.toLowerCase();
            return timeTokens.every(token => itemTimeLower.includes(token));
        }

        if (searchCategory === 'Nhiệt độ') {
            return item.type === 'Nhiệt độ' && item.value.toLowerCase().includes(term);
        }

        if (searchCategory === 'Độ ẩm') {
            return item.type === 'Độ ẩm' && item.value.toLowerCase().includes(term);
        }

        if (searchCategory === 'Ánh sáng') {
            return item.type === 'Ánh sáng' && item.value.toLowerCase().includes(term);
        }

        const matchValue = item.value.toLowerCase().includes(term);
        const timeTokens = term.split(/[\s,]+/).filter(Boolean);
        const itemTimeLower = item.time.toLowerCase();
        const matchTimeFlexible = timeTokens.every(token => itemTimeLower.includes(token));

        return matchValue || matchTimeFlexible;
    });

    // SẮP XẾP DỮ LIỆU
    const sortedData = [...filteredData].sort((a, b) => {
        if (sortBy === 'time_desc') return new Date(b.time) - new Date(a.time);
        if (sortBy === 'time_asc') return new Date(a.time) - new Date(b.time);
        if (sortBy === 'val_asc') return (a.numValue || parseFloat(a.value)) - (b.numValue || parseFloat(b.value));
        if (sortBy === 'val_desc') return (b.numValue || parseFloat(b.value)) - (a.numValue || parseFloat(a.value));
        return 0;
    });

    // PHÂN TRANG
    const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="space-y-6">
            {/* TOOLBAR TÌM KIẾM & LỌC */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-3">
                <select
                    value={searchCategory}
                    onChange={(e) => { setSearchCategory(e.target.value); setCurrentPage(1); }}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none"
                >
                    <option value="Tất cả">Tìm kiếm: Tất cả</option>
                    <option value="Thời gian">Chỉ tìm: Thời gian</option>
                    <option value="Nhiệt độ">Chỉ tìm: Nhiệt độ</option>
                    <option value="Độ ẩm">Chỉ tìm: Độ ẩm</option>
                    <option value="Ánh sáng">Chỉ tìm: Ánh sáng</option>
                </select>

                <div className="relative flex-1 min-w-[240px]">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder={
                            searchCategory === 'Thời gian' ? 'Nhập thời gian (VD: 2026-10, 10:05)...' :
                                searchCategory === 'Tất cả' ? 'Nhập giá trị hoặc thời gian...' : `Nhập giá trị ${searchCategory.toLowerCase()}...`
                        }
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none"
                >
                    <option value="time_desc">Thời gian: Mới nhất</option>
                    <option value="time_asc">Thời gian: Cũ nhất</option>
                    <option value="val_asc">Giá trị: Tăng dần</option>
                    <option value="val_desc">Giá trị: Giảm dần</option>
                </select>

                <button
                    onClick={loadData}
                    className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-medium text-sm flex items-center space-x-1 transition-all"
                    title="Tải lại dữ liệu"
                >
                    <RotateCw className="w-4 h-4" />
                </button>
            </div>

            {/* BẢNG DỮ LIỆU */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4 tracking-wide uppercase">DATA SENSOR</h3>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                <th className="py-3 px-4">ID</th>
                                <th className="py-3 px-4">Loại cảm biến</th>
                                <th className="py-3 px-4">Giá trị</th>
                                <th className="py-3 px-4">Thời gian (YYYY-MM-DD HH:MM:SS)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {currentData.map((row, index) => (
                                <tr key={`${row.id}-${index}`} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-3.5 px-4 font-semibold text-gray-900">{row.id}</td>
                                    <td className="py-3.5 px-4 font-semibold text-gray-800">{row.type}</td>
                                    <td className="py-3.5 px-4 font-bold text-blue-600">{row.value}</td>
                                    <td className="py-3.5 px-4 text-gray-500">{row.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* CHÂN TRANG PHÂN TRANG & KHU VỰC DROPDOWN SỐ DÒNG */}
                <div className="flex flex-wrap items-center justify-between mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500 gap-3">
                    <div className="flex items-center space-x-3">
                        <span>Trang <strong className="text-gray-900">{currentPage}</strong> / {totalPages}</span>
                        <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md font-bold">
                            {currentData.length} / {itemsPerPage}
                        </span>

                        {/* DROPDOWN CHỌN SỐ DÒNG TRÊN TRANG */}
                        <div className="flex items-center space-x-1 pl-2">
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                            >
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                                <option value={25}>25</option>
                                <option value={30}>30</option>
                            </select>
                            <span className="text-xs text-gray-500 font-medium">/ trang</span>
                        </div>
                    </div>

                    {/* CỤM NÚT ĐIỀU HƯỚNG PHÂN TRANG */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg text-xs font-medium hover:bg-gray-100 disabled:opacity-40 transition-all"
                        >
                            Trang đầu
                        </button>
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3.5 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 disabled:opacity-40 transition-all"
                        >
                            [-] Trước
                        </button>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 disabled:opacity-40 transition-all"
                        >
                            [+] Sau
                        </button>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 disabled:opacity-40 transition-all"
                        >
                            Trang cuối
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}