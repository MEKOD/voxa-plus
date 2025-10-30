'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

// Doğru Daily.co domain'imiz
const DAILY_DOMAIN = "cloud-04d68b8020d24e188a3550727df4ecc2";

// 🔥 KRİTİK DEĞİŞİKLİK: Canlı API adresini buradan okuyacağız
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function CallRoomPage() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const searchParams = useSearchParams();
  
  const roomName = params.room as string;
  const userName = searchParams.get('username');
  
  useEffect(() => {
    if (!userName || !roomName) {
      setError("Kullanıcı adı veya oda adı URL'de eksik.");
      setLoading(false);
      return;
    }

    const fetchToken = async () => {
      try {
        // 🔥 KRİTİK DEĞİŞİKLİK: fetch artık canlı adrese istek atacak
        const response = await fetch(`${API_URL}/api/join-room`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomName, userName }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Token sunucudan alınamadı.');
        }
        
        const data = await response.json();
        setToken(data.token);
      } catch (err: any)  {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [roomName, userName]);

  // ... (Geri kalan kodun tamamı aynı, hiçbir şeyi değiştirme)
  
  if (token) {
    const roomUrl = `https://${DAILY_DOMAIN}.daily.co/${roomName}`;
    return (
      <iframe
        title="VOXA Görüntülü Görüşme"
        src={`${roomUrl}?t=${token}`}
        allow="camera; microphone; fullscreen; speaker; display-capture; autoplay"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: '0' }}
      ></iframe>
    );
  }

  // ... (Geri kalan yüklenme ve hata ekranları aynı)
  
  return null;
}