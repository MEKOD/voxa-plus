import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const DAILY_API_KEY = process.env.DAILY_API_KEY;
const DAILY_API_URL = process.env.DAILY_API_URL;

if (!DAILY_API_KEY || !DAILY_API_URL) {
  throw new Error("Daily API credentials missing in daily.js");
}

const dailyApi = axios.create({
  baseURL: DAILY_API_URL,
  headers: {
    'Authorization': `Bearer ${DAILY_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

const createRoom = async (roomName) => {
  const roomOptions = {
    name: roomName,
    privacy: 'private',
    properties: {
      enable_network_ui: false,
      enable_prejoin_ui: true,
      enable_screenshare: true,
      enable_chat: true,
      start_video_off: false,
      start_audio_off: false,
      lang: 'tr',
    }
  };
  await dailyApi.post('/rooms', roomOptions);
};

const createMeetingToken = async (roomName, userName, isOwner = false) => {
  const tokenOptions = {
    properties: {
      room_name: roomName,
      user_name: userName,
      is_owner: isOwner,
      exp: Math.round(Date.now() / 1000) + 3600,
    }
  };
  const { data } = await dailyApi.post('/meeting-tokens', tokenOptions);
  return data.token;
};

export const dailyService = {
  async getRoomToken(roomName, userName, isOwner = false) {
    try {
      await dailyApi.get(`/rooms/${roomName}`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        try {
          await createRoom(roomName);
        } catch (createError) {
          const info = createError.response?.data?.info || "";
          if (!info.includes('already exists')) {
            throw createError;
          }
        }
      } else {
        throw error;
      }
    }

    try {
      const token = await createMeetingToken(roomName, userName, isOwner);
      return token;
    } catch (tokenError) {
      console.error("Token oluşturma sırasında hata:", tokenError.response?.data || tokenError.message);
      throw new Error('Oda mevcut ancak katılım anahtarı oluşturulamadı.');
    }
  }
};