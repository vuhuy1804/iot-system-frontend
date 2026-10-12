import React from 'react';
import { mockUserProfile } from '../data/mockData';
import myAvatar from '../assets/avatar.jpg'; // Import ảnh từ thư mục assets

export default function Profile() {
    return (
        <div className="max-w-2xl mx-auto py-4">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center space-y-6">

                {/* AVATAR */}
                <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-cyan-400 shadow-lg mb-4">
                        <img
                            src={myAvatar}
                            alt="Vũ Quang Huy Avatar"
                            className="w-full h-full rounded-full object-cover bg-white"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{mockUserProfile.fullName}</h2>
                </div>

                {/* THÔNG TIN CÁ NHÂN */}
                <div className="space-y-3 text-left border-t border-gray-100 pt-6">
                    <div className="flex justify-between items-center p-3.5 bg-gray-50/80 rounded-xl">
                        <span className="text-sm font-medium text-gray-500">Họ tên</span>
                        <span className="text-sm font-bold text-gray-900">{mockUserProfile.fullName}</span>
                    </div>

                    <div className="flex justify-between items-center p-3.5 bg-gray-50/80 rounded-xl">
                        <span className="text-sm font-medium text-gray-500">Mã sinh viên</span>
                        <span className="text-sm font-bold text-gray-900">{mockUserProfile.studentId}</span>
                    </div>

                    <div className="flex justify-between items-center p-3.5 bg-gray-50/80 rounded-xl">
                        <span className="text-sm font-medium text-gray-500">Lớp</span>
                        <span className="text-sm font-bold text-gray-900">{mockUserProfile.class}</span>
                    </div>

                    <div className="flex justify-between items-center p-3.5 bg-gray-50/80 rounded-xl">
                        <span className="text-sm font-medium text-gray-500">Email</span>
                        <span className="text-sm font-semibold text-gray-800">{mockUserProfile.email}</span>
                    </div>

                    <div className="flex justify-between items-center p-3.5 bg-gray-50/80 rounded-xl">
                        <span className="text-sm font-medium text-gray-500">Số điện thoại</span>
                        <span className="text-sm font-bold text-gray-900">{mockUserProfile.phone}</span>
                    </div>

                    <div className="flex justify-between items-center p-3.5 bg-gray-50/80 rounded-xl">
                        <span className="text-sm font-medium text-gray-500">GitHub</span>
                        <a href={`https://${mockUserProfile.github}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 hover:underline">
                            {mockUserProfile.github}
                        </a>
                    </div>

                    <div className="flex justify-between items-center p-3.5 bg-gray-50/80 rounded-xl">
                        <span className="text-sm font-medium text-gray-500">Figma</span>
                        <a href={`https://${mockUserProfile.figma}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 hover:underline">
                            {mockUserProfile.figma}
                        </a>
                    </div>

                    <div className="flex justify-between items-center p-3.5 bg-gray-50/80 rounded-xl">
                        <span className="text-sm font-medium text-gray-500">PDF Báo cáo</span>
                        <a href={`https://${mockUserProfile.baocao}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 hover:underline">
                            {mockUserProfile.baocao}
                        </a>
                    </div>

                </div>

            </div>
        </div>
    );
}