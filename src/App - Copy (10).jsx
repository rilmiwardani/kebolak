import React, { useState, useEffect, useRef } from "react";
import {
  AlertTriangle, BarChart2, Bomb, Bot, Clock, Crown, Delete, FastForward,
  FileJson, Flag, FlipHorizontal, Gamepad2, Gift, Globe, Hash, Heart, Info,
  Keyboard, Link, LogOut, MapPin, Maximize, Medal, Minimize, Minus,
  MoveUpRight, Music, Plus, RefreshCw, Repeat2, Send, Settings, Skull,
  Star, Target, TrendingUp, TrendingUp as TrendingUpIcon, Trophy, Unlink,
  User, Users, Volume2, VolumeX, X, Sparkles, MessageSquare, MessageSquareOff,
  Pause, Play
} from "lucide-react";

// ==========================================
// 1. TRANSLATIONS & CONSTANTS
// ==========================================
const TRANSLATIONS = {
  EN: {
    waiting: "WAITING FOR PLAYERS...", type_join: "Type !join", game_over: "GAME OVER",
    new_game: "New Game", current_word: "CURRENT WORD", winner: "WINNER!",
    draw: "DRAW!", play_again: "PLAY AGAIN", score: "Score", sound: "Sound",
    language: "Language", end_condition: "End Condition", turn_time: "Turn Time",
    players: "Players", load_json: "Load JSON", add_host: "+Host", add_bot: "+Bot",
    mode: "Mode", start_game: "START GAME", reset_game: "RESET GAME", simulation: "Simulation",
    footer: "Use !join to play • !unjoin to leave • !surrend to give up",
    supporter: "Supporter", sent: "sent", log_invalid: "invalid word",
    log_used: "already used", log_bad_link: "bad link", log_correct: "Correct!",
    log_eliminated: "eliminated!", log_joined: "joined!", log_stumped: "is stumped!",
    log_reset: "Game Reset!", log_lobby_full: "Lobby Full! Auto-starting...",
    log_need_players: "Need at least 2 players.", log_goes_first: "goes first!",
    log_rule_change: "RULE CHANGE", log_pts: "Pts", log_lobby_cleared: "Lobby Cleared!",
    clear_lobby: "KICK ALL / CLEAR LOBBY", rule_start: "Start with", rule_end: "Ends with",
    rule_mirror: "Ends with Start of", rule_ladder: "Length +1", rule_ladder_reset: "Reset Length",
    rule_contains: "Contains", rule_syllable: "Syllable", rule_no_doubles: "No Double Letters",
    rule_unique: "Unique Letters", rule_min: "Min", rule_max: "Max", rule_odd: "Odd Length",
    rule_even: "Even Length", rule_phrase: "Complete Phrase", target: "Target",
    round: "Round", hall_of_fame: "HALL OF FAME", stats_wins: "Wins",
    stats_games: "Games", stats_kills: "Kills", stats_rate: "Win Rate",
    most_killer: "MOST KILLER", badge_legend: "Badge Legend", no_data: "No player data found yet.",
    close: "Close", click_to_accept: "Click to Accept", chain_broken: "CHAIN BROKEN!",
    reconnecting: "Reconnecting...", rhyme_target: "RHYME TARGET", rhyme_change: "RHYME CHANGED",
    log_unjoin: "left the lobby.", log_surrender: "surrendered!", log_ban_rejoin: "Rejoin limit reached (Max 1x).",
    log_cant_unjoin: "Cannot unjoin while playing.", starting_in: "Starting in", auto_restart: "Auto Restart"
  },
  ID: {
    waiting: "MENUNGGU PEMAIN...", type_join: "Ketik !join", game_over: "PERMAINAN SELESAI",
    new_game: "Main Lagi", current_word: "KATA SAAT INI", winner: "PEMENANG!",
    draw: "SERI!", play_again: "MAIN LAGI", score: "Skor", sound: "Suara",
    language: "Bahasa", end_condition: "End Condition", turn_time: "Waktu Giliran",
    players: "Pemain", load_json: "Muat JSON", add_host: "+Host", add_bot: "+Bot",
    mode: "Mode", start_game: "MULAI GAME", reset_game: "RESET GAME", simulation: "Simulasi",
    footer: "Ketik !join (main) • !unjoin (keluar) • !surrend (nyerah)",
    supporter: "Pendukung", sent: "mengirim", log_invalid: "tidak ada di kamus",
    log_used: "sudah dipakai", log_bad_link: "tidak nyambung", log_correct: "Benar!",
    log_eliminated: "tereliminasi!", log_joined: "bergabung!", log_stumped: "bingung!",
    log_reset: "Game Direset!", log_lobby_full: "Lobby Penuh! Otomatis mulai...",
    log_need_players: "Butuh minimal 2 pemain.", log_goes_first: "jalan duluan!",
    log_rule_change: "GANTI ATURAN", log_pts: "Poin", log_lobby_cleared: "Lobby Dibersihkan!",
    clear_lobby: "USIR SEMUA / BERSIHKAN", rule_start: "Mulai dgn", rule_end: "Akhiran",
    rule_mirror: "Akhiran = Awal", rule_ladder: "Panjang +1", rule_ladder_reset: "Reset Panjang",
    rule_contains: "Mengandung", rule_syllable: "Suku Kata", rule_no_doubles: "Tanpa Huruf Ganda",
    rule_unique: "Huruf Unik", rule_min: "Min", rule_max: "Maks", rule_odd: "Panjang Ganjil",
    rule_even: "Panjang Genap", rule_phrase: "Lengkapi Frasa", target: "Target",
    round: "Ronde", hall_of_fame: "AULA KETENARAN", stats_wins: "Menang",
    stats_games: "Main", stats_kills: "Kill", stats_rate: "Rasio Menang",
    most_killer: "MOST KILLER", badge_legend: "Legenda Lencana", no_data: "Belum ada data pemain.",
    close: "Tutup", click_to_accept: "Klik untuk Terima", chain_broken: "RANTAI PUTUS!",
    reconnecting: "Menyambung...", rhyme_target: "TARGET RIMA", rhyme_change: "RIMA BERUBAH",
    log_unjoin: "keluar dari lobby.", log_surrender: "menyerah!", log_ban_rejoin: "Batas rejoin habis (Maks 1x).",
    log_cant_unjoin: "Sedang main tidak bisa unjoin.", starting_in: "Mulai dalam", auto_restart: "Mulai Otomatis"
  }
};

const FALLBACK_DICTIONARY_EN = new Set([
  "apple", "ant", "arrow", "axe", "area", "art", "arm", "air", "act", "age", "aim", "aid",
  "ball", "bat", "bear", "bed", "bee", "bell", "bird", "blue", "boat", "book", "box", "boy", "bread", "bus", "baby",
  "cat", "car", "cup", "cow", "coat", "cake", "city", "cloud", "class", "chair", "chicken", "child", "clock", "cold",
  "dog", "day", "door", "desk", "duck", "doll", "dress", "dark", "date", "dance", "dream", "drink", "drive", "dust",
  "egg", "eye", "ear", "end", "east", "earth", "event", "exam", "edge", "exit", "energy", "engine", "eagle", "elephant",
  "fish", "fan", "farm", "fat", "fire", "fly", "food", "foot", "fox", "frog", "fun", "face", "flag", "flower", "forest",
  "goat", "gold", "girl", "game", "glass", "grass", "green", "gun", "gift", "gate", "group", "guitar", "ghost", "glove",
  "hat", "hen", "hot", "house", "hill", "hand", "head", "home", "hair", "heart", "horse", "hour", "happy", "hero",
  "ice", "ink", "iron", "idea", "island", "image", "item", "insect", "inside", "issue", "input", "index", "icon",
  "jam", "jar", "jet", "job", "joy", "juice", "joke", "jump", "jacket", "jeep", "jungle", "jewel", "judge", "joint",
  "key", "king", "kite", "knee", "knife", "knot", "kick", "kid", "kitchen", "keyboard", "lamp", "leg", "lip", "lock",
  "log", "love", "low", "light", "lake", "leaf", "life", "line", "lion", "list", "man", "map", "mat", "moon",
  "milk", "mouse", "mouth", "money", "music", "mother", "monkey", "market", "metal", "magic", "net", "nut", "nose",
  "neck", "name", "night", "north", "nurse", "nest", "news", "noise", "note", "number", "nature", "owl", "oil", "orange",
  "ocean", "office", "onion", "open", "order", "oven", "owner", "object", "opera", "orbit", "out", "oops", "ooze",
  "pen", "pig", "pin", "pot", "pan", "park", "part", "past", "path", "pay", "peace", "people", "pie", "picture", "paper",
  "queen", "quiz", "quick", "quiet", "queue", "quest", "quality", "quote", "quarter", "rat", "red", "run", "rain",
  "rice", "road", "rock", "roof", "room", "rope", "rose", "ring", "river", "radio", "rabbit", "sun", "sea", "sky", "son",
  "star", "ship", "shoe", "shop", "snow", "sock", "song", "soup", "sand", "school", "sheep", "sister", "top", "toy",
  "tree", "tea", "tie", "toe", "time", "table", "tail", "tank", "tape", "taxi", "team", "tent", "test", "tiger",
  "umbrella", "uncle", "unit", "use", "user", "uniform", "union", "update", "urban", "urge", "upset", "under", "van",
  "vase", "vest", "view", "voice", "village", "video", "value", "virus", "visit", "wall", "way", "web", "well", "wind",
  "wolf", "wood", "water", "watch", "week", "white", "window", "woman", "world", "xray", "xenon", "xerox", "yak", "yam",
  "year", "yellow", "yes", "you", "young", "yard", "yacht", "yogurt", "youth", "zebra", "zoo", "zone", "zinc", "zipper", "zoom"
]);

const FALLBACK_PHRASES_ID = [
  "ahli gizi", "ahli waris", "ahli nujum", "ahli kubur", "ahli bahasa", "ahli bedah", "ahli hukum",
  "gizi buruk", "gizi seimbang", "gizi baik", "buruk sangka", "buruk rupa", "buruk siku", "buruk hati",
  "sangka baik", "sangka buruk", "mata hati", "mata kaki", "mata pisau", "mata duitan", "mata pencaharian",
  "kaki lima", "kaki tangan", "kaki ayam", "kaki langit", "kaki bukit", "lima benua", "lima waktu",
  "tangan panjang", "tangan besi", "tangan dingin", "tangan hampa", "tangan kanan", "tangan kosong",
  "panjang tangan", "panjang akal", "panjang umur", "panjang lebar", "akal bulus", "akal sehat",
  "sehat walafiat", "sehat jasmani", "sehat rohani", "rumah sakit", "rumah makan", "rumah tangga",
  "sakit hati", "sakit jiwa", "sakit gigi", "sakit kepala", "hati nurani", "hati kecil", "hati batu",
  "kecil hati", "kecil mulut", "batu besar", "batu nisan", "batu akik", "batu api", "besar kepala",
  "mulut manis", "mulut besar", "mulut buaya", "manis jari", "manis mulut", "manis daging", "jari manis",
  "tengah hari", "tengah malam", "tengah jalan", "malam minggu", "malam jumat", "malam buta",
  "minggu depan", "minggu tenang", "depan mata", "depan rumah", "pintu gerbang", "pintu masuk",
  "air mata", "air terjun", "air tawar", "air asin", "anak emas", "anak buah", "anak angkat",
  "kambing hitam", "kambing congek", "meja hijau", "meja makan", "buah tangan", "buah bibir",
  "bunga desa", "bunga bank", "kabar angin", "kabar burung", "naik daun", "naik darah", "naik haji",
  "turun tangan", "turun harga", "jual mahal", "jual aksi", "jual bangsa"
];

const FALLBACK_PHRASES_EN = [
  "high school", "school bus", "bus stop", "stop sign", "sign language", "language barrier", "barrier reef",
  "ice cream", "cream cheese", "cheese cake", "cake walk", "walk away", "hot dog", "dog house", "house party",
  "party animal", "animal kingdom", "kingdom come", "fire truck", "truck driver", "driver license",
  "license plate", "plate glass", "glass house", "apple pie", "pie chart", "chart topper", "black hole",
  "hole in one", "one way", "way out", "out side", "side walk", "full moon", "moon light", "light bulb",
  "bulb garden", "garden party", "star wars", "wars zone", "zone out", "time out", "out loud", "loud speaker",
  "speaker phone", "phone call", "call back", "back door", "door bell", "bell pepper", "pepper spray",
  "spray paint", "paint brush", "brush off", "sea shell", "shell fish", "fish tank", "tank top", "top hat",
  "hat trick", "trick shot", "shot gun", "gun powder", "powder room", "room mate", "grand father",
  "father figure", "figure out", "out run", "run away", "water fall", "fall down", "down town", "town hall",
  "hall way", "gold fish", "fish net", "net work", "work out", "out door", "rain bow", "bow tie", "tie dye",
  "sun flower", "flower pot", "pot luck", "luck out", "key board", "board game", "game over", "over time", "time zone"
];

const FALLBACK_DICTIONARY_ID_DATA = {
  makan: { nama: "ma.kan", def: "Memasukkan makanan ke dalam mulut serta mengunyah dan menelannya." },
  minum: { nama: "mi.num", def: "Memasukkan air (benda cair) ke dalam mulut dan meneguknya." },
  lari: { nama: "la.ri", def: "Melangkah dengan kecepatan tinggi (lebih dari berjalan)." },
  jalan: { nama: "ja.lan", def: "Tempat untuk lalu lintas orang, kendaraan, dsb." },
  hutan: { nama: "hu.tan", def: "Tanah luas yang ditumbuhi pohon-pohon (biasanya tidak dipelihara orang)." },
  langit: { nama: "la.ngit", def: "Ruang luas yang terbentang di atas bumi tempat beradanya bintang, bulan, dan matahari." },
  tanah: { nama: "ta.nah", def: "Permukaan bumi atau lapisan bumi yang di atas sekali." },
  api: { nama: "a.pi", def: "Panas dan cahaya yang berasal dari sesuatu yang terbakar; nyala." },
  air: { nama: "a.ir", def: "Cairan jernih tidak berwarna, tidak berasa, dan tidak berbau yang terdapat di seluruh bumi." },
  udara: { nama: "u.da.ra", def: "Campuran berbagai gas yang tidak berwarna dan tidak berbau yang memenuhi ruang di atas bumi." },
  eretan: { nama: "e.ret.an", def: "Alat untuk menyeberangkan orang (barang dsb) di sungai; rakit penyeberang." },
  tanam: { nama: "ta.nam", def: "Menaruh (bibit, benih, stek, dsb) di dalam tanah supaya tumbuh." },
  nama: { nama: "na.ma", def: "Kata untuk menyebut atau memanggil orang, tempat, barang, binatang, dsb." },
  mana: { nama: "ma.na", def: "Kata tanya untuk menanyakan tempat atau sesuatu." },
  nanas: { nama: "na.nas", def: "Tanaman tropis yang buahnya berbentuk silinder, berkulit sisik bersabut, dan berwarna kuning." },
  nasib: { nama: "na.sib", def: "Sesuatu yang sudah ditentukan oleh Tuhan atas diri seseorang; takdir." },
  ibu: { nama: "i.bu", def: "Wanita yang telah melahirkan seseorang; sebutan untuk wanita yang sudah bersuami." },
  budi: { nama: "bu.di", def: "Alat batin yang merupakan paduan akal dan perasaan untuk menimbang baik dan buruk." },
  ikan: { nama: "i.kan", def: "Binatang bertulang belakang yang hidup dalam air, berdarah dingin." },
  kancil: { nama: "kan.cil", def: "Binatang menyusui berkuku genap, mirip pelanduk tetapi lebih besar." }
};

const FALLBACK_CITIES = [
  { name: "Tokyo", region: "Japan" }, { name: "Jakarta", region: "Indonesia" }, { name: "New York", region: "USA" },
  { name: "London", region: "UK" }, { name: "Paris", region: "France" }, { name: "Berlin", region: "Germany" },
  { name: "Moscow", region: "Russia" }, { name: "Beijing", region: "China" }, { name: "Sydney", region: "Australia" },
  { name: "Cairo", region: "Egypt" }, { name: "Istanbul", region: "Turkey" }, { name: "Lima", region: "Peru" },
  { name: "Amsterdam", region: "Netherlands" }, { name: "Madrid", region: "Spain" }, { name: "Dubai", region: "UAE" }
];

const DYNAMIC_CHALLENGES = [
  // Tier 1 (Mudah)
  { id: "MIN_5", label: "📏 Min 5 Letters", labelID: "📏 Min 5 Huruf", check: (w) => w.length >= 5, tier: 1 },
  { id: "MAX_5", label: "📏 Max 5 Letters", labelID: "📏 Maks 5 Huruf", check: (w) => w.length <= 5, tier: 1 },
  { id: "ODD", label: "1️⃣3️⃣5️⃣ Odd Length", labelID: "1️⃣3️⃣5️⃣ Panjang Ganjil", check: (w) => w.length % 2 !== 0, tier: 1 },
  { id: "EVEN", label: "2️⃣4️⃣6️⃣ Even Length", labelID: "2️⃣4️⃣6️⃣ Panjang Genap", check: (w) => w.length % 2 === 0, tier: 1 },
  { id: "EXACT_4", label: "📏 Exactly 4 Letters", labelID: "📏 Tepat 4 Huruf", check: (w) => w.length === 4, tier: 1 },

  // Tier 2 (Menengah)
  { id: "HAS_DOUBLE", label: "👯 Double Letters", labelID: "👯 Ada Huruf Ganda", check: (w) => /(.)\1/.test(w), tier: 2 },
  { id: "END_VOWEL", label: "🔤 End: Vowel", labelID: "🔤 Akhir: Vokal", check: (w) => /[aeiou]$/i.test(w), tier: 2 },
  { id: "END_CONS", label: "🔤 End: Consonant", labelID: "🔤 Akhir: Konsonan", check: (w) => /[^aeiou]$/i.test(w), tier: 2 },
  { id: "NO_S_R", label: "🚫 No 'S' or 'R'", labelID: "🚫 Tanpa 'S' atau 'R'", check: (w) => !/[sr]/i.test(w), tier: 2 },
  { id: "EXACT_6", label: "📏 Exactly 6 Letters", labelID: "📏 Tepat 6 Huruf", check: (w) => w.length === 6, tier: 2 },
  { id: "START_END_CONS", label: "🧱 Consonant Ends", labelID: "🧱 Awal & Akhir Konsonan", check: (w) => w.length > 1 && /^[^aeiou].*[^aeiou]$/i.test(w), tier: 2 },
  { id: "HAS_CONSECUTIVE_VOWELS", label: "🅰️🅾️ Consecutive Vowels", labelID: "🅰️🅾️ Vokal Beruntun", check: (w) => /[aeiou]{2}/i.test(w), tier: 2 },

  // Tier 3 (Sulit)
  { id: "NO_A_I", label: "🚫 No 'A' or 'I'", labelID: "🚫 Tanpa 'A' atau 'I'", check: (w) => !/[ai]/i.test(w), tier: 3 },
  { id: "NO_E_O", label: "🚫 No 'E' or 'O'", labelID: "🚫 Tanpa 'E' atau 'O'", check: (w) => !/[eo]/i.test(w), tier: 3 },
  { id: "MAX_1_VOWEL", label: "1️⃣ Max 1 Vowel", labelID: "1️⃣ Maks 1 Vokal", check: (w) => (w.match(/[aeiou]/gi) || []).length <= 1, tier: 3 },
  { id: "MUST_3_VOWELS", label: "🔤 Min 3 Vowels", labelID: "🔤 Min 3 Vokal", check: (w) => (w.match(/[aeiou]/gi) || []).length >= 3, tier: 3 },
  { id: "MIN_7", label: "📏 Min 7 Letters", labelID: "📏 Min 7 Huruf", check: (w) => w.length >= 7, tier: 3 },
  { id: "EXACT_2_VOWELS", label: "2️⃣ Exactly 2 Vowels", labelID: "2️⃣ Tepat 2 Vokal", check: (w) => (w.match(/[aeiou]/gi) || []).length === 2, tier: 3 },
  { id: "NO_E", label: "🚫 No 'E' (Hard)", labelID: "🚫 Tanpa Huruf 'E'", check: (w) => !/e/i.test(w), tier: 3 },
  { id: "NO_A", label: "🚫 No 'A' (Hard)", labelID: "🚫 Tanpa Huruf 'A'", check: (w) => !/a/i.test(w), tier: 3 },

  // Tier 4 (Ekstrem / Chaos)
  { id: "NO_VOWELS", label: "💀 No Vowels (Abbr)", labelID: "💀 Tanpa Vokal (Singkatan)", check: (w) => !/[aeiou]/i.test(w), tier: 4 },
  { id: "SAME_START_END", label: "🔄 Start = End", labelID: "🔄 Awal = Akhir", check: (w) => w.length > 1 && w[0].toLowerCase() === w[w.length - 1].toLowerCase(), tier: 4 },
  { id: "UNIQUE", label: "🌟 Unique Letters Only", labelID: "🌟 Huruf Unik Saja", check: (w) => new Set(w).size === w.length, tier: 4 },
  { id: "SECOND_VOWEL", label: "🔤 2nd Letter: Vowel", labelID: "🔤 Huruf Ke-2: Vokal", check: (w) => w.length > 1 && /[aeiou]/.test(w[1]), tier: 4 },
  { id: "CONTAINS_Y_Z_X", label: "🔠 Contains Y, Z, or X", labelID: "🔠 Mengandung Y, Z, atau X", check: (w) => /[yzx]/i.test(w), tier: 4 },
  { id: "HAS_CONSECUTIVE_CONS", label: "🧱 3+ Consonants in Row", labelID: "🧱 3+ Konsonan Beruntun", check: (w) => /[^aeiou]{3}/i.test(w), tier: 4 },
  { id: "MIDDLE_VOWEL", label: "🎯 Middle Letter is Vowel", labelID: "🎯 Huruf Tengah Vokal", check: (w) => w.length % 2 !== 0 && /[aeiou]/i.test(w[Math.floor(w.length / 2)]), tier: 4 }
];

const BOT_PROFILES = [
  { name: "Bot Balita", diff: 1 }, { name: "Bot Tolol", diff: 1 }, { name: "Bot Plenger", diff: 1 }, { name: "Bot AFK", diff: 1 }, { name: "Bot Nyasar", diff: 1 },
  { name: "Bot Santai", diff: 2 }, { name: "Bot Normal", diff: 2 }, { name: "Bot Pelajar", diff: 2 }, { name: "Bot Magang", diff: 2 },
  { name: "Bot Sepuh", diff: 3 }, { name: "Bot Suhu", diff: 3 }, { name: "Bot Psikopat", diff: 3 }, { name: "Bot Terminator", diff: 3 }, { name: "Bot Citter", diff: 3 }
];


// ==========================================
// 2. UTILITY FUNCTIONS & MANAGERS
// ==========================================
const getRandomColor = () => {
  const colors = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899", "#14B8A6"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getAvatarUrl = (id) => `https://api.dicebear.com/9.x/adventurer/svg?seed=${id}`;

const normalizeWord = (word) => {
  if (typeof word !== "string") return "";
  return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z\s]/g, "").trim();
};

function generatePattern(baseWord, dict, currentUsed) {
  // Acak semua tipe agar benar-benar dinamis dan tidak selalu memprioritaskan tengah
  const types = ["PREFIX", "SUFFIX", "WRAP", "MIDDLE"];
  types.sort(() => Math.random() - 0.5);

  for (const type of types) {
    let patternStr = "";
    let isValidMatch = (w) => false;
    
    if (type === "MIDDLE" && baseWord.length >= 5) {
        // Ambil 2 huruf secara dinamis di area tengah (bukan ujung)
        const len = 2; 
        const maxStart = baseWord.length - len - 1; 
        const startIndex = Math.floor(Math.random() * maxStart) + 1;
        const mid = baseWord.slice(startIndex, startIndex + len).toLowerCase();
        patternStr = `...${mid}...`;
        isValidMatch = (w) => w.includes(mid) && !w.startsWith(mid) && !w.endsWith(mid);
    }
    else if (type === "PREFIX" && baseWord.length >= 3) {
        // Dinamis mengambil 2 atau 3 huruf sebagai awalan
        const len = Math.min(baseWord.length - 1, Math.floor(Math.random() * 2) + 2); 
        const prefix = baseWord.slice(0, len).toLowerCase();
        patternStr = `${prefix}...`;
        isValidMatch = (w) => w.startsWith(prefix) && w.length > prefix.length;
    }
    else if (type === "SUFFIX" && baseWord.length >= 3) {
        // Dinamis mengambil 2 atau 3 huruf sebagai akhiran
        const len = Math.min(baseWord.length - 1, Math.floor(Math.random() * 2) + 2); 
        const suffix = baseWord.slice(-len).toLowerCase();
        patternStr = `...${suffix}`;
        isValidMatch = (w) => w.endsWith(suffix) && w.length > suffix.length;
    }
    else if (type === "WRAP" && baseWord.length >= 4) {
        // Dinamis: Terkadang 2 huruf di depan 1 di belakang, atau sebaliknya
        const preLen = Math.floor(Math.random() * 2) + 1;
        const sufLen = 1;
        const prefix = baseWord.slice(0, preLen).toLowerCase();
        const suffix = baseWord.slice(-sufLen).toLowerCase();
        patternStr = `${prefix}...${suffix}`;
        isValidMatch = (w) => w.startsWith(prefix) && w.endsWith(suffix) && w.length > (preLen + sufLen);
    }
    
    if (!patternStr) continue;

    let matches = 0;
    for (const w of dict) {
        if (!currentUsed.has(w) && w !== baseWord) {
            if (isValidMatch(w)) matches++;
        }
        if (matches > 1) break;
    }

    if (matches > 1) return { display: patternStr, type };
  }
  
  // Fallback Mutlak jika kebetulan semua pola di atas berujung jalan buntu
  return { display: `${baseWord.slice(-1).toLowerCase()}...`, type: "PREFIX" };
}

const getEnglishSyllableSuffix = (word) => {
  if (!word) return "";
  const w = word.toLowerCase();
  const vowelRegex = /[aeiouy]+/gi;
  const matches = [...w.matchAll(vowelRegex)];
  const isLeEnding = /[^aeiouy]le$/.test(w);
  let relevantMatches = matches;

  if (w.endsWith("e") && !isLeEnding && matches.length > 1) {
    const lastMatch = matches[matches.length - 1];
    if (lastMatch.index >= w.length - 1) relevantMatches = matches.slice(0, -1);
  }

  if (relevantMatches.length <= 1) {
    if (!isLeEnding) {
      if (relevantMatches.length > 0) {
        let rime = w.slice(relevantMatches[0].index);
        if (rime.length >= 3 && /^[aeiouy]{2}/.test(rime)) return rime.slice(1);
        return rime;
      }
      return w;
    }
  }

  let lastVowelMatch = isLeEnding ? matches[matches.length - 1] : relevantMatches[relevantMatches.length - 1];
  let prevVowelMatch = isLeEnding ? matches[matches.length - 2] : relevantMatches[relevantMatches.length - 2];

  if (!prevVowelMatch || !lastVowelMatch) return w;

  const bridgeStart = prevVowelMatch.index + prevVowelMatch[0].length;
  const bridgeEnd = lastVowelMatch.index;
  const bridge = w.slice(bridgeStart, bridgeEnd);

  let consonantsToTake = 0;
  if (bridge.length === 0) consonantsToTake = 0;
  else if (bridge.length === 1) consonantsToTake = 1;
  else {
    if (isLeEnding && bridge.length <= 2) consonantsToTake = bridge.length;
    else consonantsToTake = Math.ceil(bridge.length / 2);
  }

  const suffixStart = bridgeEnd - consonantsToTake;
  return w.slice(suffixStart);
};

const StatsManager = {
  load: (uniqueId) => {
    try {
      const data = localStorage.getItem("word_chain_stats");
      const stats = data ? JSON.parse(data) : {};
      return stats[uniqueId] || { wins: 0, games: 0, kills: 0, badges: [] };
    } catch (e) {
      return { wins: 0, games: 0, kills: 0, badges: [] };
    }
  },
  loadAll: () => {
    try {
      const data = localStorage.getItem("word_chain_stats");
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  },
  update: (uniqueId, isWin, incrementGame = true, nickname = "Player") => {
    try {
      const data = localStorage.getItem("word_chain_stats");
      const allStats = data ? JSON.parse(data) : {};
      const playerStats = allStats[uniqueId] || { wins: 0, games: 0, kills: 0, badges: [], nickname: nickname };

      if (playerStats.kills === undefined) playerStats.kills = 0;
      if (nickname) playerStats.nickname = nickname;
      if (incrementGame) playerStats.games += 1;
      if (isWin) playerStats.wins += 1;

      const newBadges = new Set(playerStats.badges);
      if (playerStats.games === 1) newBadges.add("👶");
      if (playerStats.wins >= 1) { newBadges.add("🥇"); newBadges.delete("👶"); }
      if (playerStats.wins >= 3) newBadges.add("🔥");
      if (playerStats.games >= 5) newBadges.add("💀");
      if (playerStats.wins >= 10) newBadges.add("👑");
      if (playerStats.kills >= 5) newBadges.add("🔪");
      if (playerStats.kills >= 20) newBadges.add("🥷");
      if (playerStats.kills >= 50) newBadges.add("🩸");

      playerStats.badges = Array.from(newBadges);
      allStats[uniqueId] = playerStats;
      localStorage.setItem("word_chain_stats", JSON.stringify(allStats));
      return playerStats;
    } catch (e) {
      return { wins: 0, games: 0, kills: 0, badges: [] };
    }
  },
  addKill: (uniqueId) => {
    try {
      const data = localStorage.getItem("word_chain_stats");
      const allStats = data ? JSON.parse(data) : {};
      if (allStats[uniqueId]) {
        allStats[uniqueId].kills = (allStats[uniqueId].kills || 0) + 1;
        const newBadges = new Set(allStats[uniqueId].badges);
        if (allStats[uniqueId].kills >= 5) newBadges.add("🔪");
        if (allStats[uniqueId].kills >= 20) newBadges.add("🥷");
        if (allStats[uniqueId].kills >= 50) newBadges.add("🩸");
        allStats[uniqueId].badges = Array.from(newBadges);
        localStorage.setItem("word_chain_stats", JSON.stringify(allStats));
      }
    } catch (e) {}
  }
};

const SoundManager = {
  ctx: null,
  init: () => {
    if (!SoundManager.ctx) SoundManager.ctx = new (window.AudioContext || window.webkitAudioContext)();
  },
  playTone: (freq, type, duration, vol = 0.1, slideTo = null) => {
    if (!SoundManager.ctx) SoundManager.init();
    const ctx = SoundManager.ctx;
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, ctx.currentTime + duration);

    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  },
  play: (effect) => {
    switch (effect) {
      case "join":
        SoundManager.playTone(600, "sine", 0.1, 0.1);
        setTimeout(() => SoundManager.playTone(800, "sine", 0.1, 0.1), 100);
        break;
      case "correct":
        SoundManager.playTone(523.25, "triangle", 0.1, 0.1);
        setTimeout(() => SoundManager.playTone(659.25, "triangle", 0.1, 0.1), 100);
        setTimeout(() => SoundManager.playTone(783.99, "triangle", 0.3, 0.1), 200);
        break;
      case "wrong":
        SoundManager.playTone(150, "sawtooth", 0.3, 0.1);
        setTimeout(() => SoundManager.playTone(100, "sawtooth", 0.3, 0.1), 150);
        break;
      case "eliminate":
        SoundManager.playTone(400, "sawtooth", 0.5, 0.1, 100);
        break;
      case "tick":
        SoundManager.playTone(800, "square", 0.05, 0.05);
        break;
      case "start":
        SoundManager.playTone(440, "sine", 0.1, 0.1);
        setTimeout(() => SoundManager.playTone(880, "sine", 0.4, 0.1), 200);
        break;
      case "win":
        [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5].forEach((freq, i) => {
          setTimeout(() => SoundManager.playTone(freq, "square", 0.2, 0.1), i * 150);
        });
        break;
      case "notification":
        SoundManager.playTone(600, "sine", 0.1, 0.1);
        setTimeout(() => SoundManager.playTone(1200, "sine", 0.2, 0.1), 100);
        break;
      default: break;
    }
  }
};


// ==========================================
// 3. MAIN COMPONENT
// ==========================================
export default function App() {
  // === STATE ===
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState("WAITING");
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [usedWords, setUsedWords] = useState(new Set());
  const [gameMode, setGameMode] = useState("LAST_LETTER");
  const [language, setLanguage] = useState("EN");
  const [targetRhyme, setTargetRhyme] = useState("");
  const [tableStatus, setTableStatus] = useState("idle");
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  
  const [actionCardsEnabled, setActionCardsEnabled] = useState(false);
  const [pointRushEnabled, setPointRushEnabled] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  const [overlapLength, setOverlapLength] = useState(1);
  const [isRandomOverlap, setIsRandomOverlap] = useState(false);
  const [autoRestartEnabled, setAutoRestartEnabled] = useState(false);
  const [restartCountdown, setRestartCountdown] = useState(null);
  const [waitingCountdown, setWaitingCountdown] = useState(null);
  const [playerQueue, setPlayerQueue] = useState([]);
  const [showcaseWords, setShowcaseWords] = useState([]); 
  const [lastPlay, setLastPlay] = useState(null); // STATE BARU: Untuk melacak kata terakhir yang sukses dimainkan

  const [showStats, setShowStats] = useState(false);
  const [allStats, setAllStats] = useState([]);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [turnCount, setTurnCount] = useState(0);
  const [challengeQueue, setChallengeQueue] = useState([]);

  const [gameDuration, setGameDuration] = useState(60);
  const [targetScore, setTargetScore] = useState(50);
  const [targetRounds, setTargetRounds] = useState(3);
  const [winCondition, setWinCondition] = useState("TIME");
  const [globalTimer, setGlobalTimer] = useState(null);
  const [roundStarterId, setRoundStarterId] = useState(null);

  const [dictionary, setDictionary] = useState(FALLBACK_DICTIONARY_EN);
  const [syllableMap, setSyllableMap] = useState({});
  const [cityMetadata, setCityMetadata] = useState({});
  const [logs, setLogs] = useState([]);
  const [activeEffects, setActiveEffects] = useState([]); 
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  const [maxPlayers, setMaxPlayers] = useState(8);
  const [turnDuration, setTurnDuration] = useState(15);
  const [timer, setTimer] = useState(turnDuration);
  const [manualInput, setManualInput] = useState("");
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState("rules");
  const [dictLoadedInfo, setDictLoadedInfo] = useState("Default (EN)");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showLogs, setShowLogs] = useState(true);

  // === REFS ===
  const quitHistoryRef = useRef({});
  const bombNextRef = useRef(false);
  const rhymeTargetsRef = useRef([]);
  const tableStatusTimeout = useRef(null);
  const lastSuccessfulPlayerIdRef = useRef(null);
  const timerRef = useRef(null);
  const wsRef = useRef(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const fallbackToLocalhostRef = useRef(false);
  const feedbackTimeoutRef = useRef(null);
  const chatHandlerRef = useRef(null);
  const phraseDictionary = useRef(new Set(FALLBACK_PHRASES_EN));
  
  const dictionaryCache = useRef({
    EN: { dict: FALLBACK_DICTIONARY_EN, syl: {}, info: "Default (EN)", phrases: new Set(FALLBACK_PHRASES_EN) },
    ID: null, CITIES: null, MIX: null
  });

  const playersRef = useRef(players);
  const turnIndexRef = useRef(currentTurnIndex);
  const turnDurationRef = useRef(turnDuration);
  const usedWordsRef = useRef(usedWords);
  const syllableMapRef = useRef(syllableMap);
  const isMutedRef = useRef(isMuted);
  const cityMetadataRef = useRef(cityMetadata);
  const challengeQueueRef = useRef(challengeQueue);
  const languageRef = useRef(language);
  const gameModeRef = useRef(gameMode);
  const currentWordRef = useRef(currentWord);
  const targetRhymeRef = useRef(targetRhyme);
  const gameStateRef = useRef(gameState);
  const winConditionRef = useRef(winCondition);
  const targetRoundsRef = useRef(targetRounds);
  const targetScoreRef = useRef(targetScore);
  const actionCardsEnabledRef = useRef(actionCardsEnabled);
  const pointRushEnabledRef = useRef(pointRushEnabled);
  const isReversedRef = useRef(isReversed);
  const overlapLengthRef = useRef(overlapLength);
  const isRandomOverlapRef = useRef(isRandomOverlap);
  const activeChallengeRef = useRef(activeChallenge);
  const autoRestartEnabledRef = useRef(autoRestartEnabled);
  const playerQueueRef = useRef(playerQueue);
  const playedWordsHistoryRef = useRef([]); 

  // === EFFECTS ===
  
  useEffect(() => {
    playersRef.current = players; turnIndexRef.current = currentTurnIndex;
    turnDurationRef.current = turnDuration; usedWordsRef.current = usedWords;
    syllableMapRef.current = syllableMap; isMutedRef.current = isMuted;
    cityMetadataRef.current = cityMetadata; challengeQueueRef.current = challengeQueue;
    languageRef.current = language; gameModeRef.current = gameMode;
    currentWordRef.current = currentWord; targetRhymeRef.current = targetRhyme;
    gameStateRef.current = gameState; winConditionRef.current = winCondition;
    targetRoundsRef.current = targetRounds; targetScoreRef.current = targetScore;
    actionCardsEnabledRef.current = actionCardsEnabled;
    pointRushEnabledRef.current = pointRushEnabled;
    isReversedRef.current = isReversed;
    overlapLengthRef.current = overlapLength;
    isRandomOverlapRef.current = isRandomOverlap;
    activeChallengeRef.current = activeChallenge;
    autoRestartEnabledRef.current = autoRestartEnabled;
    playerQueueRef.current = playerQueue;
  }, [
    players, currentTurnIndex, turnDuration, usedWords, syllableMap, isMuted,
    cityMetadata, challengeQueue, language, gameMode, currentWord, targetRhyme,
    gameState, winCondition, targetRounds, targetScore, actionCardsEnabled, pointRushEnabled, isReversed, overlapLength, isRandomOverlap, activeChallenge, autoRestartEnabled, playerQueue
  ]);

  useEffect(() => {
    let interval;
    if (gameState === "ENDED" && autoRestartEnabled) {
      setRestartCountdown(10);
      interval = setInterval(() => {
        setRestartCountdown(prev => {
          if (prev !== null && prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
    } else {
      setRestartCountdown(null);
    }
    return () => clearInterval(interval);
  }, [gameState, autoRestartEnabled]);

  useEffect(() => {
    if (restartCountdown === 0 && gameState === "ENDED") {
      setRestartCountdown(null);
      clearLobby();
      pickShowcaseWords();
      setWaitingCountdown(60);
      addLog("System", "Lobby dibuka 60 detik untuk pemain baru!");
    }
  }, [restartCountdown, gameState]);

  useEffect(() => {
    let interval;
    if (gameState === "WAITING" && waitingCountdown !== null) {
      if (waitingCountdown > 0) {
        interval = setInterval(() => {
          setWaitingCountdown(prev => prev - 1);
        }, 1000);
      } else {
        setWaitingCountdown(null);
        if (playersRef.current.length >= 2) {
           startGame();
        } else {
           addLog("System", t("log_need_players"));
        }
      }
    }
    return () => clearInterval(interval);
  }, [gameState, waitingCountdown]);

  useEffect(() => {
    const counts = {};
    dictionary.forEach(w => {
      if (w.length >= 4) {
        const s3 = w.slice(-3); const s4 = w.slice(-4);
        counts[s3] = (counts[s3] || 0) + 1; counts[s4] = (counts[s4] || 0) + 1;
      } else if (w.length === 3) {
        const s2 = w.slice(-2); counts[s2] = (counts[s2] || 0) + 1;
      }
    });
    const targets = [];
    Object.keys(counts).forEach(k => { if (counts[k] > 10) targets.push(k); });
    rhymeTargetsRef.current = targets.sort((a,b) => counts[b] - counts[a]);
  }, [dictionary]);

  useEffect(() => {
    if (showStats) {
      const rawStats = StatsManager.loadAll();
      const statsArray = Object.keys(rawStats).map((key) => ({ id: key, ...rawStats[key] }));
      statsArray.sort((a, b) => b.wins !== a.wins ? b.wins - a.wins : b.games - a.games);
      setAllStats(statsArray);
    }
  }, [showStats]);

  const isScoreMode = () => pointRushEnabledRef.current;

  // --- FUNGSI BARU: Mengambil kata untuk Showcase ---
  const pickShowcaseWords = () => {
    let candidates = [...playedWordsHistoryRef.current];
    
    // Prioritaskan kata yang paling panjang
    candidates.sort((a, b) => b.word.length - a.word.length);
    
    let selected = [];
    let usedNicknames = new Set();

    for (let i = 0; i < candidates.length; i++) {
      if (selected.length >= 3) break;
      if (!usedNicknames.has(candidates[i].nickname)) {
        selected.push(candidates[i]);
        usedNicknames.add(candidates[i].nickname);
      }
    }

    if (selected.length < 3) {
      for (let i = 0; i < candidates.length; i++) {
        if (selected.length >= 3) break;
        if (!selected.find(s => s.word === candidates[i].word)) {
          selected.push(candidates[i]);
        }
      }
    }

    playedWordsHistoryRef.current = playedWordsHistoryRef.current.filter(
      h => !selected.find(s => s.word === h.word)
    );
    
    if (selected.length < 3) {
      const fallbackKeys = Object.keys(syllableMapRef.current).filter(k => syllableMapRef.current[k]?.def);
      const shuffledFallback = fallbackKeys.sort(() => Math.random() - 0.5);
      for (const key of shuffledFallback) {
        if (selected.length >= 3) break;
        if (!selected.find(s => s.word === key)) {
          const fakeNames = ["AI Kamus", "Bot Pintar", "Suhu Bahasa", "Penonton Setia"];
          const selectedName = fakeNames[Math.floor(Math.random() * fakeNames.length)];
          selected.push({
            word: key,
            nickname: selectedName,
            avatarUrl: getAvatarUrl(key), 
            def: syllableMapRef.current[key].def
          });
        }
      }
    }

    if (selected.length === 0) {
      selected.push({ word: "EDUKASI", nickname: "Sistem Pusat", avatarUrl: getAvatarUrl("edu"), def: "Proses pengubahan sikap dan tata laku seseorang atau kelompok dalam usaha mendewasakan manusia melalui pengajaran dan pelatihan." });
      selected.push({ word: "ESTETIK", nickname: "Sistem Pusat", avatarUrl: getAvatarUrl("est"), def: "Mengenai keindahan; menyangkut apresiasi keindahan (alam, seni, dan sastra)." });
      selected.push({ word: "KREATIF", nickname: "Sistem Pusat", avatarUrl: getAvatarUrl("kreatif"), def: "Memiliki daya cipta; memiliki kemampuan untuk menciptakan." });
    } else if (selected.length === 1) {
       selected.push({ word: "BAHASA", nickname: "Sistem Pusat", avatarUrl: getAvatarUrl("bahasa"), def: "Sistem lambang bunyi yang arbitrer, yang digunakan oleh anggota suatu masyarakat untuk bekerja sama dan berinteraksi." });
       selected.push({ word: "KREATIF", nickname: "Sistem Pusat", avatarUrl: getAvatarUrl("kreatif"), def: "Memiliki daya cipta; memiliki kemampuan untuk menciptakan." });
    } else if (selected.length === 2) {
       selected.push({ word: "KREATIF", nickname: "Sistem Pusat", avatarUrl: getAvatarUrl("kreatif"), def: "Memiliki daya cipta; memiliki kemampuan untuk menciptakan." });
    }
    
    setShowcaseWords(selected);
  };

  useEffect(() => {
    if (gameState === "PLAYING") {
      clearInterval(timerRef.current);
      if (bombNextRef.current) {
        setTimer(10);
        bombNextRef.current = false;
      } else {
        setTimer(turnDuration);
      }
      timerRef.current = setInterval(() => {
        setTimer((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [currentTurnIndex, gameState, turnDuration, currentWord, gameMode]);

  useEffect(() => {
    if (gameState !== "PLAYING") return;
    if (timer <= 5 && timer > 0) playSound("tick");
    if (timer === 0) handleTimeout();
  }, [timer, gameState]);

  useEffect(() => {
    if (gameState !== "PLAYING") return;
    const currentPlayer = players[currentTurnIndex];
    if (currentPlayer && currentPlayer.isBot && !currentPlayer.isEliminated) {
      const diff = currentPlayer.botDifficulty || 2;
      let minTime = 2000, maxTime = 4000;
      if (diff === 1) { minTime = 3500; maxTime = 6500; }
      if (diff === 3) { minTime = 500; maxTime = 1500; }
      const thinkingTime = Math.floor(Math.random() * (maxTime - minTime)) + minTime;
      const botTimer = setTimeout(() => {
        if (currentWordRef.current !== currentWord && gameModeRef.current !== "RHYME") return;
        const dictArray = Array.from(dictionary);
        let candidates = dictArray.filter((word) => !usedWordsRef.current.has(word) && validateConnection(currentWordRef.current, word));
        if (candidates.length > 0) {
          if (diff === 1 && Math.random() < 0.20) {
            addLog("Bot", `${currentPlayer.nickname} ${t("log_stumped")}`);
            return;
          }
          let selectedWord;
          if (diff === 3) {
            let preferredCandidates = candidates;
            if (actionCardsEnabledRef.current) {
              const actionCandidates = candidates.filter(w => {
                const low = w.toLowerCase();
                return low.endsWith('sk') || low.endsWith('bo') || low.endsWith('po') || low.endsWith('rv');
              });
              if (actionCandidates.length > 0 && Math.random() < 0.85) preferredCandidates = actionCandidates;
            }
            
            preferredCandidates.sort((a, b) => b.length - a.length);
            
            const topCandidates = preferredCandidates.slice(0, 20);
            const aliveCount = players.filter(p => !p.isEliminated).length;
            
            let killMove = null;
            let safeMoves = [];

            for (const w of topCandidates) {
              let steps = 1;
              const low = w.toLowerCase();
              if (actionCardsEnabledRef.current && low.endsWith('sk')) steps = 2;
              
              const landsOnSelf = (steps % aliveCount === 0);
              
              let isDeadlock = false;
              if (isRandomOverlapRef.current && gameModeRef.current !== "FILL_BLANK") {
                  isDeadlock = true;
                  for(let i=1; i<=Math.min(4, w.length); i++) {
                      if(hasPossibleAnswer(w, i)) { isDeadlock = false; break; }
                  }
              } else {
                  isDeadlock = !hasPossibleAnswer(w);
              }

              if (isDeadlock) {
                if (!landsOnSelf) {
                  killMove = w;
                  break; 
                }
              } else {
                safeMoves.push(w);
              }
            }

            if (killMove) {
              selectedWord = killMove;
            } else if (safeMoves.length > 0) {
              selectedWord = safeMoves[Math.floor(Math.random() * Math.min(3, safeMoves.length))];
            } else {
              selectedWord = candidates[Math.floor(Math.random() * candidates.length)];
            }
          } else if (diff === 1) {
            candidates.sort((a, b) => a.length - b.length);
            selectedWord = candidates[Math.floor(Math.random() * Math.min(3, candidates.length))];
          } else {
            if (actionCardsEnabledRef.current) {
              const actionCandidates = candidates.filter(w => {
                const low = w.toLowerCase();
                return low.endsWith('sk') || low.endsWith('bo') || low.endsWith('po') || low.endsWith('rv');
              });
              if (actionCandidates.length > 0 && Math.random() < 0.4) candidates = actionCandidates;
            }
            selectedWord = candidates[Math.floor(Math.random() * candidates.length)];
          }
          submitAnswer(selectedWord);
        } else {
          addLog("Bot", `${currentPlayer.nickname} ${t("log_stumped")}`);
        }
      }, thinkingTime);
      return () => clearTimeout(botTimer);
    }
  }, [currentTurnIndex, gameState, currentWord, players, dictionary]);

  useEffect(() => {
    fetch("/dictionary.json")
      .then((res) => { if (!res.ok) throw new Error("Not found"); return res.json(); })
      .then((data) => {
        const rawWords = Object.keys(data);
        const cleanedWords = rawWords.filter((w) => !w.includes(" ")).map((w) => normalizeWord(w)).filter((w) => w.length > 0);
        const newDict = new Set(cleanedWords);
        setDictionary(newDict);
        setDictLoadedInfo(`Loaded (${cleanedWords.length})`);
        dictionaryCache.current.EN = { dict: newDict, syl: {}, info: `Loaded (${cleanedWords.length})`, phrases: new Set(FALLBACK_PHRASES_EN) };
      }).catch(() => {});
    connectWebSocket();
    return () => {
      if (wsRef.current) { wsRef.current.onclose = null; wsRef.current.close(); }
      clearInterval(timerRef.current);
    };
  }, []);

  const triggerVisualEffect = (type, uniqueId, data) => {
    const id = `${type}-${Date.now()}-${Math.random()}`;
    setActiveEffects(prev => [...prev, { id, type, uniqueId, ...data }]);
    setTimeout(() => {
        setActiveEffects(prev => prev.filter(e => e.id !== id));
    }, type === 'gift' ? 3000 : 2000);
  };

  const connectWebSocket = () => {
    const hostname = fallbackToLocalhostRef.current ? "localhost" : window.location.hostname || "localhost";
    const url = `ws://${hostname}:62024`;
    wsRef.current = new WebSocket(url);
    wsRef.current.onopen = () => { 
      setConnectionStatus("ws_only");
      addLog("System", `Connected to Backend (${hostname})`); 
      fallbackToLocalhostRef.current = false; 
    };
    wsRef.current.onmessage = (event) => {
      try {
        const { event: eventName, data } = JSON.parse(event.data);
        if (eventName === "chat" && chatHandlerRef.current) chatHandlerRef.current(data);
        
        if (eventName === "gift") triggerVisualEffect("gift", data.uniqueId, { 
            nickname: data.nickname, 
            profilePictureUrl: data.profilePictureUrl, 
            giftName: data.giftName, 
            giftPictureUrl: data.giftPictureUrl 
        });
        if (eventName === "like") triggerVisualEffect("like", data.uniqueId, { 
            nickname: data.nickname, 
            profilePictureUrl: data.profilePictureUrl, 
            count: Math.min(data.likeCount || 1, 5) 
        });

        if (eventName === "tiktok_connected") {
          setConnectionStatus("tiktok_ready");
          addLog("System", `Terkoneksi ke TikTok Live! 🟢`);
          playSound("notification");
        }
        if (eventName === "tiktok_disconnected") {
          setConnectionStatus("ws_only");
          addLog("System", `Terputus dari TikTok Live 🔴`);
        }
      } catch (err) { console.error("WS Error", err); }
    };
    wsRef.current.onclose = () => {
      setConnectionStatus("disconnected");
      if (!fallbackToLocalhostRef.current && window.location.hostname !== "localhost") {
        fallbackToLocalhostRef.current = true;
      }
      setTimeout(connectWebSocket, 5000);
    };
  };

  useEffect(() => { chatHandlerRef.current = handleChatEvent; });

  const isHostJoined = players.some((p) => p.uniqueId === "host_player");
  const playSound = (effect) => { if (!isMutedRef.current) SoundManager.play(effect); };
  const t = (key) => TRANSLATIONS[language === "MIX" ? "ID" : language]?.[key] || TRANSLATIONS["EN"][key] || key;

  const addLog = (user, message, uniqueId = null) => {
    const logId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setLogs((prev) => [{ user, message, id: logId, uniqueId }, ...prev].slice(0, 50));
  };

  const triggerTableEffect = (status) => {
    if (tableStatusTimeout.current) clearTimeout(tableStatusTimeout.current);
    setTableStatus(status);
    tableStatusTimeout.current = setTimeout(() => setTableStatus("idle"), 500);
  };

  const showFeedback = (text, type) => {
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    setFeedbackMessage({ text, type });
    feedbackTimeoutRef.current = setTimeout(() => setFeedbackMessage(null), 2000);
  };

  const generateChallengeQueue = () => {
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
    return [
      ...shuffle(DYNAMIC_CHALLENGES.filter((c) => c.tier === 1)),
      ...shuffle(DYNAMIC_CHALLENGES.filter((c) => c.tier === 2)),
      ...shuffle(DYNAMIC_CHALLENGES.filter((c) => c.tier === 3)),
      ...shuffle(DYNAMIC_CHALLENGES.filter((c) => c.tier === 4))
    ];
  };

  const getNextChallenge = (queue, currentSuffix) => {
    let tempQueue = [...queue];
    if (tempQueue.length === 0) tempQueue = generateChallengeQueue();
    for (let i = 0; i < tempQueue.length; i++) {
      const challenge = tempQueue[i];
      let isSafe = true;
      
      if (challenge.id === "NO_VOWELS" && /[aeiou]/i.test(currentSuffix)) isSafe = false;
      else if (challenge.id === "MAX_1_VOWEL" && (currentSuffix.match(/[aeiou]/gi) || []).length > 1) isSafe = false;
      else if (challenge.id === "EXACT_2_VOWELS" && (currentSuffix.match(/[aeiou]/gi) || []).length > 2) isSafe = false;
      else if (challenge.id === "UNIQUE" && new Set(currentSuffix).size !== currentSuffix.length) isSafe = false;
      else if (challenge.id === "START_END_CONS" && /[aeiou]/i.test(currentSuffix[0])) isSafe = false;
      else if (challenge.id === "SECOND_VOWEL" && currentSuffix.length >= 2 && !/[aeiou]/i.test(currentSuffix[1])) isSafe = false;
      else if (challenge.id === "EXACT_4" && currentSuffix.length >= 4) isSafe = false;
      else if (challenge.id === "MAX_5" && currentSuffix.length >= 5) isSafe = false;
      else if (challenge.id === "EXACT_6" && currentSuffix.length >= 6) isSafe = false;
      else if (challenge.id.startsWith("NO_")) {
        const forbiddenChars = challenge.id.replace("NO_", "").toLowerCase().split("_");
        if (forbiddenChars.some((char) => currentSuffix.includes(char))) isSafe = false;
      }
      
      if (isSafe) return { selected: tempQueue.splice(i, 1)[0], newQueue: tempQueue };
    }
    return { selected: tempQueue.shift(), newQueue: tempQueue };
  };

  function getSuffixOrRule(word) {
    const overlap = overlapLengthRef.current;
    if (gameMode === "CITIES" || gameMode === "LAST_LETTER" || gameMode === "DYNAMIC") return word.slice(-overlap);
    if (gameMode === "RHYME") return targetRhymeRef.current || word.slice(-2);
    if (gameMode === "PHRASE_CHAIN") return word;
    if (gameMode === "MIRROR") return word.slice(0, overlap);
    if (gameMode === "WRAP_AROUND") return `${word.slice(-overlap)}...${word.slice(0, overlap)}`;
    if (gameMode === "STEP_UP") return word.slice(-overlap);
    if (gameMode === "SECOND_LETTER") return word.length >= 2 ? word[1] : "";
    if (gameMode === "LONGER_WORD") return word.slice(-overlap);
    if ((language === "ID" || language === "MIX") && gameMode === "SYLLABLE") {
      const data = syllableMapRef.current[word.toLowerCase()];
      if (data && data.nama) return data.nama.split(".").pop();
      const overlapData = getIndonesianOverlapSuffix(word);
      return overlapData.length > 0 ? overlapData : word.slice(-2);
    }
    return getEnglishSyllableSuffix(word);
  }

  function getRecoverySuffix(word) {
    return (language === "ID" || language === "MIX") ? getIndonesianOverlapSuffix(word) : getEnglishSyllableSuffix(word);
  }

  function getIndonesianOverlapSuffix(word) {
    const w = word.toLowerCase();
    const vowels = /[aeiou]/gi;
    const lastVowelMatch = [...w.matchAll(vowels)].pop();
    if (!lastVowelMatch) return w.slice(-2);
    if (lastVowelMatch.index === w.length - 1) return w.slice(Math.max(0, w.length - 2));
    return w.slice(lastVowelMatch.index);
  }

  function getRuleDisplay(word) {
    const target = getSuffixOrRule(word).toUpperCase();
    const action = t("rule_start");
    const labelID = (challenge) => ((language === "ID" || language === "MIX") && challenge?.labelID) ? challenge.labelID : challenge?.label;
    const overlap = overlapLength;
    
    if (gameMode === "FILL_BLANK") return { label: "Lengkapi Kata", target: word.toUpperCase(), desc: `Cocokkan dengan pola huruf`, action: "Pola:" };
    if (gameMode === "CITIES") return { label: "City Chain", target, desc: `${t("rule_end")} '${target}'`, action };
    if (gameMode === "WRAP_AROUND") return { label: "Wrap Around", target: `${word.slice(-overlap).toUpperCase()}...${word.slice(0, overlap).toUpperCase()}`, desc: `${t("rule_start")} '${word.slice(-overlap).toUpperCase()}' & ${t("rule_end")} '${word.slice(0, overlap).toUpperCase()}'`, action: "" };
    if (gameMode === "PHRASE_CHAIN") return { label: "Phrase Chain", target, desc: `${t("rule_phrase")}: ${target} ...`, action: "Add next word" };
    if (gameMode === "DYNAMIC") return { label: `Dynamic Chaos (${overlap})`, target, desc: activeChallenge ? `${labelID(activeChallenge)} • ${t("rule_end")} '${target}'` : `${t("rule_end")} '${target}'`, action };
    if (gameMode === "RHYME") return { label: "Rhyme Rush", target: targetRhyme.toUpperCase(), desc: `${t("rule_end")} ...${targetRhyme.toUpperCase()}`, action: "Target" };
    if (gameMode === "MIRROR") return { label: `Mirror Chain (${overlap})`, target, desc: `${t("rule_mirror")} '${target}'`, action: "End with" };
    
    if (gameMode === "STEP_UP") {
        const nextLen1 = Math.max(3, overlap + 1);
        const nextLen2 = Math.max(4, overlap + 2);
        return { label: word.length >= 10 ? "Step Up (Reset)" : `Step Up (${overlap})`, target, desc: `${t("rule_end")} '${target}' (${word.length >= 10 ? t("rule_ladder_reset") + ` -> ${nextLen1}/${nextLen2}` : t("rule_ladder") + " -> " + (word.length + 1)})`, action };
    }
    if (gameMode === "LONGER_WORD") {
        const resetLen = Math.max(4, overlap + 1);
        return { label: word.length >= 10 ? "Longer Word (Reset)" : `Longer (${overlap})`, target: `> ${word.length >= 10 ? (resetLen - 1) + ' chars' : word.length}`, desc: `${t("rule_end")} '${target}' (> ${word.length >= 10 ? (resetLen - 1) + ' letters - RESET!' : word.length + ' letters'})`, action };
    }
    
    if (gameMode === "LAST_LETTER") return { label: `Last Letter(s) [${overlap}]`, target, desc: `${t("rule_end")} '${target}'`, action };
    if (gameMode === "SECOND_LETTER") return { label: "2nd Letter", target, desc: `2nd Letter is '${target}'`, action };
    
    return { label: "Last Syllable", target, desc: `${t("rule_syllable")} '${target}'`, action };
  }

  function getDisplayParts(word) {
    if (!word) return { pre: "", high: "", post: "" };
    
    if (gameMode === "FILL_BLANK") {
      const pat = word.toUpperCase();
      if (pat.startsWith("...") && pat.endsWith("...")) {
          return { pre: "...", high: pat.replace(/\.\.\./g, ""), post: "..." };
      } else if (pat.startsWith("...")) {
          return { pre: "...", high: pat.replace("...", ""), post: "" };
      } else if (pat.endsWith("...")) {
          return { pre: "", high: pat.replace("...", ""), post: "..." };
      } else if (pat.includes("...")) {
          const [pref, suf] = pat.split("...");
          return { pre: pref, high: "...", post: suf };
      }
      return { pre: "", high: pat, post: "" };
    }
    
    const overlap = overlapLengthRef.current;
    if (gameMode === "PHRASE_CHAIN") return { pre: "", high: word, post: "..." };
    if (gameMode === "RHYME") {
      const tr = targetRhymeRef.current;
      if (tr && word.toLowerCase().endsWith(tr)) {
        const splitIdx = word.length - tr.length;
        return { pre: word.slice(0, splitIdx), high: word.slice(splitIdx), post: "" };
      }
    }
    if (gameMode === "MIRROR") return word.length < overlap ? { pre: "", high: word, post: "" } : { pre: "", high: word.slice(0, overlap), post: word.slice(overlap) };
    if (gameMode === "SECOND_LETTER") return word.length < 2 ? { pre: word, high: "", post: "" } : { pre: word.slice(0, 1), high: word.slice(1, 2), post: word.slice(2) };
    if (gameMode === "WRAP_AROUND") return { pre: word.slice(0, -overlap), high: word.slice(-overlap), post: "" };
    const suffix = getSuffixOrRule(word);
    const prefixLen = Math.max(0, word.length - suffix.length);
    return { pre: word.slice(0, prefixLen), high: suffix, post: "" };
  }

  function validateConnection(prev, next) {
    if (!prev && gameMode !== "RHYME") return true;
    const p = prev ? prev.toLowerCase() : "";
    const n = next.toLowerCase();
    const currentMode = gameModeRef.current || gameMode;
    const overlap = overlapLengthRef.current;
    
    if (currentMode === "FILL_BLANK") {
      const pat = p.toLowerCase();
      if (pat.startsWith('...') && pat.endsWith('...')) {
          const mid = pat.replace(/\.\.\./g, '');
          // FIX: Cek apakah pola ada di bagian tengah kata (mengabaikan karakter pertama dan terakhir)
          // Ini mencegah penolakan kata yang kebetulan JUGA memiliki pola tersebut di akhir/awal.
          return n.slice(1, -1).includes(mid);
      } else if (pat.startsWith('...')) {
          const suf = pat.replace(/\.\.\./g, '');
          return n.endsWith(suf) && n.length > suf.length;
      } else if (pat.endsWith('...')) {
          const pref = pat.replace(/\.\.\./g, '');
          return n.startsWith(pref) && n.length > pref.length;
      } else if (pat.includes('...')) {
          const [pref, suf] = pat.split('...');
          return n.startsWith(pref) && n.endsWith(suf) && n.length > pref.length + suf.length;
      }
      return false;
    }
    
    if (currentMode === "PHRASE_CHAIN") return phraseDictionary.current.has(`${p} ${n}`);
    if (currentMode === "WRAP_AROUND") return n !== p && n.length >= overlap * 2 && n.startsWith(p.slice(-overlap)) && n.endsWith(p.slice(0, overlap));
    if (currentMode === "DYNAMIC") {
      const suffix = p.slice(-overlap);
      if (n === suffix || !n.startsWith(suffix)) return false;
      if (activeChallengeRef.current?.check && !activeChallengeRef.current.check(n)) {
        return false;
      }
      return true;
    }
    
    let requiredSuffix = "";
    
    if (currentMode === "MIRROR") { 
      requiredSuffix = p.slice(0, overlap); 
      return n !== requiredSuffix && n.endsWith(requiredSuffix); 
    }
    
    if (currentMode === "STEP_UP") {
      requiredSuffix = p.slice(-overlap);
      if (n === requiredSuffix || !n.startsWith(requiredSuffix)) return false;
      const nextLen1 = Math.max(3, overlap + 1);
      const nextLen2 = Math.max(4, overlap + 2);
      return p.length >= 10 ? (n.length === nextLen1 || n.length === nextLen2) : n.length === p.length + 1;
    }
    
    if (currentMode === "RHYME") return n !== targetRhymeRef.current && n.endsWith(targetRhymeRef.current);
    if (["CITIES", "LAST_LETTER"].includes(currentMode)) {
      requiredSuffix = p.slice(-overlap); return n !== requiredSuffix && n.startsWith(requiredSuffix);
    }
    if (currentMode === "SECOND_LETTER") {
      if (p.length < 2) return false; const targetChar = p[1]; return n !== targetChar && n.startsWith(targetChar);
    }
    
    if (currentMode === "LONGER_WORD") {
      if (!n.startsWith(p.slice(-overlap))) return false;
      const resetLen = Math.max(4, overlap + 1);
      return p.length >= 10 ? n.length >= resetLen : n.length > p.length;
    }
    
    if (currentMode === "SYLLABLE") {
      let connectionPart = "";
      if (language === "EN") {
        connectionPart = getEnglishSyllableSuffix(p);
      } else {
        const prevData = syllableMapRef.current[p];
        if (prevData?.nama) {
          connectionPart = prevData.nama.split(".").pop();
        } else {
          const overlapData = getIndonesianOverlapSuffix(p);
          connectionPart = overlapData.length > 0 ? overlapData : p.slice(-2);
        }
      }
      return n.startsWith(connectionPart) && n !== connectionPart;
    }
    return false;
  }

  function handleWin(winners) {
    const winnersArray = Array.isArray(winners) ? winners : [winners];
    const updatedStatsMap = {};
    winnersArray.forEach(w => { updatedStatsMap[w.uniqueId] = StatsManager.update(w.uniqueId, true, false, w.nickname); });
    setPlayers((prev) => prev.map(p => updatedStatsMap[p.uniqueId] ? { ...p, stats: updatedStatsMap[p.uniqueId] } : p));
    setGameState("ENDED");
    playSound("win");
  }

  function advanceTurn(currentPlayersList, startIndex, steps = 1) {
    const len = currentPlayersList.length;
    if (len === 0) return;
    let nextIndex = startIndex; let stepsTaken = 0; let attempts = 0;
    const direction = isReversedRef.current ? -1 : 1;
    while (stepsTaken < steps && attempts < len * 2) {
      nextIndex = (nextIndex + direction + len) % len;
      if (!currentPlayersList[nextIndex].isEliminated) stepsTaken++;
      attempts++;
    }
    setCurrentTurnIndex(nextIndex);
  }

  function handleTimeout() {
    clearInterval(timerRef.current);
    playSound("eliminate");
    const currentPlayers = playersRef.current;
    const currentIndex = turnIndexRef.current;
    const playerToEliminate = currentPlayers[currentIndex];
    if (!playerToEliminate || playerToEliminate.isEliminated) return;
    let killerId = null;
    if (lastSuccessfulPlayerIdRef.current && lastSuccessfulPlayerIdRef.current !== playerToEliminate.uniqueId) {
      killerId = lastSuccessfulPlayerIdRef.current;
      StatsManager.addKill(killerId);
    }
    const newPlayers = currentPlayers.map((p, idx) => {
      let pData = { ...p };
      if (idx === currentIndex) pData.isEliminated = true;
      if (killerId && p.uniqueId === killerId) pData.sessionKills = (pData.sessionKills || 0) + 1;
      return pData;
    });
    setPlayers(newPlayers);
    addLog("System", `${playerToEliminate.nickname} ${t("log_eliminated")}`);
    if (gameModeRef.current === "RHYME" && gameStateRef.current !== "ENDED") {
      setTimeout(changeRhymeTarget, 500); setTurnCount(0);
    }
    if (isScoreMode() && winConditionRef.current === "ROUNDS") {
      const activePlayers = newPlayers.filter((p) => !p.isEliminated);
      if (activePlayers.length > 0 && activePlayers.every((p) => (p.turnCount || 0) >= targetRoundsRef.current)) {
        const sorted = [...activePlayers].sort((a, b) => (b.score || 0) - (a.score || 0));
        const winners = sorted.filter(p => (p.score || 0) === (sorted[0].score || 0));
        if (winners.length > 0) handleWin(winners); else { setGameState("ENDED"); playSound("win"); }
        return;
      }
    }
    const activePlayers = newPlayers.filter((p) => !p.isEliminated);
    if (activePlayers.length <= 1) {
      if (activePlayers.length === 1) handleWin([activePlayers[0]]);
      else { setGameState("ENDED"); playSound("win"); }
    } else {
      advanceTurn(newPlayers, currentIndex, 1);
    }
  }

  const hasPossibleAnswer = (startWord, specificOverlap = null) => {
    const oldOverlap = overlapLengthRef.current;
    if (specificOverlap !== null) overlapLengthRef.current = specificOverlap;
    
    let patternToTest = startWord;
    if (gameModeRef.current === "FILL_BLANK" && !startWord.includes("...")) {
        patternToTest = generatePattern(startWord, dictionary, usedWordsRef.current).display;
    }
    
    let found = false;
    for (const candidate of dictionary) {
      if (usedWordsRef.current.has(candidate) || candidate === startWord) continue;
      if (validateConnection(patternToTest, candidate)) { found = true; break; }
    }
    
    if (specificOverlap !== null) overlapLengthRef.current = oldOverlap;
    return found;
  };

  const countPossibleAnswers = (startWord, specificOverlap = null) => {
    const oldOverlap = overlapLengthRef.current;
    if (specificOverlap !== null) overlapLengthRef.current = specificOverlap;

    let patternToTest = startWord;
    if (gameModeRef.current === "FILL_BLANK" && !startWord.includes("...")) {
        patternToTest = generatePattern(startWord, dictionary, usedWordsRef.current).display;
    }

    let count = 0;
    for (const candidate of dictionary) {
      if (usedWordsRef.current.has(candidate) || candidate === startWord) continue;
      if (validateConnection(patternToTest, candidate)) {
          count++;
          if (count > 1) break; 
      }
    }

    if (specificOverlap !== null) overlapLengthRef.current = oldOverlap;
    return count;
  };

  const getNewRandomWord = (challenge = null) => {
    if (gameModeRef.current === "PHRASE_CHAIN") {
      const phrases = Array.from(phraseDictionary.current);
      if (phrases.length === 0) return dictionary.size > 0 ? Array.from(dictionary)[0] : "word";
      return phrases[Math.floor(Math.random() * phrases.length)].split(" ")[0];
    }
    const dictArray = Array.from(dictionary);
    if (dictArray.length === 0) return "start";
    
    let candidates = dictArray.filter((w) => w.length >= 3 && w.length <= 6);
    
    if (challenge) {
      candidates = candidates.filter(w => challenge.check(w));
    }
    if (candidates.length === 0) candidates = dictArray.filter(w => !challenge || challenge.check(w));
    if (candidates.length === 0) candidates = dictArray; 
    
    for (let i = 0; i < 50; i++) {
      const choice = candidates[Math.floor(Math.random() * candidates.length)];
      if (hasPossibleAnswer(choice)) return choice;
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  function handleSurrender(playerToSurrender) {
    if (gameStateRef.current !== "PLAYING") return;
    const currentPlayers = playersRef.current;
    const pIndex = currentPlayers.findIndex(p => p.uniqueId === playerToSurrender.uniqueId);
    if (pIndex === -1 || currentPlayers[pIndex].isEliminated) return;
    playSound("eliminate");
    const isActivePlayer = pIndex === turnIndexRef.current;
    let killerId = null;
    if (isActivePlayer && lastSuccessfulPlayerIdRef.current && lastSuccessfulPlayerIdRef.current !== playerToSurrender.uniqueId) {
      killerId = lastSuccessfulPlayerIdRef.current; StatsManager.addKill(killerId);
    }
    const newPlayers = currentPlayers.map((p, idx) => {
      let pData = { ...p };
      if (idx === pIndex) pData.isEliminated = true;
      if (killerId && p.uniqueId === killerId) pData.sessionKills = (pData.sessionKills || 0) + 1;
      return pData;
    });
    playersRef.current = newPlayers;
    setPlayers(newPlayers);
    addLog("Game", `${playerToSurrender.nickname} ${t("log_surrender")}`);
    const activePlayers = newPlayers.filter((p) => !p.isEliminated);
    if (gameModeRef.current === "RHYME" && gameStateRef.current !== "ENDED" && isActivePlayer) {
      setTimeout(changeRhymeTarget, 500); setTurnCount(0);
    }
    if (isScoreMode() && winConditionRef.current === "ROUNDS") {
      if (activePlayers.length > 0 && activePlayers.every((p) => (p.turnCount || 0) >= targetRoundsRef.current)) {
        const sorted = [...activePlayers].sort((a, b) => (b.score || 0) - (a.score || 0));
        const winners = sorted.filter(p => (p.score || 0) === (sorted[0].score || 0));
        if (winners.length > 0) handleWin(winners); else { setGameState("ENDED"); playSound("win"); }
        return;
      }
    }
    if (activePlayers.length <= 1) {
      if (activePlayers.length === 1) handleWin([activePlayers[0]]);
      else { setGameState("ENDED"); playSound("win"); }
    } else if (isActivePlayer) {
      advanceTurn(newPlayers, pIndex, 1);
    }
  }

  const wordStartsPhrase = (word) => {
    const prefix = word.toLowerCase() + " ";
    for (const phrase of phraseDictionary.current) if (phrase.startsWith(prefix)) return true;
    return false;
  };

  const findRecoveryWord = (deadEndWord) => {
    const suffix = getRecoverySuffix(deadEndWord).toLowerCase();
    const candidates = [];
    for (const phrase of phraseDictionary.current) {
      const parts = phrase.split(" ");
      if (parts.length > 0 && parts[0].startsWith(suffix) && parts[0] !== deadEndWord.toLowerCase()) candidates.push(parts[0]);
    }
    return candidates.length > 0 ? { word: candidates[Math.floor(Math.random() * candidates.length)], suffix } : null;
  };

  function changeRhymeTarget() {
    const targets = rhymeTargetsRef.current;
    if (targets.length > 0) {
      let newTarget = targets[Math.floor(Math.random() * targets.length)];
      if (newTarget === targetRhymeRef.current && targets.length > 1) {
        const alt = targets.filter(t => t !== newTarget);
        newTarget = alt[Math.floor(Math.random() * alt.length)];
      }
      setTargetRhyme(newTarget);
      addLog("System", `${t("rhyme_change")}: ...${newTarget.toUpperCase()}`);
      playSound("notification"); triggerTableEffect("info"); showFeedback(`${t("rhyme_change")}: ${newTarget.toUpperCase()}`, "info");
    }
  }

  function submitAnswer(word, forcedUniqueId = null) {
    let playerIndex = turnIndexRef.current;
    if (forcedUniqueId) {
      const idx = playersRef.current.findIndex(p => p.uniqueId === forcedUniqueId);
      if (idx !== -1) playerIndex = idx;
    }
    if (gameModeRef.current !== "PHRASE_CHAIN" && !dictionary.has(word)) {
      addLog("Game", `❌ "${word}" ${t("log_invalid")}.`);
      playSound("wrong"); triggerTableEffect("error"); showFeedback(`${word} ${t("log_invalid")}`, "error");
      return;
    }
    if (usedWordsRef.current.has(word)) {
      addLog("Game", `❌ "${word}" ${t("log_used")}.`);
      playSound("wrong"); triggerTableEffect("warning"); showFeedback(`${word} ${t("log_used")}`, "warning");
      return;
    }
    const isValid = validateConnection(currentWordRef.current, word);
    if (isValid) {
      playSound("correct"); triggerTableEffect("success");
      usedWordsRef.current.add(word); setUsedWords(new Set(usedWordsRef.current));
      const prevWord = currentWordRef.current;
      let nextWord = word; let stepsToAdvance = 1; let applyBomb = false;
      let pointsAwarded = word.length;
      if (gameModeRef.current === "STEP_UP") pointsAwarded = 10;
      
      const p = playersRef.current[playerIndex];
      
      // Memicu Teks Pop-Up Kesuksesan (Float Up Animation) untuk kata yang diinput user
      setLastPlay({
          id: Date.now(),
          word: word.toUpperCase(),
          points: pointsAwarded,
          nickname: p.nickname,
          avatarUrl: p.avatarUrl
      });
      
      const defData = syllableMapRef.current[word]?.def;
      if (defData && !playedWordsHistoryRef.current.find(h => h.word === word)) {
        playedWordsHistoryRef.current.push({
          word: word,
          nickname: p.nickname,
          avatarUrl: p.avatarUrl,
          def: defData
        });
        if (playedWordsHistoryRef.current.length > 50) playedWordsHistoryRef.current.shift();
      }

      const newPlayersList = playersRef.current.map((pl, index) => {
        if (index === playerIndex) return { ...pl, score: (pl.score || 0) + pointsAwarded, turnCount: (pl.turnCount || 0) + 1 };
        return pl;
      });
      let modifiedPlayers = [...newPlayersList];
      if (actionCardsEnabledRef.current) {
        const lowWord = word.toLowerCase();
        if (lowWord.endsWith('sk')) { stepsToAdvance = 2; addLog("Action", `⏭️ SKIP!`); triggerTableEffect("warning"); playSound("notification"); }
        else if (lowWord.endsWith('bo')) { applyBomb = true; addLog("Action", `💣 BOM WAKTU! (10 Detik)`); triggerTableEffect("error"); playSound("eliminate"); }
        else if (lowWord.endsWith('rv')) {
          setIsReversed((prev) => !prev);
          isReversedRef.current = !isReversedRef.current;
          addLog("Action", `🔄 PUTAR BALIK!`);
          triggerTableEffect("info");
          playSound("notification");
        }
        else if (lowWord.endsWith('po')) { 
          const len = modifiedPlayers.length;
          const direction = isReversedRef.current ? -1 : 1;
          let nextIdx = (playerIndex + direction + len) % len;
          let attempts = 0;
          while (modifiedPlayers[nextIdx].isEliminated && attempts < len) {
            nextIdx = (nextIdx + direction + len) % len;
            attempts++;
          }
          modifiedPlayers[nextIdx] = { 
            ...modifiedPlayers[nextIdx], 
            score: Math.max(0, (modifiedPlayers[nextIdx].score || 0) - 5) 
          };
          addLog("Action", `💀 ${modifiedPlayers[nextIdx].nickname} -5 POIN!`);
          triggerTableEffect("error");
          playSound("wrong"); 
        }
      }
      setPlayers(modifiedPlayers);
      bombNextRef.current = applyBomb;
      if (isScoreMode()) {
        let gameEnded = false;
        if (winConditionRef.current === "SCORE" && modifiedPlayers[playerIndex].score >= targetScoreRef.current) gameEnded = true;
        if (winConditionRef.current === "ROUNDS") {
          const activePlayers = modifiedPlayers.filter((pl) => !pl.isEliminated);
          if (activePlayers.length > 0 && activePlayers.every((pl) => (pl.turnCount || 0) >= targetRoundsRef.current)) gameEnded = true;
        }
        if (gameEnded) {
          const activePlayers = modifiedPlayers.filter((pl) => !pl.isEliminated);
          const sorted = [...activePlayers].sort((a, b) => (b.score || 0) - (a.score || 0));
          const winners = sorted.filter(pl => (pl.score || 0) === (sorted[0].score || 0));
          lastSuccessfulPlayerIdRef.current = modifiedPlayers[playerIndex].uniqueId;
          handleWin(winners);
          return;
        }
      }
      let pts = isScoreMode() ? ` (+${pointsAwarded})` : "";
      
      if (gameModeRef.current === "FILL_BLANK") {
        nextWord = generatePattern(word, dictionary, usedWordsRef.current).display;
      }

      if (gameModeRef.current === "CITIES") {
        addLog("Game", `✅ ${word.toUpperCase()} ${cityMetadataRef.current[word] ? `(${cityMetadataRef.current[word]}) ` : ""}${pts}`);
      } else if (gameModeRef.current === "PHRASE_CHAIN") {
        addLog("Game", `✅ ${prevWord.toUpperCase()} -> ${word.toUpperCase()}${pts}`);
        if (!wordStartsPhrase(word)) {
          const recovery = findRecoveryWord(word);
          if (recovery) {
            setTimeout(() => {
              addLog("System", `${t("chain_broken")} 🔗`);
              addLog("System", `${t("reconnecting")}: ...${recovery.suffix} -> ${recovery.word.toUpperCase()}`);
              triggerTableEffect("info"); playSound("notification"); showFeedback(t("chain_broken"), "info");
            }, 600);
            nextWord = recovery.word;
          }
        }
      } else if (gameModeRef.current === "RHYME") {
        addLog("Game", `✅ ${word.toUpperCase()} (...${targetRhymeRef.current.toUpperCase()})${pts}`);
      } else if (gameModeRef.current === "WRAP_AROUND") {
        addLog("Game", `✅ ${word.toUpperCase()} (${word.slice(0, overlapLengthRef.current).toUpperCase()}...${word.slice(-overlapLengthRef.current).toUpperCase()})${pts}`);
      } else if (gameModeRef.current === "MIRROR") {
        addLog("Game", `✅ ${word.toUpperCase()} (End: ${word.slice(-overlapLengthRef.current).toUpperCase()})${pts}`);
      } else if (gameModeRef.current === "STEP_UP") {
        addLog("Game", `✅ ${word.toUpperCase()} (Len: ${word.length}) ➡️ Next: ${word.length >= 10 ? "Reset" : word.length + 1}${pts}`);
      } else if (gameModeRef.current === "FILL_BLANK") {
        addLog("Game", `✅ ${word.toUpperCase()} (+${pointsAwarded})`);
      } else {
        if (isScoreMode()) {
          addLog("Game", `✅ ${word.toUpperCase()} +${word.length} ${t("log_pts")}!`);
        } else {
          addLog("Game", `✅ ${t("log_correct")} "${word.toUpperCase()}"`);
        }
      }
      
      if ((gameModeRef.current === "DYNAMIC") && gameStateRef.current !== "ENDED") {
        const activePlayersCount = modifiedPlayers.filter(pl => !pl.isEliminated).length;
        if (turnCount + 1 >= Math.max(1, activePlayersCount)) {
          const suffix = word.slice(-overlapLengthRef.current).toLowerCase();
          const { selected, newQueue } = getNextChallenge(challengeQueueRef.current, suffix);
          setActiveChallenge(selected); 
          activeChallengeRef.current = selected; 
          setChallengeQueue(newQueue);
          challengeQueueRef.current = newQueue;
          const label = (languageRef.current === "ID" || languageRef.current === "MIX") && selected.labelID ? selected.labelID : selected.label;
          addLog("System", `🚨 ${t("log_rule_change")}: ${label} 🚨`);
          playSound("tick");
          setTurnCount(0);
        } else {
          setTurnCount(turnCount + 1);
        }
      }

      if (isRandomOverlapRef.current && gameModeRef.current !== "FILL_BLANK") {
        const maxOverlap = Math.min(4, nextWord.length);
        let nextOverlap = 1;
        let found = false;
        
        for (let i = maxOverlap; i >= 1; i--) {
          if (countPossibleAnswers(nextWord, i) > 1) {
            nextOverlap = i;
            found = true;
            break;
          }
        }
        
        if (!found) {
          for (let i = maxOverlap; i >= 1; i--) {
            if (hasPossibleAnswer(nextWord, i)) {
              nextOverlap = i; break;
            }
          }
        }
        
        setOverlapLength(nextOverlap);
        overlapLengthRef.current = nextOverlap;
      }

      setCurrentWord(nextWord);
      if (gameModeRef.current === "RHYME") {
        const activePlayersCount = modifiedPlayers.filter(pl => !pl.isEliminated).length;
        if (turnCount + 1 >= activePlayersCount) { setTimeout(changeRhymeTarget, 800); setTurnCount(0); }
        else setTurnCount(turnCount + 1);
      }
      
      lastSuccessfulPlayerIdRef.current = modifiedPlayers[playerIndex].uniqueId;
      if (gameStateRef.current !== "ENDED") advanceTurn(modifiedPlayers, playerIndex, stepsToAdvance);
    } else {
      let msg = t("log_bad_link");
      if (gameModeRef.current === "PHRASE_CHAIN") msg = "Invalid Phrase Pair";
      else if (gameModeRef.current === "RHYME") msg = "Salah Rima";
      else if (gameModeRef.current === "FILL_BLANK") msg = "Pola Huruf Tidak Cocok";
      else if (gameModeRef.current === "DYNAMIC") {
        const suffix = currentWordRef.current.slice(-overlapLengthRef.current).toLowerCase();
        if (word.toLowerCase().startsWith(suffix)) {
          if (activeChallengeRef.current?.check && !activeChallengeRef.current.check(word)) {
             const label = (languageRef.current === "ID" || languageRef.current === "MIX") && activeChallengeRef.current.labelID ? activeChallengeRef.current.labelID : activeChallengeRef.current.label;
             msg = `Gagal Aturan: ${label}`;
          }
        }
      }
      addLog("Game", `❌ "${word}" ${msg}.`);
      playSound("wrong"); triggerTableEffect("error"); showFeedback(`${word} ${msg}`, "error");
    }
  }

  function processQueue() {
    if (playerQueueRef.current.length === 0) return;
    let currentPlayers = [...playersRef.current];
    let currentQueue = [...playerQueueRef.current];
    
    while (currentPlayers.length < maxPlayers && currentQueue.length > 0) {
      const nextPlayer = currentQueue.shift();
      currentPlayers.push(nextPlayer);
      addLog("System", `${nextPlayer.nickname} bergabung dari antrean!`);
    }
    
    playersRef.current = currentPlayers;
    setPlayers(currentPlayers);
    playerQueueRef.current = currentQueue;
    setPlayerQueue(currentQueue);
  }

  function unjoinGame(uniqueId, nickname) {
    if (playerQueueRef.current.some(p => p.uniqueId === uniqueId)) {
        playerQueueRef.current = playerQueueRef.current.filter(p => p.uniqueId !== uniqueId);
        setPlayerQueue([...playerQueueRef.current]);
        addLog("System", `${nickname} keluar dari antrean.`);
        return;
    }
    if (gameStateRef.current !== "WAITING") return addLog("System", `${nickname}: ${t("log_cant_unjoin")}`);
    if (!playersRef.current.some(p => p.uniqueId === uniqueId)) return;
    quitHistoryRef.current[uniqueId] = (quitHistoryRef.current[uniqueId] || 0) + 1;
    addLog("System", `${nickname} ${t("log_unjoin")}`); playSound("eliminate");
    playersRef.current = playersRef.current.filter(p => p.uniqueId !== uniqueId);
    setPlayers([...playersRef.current]);
  }

  function joinGame(uniqueId, nickname, profilePictureUrl, botDifficulty = 0) {
    if ((quitHistoryRef.current[uniqueId] || 0) >= 2) return;
    if (playersRef.current.some((p) => p.uniqueId === uniqueId)) return;
    if (playerQueueRef.current.some((p) => p.uniqueId === uniqueId)) return;

    const isBot = botDifficulty > 0;
    const stats = isBot ? { wins: 0, games: 0, kills: 0, badges: [] } : StatsManager.load(uniqueId);
    const newPlayer = {
      id: uniqueId, uniqueId, nickname, avatarUrl: profilePictureUrl || getAvatarUrl(uniqueId),
      isEliminated: false, color: getRandomColor(), isBot, botDifficulty, stats, score: 0, turnCount: 0, sessionKills: 0
    };

    if (gameStateRef.current !== "WAITING") {
      playerQueueRef.current = [...playerQueueRef.current, newPlayer];
      setPlayerQueue([...playerQueueRef.current]);
      playSound("notification");
      addLog("System", `${nickname} masuk antrean next game!`, uniqueId);
      return;
    }

    if (playersRef.current.length >= maxPlayers) {
      playerQueueRef.current = [...playerQueueRef.current, newPlayer];
      setPlayerQueue([...playerQueueRef.current]);
      addLog("System", `Lobby penuh, ${nickname} antre!`, uniqueId);
      return;
    }

    playSound("join"); addLog("System", `${nickname} ${t("log_joined")}`, uniqueId);
    playersRef.current = [...playersRef.current, newPlayer]; setPlayers([...playersRef.current]);
  }

  function addBot() {
    const existingNames = new Set(playersRef.current.map((p) => p.nickname));
    const availableBots = BOT_PROFILES.filter((b) => !existingNames.has(b.name));
    if (availableBots.length === 0) {
      joinGame(`bot_${Date.now()}_${Math.random()}`, `Bot Kloning ${Math.floor(Math.random() * 100)}`, null, 2);
      return;
    }
    const selected = availableBots[Math.floor(Math.random() * availableBots.length)];
    joinGame(`bot_${Date.now()}_${Math.random()}`, selected.name, null, selected.diff);
  }

  function addHost() { joinGame("host_player", "HOST", `https://api.dicebear.com/9.x/fun-emoji/svg?seed=HOST`, 0); }

  const loadCitiesData = (citiesArray) => {
    const dictSet = new Set(); const meta = {};
    citiesArray.forEach((city) => {
      const cleanName = normalizeWord(city.name);
      if (cleanName) { dictSet.add(cleanName); if (city.region) meta[cleanName] = city.region; }
    });
    setDictionary(dictSet); setCityMetadata(meta); setDictLoadedInfo(`Cities (${dictSet.size})`);
    dictionaryCache.current.CITIES = { dict: dictSet, syl: {}, info: `Cities (${dictSet.size})`, meta: meta };
    addLog("System", "Loaded World Cities!");
  };

  function startGame() {
    if (playersRef.current.length < 2) return addLog("System", t("log_need_players"));
    playSound("start");
    setWaitingCountdown(null);
    bombNextRef.current = false; lastSuccessfulPlayerIdRef.current = null;
    setIsReversed(false);
    
    let randomStart = "";
    let selectedChallenge = null;

    if (gameModeRef.current === "DYNAMIC") {
      const queue = generateChallengeQueue();
      const { selected, newQueue } = getNextChallenge(queue, "");
      selectedChallenge = selected;
      setActiveChallenge(selected); 
      activeChallengeRef.current = selected;
      setChallengeQueue(newQueue); setTurnCount(0);
      const label = (languageRef.current === "ID" || languageRef.current === "MIX") && selected.labelID ? selected.labelID : selected.label;
      addLog("System", `Mode: DYNAMIC CHAOS! \nRule: ${label}`);
    }

    if (gameModeRef.current === "RHYME") {
      setTargetRhyme(rhymeTargetsRef.current.length > 0 ? rhymeTargetsRef.current[Math.floor(Math.random() * rhymeTargetsRef.current.length)] : "ing");
    } else if (gameModeRef.current === "FILL_BLANK") {
      const baseW = getNewRandomWord(selectedChallenge);
      const pat = generatePattern(baseW, dictionary, new Set());
      randomStart = pat.display;
    } else {
      randomStart = getNewRandomWord(selectedChallenge);
    }
    
    const initialUsed = new Set(gameModeRef.current === "FILL_BLANK" ? [] : (randomStart ? [randomStart] : []));
    setUsedWords(initialUsed); usedWordsRef.current = initialUsed;
    const updatedStatsMap = {};
    playersRef.current.forEach((p) => { if (!p.isBot) updatedStatsMap[p.uniqueId] = StatsManager.update(p.uniqueId, false, true, p.nickname); });
    setPlayers((prev) => prev.map((p) => ({ ...p, stats: updatedStatsMap[p.uniqueId] || p.stats, score: 0, turnCount: 0, sessionKills: 0, isEliminated: false })));
    if (isScoreMode() && winConditionRef.current === "TIME") setGlobalTimer(gameDuration);
    
    if (gameModeRef.current === "RHYME") { setTurnCount(0); addLog("System", `Mode: RHYME RUSH! Target: ...${targetRhymeRef.current || ""}`); }
    
    if (isRandomOverlapRef.current && randomStart && gameModeRef.current !== "FILL_BLANK") {
      const maxOverlap = Math.min(4, randomStart.length);
      let nextOverlap = 1;
      let found = false;
      
      for (let i = maxOverlap; i >= 1; i--) {
        if (countPossibleAnswers(randomStart, i) > 1) {
          nextOverlap = i;
          found = true;
          break;
        }
      }
      
      if (!found) {
        for (let i = maxOverlap; i >= 1; i--) {
          if (hasPossibleAnswer(randomStart, i)) {
            nextOverlap = i; break;
          }
        }
      }
      
      setOverlapLength(nextOverlap);
      overlapLengthRef.current = nextOverlap;
    }

    setCurrentWord(randomStart);
    const randomFirstPlayerIndex = Math.floor(Math.random() * playersRef.current.length);
    setCurrentTurnIndex(randomFirstPlayerIndex); setRoundStarterId(playersRef.current[randomFirstPlayerIndex].uniqueId);
    setTimer(turnDuration); setGameState("PLAYING"); setShowSettings(false);
    addLog("System", `Start: ${playersRef.current[randomFirstPlayerIndex].nickname} ${t("log_goes_first")}`);
    if (randomStart) addLog("System", `Word: ${randomStart.toUpperCase()} ${cityMetadataRef.current[randomStart] ? `(${cityMetadataRef.current[randomStart]})` : ""}`);
  }

  function resetGame() {
    setGameState("WAITING");
    setWaitingCountdown(null);
    processQueue();
    setPlayers((prev) => prev.map((p) => ({ ...p, isEliminated: false, score: 0, turnCount: 0, sessionKills: 0 })));
    setUsedWords(new Set()); setCurrentWord(""); setTargetRhyme(""); setGlobalTimer(null);
    setRoundStarterId(null); lastSuccessfulPlayerIdRef.current = null; setTimer(turnDuration);
    bombNextRef.current = false; setIsReversed(false); addLog("System", t("log_reset"));
  }

  function togglePause() {
    if (gameState === "PLAYING") {
      setGameState("PAUSED");
      addLog("System", "Game Paused ⏸️");
      triggerTableEffect("warning");
      playSound("notification");
    } else if (gameState === "PAUSED") {
      setGameState("PLAYING");
      addLog("System", "Game Resumed ▶️");
      triggerTableEffect("success");
      playSound("start");
    }
  }

  function clearLobby() {
    setGameState("WAITING"); setPlayers([]); playersRef.current = []; setUsedWords(new Set());
    setPlayerQueue([]); playerQueueRef.current = [];
    usedWordsRef.current = new Set(); setCurrentWord(""); setTargetRhyme(""); setGlobalTimer(null);
    setRoundStarterId(null); lastSuccessfulPlayerIdRef.current = null; setTimer(turnDuration);
    setTurnCount(0); setActiveChallenge(null); setChallengeQueue([]); quitHistoryRef.current = {};
    bombNextRef.current = false; setIsReversed(false); addLog("System", t("log_lobby_cleared")); playSound("eliminate");
    setWaitingCountdown(null);
  }

  useEffect(() => {
    if (gameState === "WAITING" && players.length >= maxPlayers) {
      addLog("System", t("log_lobby_full")); startGame();
    }
  }, [players, gameState, maxPlayers]);

  function cycleGameMode() {
    if (gameState === "PLAYING") { resetGame(); addLog("System", "Game Reset due to Mode Change"); }
    const modes = [
      "LAST_LETTER", "WRAP_AROUND", "STEP_UP",
      "RHYME", "MIRROR", "PHRASE_CHAIN", "DYNAMIC", "SECOND_LETTER",
      "SYLLABLE", "LONGER_WORD", "CITIES", "FILL_BLANK"
    ];
    setGameMode(modes[(modes.indexOf(gameMode) + 1) % modes.length]);
  }

  useEffect(() => {
    if (gameMode === "CITIES") {
      if (dictionaryCache.current.CITIES) {
        setDictionary(dictionaryCache.current.CITIES.dict); setCityMetadata(dictionaryCache.current.CITIES.meta);
        setDictLoadedInfo(dictionaryCache.current.CITIES.info); addLog("System", "Loaded Cities (Cached)");
      } else {
        loadCitiesData(FALLBACK_CITIES);
      }
    } else {
      toggleLanguage(true);
    }
  }, [gameMode]);

  function toggleLanguage(forceReload = false) {
    let targetLang = language;
    if (!forceReload) {
      targetLang = language === "EN" ? "ID" : language === "ID" ? "MIX" : "EN";
      setLanguage(targetLang);
    }
    
    if (targetLang === "ID") {
      if (!forceReload) addLog("System", "Switching to Indonesian...");
      
      Promise.all([
        fetch("/kamus.json").then((res) => res.ok ? res.json() : {}).catch(() => ({})),
        fetch("/kamus_tambahan.txt").then((res) => res.ok ? res.text() : "").catch(() => "")
      ]).then(([jsonData, txtData]) => {
        const dictSet = new Set(); const sMap = {}; const phraseSet = new Set(FALLBACK_PHRASES_ID);
        
        if (Object.keys(jsonData).length > 0) {
          Object.keys(jsonData).forEach((k) => {
            if (k.includes(" ")) phraseSet.add(k.toLowerCase());
            else { 
              const clean = normalizeWord(k); 
              if (clean) { 
                dictSet.add(clean); 
                let defText = null;
                if (jsonData[k].submakna) {
                  let sm = jsonData[k].submakna;
                  if (Array.isArray(sm)) sm = sm[0]; 
                  if (typeof sm === 'string' && sm.trim().length > 0) defText = sm.replace(/^[0-9]+\.?\s*/, '').trim();
                }
                if (jsonData[k].nama || defText) { 
                  sMap[clean] = { nama: jsonData[k].nama?.toLowerCase(), def: defText }; 
                } 
              } 
            }
          });
        }
        
        if (txtData) {
          const lines = txtData.split(/\r?\n/);
          lines.forEach((line) => {
            if (line.includes(" ")) phraseSet.add(line.trim().toLowerCase());
            else { const clean = normalizeWord(line); if (clean) dictSet.add(clean); }
          });
        }

        if (dictSet.size === 0) throw new Error("Empty Dictionary");

        setDictionary(dictSet); setSyllableMap(sMap); phraseDictionary.current = phraseSet; setDictLoadedInfo(`Kamus.json+TXT (${dictSet.size})`);
        dictionaryCache.current.ID = { dict: dictSet, syl: sMap, phrases: phraseSet, info: `Kamus.json+TXT (${dictSet.size})` };
      }).catch(() => {
        const words = Object.keys(FALLBACK_DICTIONARY_ID_DATA); const pSet = new Set(FALLBACK_PHRASES_ID);
        setDictionary(new Set(words)); setSyllableMap(FALLBACK_DICTIONARY_ID_DATA); phraseDictionary.current = pSet;
        setDictLoadedInfo("Default (ID)"); dictionaryCache.current.ID = { dict: new Set(words), syl: FALLBACK_DICTIONARY_ID_DATA, phrases: pSet, info: "Default (ID)" };
      });
    } else if (targetLang === "MIX") {
      if (!forceReload) addLog("System", "Switching to Mix Bahasa...");
      const loadMix = async () => {
        let rawEn = FALLBACK_DICTIONARY_EN; let rawId = new Set(Object.keys(FALLBACK_DICTIONARY_ID_DATA));
        let pSet = new Set([...FALLBACK_PHRASES_EN, ...FALLBACK_PHRASES_ID]);
        let mixSMap = {};
        try { const resEn = await fetch("/dictionary.json"); if (resEn.ok) rawEn = new Set((Array.isArray(await resEn.clone().json()) ? await resEn.json() : Object.keys(await resEn.json())).map(normalizeWord).filter(w => w.length > 0)); } catch (e) {}
        try { 
          const resId = await fetch("/kamus.json"); 
          if (resId.ok) {
            const idData = await resId.json();
            Object.keys(idData).forEach(k => {
              const clean = normalizeWord(k);
              if (clean) {
                rawId.add(clean);
                let defText = null;
                if (idData[k].submakna) {
                  let sm = idData[k].submakna;
                  if (Array.isArray(sm)) sm = sm[0];
                  if (typeof sm === 'string') defText = sm.replace(/^[0-9]+\.?\s*/, '').trim();
                }
                if (idData[k].nama || defText) mixSMap[clean] = { nama: idData[k].nama?.toLowerCase(), def: defText };
              }
            });
          } 
        } catch (e) {}
        try {
          const resTxt = await fetch("/kamus_tambahan.txt");
          if (resTxt.ok) {
            const txtData = await resTxt.text();
            const lines = txtData.split(/\r?\n/);
            lines.forEach((line) => {
              if (line.includes(" ")) pSet.add(line.trim().toLowerCase());
              else { const clean = normalizeWord(line); if (clean) rawId.add(clean); }
            });
          }
        } catch (e) {}

        const mixDict = new Set([...rawEn, ...rawId]);
        setDictionary(mixDict); setSyllableMap(mixSMap); phraseDictionary.current = pSet; setDictLoadedInfo(`Mix (${mixDict.size})`);
        dictionaryCache.current.MIX = { dict: mixDict, syl: mixSMap, phrases: pSet, info: `Mix (${mixDict.size})` };
      };
      loadMix();
    } else {
      if (!forceReload) addLog("System", "Switching to English...");
      fetch("/dictionary.json").then((res) => res.json()).then((data) => {
        let rawWords = Array.isArray(data) ? data : Object.keys(data); let phraseSet = new Set(FALLBACK_PHRASES_EN);
        const cleanedWords = rawWords.filter((w) => { if (w.includes(" ")) { phraseSet.add(w.toLowerCase()); return false; } return true; }).map(normalizeWord).filter(w => w.length > 0);
        const newDict = new Set(cleanedWords);
        setDictionary(newDict); setSyllableMap({}); phraseDictionary.current = phraseSet; setDictLoadedInfo(`Dictionary.json (${cleanedWords.length})`);
        dictionaryCache.current.EN = { dict: newDict, syl: {}, phrases: phraseSet, info: `Dictionary.json (${cleanedWords.length})` };
      }).catch(() => {
        setDictionary(FALLBACK_DICTIONARY_EN); setSyllableMap({}); phraseDictionary.current = new Set(FALLBACK_PHRASES_EN);
        setDictLoadedInfo("Default (EN)"); dictionaryCache.current.EN = { dict: FALLBACK_DICTIONARY_EN, syl: {}, phrases: new Set(FALLBACK_PHRASES_EN), info: "Default (EN)" };
      });
    }

    if (!forceReload) {
      setGameState("WAITING"); setPlayers((prev) => prev.map((p) => ({ ...p, isEliminated: false, score: 0, turnCount: 0, sessionKills: 0 })));
      setUsedWords(new Set()); setCurrentWord(""); setTargetRhyme(""); setGlobalTimer(null);
      setRoundStarterId(null); lastSuccessfulPlayerIdRef.current = null; setTurnCount(0);
      setActiveChallenge(null); setChallengeQueue([]); setTimer(turnDuration); addLog("System", "Language changed! Lobby kept.");
    }
  }

  function getModeLabel() {
    const ovStr = isRandomOverlap ? "RND" : overlapLength;
    const labels = {
      LAST_LETTER: `LETTERS (${ovStr})`, WRAP_AROUND: `WRAP AROUND (${ovStr})`,
      SECOND_LETTER: "2ND LETTER", RHYME: "RHYME RUSH", MIRROR: `MIRROR (${ovStr})`,
      STEP_UP: `STEP UP (${ovStr})`,
      SYLLABLE: "SYLLABLE", LONGER_WORD: `LONGER (${ovStr})`,
      CITIES: `CITIES (${ovStr})`, DYNAMIC: `DYNAMIC (${ovStr})`, PHRASE_CHAIN: "PHRASE",
      FILL_BLANK: "LENGKAPI"
    };
    return labels[gameMode] || `LETTERS (${ovStr})`;
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (containerRef.current) containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      setIsFullscreen(false);
    }
  }

  const handleChatEvent = (data) => {
    const { uniqueId, nickname, comment, profilePictureUrl } = data;
    const lowerComment = (comment || "").trim().toLowerCase();
    if (lowerComment === "!join" || lowerComment === "join") return joinGame(uniqueId, nickname, profilePictureUrl);
    if (lowerComment === "!unjoin" || lowerComment === "unjoin") return unjoinGame(uniqueId, nickname);
    if (["!surrender", "!surrend", "surrend", "surrender", "ff", "menyerah", "!ff"].includes(lowerComment)) {
      const p = playersRef.current.find(p => p.uniqueId === uniqueId);
      if (p && !p.isEliminated) handleSurrender(p);
      return;
    }
    if (gameStateRef.current === "PLAYING") {
      const currentPlayer = playersRef.current[turnIndexRef.current];
      if (currentPlayer?.uniqueId === uniqueId && !currentPlayer.isEliminated) {
        const cleanWord = normalizeWord(lowerComment);
        if (cleanWord.length > 0) submitAnswer(cleanWord);
      }
    }
  };

  const handleManualSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!manualInput.trim()) return;

    const currentPlayer = playersRef.current[turnIndexRef.current];
    const isHostTurn = currentPlayer?.uniqueId === "host_player";
    
    if (gameStateRef.current === "PLAYING") {
      if (!isHostTurn) {
          showFeedback("Bukan Giliran Host!", "warning");
          setManualInput("");
          return;
      }
      
      const lower = manualInput.trim().toLowerCase();
      if (["!surrender", "!surrend", "surrend", "surrender", "ff", "menyerah", "!ff"].includes(lower)) {
          handleSurrender(currentPlayer);
      } else {
          const cleanWord = normalizeWord(manualInput);
          if (cleanWord.length > 0) submitAnswer(cleanWord);
      }
    }
    setManualInput("");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (file.name.endsWith('.txt')) {
        const lines = e.target.result.split(/\r?\n/);
        let dictSet = new Set(); let phraseSet = new Set();
        lines.forEach(line => {
          if (line.includes(" ")) phraseSet.add(line.trim().toLowerCase());
          else { const clean = normalizeWord(line); if (clean) dictSet.add(clean); }
        });
        setDictionary(dictSet); setSyllableMap({}); phraseDictionary.current = phraseSet; setDictLoadedInfo(`Custom TXT (${dictSet.size})`);
        addLog("System", `Loaded TXT Dictionary (${dictSet.size} words)`);
        if (phraseSet.size > 0) addLog("System", `Detected ${phraseSet.size} phrases.`);
        return;
      }
      try {
        const json = JSON.parse(e.target.result);
        let dictSet = new Set(); let sMap = {}; let meta = {}; let phraseSet = new Set();
        if (Array.isArray(json)) {
          if (json.length > 0 && typeof json[0] === "object" && json[0].name) {
            json.forEach((item) => {
              const clean = normalizeWord(item.name);
              if (clean) { dictSet.add(clean); if (item.region) meta[clean] = item.region; }
            });
            setCityMetadata(meta); setGameMode("CITIES"); addLog("System", `Loaded Cities JSON (${dictSet.size})`);
          } else {
            const cleanedWords = json.filter((w) => { if (typeof w === "string" && w.includes(" ")) { phraseSet.add(w.toLowerCase()); return false; } return typeof w === "string"; }).map(normalizeWord).filter(w => w.length > 0);
            dictSet = new Set(cleanedWords); addLog("System", `Loaded Simple Array (${dictSet.size} words)`);
          }
        } else {
          Object.keys(json).forEach((k) => {
            if (k.includes(" ")) phraseSet.add(k.toLowerCase());
            else { const cleanKey = normalizeWord(k); if (cleanKey) { dictSet.add(cleanKey); if (json[k].nama) sMap[cleanKey] = { nama: json[k].nama.toLowerCase() }; } }
          });
          addLog("System", `Loaded Rich Dictionary (${dictSet.size} words)`);
        }
        setDictionary(dictSet); setSyllableMap(sMap); phraseDictionary.current = phraseSet; setDictLoadedInfo(`Custom (${dictSet.size})`);
        if (phraseSet.size > 0) addLog("System", `Detected ${phraseSet.size} phrases for Phrase Chain mode.`);
      } catch (err) { addLog("System", "Error parsing JSON"); console.error(err); }
    };
    reader.readAsText(file);
  };

  const simulateJoin = () => {
    const names = ["Andi", "Budi", "Citra", "Dewi", "Eko", "Fajar"];
    handleChatEvent({ uniqueId: `user_${Math.floor(Math.random() * 1000)}`, nickname: names[Math.floor(Math.random() * names.length)], comment: "!join" });
  };

  const simulateCorrectAnswer = () => {
    const validWord = Array.from(dictionary).find((w) => validateConnection(currentWord, w) && !usedWords.has(w));
    if (validWord && players[currentTurnIndex] && !players[currentTurnIndex].isEliminated) {
      handleChatEvent({ uniqueId: players[currentTurnIndex].uniqueId, nickname: players[currentTurnIndex].nickname, comment: validWord });
    } else addLog("Debug", "No valid word found.");
  };

  const simulateEffect = (type) => {
      const isPlayer = players.length > 0 && Math.random() > 0.3;
      const targetUniqueId = isPlayer 
          ? players[Math.floor(Math.random() * players.length)].uniqueId 
          : `viewer_${Math.floor(Math.random() * 1000)}`;
      
      const targetNickname = isPlayer ? "" : "Penonton Setia";
      const targetAvatar = isPlayer ? "" : getAvatarUrl(targetUniqueId);

      if (type === 'like') {
          triggerVisualEffect("like", targetUniqueId, { count: 5, nickname: targetNickname, profilePictureUrl: targetAvatar });
      } else {
          const gifts = [
              { name: "Mawar", pictureUrl: "https://cdn-icons-png.flaticon.com/512/126/126079.png" }, 
              { name: "Kopi", pictureUrl: "https://cdn-icons-png.flaticon.com/512/3502/3502601.png" }, 
              { name: "TikTok Universe", pictureUrl: "https://cdn-icons-png.flaticon.com/512/3176/3176335.png" }
          ];
          const g = gifts[Math.floor(Math.random() * gifts.length)];
          triggerVisualEffect("gift", targetUniqueId, { giftName: g.name, giftPictureUrl: g.pictureUrl, nickname: targetNickname, profilePictureUrl: targetAvatar });
      }
  };

  const getWinners = () => {
    if (gameState !== "ENDED") return [];
    const activePlayers = players.filter((p) => !p.isEliminated);
    if (activePlayers.length === 0) return [];
    if (isScoreMode()) {
      const sorted = [...activePlayers].sort((a, b) => (b.score || 0) - (a.score || 0));
      return sorted.filter(p => (p.score || 0) === (sorted[0].score || 0));
    }
    return [activePlayers[0]];
  };

  const cycleWinCondition = () => {
    setWinCondition(winCondition === "TIME" ? "SCORE" : winCondition === "SCORE" ? "ROUNDS" : "TIME");
  };

  const getTableStatusClass = () => {
    switch (tableStatus) {
      case "error": return "border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.6)] animate-shake";
      case "warning": return "border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.6)]";
      case "success": return "border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.6)]";
      case "info": return "border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.6)] animate-pulse";
      default: return "border-slate-700 bg-slate-800 shadow-2xl";
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-900 text-white font-sans overflow-hidden flex flex-col items-center justify-center p-2 sm:p-4 relative">
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 pointer-events-none">
        <h1 className="text-xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-lg">MAD CHAIN</h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mt-1">
          <span 
            className={`w-2 h-2 rounded-full ${connectionStatus === "tiktok_ready" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" : connectionStatus === "ws_only" ? "bg-yellow-500 animate-pulse" : "bg-red-500"}`}
            title={connectionStatus === "tiktok_ready" ? "Terhubung ke TikTok" : connectionStatus === "ws_only" ? "Backend OK, TikTok Belum Connect" : "Backend Offline"}
          ></span>
          <div className="flex gap-2">
            <span className="text-yellow-400 font-bold bg-slate-800 px-2 rounded border border-slate-600">{language}</span>
            <span className="text-blue-400 font-bold bg-slate-800 px-2 rounded border border-slate-600">{getModeLabel()}</span>
          </div>
        </div>
        {playerQueue.length > 0 && (
          <div className="mt-2 flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-600 backdrop-blur-sm animate-in fade-in max-w-fit">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-slate-300">Antrean: <span className="text-yellow-400">{playerQueue.length}</span></span>
          </div>
        )}
      </div>

      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-[70] flex flex-col items-end">
        <div className="flex gap-2">
          {(gameState === "PLAYING" || gameState === "PAUSED") && (
            <button onClick={togglePause} className={`w-10 h-10 flex items-center justify-center rounded-full shadow-xl transition-all duration-300 border border-slate-600 ${gameState === "PAUSED" ? "bg-amber-600 hover:bg-amber-500 animate-pulse shadow-[0_0_15px_rgba(217,119,6,0.5)]" : "bg-slate-800 hover:bg-slate-700 hover:scale-110"}`} title={gameState === "PAUSED" ? "Resume Game" : "Pause Game"}>
              {gameState === "PAUSED" ? <Play className="w-5 h-5 text-white" /> : <Pause className="w-5 h-5 text-yellow-400" />}
            </button>
          )}
          <button onClick={() => setShowStats(true)} className="w-10 h-10 flex items-center justify-center rounded-full shadow-xl transition-all duration-300 border border-slate-600 bg-slate-800 hover:bg-slate-700 hover:scale-110" title="Hall of Fame">
            <BarChart2 className="w-5 h-5 text-yellow-400" />
          </button>
          <button onClick={toggleFullscreen} className="w-10 h-10 flex items-center justify-center rounded-full shadow-xl transition-all duration-300 border border-slate-600 bg-slate-800 hover:bg-slate-700 hover:scale-110" title="Toggle Fullscreen">
            {isFullscreen ? <Minimize className="w-5 h-5 text-slate-300" /> : <Maximize className="w-5 h-5 text-slate-300" />}
          </button>
          <button onClick={() => setShowSettings(!showSettings)} className={`w-10 h-10 flex items-center justify-center rounded-full shadow-xl transition-all duration-300 border border-slate-600 ${showSettings ? "bg-red-600 hover:bg-red-500 rotate-90" : "bg-slate-800 hover:bg-slate-700 hover:scale-110"}`}>
            {showSettings ? <X className="w-5 h-5 text-white" /> : <Settings className="w-5 h-5 text-slate-300" />}
          </button>
        </div>

        <div className={`mt-3 flex flex-col gap-2 transition-all duration-300 origin-top-right ${showSettings ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 -translate-y-4 pointer-events-none absolute top-10 right-0 w-0 h-0 overflow-hidden"}`}>
          <div className="bg-slate-800/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-600 shadow-2xl flex flex-col gap-2 w-64">
            <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
              <button onClick={() => setSettingsTab('rules')} title="Aturan Game" className={`flex-1 flex justify-center py-1.5 rounded-md transition-all duration-200 ${settingsTab === 'rules' ? 'bg-blue-600 text-white shadow-inner scale-95' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Gamepad2 className="w-4 h-4"/></button>
              <button onClick={() => setSettingsTab('lobby')} title="Lobi & Pemain" className={`flex-1 flex justify-center py-1.5 rounded-md transition-all duration-200 ${settingsTab === 'lobby' ? 'bg-pink-600 text-white shadow-inner scale-95' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Users className="w-4 h-4"/></button>
              <button onClick={() => setSettingsTab('general')} title="Sistem & Kamus" className={`flex-1 flex justify-center py-1.5 rounded-md transition-all duration-200 ${settingsTab === 'general' ? 'bg-slate-600 text-white shadow-inner scale-95' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Settings className="w-4 h-4"/></button>
              <button onClick={() => setSettingsTab('dev')} title="Simulasi/Dev" className={`flex-1 flex justify-center py-1.5 rounded-md transition-all duration-200 ${settingsTab === 'dev' ? 'bg-amber-600 text-white shadow-inner scale-95' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Bot className="w-4 h-4"/></button>
            </div>

            <div className="flex flex-col gap-2 min-h-[190px]">
              {settingsTab === 'rules' && (
                <div className="animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-2">
                  <button onClick={cycleGameMode} className="w-full bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded text-xs font-bold border border-slate-600 transition-colors flex items-center justify-between group">
                    <span className="text-slate-300">{t("mode")}:</span><span className="text-yellow-400 group-hover:text-yellow-300">{getModeLabel()}</span>
                  </button>
                  <div className="flex flex-col gap-1.5">
                    <button onClick={() => setActionCardsEnabled(!actionCardsEnabled)} className={`w-full ${actionCardsEnabled ? 'bg-amber-900 hover:bg-amber-800 border-amber-500' : 'bg-slate-700 hover:bg-slate-600 border-slate-600'} px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center justify-between group`}>
                      <div className="flex items-center gap-2"><Sparkles className={`w-3 h-3 ${actionCardsEnabled ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} /><span className="text-slate-300">Action Cards</span></div>
                      <span className={actionCardsEnabled ? "text-amber-400" : "text-slate-400"}>{actionCardsEnabled ? "ON" : "OFF"}</span>
                    </button>
                    <button onClick={() => setPointRushEnabled(!pointRushEnabled)} className={`w-full ${pointRushEnabled ? 'bg-green-900 hover:bg-green-800 border-green-500' : 'bg-slate-700 hover:bg-slate-600 border-slate-600'} px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center justify-between group`}>
                      <div className="flex items-center gap-2"><Target className={`w-3 h-3 ${pointRushEnabled ? 'text-green-400 animate-pulse' : 'text-slate-400'}`} /><span className="text-slate-300">Point Rush (Pts)</span></div>
                      <span className={pointRushEnabled ? "text-green-400" : "text-slate-400"}>{pointRushEnabled ? "ON" : "OFF"}</span>
                    </button>
                    <button onClick={() => setAutoRestartEnabled(!autoRestartEnabled)} className={`w-full ${autoRestartEnabled ? 'bg-indigo-900 hover:bg-indigo-800 border-indigo-500' : 'bg-slate-700 hover:bg-slate-600 border-slate-600'} px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center justify-between group`}>
                      <div className="flex items-center gap-2"><FastForward className={`w-3 h-3 ${autoRestartEnabled ? 'text-indigo-400 animate-pulse' : 'text-slate-400'}`} /><span className="text-slate-300">{t("auto_restart")}</span></div>
                      <span className={autoRestartEnabled ? "text-indigo-400" : "text-slate-400"}>{autoRestartEnabled ? "ON" : "OFF"}</span>
                    </button>
                  </div>
                  <div className="w-full bg-slate-700 p-2 rounded border border-slate-600 flex flex-col gap-1.5 mt-0.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold mb-0.5">
                      <span>{t("end_condition")}:</span>
                      <button onClick={cycleWinCondition} className="text-blue-400 hover:text-white transition-colors uppercase">{winCondition}</button>
                    </div>
                    {winCondition === "TIME" ? (
                      <div className="flex items-center gap-1 bg-slate-900 rounded p-1">
                        <Clock className="w-3 h-3 text-blue-400" />
                        <input type="range" min="30" max="300" step="10" value={gameDuration} onChange={(e) => setGameDuration(Number(e.target.value))} className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                        <span className="text-[10px] font-mono w-8 text-right text-yellow-400">{gameDuration}s</span>
                      </div>
                    ) : winCondition === "SCORE" ? (
                      <div className="flex items-center gap-1 bg-slate-900 rounded p-1">
                        <Target className="w-3 h-3 text-red-400" />
                        <input type="range" min="20" max="200" step="10" value={targetScore} onChange={(e) => setTargetScore(Number(e.target.value))} className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-red-500" />
                        <span className="text-[10px] font-mono w-8 text-right text-yellow-400">{targetScore}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 bg-slate-900 rounded p-1">
                        <RefreshCw className="w-3 h-3 text-purple-400" />
                        <input type="range" min="1" max="10" step="1" value={targetRounds} onChange={(e) => setTargetRounds(Number(e.target.value))} className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                        <span className="text-[10px] font-mono w-8 text-right text-yellow-400">{targetRounds}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300"><Clock className="w-3 h-3 text-green-400" /><span className="font-bold">{t("turn_time")}</span></div>
                    <div className="flex items-center gap-1 bg-slate-900 rounded p-0.5 border border-slate-700">
                      <button onClick={() => setTurnDuration((d) => Math.max(5, d - 5))} className="w-5 h-5 flex items-center justify-center hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"><Minus className="w-3 h-3" /></button>
                      <span className="w-7 text-center font-mono font-bold text-yellow-400 text-xs">{turnDuration}s</span>
                      <button onClick={() => setTurnDuration((d) => Math.min(60, d + 5))} className="w-5 h-5 flex items-center justify-center hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300"><Link className="w-3 h-3 text-indigo-400" /><span className="font-bold">Overlap Letters</span></div>
                    <div className="flex items-center gap-1 bg-slate-900 rounded p-0.5 border border-slate-700">
                      <button onClick={() => {
                        if (isRandomOverlap) { setIsRandomOverlap(false); setOverlapLength(4); }
                        else setOverlapLength((n) => Math.max(1, n - 1));
                      }} className="w-5 h-5 flex items-center justify-center hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"><Minus className="w-3 h-3" /></button>
                      <span className="w-7 text-center font-mono font-bold text-yellow-400 text-xs">{isRandomOverlap ? "RND" : overlapLength}</span>
                      <button onClick={() => {
                        if (isRandomOverlap) { setIsRandomOverlap(false); setOverlapLength(1); }
                        else if (overlapLength === 4) setIsRandomOverlap(true);
                        else setOverlapLength((n) => Math.min(4, n + 1));
                      }} className="w-5 h-5 flex items-center justify-center hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>
              )}
              {settingsTab === 'lobby' && (
                <div className="animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3 text-xs bg-slate-700 p-2 rounded border border-slate-600">
                    <div className="flex items-center gap-1.5 text-slate-300"><Users className="w-3.5 h-3.5 text-pink-400" /><span className="font-bold">{t("players")} Max</span></div>
                    <div className="flex items-center gap-1 bg-slate-900 rounded p-0.5 border border-slate-700">
                      <button onClick={() => setMaxPlayers((n) => Math.max(2, n - 1))} className="w-6 h-6 flex items-center justify-center hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"><Minus className="w-3 h-3" /></button>
                      <span className="w-8 text-center font-mono font-bold text-yellow-400 text-sm">{maxPlayers}</span>
                      <button onClick={() => setMaxPlayers((n) => Math.min(100, n + 1))} className="w-6 h-6 flex items-center justify-center hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addHost} className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded text-xs font-bold border border-slate-600 transition-colors flex items-center justify-center gap-1.5 group">
                      <User className="w-3.5 h-3.5 text-blue-400" /><span className="text-slate-300 group-hover:text-white">{t("add_host")}</span>
                    </button>
                    <button onClick={addBot} className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded text-xs font-bold border border-slate-600 transition-colors flex items-center justify-center gap-1.5 group">
                      <Bot className="w-3.5 h-3.5 text-purple-400" /><span className="text-slate-300 group-hover:text-white">{t("add_bot")}</span>
                    </button>
                  </div>
                  <div className="h-px bg-slate-600/50 my-1"></div>
                  <button onClick={clearLobby} className="w-full bg-slate-900 hover:bg-red-950 px-3 py-2 rounded text-xs font-bold border border-slate-700 hover:border-red-800 text-slate-500 hover:text-red-400 transition-colors flex items-center justify-center gap-2 group">
                    <Delete className="w-3.5 h-3.5" /> {t("clear_lobby")}
                  </button>
                </div>
              )}
              {settingsTab === 'general' && (
                <div className="animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-2">
                  <button onClick={() => setIsMuted(!isMuted)} className="w-full bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded text-xs font-bold border border-slate-600 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-2">{isMuted ? <VolumeX className="w-3 h-3 text-red-400" /> : <Volume2 className="w-3 h-3 text-green-400" />}<span className="text-slate-300">{t("sound")}</span></div>
                    <span className="text-white">{isMuted ? "Off" : "On"}</span>
                  </button>
                  <button onClick={() => toggleLanguage()} className="w-full bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded text-xs font-bold border border-slate-600 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-2"><Globe className="w-3 h-3 text-blue-400" /><span className="text-slate-300">{t("language")}</span></div>
                    <span className="text-white group-hover:text-yellow-300">{language === "EN" ? "English" : language === "ID" ? "Indonesia" : "Mix"}</span>
                  </button>
                  <div className="w-full bg-slate-700 p-2.5 rounded border border-slate-600 flex flex-col gap-2 mt-2">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Kamus (Dictionary)</div>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="truncate text-yellow-400 font-mono" title={dictLoadedInfo}>{dictLoadedInfo}</span>
                      <button onClick={() => fileInputRef.current?.click()} className="bg-slate-600 hover:bg-slate-500 px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-colors text-white border border-slate-500">
                        <FileJson className="w-3.5 h-3.5" /> {t("load_json")}
                      </button>
                      <input type="file" accept=".json,.txt" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                    </div>
                  </div>
                </div>
              )}
              {settingsTab === 'dev' && (
                <div className="animate-in fade-in zoom-in-95 duration-200 bg-black/40 p-2 rounded-lg border border-slate-700 flex flex-col justify-center h-full min-h-[190px]">
                  <div className="text-[10px] uppercase font-bold text-slate-500 text-center tracking-wider mb-3">{t("simulation")} Tools</div>
                  <div className="grid grid-cols-4 gap-2">
                    <button onClick={simulateJoin} className="bg-blue-900/60 hover:bg-blue-800 py-2.5 rounded text-blue-200 border border-blue-800/50 flex flex-col items-center justify-center gap-1 transition-colors"><Users className="w-4 h-4" /> <span className="text-[9px] font-bold">Join</span></button>
                    <button onClick={simulateCorrectAnswer} className="bg-green-900/60 hover:bg-green-800 py-2.5 rounded text-green-200 border border-green-800/50 flex flex-col items-center justify-center gap-1 transition-colors"><Gamepad2 className="w-4 h-4" /> <span className="text-[9px] font-bold">Ans</span></button>
                    <button onClick={handleTimeout} className="bg-red-900/60 hover:bg-red-800 py-2.5 rounded text-red-200 border border-red-800/50 flex flex-col items-center justify-center gap-1 transition-colors"><Clock className="w-4 h-4" /> <span className="text-[9px] font-bold">T.O.</span></button>
                    <button onClick={() => { setShowSettings(false); clearLobby(); pickShowcaseWords(); setWaitingCountdown(60); }} className="bg-indigo-900/60 hover:bg-indigo-800 py-2.5 rounded text-indigo-200 border border-indigo-800/50 flex flex-col items-center justify-center gap-1 transition-colors"><Info className="w-4 h-4" /> <span className="text-[9px] font-bold">Edu</span></button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                     <button onClick={() => simulateEffect('like')} className="bg-pink-900/60 hover:bg-pink-800 py-2 rounded text-pink-200 border border-pink-800/50 flex items-center justify-center gap-1 transition-colors"><Heart className="w-3 h-3" /> <span className="text-[10px] font-bold">Spam Like</span></button>
                     <button onClick={() => simulateEffect('gift')} className="bg-purple-900/60 hover:bg-purple-800 py-2 rounded text-purple-200 border border-purple-800/50 flex items-center justify-center gap-1 transition-colors"><Gift className="w-3 h-3" /> <span className="text-[10px] font-bold">Send Gift</span></button>
                  </div>
                </div>
              )}
            </div>
            <div className="h-px bg-slate-600/50 my-1"></div>
            <button onClick={gameState === "WAITING" ? startGame : resetGame} className={`w-full px-3 py-2.5 rounded-lg text-sm font-black tracking-widest uppercase shadow-lg transition-transform active:scale-95 border border-transparent ${gameState === "WAITING" ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 text-white" : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 text-white"}`}>
              {gameState === "WAITING" ? t("start_game") : t("reset_game")}
            </button>
          </div>
        </div>
      </div>

      {showStats && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300 p-4">
          <div className="bg-slate-900/90 w-full max-w-2xl max-h-[80vh] rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-slate-900 to-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-600 tracking-wider">{t("hall_of_fame")}</h2>
              </div>
              <button onClick={() => setShowStats(false)} className="bg-slate-800 hover:bg-red-900/50 p-2 rounded-full transition-colors text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <div className="mb-6 bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Info className="w-3 h-3" /> {t("badge_legend")}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="flex items-center gap-2 text-[10px] text-slate-300"><span className="text-sm">👶</span> Rookie</div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-300"><span className="text-sm">🥇</span> 1+ Wins</div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-300"><span className="text-sm">🔥</span> 3+ Wins</div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-300"><span className="text-sm">👑</span> 10+ Wins</div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-300"><span className="text-sm">💀</span> 5+ Games</div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-300"><span className="text-sm">🔪</span> 5+ Kills</div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-300"><span className="text-sm">🥷</span> 20+ Kills</div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-300"><span className="text-sm">🩸</span> 50+ Kills</div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {allStats.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 italic">{t("no_data")}</div>
                ) : (
                  allStats.map((stat, index) => {
                    const winRate = stat.games > 0 ? Math.round((stat.wins / stat.games) * 100) : 0;
                    let rankStyle = "border-slate-700 bg-slate-800/50";
                    let rankIcon = <span className="font-mono font-bold text-slate-500">#{index + 1}</span>;
                    if (index === 0) { rankStyle = "border-yellow-500/50 bg-gradient-to-r from-yellow-900/20 to-slate-900 shadow-[0_0_15px_rgba(234,179,8,0.1)]"; rankIcon = <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />; }
                    else if (index === 1) { rankStyle = "border-slate-400/50 bg-gradient-to-r from-slate-800 to-slate-900"; rankIcon = <Medal className="w-5 h-5 text-slate-300" />; }
                    else if (index === 2) { rankStyle = "border-orange-700/50 bg-gradient-to-r from-orange-900/20 to-slate-900"; rankIcon = <Medal className="w-5 h-5 text-orange-600" />; }
                    return (
                      <div key={stat.id} className={`relative flex items-center p-3 rounded-xl border ${rankStyle} transition-all hover:bg-slate-800 group`}>
                        <div className="flex items-center gap-4 min-w-[50px] sm:min-w-[150px]">
                          <div className="w-8 flex justify-center">{rankIcon}</div>
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-600 bg-slate-900"><img src={getAvatarUrl(stat.id)} alt="Avatar" className="w-full h-full object-cover" /></div>
                            {index === 0 && <div className="absolute -top-2 -right-1 text-lg">👑</div>}
                          </div>
                        </div>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 ml-2">
                          <div className="flex flex-col justify-center">
                            <span className="font-bold text-white text-lg truncate">{stat.nickname || "Unknown"}</span>
                            <div className="flex gap-1 mt-1 flex-wrap">{stat.badges && stat.badges.map((b, i) => <span key={i} className="text-sm bg-black/30 rounded px-1">{b}</span>)}</div>
                          </div>
                          <div className="flex flex-col justify-center gap-1.5 text-xs">
                            <div className="flex justify-between text-slate-400 mb-1">
                              <span title={t("stats_wins")}>🏆 <span className="text-yellow-400 font-bold">{stat.wins || 0}</span></span>
                              <span title={t("stats_games")}>🎮 <span className="text-blue-400 font-bold">{stat.games || 0}</span></span>
                              <span title={t("stats_kills")}>🔪 <span className="text-red-400 font-bold">{stat.kills || 0}</span></span>
                            </div>
                            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden relative group/bar">
                              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${winRate}%` }}></div>
                            </div>
                            <div className="flex justify-between items-center"><span className="text-[10px] text-slate-500">{t("stats_rate")}</span><span className="font-mono font-bold text-green-400">{winRate}%</span></div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <div className="p-3 bg-slate-900 border-t border-slate-800 text-center">
              <button onClick={() => setShowStats(false)} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full text-sm font-bold transition-colors border border-slate-600">{t("close")}</button>
            </div>
          </div>
        </div>
      )}

      <div className="transform scale-[0.85] -translate-y-12 sm:translate-y-0 sm:scale-100 transition-transform duration-300">
        <div className="relative w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full border-[8px] bg-slate-800 transition-all duration-300 flex items-center justify-center overflow-hidden ${getTableStatusClass()} ${tableStatus === 'success' ? 'scale-105' : 'scale-100'}`}>
            {gameState === "PAUSED" && (
              <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
                <Pause className="w-16 h-16 sm:w-20 sm:h-20 text-amber-500 mb-2 animate-pulse drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                <p className="text-2xl sm:text-4xl font-black text-amber-400 tracking-widest drop-shadow-md">PAUSED</p>
                <p className="text-xs sm:text-sm text-amber-200/70 mt-2 font-mono">Menunggu Jaringan Stabil...</p>
              </div>
            )}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-100 via-gray-900 to-black"></div>
            
            <div className="relative z-10 text-center flex flex-col items-center justify-center w-full h-full">
              {gameState === "WAITING" ? (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  {waitingCountdown !== null ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full px-4">
                      {showcaseWords.length > 0 ? (
                        (() => {
                          let currentShowcase;
                          if (waitingCountdown > 40) {
                            currentShowcase = showcaseWords[0];
                          } else if (waitingCountdown > 20) {
                            currentShowcase = showcaseWords[1] || showcaseWords[0];
                          } else {
                            currentShowcase = showcaseWords[2] || showcaseWords[1] || showcaseWords[0];
                          }
                          
                          if (!currentShowcase) return null;
                          return (
                            <div key={currentShowcase.word} className="flex flex-col items-center text-center max-w-[85%] bg-slate-900/60 p-4 sm:p-6 rounded-3xl backdrop-blur-md border border-slate-700 shadow-2xl animate-in fade-in zoom-in duration-700 w-full">
                              <div className="flex items-center gap-2 mb-3 bg-slate-800/80 pr-4 pl-1.5 py-1.5 rounded-full border border-slate-600 shadow-inner">
                                <img src={currentShowcase.avatarUrl} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-700 border-2 border-slate-500 object-cover" alt="avatar" />
                                <span className="text-[10px] sm:text-xs text-slate-300 font-bold tracking-wide">Kocakata dari <span className="text-yellow-400">{currentShowcase.nickname}</span></span>
                              </div>
                              <h3 className={`${currentShowcase.word.length > 14 ? 'text-lg sm:text-2xl' : currentShowcase.word.length > 9 ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'} font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-400 tracking-widest uppercase drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] mb-2 sm:mb-4 break-words w-full px-2`}>{currentShowcase.word}</h3>
                              <div className="relative w-full px-4 py-2 sm:px-6 sm:py-3 bg-black/40 rounded-xl border border-slate-600/50">
                                <span className="absolute -top-3 -left-2 text-3xl text-slate-600 font-serif">"</span>
                                <p className="text-[10px] sm:text-sm text-slate-300 italic line-clamp-3 sm:line-clamp-4 leading-relaxed font-serif relative z-10">
                                  {currentShowcase.def}
                                </p>
                                <span className="absolute -bottom-5 -right-2 text-3xl text-slate-600 font-serif">"</span>
                              </div>
                              <div className="mt-4 flex flex-col items-center justify-center animate-pulse bg-indigo-900/40 border border-indigo-500/50 rounded-full px-5 py-1.5 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                                 <span className="text-[9px] text-indigo-300 uppercase tracking-widest leading-none mb-0.5">{t("starting_in")}</span>
                                 <span className="text-xl sm:text-2xl font-black text-indigo-400 font-mono leading-none">{waitingCountdown}s</span>
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                         <div className="mb-2 animate-pulse bg-indigo-900/50 border border-indigo-500 rounded-full px-6 py-2 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                            <p className="text-[10px] text-indigo-200 uppercase tracking-widest text-center">{t("starting_in")}</p>
                            <p className="text-3xl font-black text-indigo-400 font-mono text-center">{waitingCountdown}s</p>
                         </div>
                      )}
                    </div>
                  ) : (
                    <>
                       <Users className="w-12 h-12 text-slate-500 mx-auto mb-2 animate-pulse" />
                       <p className="text-slate-400 font-bold">{t("waiting")}</p>
                       <p className="text-xs text-slate-500">{t("type_join")}</p>
                       <p className="text-xl font-mono mt-2">{players.length} / {maxPlayers}</p>
                    </>
                  )}
                </div>
              ) : gameState === "ENDED" ? (
                <div className="animate-bounce">
                  <p className="text-xl font-bold text-yellow-400">{t("game_over")}</p>
                  <button onClick={() => { setRestartCountdown(null); processQueue(); startGame(); }} className="mt-2 bg-purple-600 px-4 py-1 rounded text-sm hover:bg-purple-500 transition-colors">{t("new_game")}</button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  {pointRushEnabled && (
                    <div className="mb-3 flex justify-center animate-in slide-in-from-top fade-in duration-500">
                      {winCondition === "TIME" ? (
                        <div className={`px-4 py-1 rounded-full font-mono text-xl font-bold border shadow-[0_0_15px_currentColor] backdrop-blur-md ${globalTimer !== null && globalTimer <= 10 ? "text-red-500 border-red-500 bg-red-950/40 animate-pulse" : "text-blue-400 border-blue-500/50 bg-slate-900/60"}`}>
                          {globalTimer !== null ? `${Math.floor(globalTimer / 60)}:${(globalTimer % 60).toString().padStart(2, "0")}` : "0:00"}
                        </div>
                      ) : winCondition === "SCORE" ? (
                        <div className="px-4 py-1 rounded-full font-bold border text-yellow-400 border-yellow-500/50 bg-slate-900/60 shadow-[0_0_15px_currentColor] flex items-center gap-2 backdrop-blur-md">
                          <Target className="w-4 h-4" /><span className="text-xs uppercase tracking-wide opacity-80">{t("target")}:</span><span className="text-lg">{targetScore}</span>
                        </div>
                      ) : (
                        <div className="px-4 py-1 rounded-full font-bold border text-purple-400 border-purple-500/50 bg-slate-900/60 shadow-[0_0_15px_currentColor] flex items-center gap-2 backdrop-blur-md">
                          <RefreshCw className="w-4 h-4" /><span className="text-xs uppercase tracking-wide opacity-80">{t("round")}:</span><span className="text-lg">{Math.min(...players.filter((p) => !p.isEliminated).map((p) => p.turnCount || 0)) + 1}/{targetRounds}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 mb-2 h-7">
                    {actionCardsEnabled && (
                      <div title="Action Cards Enabled" className="w-6 h-6 rounded-full bg-amber-900/80 text-amber-300 flex items-center justify-center shadow-[0_0_8px_rgba(251,191,36,0.5)] border border-amber-500">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      </div>
                    )}
                    {pointRushEnabled && (
                      <div title="Point Rush Active" className="w-6 h-6 rounded-full bg-green-900/80 text-green-300 flex items-center justify-center shadow-[0_0_8px_rgba(34,197,94,0.5)] border border-green-500">
                        <Target className="w-3.5 h-3.5 animate-pulse" />
                      </div>
                    )}
                    <div title={`Game Mode: ${getModeLabel()}`} className="px-1.5 h-6 rounded-full bg-slate-900/60 border border-slate-600 flex items-center gap-1">
                      {gameMode === "CITIES" && <MapPin className="w-3.5 h-3.5 text-blue-400" />}
                      {gameMode === "WRAP_AROUND" && <Repeat2 className="w-3.5 h-3.5 text-rose-400 animate-pulse" />}
                      {gameMode === "RHYME" && <Hash className="w-3.5 h-3.5 text-purple-400" />}
                      {gameMode === "MIRROR" && <FlipHorizontal className="w-3.5 h-3.5 text-pink-400 animate-pulse" />}
                      {gameMode === "STEP_UP" && <MoveUpRight className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />}
                      {gameMode === "PHRASE_CHAIN" && (tableStatus === "info" ? <Unlink className="w-3.5 h-3.5 text-indigo-400 animate-bounce" /> : <Link className="w-3.5 h-3.5 text-indigo-400" />)}
                      {gameMode === "DYNAMIC" && <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />}
                      {gameMode === "FILL_BLANK" && <Keyboard className="w-3.5 h-3.5 text-emerald-400" />}
                      {!["CITIES", "WRAP_AROUND", "RHYME", "MIRROR", "STEP_UP", "PHRASE_CHAIN", "DYNAMIC", "FILL_BLANK"].includes(gameMode) && <TrendingUpIcon className="w-3.5 h-3.5 text-slate-400" />}
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{getModeLabel().split(' ')[0]}</span>
                    </div>
                  </div>

                  <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1 flex items-center justify-center gap-2">
                    {gameMode === "RHYME" ? t("rhyme_target") : t("current_word")}
                  </p>
                  
                  <h2 className={`${currentWord?.length > 14 ? "text-xl sm:text-3xl" : currentWord?.length > 9 ? "text-2xl sm:text-4xl" : "text-3xl sm:text-5xl"} font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] flex justify-center transition-all duration-300 px-2`}>
                    {(() => {
                      if (gameMode === "RHYME") {
                        return (
                          <div className="flex flex-col items-center">
                            <span className="text-4xl text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]">...{targetRhyme.toUpperCase()}</span>
                            {currentWord && <span className="text-xs text-slate-400 mt-1 font-normal opacity-50">Last: {currentWord.toUpperCase()}</span>}
                          </div>
                        );
                      }
                      if (gameMode === "FILL_BLANK") {
                         // Garis titik tiga akan dirender menggunakan warna zamrud agar tampak seperti placeholder teka-teki
                         const parts = currentWord.toUpperCase().split(/(\.\.\.)/g);
                         return parts.map((part, i) => 
                            part === "..." 
                            ? <span key={i} className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)] opacity-90 mx-1 tracking-widest">. . .</span> 
                            : <span key={i} className="text-white drop-shadow-md">{part}</span>
                         );
                      }
                      const { pre, high, post } = getDisplayParts(currentWord);
                      // FIX: Menambahkan kembali .toUpperCase() agar semua huruf menjadi kapital
                      return (<><span>{pre.toUpperCase()}</span><span className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]">{high.toUpperCase()}</span><span>{post.toUpperCase()}</span></>);
                    })()}
                  </h2>

                  <div className="flex flex-col items-center w-full">
                    <div className="mt-2 flex flex-col items-center gap-2 w-full max-w-[260px] sm:max-w-[380px]">
                      <div className="w-full font-mono text-purple-300 bg-purple-900/40 px-2 py-1.5 rounded-xl border border-purple-500/30 flex justify-center items-center text-center">
                        {(() => {
                          const rule = getRuleDisplay(currentWord);
                          const totalLen = (rule.desc?.length || 0) + (rule.action?.length || 0) + (rule.target?.length || 0);
                          const dynamicTextSize = totalLen > 30 ? "text-[11px] sm:text-sm" : "text-xs sm:text-base";
                          return (
                            <div className={`${dynamicTextSize} flex flex-col justify-center items-center gap-y-1.5 leading-snug w-full`}>
                              <span className="font-semibold text-purple-200 px-1 text-center">{rule.desc}</span>
                              {gameMode !== "RHYME" && gameMode !== "FILL_BLANK" && (
                                <div className="flex items-center justify-center bg-black/30 px-2 py-0.5 rounded-lg border border-purple-500/20">
                                  {rule.action && <span className="mr-1.5 opacity-60">→</span>}
                                  {rule.action && <span className="mr-1.5">{rule.action}</span>}
                                  <span className="font-bold text-yellow-400 bg-black/50 px-2 py-0.5 rounded-md shadow-inner tracking-widest">{rule.target}</span>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                    {feedbackMessage && (
                        <div className={`mt-2 px-3 py-1 rounded-md text-xs font-bold animate-bounce ${feedbackMessage.type === 'error' ? 'bg-red-900/80 text-red-200 border border-red-500' : feedbackMessage.type === 'warning' ? 'bg-yellow-900/80 text-yellow-200 border border-yellow-500' : feedbackMessage.type === 'info' ? 'bg-blue-900/80 text-blue-200 border border-blue-500' : 'bg-green-900/80 text-green-200'}`}>
                          {feedbackMessage.text}
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {players.map((player, index) => {
            const angleDeg = index * (360 / Math.max(players.length, 1)) + 90;
            const isTurn = gameState === "PLAYING" && currentTurnIndex === index && !player.isEliminated;
            const maxWins = Math.max(...players.map((p) => p.stats?.wins || 0));
            const isKing = maxWins > 0 && (player.stats?.wins || 0) === maxWins && !player.isEliminated;
            const isStarter = player.uniqueId === roundStarterId;
            const radius = (gameState === "WAITING" && waitingCountdown === null) ? 140 : 210;
            return (
              <div key={player.uniqueId} className="absolute transition-all duration-500 ease-out flex flex-col items-center justify-center w-24 h-28" style={{ transform: `rotate(${angleDeg}deg) translate(${radius}px) rotate(-${angleDeg}deg)`, zIndex: isTurn ? 100 : 20 }}>
                
                {/* --- RENDER EFEK VISUAL DI SINI --- */}
                <div className="absolute inset-0 pointer-events-none z-[150]">
                  {activeEffects.filter(e => e.uniqueId === player.uniqueId).map(effect => {
                    if (effect.type === 'like') {
                      return Array.from({ length: effect.count }).map((_, i) => {
                        const tx = (Math.random() - 0.5) * 60; 
                        const ty = (Math.random() - 0.5) * 80 - 20; 
                        const delay = Math.random() * 0.4;
                        return (
                          <Heart 
                            key={`${effect.id}-${i}`} 
                            className="absolute top-1/2 left-1/2 text-rose-500 fill-rose-500 drop-shadow-sm w-4 h-4 animate-flurry-heart" 
                            style={{ '--tx': `${tx}px`, '--ty': `${ty}px`, animationDelay: `${delay}s`, opacity: 0, marginTop: '-10px', transform: 'translate(-50%, -50%)' }} 
                          />
                        );
                      });
                    }
                    if (effect.type === 'gift') {
                      return (
                        <div key={effect.id} className="absolute top-0 left-1/2 -translate-x-1/2 animate-flurry-gift flex flex-col items-center justify-center pointer-events-none w-[150px]">
                          {effect.giftPictureUrl ? (
                            <img src={effect.giftPictureUrl} alt={effect.giftName} className="w-12 h-12 object-contain drop-shadow-[0_0_10px_rgba(236,72,153,0.8)] animate-bounce" />
                          ) : (
                            <span className="text-4xl drop-shadow-[0_0_10px_rgba(236,72,153,0.8)] animate-bounce">🎁</span>
                          )}
                          <span className="text-[10px] font-black text-white bg-gradient-to-r from-pink-600 to-purple-600 px-2 py-0.5 rounded-full border border-pink-400 shadow-xl whitespace-nowrap mt-1 leading-tight text-center">
                            {effect.giftName}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
                {/* --------------------------------- */}

                <div className={`relative group ${player.isEliminated ? "opacity-60 grayscale" : "opacity-100"}`}>
                  {isTurn && <div className="absolute -inset-2 bg-yellow-400 rounded-full animate-ping opacity-75"></div>}
                  {isKing && <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xl z-50 animate-bounce drop-shadow-sm">👑</div>}
                  <div className={`w-14 h-14 rounded-full border-4 overflow-hidden bg-slate-800 z-10 relative shadow-lg ${isTurn ? (bombNextRef.current ? "border-red-500 scale-125 animate-shake" : "border-yellow-400 scale-110") : isKing ? "border-yellow-300 scale-105" : "border-slate-600"} ${player.isEliminated ? "border-red-900" : ""} transition-all duration-300`}>
                    <img src={player.avatarUrl} alt={player.nickname} className={`w-full h-full object-cover transition-all ${isKing ? "brightness-110 contrast-110" : ""}`} />
                  </div>
                  {player.isBot && (
                    <div className={`absolute -top-1 -right-3 sm:-right-4 text-[7px] sm:text-[8px] px-1.5 py-0.5 rounded-full text-white font-bold border z-30 flex items-center shadow-md transition-colors ${
                      player.botDifficulty === 1 ? "bg-green-600 border-green-400" :
                      player.botDifficulty === 3 ? "bg-red-700 border-red-400 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]" :
                      "bg-blue-600 border-blue-400"
                    }`}>
                      {player.botDifficulty === 1 ? "👶 NOOB" : player.botDifficulty === 3 ? "🔥 PRO" : "🤖 BOT"}
                    </div>
                  )}
                  {isStarter && !player.isEliminated && (
                    <div className="absolute -top-1 -left-2 bg-gradient-to-br from-cyan-500 to-blue-600 border border-cyan-200 text-white p-1.5 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.9)] z-40 animate-pulse" title="First Player (Round Starter)"><Flag className="w-3 h-3 fill-white" /></div>
                  )}
                  {isTurn && <div className={`absolute -top-6 left-1/2 -translate-x-1/2 font-bold text-xs px-2 py-0.5 rounded-full shadow-lg z-50 whitespace-nowrap ${timer <= 5 ? "bg-red-600 text-white animate-pulse border border-red-400" : "bg-yellow-500 text-black"}`}>{`${timer}s`}</div>}
                  {player.isEliminated && <div className="absolute inset-0 flex items-center justify-center z-20"><Skull className="w-8 h-8 text-red-600 drop-shadow-md" /></div>}
                </div>
                <div className="mt-[-12px] flex flex-col items-center z-40 relative w-full">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 ${isTurn ? "bg-yellow-500/90 border-yellow-400/50 text-yellow-900 scale-110" : "bg-slate-900/80 border-slate-700/50 text-slate-200"}`}>
                    {player.stats?.wins > 0 && (
                      <div className={`flex items-center gap-0.5 border-r pr-1.5 mr-0.5 ${isTurn ? "border-yellow-700/30" : "border-white/20"}`}>
                        <Trophy className={`w-3 h-3 drop-shadow-sm ${isTurn ? "text-yellow-700" : "text-yellow-400"}`} /><span className={`text-[10px] font-bold font-mono ${isTurn ? "text-yellow-800" : "text-yellow-200"}`}>{player.stats.wins}</span>
                      </div>
                    )}
                    {pointRushEnabled && (
                      <div className={`flex items-center gap-0.5 border-r pr-1.5 mr-0.5 ${isTurn ? "border-yellow-700/30" : "border-white/20"}`}>
                        <Star className={`w-3 h-3 drop-shadow-sm ${isTurn ? "text-yellow-700" : "text-green-400"}`} fill={isTurn ? "currentColor" : "none"} /><span className={`text-[10px] font-bold font-mono ${isTurn ? "text-yellow-800" : "text-green-200"}`}>{player.score || 0}</span>
                      </div>
                    )}
                    {player.sessionKills > 0 && (
                      <div className={`flex items-center gap-0.5 border-r pr-1.5 mr-0.5 ${isTurn ? "border-yellow-700/30" : "border-white/20"}`} title="Kills this match">
                        <Skull className={`w-3 h-3 drop-shadow-sm ${isTurn ? "text-red-700" : "text-red-400"}`} /><span className={`text-[10px] font-bold font-mono ${isTurn ? "text-red-800" : "text-red-200"}`}>{player.sessionKills}</span>
                      </div>
                    )}
                    <span className="text-[10px] font-bold tracking-wide truncate max-w-[70px]">{player.nickname}</span>
                  </div>
                  {player.stats?.badges && player.stats.badges.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-0.5 mt-1 animate-in slide-in-from-top-1 duration-300">
                       <div className="flex items-center bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-full border border-white/10 shadow-sm">
                         {player.stats.badges.map((b, i) => (
                           <span key={i} className="text-[9px] leading-none select-none hover:scale-125 transition-transform" title="Achievement Badge">{b}</span>
                         ))}
                       </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* EFEK KATA MELAYANG (JUICY UI) - DIPINDAHKAN KE SINI AGAR TIDAK TERHALANG AVATAR */}
          {lastPlay && (
             <div key={lastPlay.id} className="absolute top-[10%] sm:top-[15%] left-1/2 -translate-x-1/2 pointer-events-none z-[250] flex flex-col items-center animate-float-up w-full">
                <div className="flex items-center gap-1.5 mb-1 bg-black/60 px-3 py-1 rounded-full border border-green-500/50 backdrop-blur-md shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                   <img src={lastPlay.avatarUrl} className="w-5 h-5 rounded-full border border-green-400" alt="avatar" />
                   <span className="text-[10px] sm:text-xs text-green-100 font-bold truncate max-w-[100px]">{lastPlay.nickname}</span>
                </div>
                <div className={`${lastPlay.word.length > 12 ? 'text-xl sm:text-2xl' : lastPlay.word.length > 8 ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-5xl'} font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)] uppercase tracking-widest leading-none px-4 text-center`}>
                   {lastPlay.word}
                </div>
                {pointRushEnabled && (
                  <div className="text-lg sm:text-xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] mt-1">
                     +{lastPlay.points} Pts
                  </div>
                )}
             </div>
          )}

        </div>
      </div>

      {gameState === "PLAYING" && isHostJoined && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-2 flex flex-col gap-2 items-center">
          <div className="flex items-center gap-2 bg-slate-900/95 border border-slate-600 rounded-full px-4 py-2 w-full sm:max-w-md shadow-lg backdrop-blur-md">
            <input 
              type="text" 
              value={manualInput} 
              onChange={(e) => setManualInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleManualSubmit(e); }}
              placeholder="type answer..." 
              className="flex-1 bg-transparent text-center font-mono font-bold text-lg sm:text-xl text-white tracking-widest uppercase outline-none placeholder:text-slate-500 placeholder:text-sm placeholder:font-sans placeholder:lowercase placeholder:tracking-normal w-full min-w-0"
            />
            {manualInput && <button onClick={() => setManualInput("")} className="text-slate-400 hover:text-white shrink-0"><X className="w-5 h-5" /></button>}
            <button onClick={handleManualSubmit} className="bg-green-600 text-white p-2 rounded-full hover:bg-green-500 shadow-lg active:scale-90 transition-transform shrink-0"><Send className="w-4 h-4" /></button>
          </div>
          <button onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)} className="text-[10px] text-slate-400 bg-black/40 px-3 py-1 rounded-full hover:bg-black/60 transition-colors flex items-center gap-1 backdrop-blur-sm border border-slate-700/50">
            <Keyboard className="w-3 h-3" /> {showVirtualKeyboard ? "Hide Keyboard" : "Show Keyboard"}
          </button>
          {showVirtualKeyboard && (
            <div className="bg-slate-900/95 p-2.5 sm:p-3 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-md w-full sm:w-[90%] animate-in slide-in-from-bottom-10 fade-in duration-300">
              {["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row, i) => (
                <div key={i} className="flex justify-center gap-1.5 sm:gap-2 mb-2 last:mb-0">
                  {row.split("").map((char) => (
                    <button key={char} onClick={() => setManualInput(prev => prev + char)} className="w-8 h-10 sm:w-11 sm:h-12 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold text-sm sm:text-base shadow active:scale-95 transition-all active:bg-slate-500">{char}</button>
                  ))}
                </div>
              ))}
              <div className="flex justify-center gap-2 mt-2 px-0.5 sm:px-2">
                {/* Tombol ENTER di sebelah Kiri */}
                <button onClick={handleManualSubmit} className="flex-[1.5] bg-green-700/80 hover:bg-green-600 text-white rounded-lg font-bold text-xs sm:text-sm h-11 sm:h-13 flex items-center justify-center shadow active:scale-95 transition-colors uppercase">ENTER</button>
                
                {/* Tombol SPACE di Tengah */}
                <button onClick={() => setManualInput(prev => prev + " ")} className="flex-[4] bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-bold text-xs sm:text-sm h-11 sm:h-13 flex items-center justify-center shadow active:scale-95 transition-colors uppercase tracking-widest">SPACE</button>
                
                {/* Tombol DELETE di sebelah Kanan */}
                <button onClick={() => setManualInput(prev => prev.slice(0, -1))} className="flex-[1.5] bg-red-900/80 hover:bg-red-800 text-white rounded-lg font-bold text-xs sm:text-sm h-11 sm:h-13 flex items-center justify-center shadow active:scale-95 gap-1 transition-colors uppercase"><Delete className="w-4 h-4 sm:w-5 sm:h-5" /></button>
              </div>
            </div>
          )}
        </div>
      )}

      {gameState === "ENDED" && getWinners().length > 0 && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-500 p-4">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="absolute animate-ping" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDuration: `${1 + Math.random()}s`, animationDelay: `${Math.random()}s`, backgroundColor: ["#FFD700", "#FF69B4", "#00BFFF", "#32CD32"][Math.floor(Math.random() * 4)], width: "6px", height: "6px", borderRadius: "50%" }}></div>
            ))}
          </div>
          <div className="relative bg-slate-900/95 border border-yellow-500/30 shadow-[0_0_40px_rgba(250,204,21,0.2)] rounded-3xl p-6 sm:p-8 max-w-3xl w-full flex flex-col items-center transform transition-all animate-in zoom-in-90 duration-300">
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6">
              <Trophy className="w-10 h-10 sm:w-14 sm:h-14 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] animate-bounce" />
              <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 drop-shadow-md">{getWinners().length > 1 ? t("draw") : t("winner")}</h2>
              <Trophy className="w-10 h-10 sm:w-14 sm:h-14 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] animate-bounce" />
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 w-full max-h-[35vh] overflow-y-auto custom-scrollbar">
              {getWinners().map((winner, idx) => (
                <div key={idx} className="flex flex-col items-center bg-slate-800/60 p-3 rounded-2xl border border-yellow-500/20 min-w-[110px] sm:min-w-[130px] animate-in zoom-in duration-300" style={{animationDelay: `${idx * 100}ms`}}>
                  <div className="relative mb-2 group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-full opacity-50 blur group-hover:opacity-100 transition duration-500"></div>
                    <img src={winner.avatarUrl} alt="Winner" className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-yellow-400 shadow-xl object-cover bg-slate-900" />
                    {getWinners().length > 1 && <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black font-bold px-1.5 py-0.5 rounded-full text-[10px] shadow-lg">#{idx + 1}</div>}
                  </div>
                  <p className="text-sm sm:text-base font-bold text-white truncate max-w-[100px]">{winner.nickname}</p>
                  {pointRushEnabled && <p className="text-xs sm:text-sm font-mono text-green-300 font-bold mt-0.5">{winner.score} {t("log_pts")}</p>}
                </div>
              ))}
            </div>
            {(() => {
              const killers = players.filter(p => (p.sessionKills || 0) > 0).sort((a,b) => b.sessionKills - a.sessionKills);
              const maxKills = killers.length > 0 ? killers[0].sessionKills : 0;
              const mostKillers = killers.filter(p => p.sessionKills === maxKills);
              if (mostKillers.length > 0) {
                return (
                  <div className="w-full bg-red-950/30 border border-red-900/50 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-6">
                    <div className="flex items-center gap-1.5 text-red-500 text-xs sm:text-sm font-black tracking-widest drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"><Skull className="w-4 h-4 animate-pulse" /> {t("most_killer")}</div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {mostKillers.map((killer, idx) => (
                        <div key={idx} className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-red-800/40 flex items-center gap-2 shadow-sm hover:scale-105 transition-transform">
                          <div className="relative">
                            <img src={killer.avatarUrl} alt="killer" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-red-600 object-cover bg-slate-800"/>
                            <div className="absolute -bottom-1 -right-1 text-[8px] bg-red-600 text-white rounded-full px-1 shadow-md">🔪</div>
                          </div>
                          <div className="text-left leading-tight">
                            <p className="text-[10px] sm:text-xs font-bold text-white truncate max-w-[80px]">{killer.nickname}</p>
                            <p className="text-[9px] sm:text-[10px] font-mono text-red-400 font-bold">{killer.sessionKills} {t("stats_kills")}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })()}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => { 
                  setRestartCountdown(null); 
                  if (autoRestartEnabled) {
                      clearLobby();
                      pickShowcaseWords();
                      setTimeout(() => setWaitingCountdown(60), 0);
                  } else {
                      processQueue(); 
                      startGame(); 
                  }
              }} className="px-8 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-full shadow-lg hover:shadow-green-500/50 active:scale-95 transition-all text-sm sm:text-base border border-green-400/50">
                {restartCountdown !== null ? `Timer Join (${restartCountdown}s)` : t("play_again")}
              </button>
              <button onClick={() => { setRestartCountdown(null); clearLobby(); }} className="px-6 py-2.5 bg-slate-800 hover:bg-red-900/80 text-white font-bold rounded-full shadow-lg active:scale-95 transition-all text-xs sm:text-sm border border-slate-700 hover:border-red-500">
                {t("clear_lobby")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-12 left-2 sm:bottom-4 sm:left-4 z-40 flex flex-col gap-1 items-start">
        <button 
          onClick={() => setShowLogs(!showLogs)} 
          className="text-[10px] text-slate-400 bg-black/40 px-2 py-1 rounded-md hover:bg-black/60 transition-colors flex items-center gap-1.5 backdrop-blur-sm border border-slate-700/50"
          title={showLogs ? "Sembunyikan Log" : "Tampilkan Log"}
        >
          {showLogs ? <MessageSquareOff className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
          <span className="hidden sm:inline">{showLogs ? "Hide Logs" : "Show Logs"}</span>
        </button>

        {showLogs && (
          <div className="w-48 sm:w-64 h-32 sm:h-48 overflow-y-auto custom-scrollbar rounded-lg">
            <div className="flex flex-col-reverse justify-end min-h-full gap-1">
              {logs.map((log) => (
                <div key={log.id} className={`flex items-center px-3 py-1 rounded text-[10px] sm:text-xs animate-in slide-in-from-left fade-in transition-colors w-full bg-black/40 backdrop-blur-md cursor-default`}>
                  <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {log.user === "Action" ? <span className="font-bold text-amber-400 drop-shadow-sm">{log.message}</span> : <><span className="font-bold text-blue-300">{log.user}:</span> <span className="text-white">{log.message}</span></>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- GLOBAL TOAST UNTUK PENONTON (NON-PLAYERS) --- */}
      <div className="absolute top-24 right-4 z-[120] flex flex-col gap-2 pointer-events-none items-end">
        {activeEffects.filter(e => !players.some(p => p.uniqueId === e.uniqueId)).map(effect => {
           if (effect.type === 'like') {
             return (
               <div key={effect.id} className="bg-gradient-to-r from-red-500/80 to-rose-600/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full border border-red-400/50 flex items-center gap-2 shadow-lg animate-in slide-in-from-right fade-in fade-out duration-500">
                  <img src={effect.profilePictureUrl || getAvatarUrl(effect.uniqueId)} alt="avatar" className="w-5 h-5 rounded-full border border-white/50 object-cover bg-slate-900" />
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10px] font-bold truncate max-w-[80px]">{effect.nickname || "Penonton"}</span>
                    <span className="text-[8px] text-red-200">Sent likes <Heart className="w-2.5 h-2.5 inline text-white animate-pulse" fill="currentColor" /></span>
                  </div>
               </div>
             )
           }
           if (effect.type === 'gift') {
             return (
               <div key={effect.id} className="bg-gradient-to-r from-pink-500/80 to-purple-600/80 backdrop-blur-md text-white p-2 rounded-lg border border-pink-400/50 flex items-center gap-3 shadow-xl animate-in slide-in-from-right fade-in fade-out duration-500">
                  <img src={effect.profilePictureUrl || getAvatarUrl(effect.uniqueId)} alt="avatar" className="w-8 h-8 rounded-full border-2 border-white/50 object-cover bg-slate-900" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold truncate max-w-[100px]">{effect.nickname || "Penonton"}</span>
                    <span className="text-[10px] text-pink-200 flex items-center gap-1">
                      Kirim: {effect.giftName} 
                      {effect.giftPictureUrl ? <img src={effect.giftPictureUrl} className="w-4 h-4 object-contain inline" alt="gift" /> : "🎁"}
                    </span>
                  </div>
               </div>
             )
           }
           return null;
        })}
      </div>

      <div className="absolute bottom-2 sm:bottom-4 text-center w-full text-slate-500 text-[8px] sm:text-[10px] pointer-events-none z-40">{t("footer")}</div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        
        /* Animasi Flurry Heart / Likes */
        @keyframes flurry-heart {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
            20% { opacity: 1; transform: translate(calc(-50% + (var(--tx) * 0.5)), calc(-50% + (var(--ty) * 0.5))) scale(1); }
            80% { opacity: 1; transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0.8); }
            100% { opacity: 0; transform: translate(calc(-50% + (var(--tx) * 1.5)), calc(-50% + (var(--ty) * 1.5) - 10px)) scale(0); }
        }
        .animate-flurry-heart {
            animation: flurry-heart 1.5s ease-out forwards;
        }

        /* Animasi Flurry Gift */
        @keyframes flurry-gift {
            0% { opacity: 0; transform: translateX(-50%) translateY(10px) scale(0.5); }
            15% { opacity: 1; transform: translateX(-50%) translateY(-10px) scale(1.1); }
            85% { opacity: 1; transform: translateX(-50%) translateY(-40px) scale(1); }
            100% { opacity: 0; transform: translateX(-50%) translateY(-60px) scale(0.8); }
        }
        .animate-flurry-gift {
            animation: flurry-gift 3s ease-out forwards;
        }

        /* Animasi Teks Meledak & Melayang */
        @keyframes float-up {
            0% { opacity: 0; transform: translate(-50%, 40px) scale(0.5); }
            15% { opacity: 1; transform: translate(-50%, -10px) scale(1.1); }
            30% { transform: translate(-50%, 0px) scale(1); }
            70% { opacity: 1; transform: translate(-50%, -15px) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -40px) scale(0.8); }
        }
        .animate-float-up {
            animation: float-up 2s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
            position: absolute; left: 50%;
        }
      `}</style>
    </div>
  );
}