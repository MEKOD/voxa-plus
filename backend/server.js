import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dailyService } from './utils/daily.js';

dotenv.config();

const { CLIENT_URL, PORT } = process.env;

if (!process.env.DAILY_API_KEY || !process.env.DAILY_API_URL) {
  console.error("KRİTİK HATA: Daily API anahtarları eksik.");
  process.exit(1);
}

// 🔥 KRİTİK DEĞİŞİKLİK: CORS'u daha akıllı hale getiriyoruz
const allowedOrigins = [CLIENT_URL, "http://localhost:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Bu kaynaktan gelen CORS isteği reddedildi.'));
    }
  }
};

const app = express();
app.use(cors(corsOptions)); // Akıllı CORS'u kullan
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'VOXA Backend is running' });
});

app.post('/api/join-room', async (req, res) => {
  const { roomName, userName, isOwner = false } = req.body;
  if (!roomName || !userName) {
    return res.status(400).json({ error: 'Oda adı ve kullanıcı adı gereklidir.' });
  }
  try {
    const token = await dailyService.getRoomToken(roomName, userName, isOwner);
    res.status(200).json({ token });
  } catch (error) {
    console.error("Odaya katılım hatası:", error.message);
    res.status(500).json({ error: error.message || 'Odaya katılım sağlanamadı.' });
  }
});

const serverPort = PORT || 8080;
app.listen(serverPort, () => {
  console.log(`Sunucu http://localhost:${serverPort} adresinde dinlemede.`);
  // 🔥 KANIT: Sunucu başladığında hangi adreslere izin verdiğini görelim
  console.log("İzin verilen CORS kaynakları:", allowedOrigins);
});