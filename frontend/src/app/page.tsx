'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!roomName.trim() || !userName.trim()) return;

    const formattedRoomName = roomName.trim().replace(/\s+/g, '-').toLowerCase();
    router.push(`/call/${formattedRoomName}?username=${encodeURIComponent(userName.trim())}`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 overflow-hidden relative">
      {/* Arka plan girdap efekti */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-red-700 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob top-10 left-10"></div>
        <div className="absolute w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 top-0 right-10"></div>
        <div className="absolute w-96 h-96 bg-red-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 bottom-10 left-30"></div>
      </div>

      <div
        className={`relative z-10 w-full max-w-lg mx-auto transition-all duration-1000 ease-out transform ${
          isMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-90'
        }`}
      >
        <div className="text-center mb-12">
          <h1 className="text-8xl font-extrabold tracking-tighter text-white drop-shadow-lg animate-pulse-fast">
            VOXA
          </h1>
          <p className="mt-4 text-2xl font-light text-red-300 animate-fade-in">
            Bağlantı Kur, Sohbet Et, Canlı Yayınla.
          </p>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-md border border-red-700 rounded-3xl p-10 shadow-3xl transform hover:scale-102 transition-transform duration-300">
          <form onSubmit={handleJoinRoom} className="space-y-7">
            <div>
              <label htmlFor="roomName" className="text-sm font-semibold text-red-200 block mb-2">
                ODA ADI
              </label>
              <input
                id="roomName"
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
                className="mt-1 block w-full px-5 py-3 bg-gray-900 border border-red-600 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-3 focus:ring-red-500 transition-all duration-300 text-lg"
                placeholder="Toplantı, ders, oyun..."
              />
            </div>
            <div>
              <label htmlFor="userName" className="text-sm font-semibold text-red-200 block mb-2">
                İSMİNİZ
              </label>
              <input
                id="userName"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="mt-1 block w-full px-5 py-3 bg-gray-900 border border-red-600 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-3 focus:ring-red-500 transition-all duration-300 text-lg"
                placeholder="Görüşmedeki takma adınız"
              />
            </div>
            <button
              type="submit"
              disabled={!roomName.trim() || !userName.trim()}
              className="w-full py-4 px-6 font-bold text-xl text-white bg-red-700 rounded-xl hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1"
            >
              Odaya Katıl
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}