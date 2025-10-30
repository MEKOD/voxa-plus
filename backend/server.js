import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dailyService } from './utils/daily.js';

dotenv.config();

const { CLIENT_URL, PORT } = process.env;

// dailyService modülü kendi içinde API anahtarını kontrol etse de,
// sunucunun başlangıçta temel yapılandırmaya sahip olduğunu garanti etmek iyidir.
if (!process.env.DAILY_API_KEY || !process.env.DAILY_API_URL) {
  console.error("KRİTİK HATA: .env dosyasında Daily API anahtarı veya URL'si eksik. Sunucu başlatılamıyor.");
  process.exit(1);
}

const app = express();

// Güvenlik ve veri işleme için temel middleware'ler
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// Oda oluşturma ve token alma için tek, temiz endpoint
app.post('/api/join-room', async (req, res) => {
  const { roomName, userName, isOwner = false } = req.body;

  if (!roomName || !userName) {
    return res.status(400).json({ error: 'Oda adı ve kullanıcı adı alanları zorunludur.' });
  }

  try {
    // Tüm karmaşık Daily.co mantığı, bu tek servis çağrısının arkasında soyutlandı.
    const token = await dailyService.getRoomToken(roomName, userName, isOwner);
    
    res.status(200).json({ token });
  } catch (error) {
    // dailyService'ten gelen spesifik hata mesajını logla ve kullanıcıya döndür.
    console.error(`Odaya katılım sağlanamadı [${roomName}]:`, error.message);
    
    // Güvenlik için, istemciye her zaman genel bir hata mesajı döndürmek daha iyidir,
    // ancak hata ayıklama kolaylığı için dailyService'ten gelen mesajı kullanabiliriz.
    res.status(500).json({ error: error.message || 'Sunucu tarafında odaya katılım sağlanamadı.' });
  }
});

const serverPort = PORT || 8080;

app.listen(serverPort, () => {
  console.log(`Sunucu, http://localhost:${serverPort} adresinde dinlemede.`);
});