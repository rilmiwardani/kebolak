// ================== MULAI KODE SERVER.JS ==================
const { WebcastPushConnection } = require('tiktok-live-connector');
const WebSocket = require('ws');

// --- KONFIGURASI ---
// Ganti dengan username host TikTok yang sedang live!
const TARGET_USERNAME = 'USERNAME_TIKTOK_ANDA';
const WS_PORT = 62024;

// --- 1. SETUP WEBSOCKET (JEMBATAN KE REACT) ---
const wss = new WebSocket.Server({ port: WS_PORT });

console.log(\n[Server] Memulai sistem...);
console.log([WebSocket] Mendengarkan game React di port ${WS_PORT});

function broadcastToReact(eventName, eventData) {
wss.clients.forEach(client => {
if (client.readyState === WebSocket.OPEN) {
client.send(JSON.stringify({ event: eventName, data: eventData }));
}
});
}

wss.on('connection', (ws) => {
console.log('[WebSocket] Game React berhasil terhubung!');
ws.on('close', () => console.log('[WebSocket] Game React terputus.'));
});

// --- 2. SETUP TIKTOK LIVE CONNECTOR ---
const tiktokLiveConnection = new WebcastPushConnection(TARGET_USERNAME);

tiktokLiveConnection.connect().then(state => {
console.log([TikTok] ✅ Berhasil masuk ke Room Live: ${state.roomId});
}).catch(err => {
console.error('[TikTok] ❌ Gagal terhubung. Pastikan username benar dan sedang live.', err.message);
});

// --- 3. MENANGKAP CHAT (JAWABAN/PERINTAH) ---
tiktokLiveConnection.on('chat', data => {
console.log([Chat] ${data.uniqueId}: ${data.comment});
broadcastToReact('chat', {
uniqueId: data.uniqueId,
nickname: data.nickname,
comment: data.comment,
profilePictureUrl: data.profilePictureUrl
});
});

// --- 4. MENANGKAP GIFT (OPSIONAL) ---
tiktokLiveConnection.on('gift', data => {
if (data.giftType === 1 && !data.repeatEnd) return; // Hindari spam combo gift
console.log([Gift] 🎁 ${data.uniqueId} mengirim: ${data.giftName});
broadcastToReact('gift', {
uniqueId: data.uniqueId,
nickname: data.nickname,
giftName: data.giftName,
profilePictureUrl: data.profilePictureUrl
});
});

// --- 5. ERROR HANDLING ---
tiktokLiveConnection.on('error', err => console.error('[TikTok Error]', err.message));
tiktokLiveConnection.on('disconnected', () => console.log('[TikTok] ⚠️ Terputus dari Live.'));
// ================== AKHIR KODE SERVER.JS ==================