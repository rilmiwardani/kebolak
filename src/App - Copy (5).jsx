import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Clock,
  Settings,
  Trophy,
  Star,
  Plus,
  Minus,
  X,
  Gamepad2,
  FileJson,
  Skull,
  Bot,
  User,
  Keyboard,
  Send,
  Globe,
  Maximize,
  Minimize,
  Delete,
  Volume2,
  VolumeX,
  Medal,
  TrendingUp,
  AlertTriangle,
  MapPin,
  Music,
  Zap,
  Target,
  RefreshCw,
  Gift,
  BarChart2,
  Info,
  Crown,
  Link,
  Unlink,
  Hash,
  FlipHorizontal,
  MoveUpRight, // Ikon untuk Step Up
  TrendingUp as TrendingUpIcon, // Ikon Step Up 2
  Repeat2 // Ikon untuk Mirror 2
} from "lucide-react";

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  EN: {
    waiting: "WAITING FOR PLAYERS...",
    type_join: "Type !join",
    game_over: "GAME OVER",
    new_game: "New Game",
    current_word: "CURRENT WORD",
    winner: "WINNER!",
    play_again: "PLAY AGAIN",
    score: "Score",
    sound: "Sound",
    language: "Language",
    end_condition: "End Condition",
    turn_time: "Turn Time",
    players: "Players",
    load_json: "Load JSON",
    add_host: "+Host",
    add_bot: "+Bot",
    mode: "Mode",
    start_game: "START GAME",
    reset_game: "RESET GAME",
    simulation: "Simulation",
    footer: "Use !join to play • Answer in chat • No repeating words",
    supporter: "Supporter",
    sent: "sent",
    log_invalid: "invalid word",
    log_used: "already used",
    log_bad_link: "bad link",
    log_correct: "Correct!",
    log_eliminated: "eliminated!",
    log_joined: "joined!",
    log_stumped: "is stumped!",
    log_reset: "Game Reset!",
    log_lobby_full: "Lobby Full! Auto-starting...",
    log_need_players: "Need at least 2 players.",
    log_goes_first: "goes first!",
    log_rule_change: "RULE CHANGE",
    log_pts: "Pts",
    log_lobby_cleared: "Lobby Cleared!",
    clear_lobby: "KICK ALL / CLEAR LOBBY",
    rule_start: "Start with",
    rule_end: "Ends with",
    rule_mirror: "Ends with Start of",
    rule_ladder: "Length +1",
    rule_ladder_reset: "Reset Length",
    rule_contains: "Contains",
    rule_syllable: "Syllable",
    rule_no_doubles: "No Double Letters",
    rule_unique: "Unique Letters",
    rule_min: "Min",
    rule_max: "Max",
    rule_odd: "Odd Length",
    rule_even: "Even Length",
    rule_phrase: "Complete Phrase",
    target: "Target",
    round: "Round",
    hall_of_fame: "HALL OF FAME",
    stats_wins: "Wins",
    stats_games: "Games",
    stats_rate: "Win Rate",
    badge_legend: "Badge Legend",
    no_data: "No player data found yet.",
    close: "Close",
    click_to_accept: "Click to Accept",
    chain_broken: "CHAIN BROKEN!",
    reconnecting: "Reconnecting...",
    rhyme_target: "RHYME TARGET",
    rhyme_change: "RHYME CHANGED"
  },
  ID: {
    waiting: "MENUNGGU PEMAIN...",
    type_join: "Ketik !join",
    game_over: "PERMAINAN SELESAI",
    new_game: "Main Lagi",
    current_word: "KATA SAAT INI",
    winner: "PEMENANG!",
    play_again: "MAIN LAGI",
    score: "Skor",
    sound: "Suara",
    language: "Bahasa",
    end_condition: "Akhir Game",
    turn_time: "Waktu Giliran",
    players: "Pemain",
    load_json: "Muat JSON",
    add_host: "+Host",
    add_bot: "+Bot",
    mode: "Mode",
    start_game: "MULAI GAME",
    reset_game: "RESET GAME",
    simulation: "Simulasi",
    footer: "Ketik !join untuk main • Jawab di chat • Dilarang kata ulang",
    supporter: "Pendukung",
    sent: "mengirim",
    log_invalid: "tidak ada di kamus",
    log_used: "sudah dipakai",
    log_bad_link: "tidak nyambung",
    log_correct: "Benar!",
    log_eliminated: "tereliminasi!",
    log_joined: "bergabung!",
    log_stumped: "bingung!",
    log_reset: "Game Direset!",
    log_lobby_full: "Lobby Penuh! Otomatis mulai...",
    log_need_players: "Butuh minimal 2 pemain.",
    log_goes_first: "jalan duluan!",
    log_rule_change: "GANTI ATURAN",
    log_pts: "Poin",
    log_lobby_cleared: "Lobby Dibersihkan!",
    clear_lobby: "USIR SEMUA / BERSIHKAN",
    rule_start: "Mulai dgn",
    rule_end: "Akhiran",
    rule_mirror: "Akhiran = Awal",
    rule_ladder: "Panjang +1",
    rule_ladder_reset: "Reset Panjang",
    rule_contains: "Mengandung",
    rule_syllable: "Suku Kata",
    rule_no_doubles: "Tanpa Huruf Ganda",
    rule_unique: "Huruf Unik",
    rule_min: "Min",
    rule_max: "Maks",
    rule_odd: "Panjang Ganjil",
    rule_even: "Panjang Genap",
    rule_phrase: "Lengkapi Frasa",
    target: "Target",
    round: "Ronde",
    hall_of_fame: "AULA KETENARAN",
    stats_wins: "Menang",
    stats_games: "Main",
    stats_rate: "Rasio Menang",
    badge_legend: "Legenda Lencana",
    no_data: "Belum ada data pemain.",
    close: "Tutup",
    click_to_accept: "Klik untuk Terima",
    chain_broken: "RANTAI PUTUS!",
    reconnecting: "Menyambung...",
    rhyme_target: "TARGET RIMA",
    rhyme_change: "RIMA BERUBAH"
  }
};

// --- FALLBACK DICTIONARY (ENGLISH) ---
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
  "log", "love", "low", "light", "lake", "leaf", "life", "line", "lion", "list", "lemon", "man", "map", "mat", "moon",
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

// --- FALLBACK PHRASES (INDONESIA) ---
const FALLBACK_PHRASES_ID = [
  "ahli gizi", "ahli waris", "ahli nujum", "ahli kubur", "ahli bahasa", "ahli bedah", "ahli hukum", "ahli kimia", "ahli mesin", "ahli sejarah", "ahli tafsir",
  "gizi buruk", "gizi seimbang", "gizi baik",
  "buruk sangka", "buruk rupa", "buruk siku", "buruk hati", "buruk laku", "buruk mulut",
  "sangka baik", "sangka buruk",
  "mata hati", "mata kaki", "mata pisau", "mata duitan", "mata pencaharian", "mata sapi", "mata air", "mata angin", "mata batin", "mata buatan", "mata buku", "mata dagangan", "mata dunia", "mata gelap", "mata ganti", "mata jalan", "mata jala", "mata keranjang", "mata kuliah", "mata kucing", "mata luka", "mata memandang", "mata pelajaran", "mata pedang", "mata panah", "mata pancing", "mata rantai", "mata rumah", "mata susu", "mata uang",
  "kaki lima", "kaki tangan", "kaki ayam", "kaki langit", "kaki bukit", "kaki dian", "kaki gajah", "kaki gunung", "kaki meja", "kaki seribu",
  "lima benua", "lima waktu", "lima jari", "lima sila", "lima sekawan",
  "tangan panjang", "tangan besi", "tangan dingin", "tangan hampa", "tangan kanan", "tangan kosong", "tangan terbuka", "tangan jahil", "tangan pertama", "tangan kedua",
  "panjang tangan", "panjang akal", "panjang umur", "panjang lebar", "panjang napas", "panjang usus",
  "akal bulus", "akal sehat", "akal budi", "akal kancil",
  "sehat walafiat", "sehat jasmani", "sehat rohani", "sehat sentosa",
  "rumah sakit", "rumah makan", "rumah tangga", "rumah duka", "rumah kaca", "rumah susun", "rumah adat", "rumah ibadah", "rumah jagal", "rumah jamur", "rumah kolong", "rumah lebah", "rumah monyet", "rumah obat", "rumah pasung", "rumah piatu", "rumah potong", "rumah ramah", "rumah sekolah", "rumah sewa", "rumah siput", "rumah susun", "rumah tumbuh",
  "sakit hati", "sakit jiwa", "sakit gigi", "sakit kepala", "sakit keras", "sakit mata", "sakit perut", "sakit pinggang",
  "hati nurani", "hati kecil", "hati batu", "hati emas", "hati hampa", "hati kedondong", "hati kristal", "hati lebur", "hati luka", "hati membusuk", "hati muda", "hati mutu", "hati panas", "hati putih", "hati sanubari", "hati tawon", "hati terbuka", "hati tungau",
  "kecil hati", "kecil mulut",
  "batu besar", "batu nisan", "batu akik", "batu api", "batu arang", "batu asah", "batu bara", "batu bata", "batu baterai", "batu belah", "batu berani", "batu bersurat", "batu besi", "batu bintang", "batu canai", "batu delima", "batu duga", "batu empedu", "batu gamping", "batu gantung", "batu giling", "batu ginjal", "batu giok", "batu gunung", "batu hias", "batu hidup", "batu hitam", "batu induk", "batu jala", "batu kali", "batu kapur", "batu karang", "batu kawi", "batu kelating", "batu kerikil", "batu kisaran", "batu koral", "batu kristal", "batu kuarsa", "batu kubur", "batu laga", "batu lahar", "batu lempung", "batu loncatan", "batu mandi", "batu merah", "batu mulia", "batu padas", "batu pualam", "batu sandungan", "batu sapi", "batu sarang", "batu sempur", "batu sendi", "batu serawak", "batu slate", "batu tahu", "batu tian", "batu timbang", "batu tulis", "batu tungku", "batu ubin", "batu ujian", "batu unam", "batu ubin",
  "besar kepala", "besar mulut", "besar hati", "besar cakap", "besar kaleng",
  "mulut manis", "mulut besar", "mulut buaya", "mulut harimau", "mulut kotor", "mulut manis", "mulut murai", "mulut pahit", "mulut rambang",
  "manis jari", "manis mulut", "manis daging",
  "jari manis", "jari tengah", "jari kelingking", "jari telunjuk", "jari jempol", "jari hantu", "jari malang", "jari mati", "jari panjang", "jari rimpang", "jari syahadat",
  "tengah hari", "tengah malam", "tengah jalan", "tengah kota", "tengah laut", "tengah rumah", "tengah sawah", "tengah tahun",
  "malam minggu", "malam jumat", "malam buta", "malam panjang", "malam pertama",
  "minggu depan", "minggu tenang", "minggu ini", "minggu lalu",
  "depan mata", "depan rumah", "depan pintu",
  "pintu gerbang", "pintu masuk", "pintu keluar", "pintu darurat", "pintu hati", "pintu air", "pintu belakang", "pintu besi", "pintu buta", "pintu depan", "pintu dorong", "pintu gulung", "pintu hantu", "pintu harmonika", "pintu hati", "pintu jendela", "pintu kaca", "pintu kambing", "pintu koboi", "pintu kolong", "pintu kompas", "pintu kuku", "pintu kupu-kupu", "pintu lipat", "pintu maling", "pintu masuk", "pintu monyet", "pintu nama", "pintu pagar", "pintu pusing", "pintu rangkap", "pintu samping", "pintu sorong", "pintu teralis", "pintu tolak", "pintu utama", "pintu wali",
  "air mata", "air terjun", "air tawar", "air asin", "air besar", "air bah", "air keras", "air liur", "air mancur", "air mandi", "air minum", "air muka", "air pasang", "air payau", "air putih", "air raksa", "air rebusan", "air seni", "air surut", "air susu", "air tanah", "air terjun", "air zamzam",
  "anak emas", "anak buah", "anak angkat", "anak asuh", "anak bawang", "anak bini", "anak cucu", "anak dagang", "anak dara", "anak didik", "anak duit", "anak gampang", "anak gugur", "anak haram", "anak jadah", "anak jalanan", "anak kandung", "anak kapal", "anak kembar", "anak kolong", "anak komidi", "anak kunci", "anak laki-laki", "anak layang-layang", "anak lembu", "anak lidah", "anak luar", "anak manis", "anak manusia", "anak mas", "anak mata", "anak meja", "anak merah", "anak muda", "anak murid", "anak negeri", "anak obat", "anak panah", "anak pandu", "anak panggung", "anak panjang", "anak perahu", "anak perak", "anak perempuan", "anak piatu", "anak pinak", "anak pisau", "anak pungut", "anak putib", "anak raja", "anak rambut", "anak rantau", "anak rata", "anak roda", "anak rumah", "anak rusa", "anak saku", "anak sapi", "anak sekolah", "anak semang", "anak sulung", "anak sumbang", "anak sungai", "anak susuan", "anak tangan", "anak tangga", "anak tanggung", "anak tiri", "anak torak", "anak tunggal", "anak uang", "anak wayang", "anak yatim",
  "kambing hitam", "kambing congek",
  "meja hijau", "meja makan", "meja tulis", "meja bola", "meja bundar", "meja kerja",
  "buah tangan", "buah bibir", "buah hati", "buah dada", "buah kalam", "buah pena", "buah pikiran", "buah pinggang", "buah simalakama", "buah tidur", "buah tutur",
  "bunga desa", "bunga bank", "bunga tidur", "bunga api", "bunga bangkai", "bunga bibir", "bunga karang", "bunga latar", "bunga matahari", "bunga rampai", "bunga raya", "bunga ros", "bunga sepatu", "bunga tahi ayam", "bunga tanah", "bunga uang",
  "kabar angin", "kabar burung", "kabar dengkul", "kabar selentingan",
  "naik daun", "naik darah", "naik haji", "naik hati", "naik kelas", "naik kuda", "naik mimbar", "naik nama", "naik pangkat", "naik pasang", "naik pitam", "naik ranjang", "naik saksi", "naik tahta", "naik tangan", "naik tekstil",
  "turun tangan", "turun harga", "turun hati", "turun main", "turun makan", "turun minum", "turun ranjang", "turun tahta", "turun tangan", "turun temurun",
  "jual mahal", "jual aksi", "jual bangsa", "jual bicara", "jual diri", "jual gampang", "jual gigi", "jual jamu", "jual kepala", "jual lagak", "jual lelang", "jual mata", "jual muka", "jual nama", "jual tampang"
];

const FALLBACK_PHRASES_EN = [
    "high school", "school bus", "bus stop", "stop sign", "sign language", "language barrier", "barrier reef",
    "ice cream", "cream cheese", "cheese cake", "cake walk", "walk away",
    "hot dog", "dog house", "house party", "party animal", "animal kingdom", "kingdom come",
    "fire truck", "truck driver", "driver license", "license plate", "plate glass", "glass house",
    "apple pie", "pie chart", "chart topper",
    "black hole", "hole in one", "one way", "way out", "out side", "side walk",
    "full moon", "moon light", "light bulb", "bulb garden", "garden party",
    "star wars", "wars zone", "zone out",
    "time out", "out loud", "loud speaker", "speaker phone", "phone call", "call back", "back door",
    "door bell", "bell pepper", "pepper spray", "spray paint", "paint brush", "brush off",
    "sea shell", "shell fish", "fish tank", "tank top", "top hat", "hat trick", "trick shot",
    "shot gun", "gun powder", "powder room", "room mate",
    "grand father", "father figure", "figure out", "out run", "run away",
    "water fall", "fall down", "down town", "town hall", "hall way",
    "gold fish", "fish net", "net work", "work out", "out door",
    "rain bow", "bow tie", "tie dye",
    "sun flower", "flower pot", "pot luck", "luck out",
    "key board", "board game", "game over", "over time", "time zone"
];

// --- FALLBACK DICTIONARY (INDONESIA - Mockup) ---
const FALLBACK_DICTIONARY_ID_DATA = {
  makan: { nama: "ma.kan" }, minum: { nama: "mi.num" }, lari: { nama: "la.ri" }, jalan: { nama: "ja.lan" },
  hutan: { nama: "hu.tan" }, langit: { nama: "la.ngit" }, tanah: { nama: "ta.nah" }, api: { nama: "a.pi" },
  air: { nama: "a.ir" }, udara: { nama: "u.da.ra" }, eretan: { nama: "e.ret.an" }, tanam: { nama: "ta.nam" },
  nama: { nama: "na.ma" }, mana: { nama: "ma.na" }, nanas: { nama: "na.nas" }, nasib: { nama: "na.sib" },
  ibu: { nama: "i.bu" }, budi: { nama: "bu.di" }, ikan: { nama: "i.kan" }, kancil: { nama: "kan.cil" }
};

// --- FALLBACK CITIES (Mockup) ---
const FALLBACK_CITIES = [
  { name: "Tokyo", region: "Japan" }, { name: "Jakarta", region: "Indonesia" }, { name: "New York", region: "USA" },
  { name: "London", region: "UK" }, { name: "Paris", region: "France" }, { name: "Berlin", region: "Germany" },
  { name: "Moscow", region: "Russia" }, { name: "Beijing", region: "China" }, { name: "Sydney", region: "Australia" },
  { name: "Cairo", region: "Egypt" }, { name: "Istanbul", region: "Turkey" }, { name: "Lima", region: "Peru" },
  { name: "Amsterdam", region: "Netherlands" }, { name: "Madrid", region: "Spain" }, { name: "Dubai", region: "UAE" }
];

// --- UPDATED: DYNAMIC CHALLENGES WITH TIERS ---
const DYNAMIC_CHALLENGES = [
  { id: "MIN_5", label: "📏 Min 5 Letters", labelID: "📏 Min 5 Huruf", check: (w) => w.length >= 5, tier: 1 },
  { id: "MAX_5", label: "📏 Max 5 Letters", labelID: "📏 Maks 5 Huruf", check: (w) => w.length <= 5, tier: 1 },
  { id: "ODD", label: "1️⃣3️⃣5️⃣ Odd Length", labelID: "1️⃣3️⃣5️⃣ Panjang Ganjil", check: (w) => w.length % 2 !== 0, tier: 1 },
  { id: "EVEN", label: "2️⃣4️⃣6️⃣ Even Length", labelID: "2️⃣4️⃣6️⃣ Panjang Genap", check: (w) => w.length % 2 === 0, tier: 1 },
  { id: "HAS_DOUBLE", label: "👯 Double Letters", labelID: "👯 Ada Huruf Ganda", check: (w) => /(.)\1/.test(w), tier: 2 },
  { id: "END_VOWEL", label: "🔤 End: Vowel", labelID: "🔤 Akhir: Vokal", check: (w) => /[aeiou]$/i.test(w), tier: 2 },
  { id: "END_CONS", label: "🔤 End: Consonant", labelID: "🔤 Akhir: Konsonan", check: (w) => /[^aeiou]$/i.test(w), tier: 2 },
  { id: "NO_S_R", label: "🚫 No 'S' or 'R'", labelID: "🚫 Tanpa 'S' atau 'R'", check: (w) => !/[sr]/i.test(w), tier: 2 },
  { id: "NO_A_I", label: "🚫 No 'A' or 'I'", labelID: "🚫 Tanpa 'A' atau 'I'", check: (w) => !/[ai]/i.test(w), tier: 3 },
  { id: "NO_E_O", label: "🚫 No 'E' or 'O'", labelID: "🚫 Tanpa 'E' atau 'O'", check: (w) => !/[eo]/i.test(w), tier: 3 },
  { id: "MAX_1_VOWEL", label: "1️⃣ Max 1 Vowel", labelID: "1️⃣ Maks 1 Vokal", check: (w) => (w.match(/[aeiou]/gi) || []).length <= 1, tier: 3 },
  { id: "MUST_3_VOWELS", label: "🔤 Min 3 Vowels", labelID: "🔤 Min 3 Vokal", check: (w) => (w.match(/[aeiou]/gi) || []).length >= 3, tier: 3 },
  { id: "NO_VOWELS", label: "💀 No Vowels (Abbr)", labelID: "💀 Tanpa Vokal (Singkatan)", check: (w) => !/[aeiou]/i.test(w), tier: 4 },
  { id: "SAME_START_END", label: "🔄 Start = End", labelID: "🔄 Awal = Akhir", check: (w) => w.length > 1 && w[0].toLowerCase() === w[w.length - 1].toLowerCase(), tier: 4 },
  { id: "UNIQUE", label: "🌟 Unique Letters Only", labelID: "🌟 Huruf Unik Saja", check: (w) => new Set(w).size === w.length, tier: 4 },
  { id: "SECOND_VOWEL", label: "🔤 2nd Letter: Vowel", labelID: "🔤 Huruf Ke-2: Vokal", check: (w) => w.length > 1 && /[aeiou]/.test(w[1]), tier: 4 }
];

// --- UTILS ---
const getRandomColor = () => {
  const colors = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899", "#14B8A6"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getAvatarUrl = (id) => `https://api.dicebear.com/7.x/adventurer/svg?seed=${id}`;

const normalizeWord = (word) => {
  if (typeof word !== "string") return "";
  return word
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
};

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
        if (rime.length >= 3 && /^[aeiouy]{2}/.test(rime)) {
          return rime.slice(1);
        }
        return rime;
      }
      return w;
    }
  }

  let lastVowelMatch, prevVowelMatch;
  if (isLeEnding) {
    lastVowelMatch = matches[matches.length - 1];
    prevVowelMatch = matches[matches.length - 2];
  } else {
    lastVowelMatch = relevantMatches[relevantMatches.length - 1];
    prevVowelMatch = relevantMatches[relevantMatches.length - 2];
  }

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

// --- STATS MANAGER (LocalStorage) ---
const StatsManager = {
  load: (uniqueId) => {
    try {
      const data = localStorage.getItem("word_chain_stats");
      const stats = data ? JSON.parse(data) : {};
      return stats[uniqueId] || { wins: 0, games: 0, badges: [] };
    } catch (e) {
      console.error("Stats Load Error", e);
      return { wins: 0, games: 0, badges: [] };
    }
  },
  loadAll: () => {
    try {
      const data = localStorage.getItem("word_chain_stats");
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error("Stats Load All Error", e);
      return {};
    }
  },
  update: (uniqueId, isWin, incrementGame = true, nickname = "Player") => {
    try {
      const data = localStorage.getItem("word_chain_stats");
      const allStats = data ? JSON.parse(data) : {};
      const playerStats = allStats[uniqueId] || { wins: 0, games: 0, badges: [], nickname: nickname };

      if (nickname) playerStats.nickname = nickname;

      if (incrementGame) playerStats.games += 1;
      if (isWin) playerStats.wins += 1;

      const newBadges = new Set(playerStats.badges);
      if (playerStats.games === 1) newBadges.add("👶");

      if (playerStats.wins >= 1) {
        newBadges.add("🥇");
        newBadges.delete("👶");
      }

      if (playerStats.wins >= 3) newBadges.add("🔥");
      if (playerStats.games >= 5) newBadges.add("💀");
      if (playerStats.wins >= 10) newBadges.add("👑");

      playerStats.badges = Array.from(newBadges);
      allStats[uniqueId] = playerStats;

      localStorage.setItem("word_chain_stats", JSON.stringify(allStats));
      return playerStats;
    } catch (e) {
      console.error("Stats Save Error", e);
      return { wins: 0, games: 0, badges: [] };
    }
  }
};

// --- SOUND MANAGER ---
const SoundManager = {
  ctx: null,
  init: () => {
    if (!SoundManager.ctx) {
      SoundManager.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  playTone: (freq, type, duration, vol = 0.1, slideTo = null) => {
    if (!SoundManager.ctx) SoundManager.init();
    const ctx = SoundManager.ctx;
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(slideTo, ctx.currentTime + duration);
    }

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
      default:
        break;
    }
  }
};

export default function App() {
  // Game State
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState("WAITING");
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [usedWords, setUsedWords] = useState(new Set());
  const [gameMode, setGameMode] = useState("LAST_LETTER");
  const [language, setLanguage] = useState("EN");

  // RHYME MODE STATE
  const [targetRhyme, setTargetRhyme] = useState("");
  const rhymeTargetsRef = useRef([]);

  // Table Feedback State
  const [tableStatus, setTableStatus] = useState("idle");
  const tableStatusTimeout = useRef(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Stats / Hall of Fame
  const [showStats, setShowStats] = useState(false);
  const [allStats, setAllStats] = useState([]);

  // Dynamic Mode State
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [turnCount, setTurnCount] = useState(0);
  const [challengeQueue, setChallengeQueue] = useState([]);

  // Settings for POINT_RUSH
  const [gameDuration, setGameDuration] = useState(60);
  const [targetScore, setTargetScore] = useState(50);
  const [targetRounds, setTargetRounds] = useState(3);
  const [winCondition, setWinCondition] = useState("TIME");
  const [globalTimer, setGlobalTimer] = useState(null);

  // Dictionaries
  const [dictionary, setDictionary] = useState(FALLBACK_DICTIONARY_EN);
  const [syllableMap, setSyllableMap] = useState({});
  const [cityMetadata, setCityMetadata] = useState({});

  const [logs, setLogs] = useState([]);
  const [lastEvent, setLastEvent] = useState(null);

  // Settings
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [turnDuration, setTurnDuration] = useState(15);
  const [timer, setTimer] = useState(turnDuration);
  const [manualInput, setManualInput] = useState("");
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [dictLoadedInfo, setDictLoadedInfo] = useState("Default (EN)");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const [suggestions, setSuggestions] = useState([]);

  // Refs
  const timerRef = useRef(null);
  const wsRef = useRef(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const fallbackToLocalhostRef = useRef(false);
  const feedbackTimeoutRef = useRef(null);
  
  // Ref for Caching Dictionaries
  const dictionaryCache = useRef({
      EN: { dict: FALLBACK_DICTIONARY_EN, syl: {}, info: "Default (EN)", phrases: new Set(FALLBACK_PHRASES_EN) },
      ID: null,
      CITIES: null
  });

  const phraseDictionary = useRef(new Set(FALLBACK_PHRASES_EN));
  
  // Refs for State Access
  const playersRef = useRef(players);
  const turnIndexRef = useRef(currentTurnIndex);
  const turnDurationRef = useRef(turnDuration);
  const chatHandlerRef = useRef(null);
  const usedWordsRef = useRef(usedWords);
  const syllableMapRef = useRef(syllableMap);
  const isMutedRef = useRef(isMuted);
  const cityMetadataRef = useRef(cityMetadata);
  const challengeQueueRef = useRef(challengeQueue);
  const languageRef = useRef(language);
  const gameModeRef = useRef(gameMode);
  
  // NEW: Ref to track current word for Bot accuracy
  const currentWordRef = useRef(currentWord);
  // NEW: Ref to track targetRhyme for validation
  const targetRhymeRef = useRef(targetRhyme);

  // Sync refs
  useEffect(() => {
    playersRef.current = players;
  }, [players]);
  useEffect(() => {
    turnIndexRef.current = currentTurnIndex;
  }, [currentTurnIndex]);
  useEffect(() => {
    turnDurationRef.current = turnDuration;
  }, [turnDuration]);
  useEffect(() => {
    syllableMapRef.current = syllableMap;
  }, [syllableMap]);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);
  useEffect(() => {
    cityMetadataRef.current = cityMetadata;
  }, [cityMetadata]);
  useEffect(() => {
    challengeQueueRef.current = challengeQueue;
  }, [challengeQueue]);
  useEffect(() => {
    languageRef.current = language;
  }, [language]);
  useEffect(() => {
    gameModeRef.current = gameMode;
  }, [gameMode]);
  useEffect(() => {
    currentWordRef.current = currentWord;
  }, [currentWord]);
  useEffect(() => {
    targetRhymeRef.current = targetRhyme;
  }, [targetRhyme]);

  // --- POPULATE RHYME TARGETS (Heavy Calculation Effect) ---
  useEffect(() => {
    // Generate common suffixes of length 3 and 4
    // Filter those with > 5 occurrences
    const counts = {};
    dictionary.forEach(w => {
        if (w.length >= 4) {
             const s3 = w.slice(-3);
             const s4 = w.slice(-4);
             counts[s3] = (counts[s3] || 0) + 1;
             counts[s4] = (counts[s4] || 0) + 1;
        } else if (w.length === 3) {
             const s2 = w.slice(-2);
             counts[s2] = (counts[s2] || 0) + 1;
        }
    });
    
    const targets = [];
    Object.keys(counts).forEach(k => {
        if (counts[k] > 10) targets.push(k);
    });
    // Sort by most common first, then randomize selection in game
    rhymeTargetsRef.current = targets.sort((a,b) => counts[b] - counts[a]);
  }, [dictionary]);

  const isHostJoined = players.some((p) => p.uniqueId === "host_player");

  const playSound = (effect) => {
    if (!isMutedRef.current) {
      SoundManager.play(effect);
    }
  };

  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS["EN"][key] || key;
  };

  // --- SUGGESTIONS EFFECT ---
  useEffect(() => {
    if (!manualInput || manualInput.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const inputLower = manualInput.toLowerCase();
    const matched = [];
    for (const word of dictionary) {
      if (word.startsWith(inputLower)) {
        matched.push(word);
        if (matched.length >= 5) break;
      }
    }
    setSuggestions(matched);
  }, [manualInput, dictionary]);

  // --- LOGGING ---
  const addLog = (user, message, uniqueId = null) => {
    const logId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setLogs((prev) => [{ user, message, id: logId, uniqueId }, ...prev].slice(0, 50)); 
  };

  const triggerTableEffect = (status) => {
    if (tableStatusTimeout.current) clearTimeout(tableStatusTimeout.current);
    setTableStatus(status);
    tableStatusTimeout.current = setTimeout(() => {
      setTableStatus("idle");
    }, 500);
  };

  const showFeedback = (text, type) => {
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    setFeedbackMessage({ text, type });
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedbackMessage(null);
    }, 2000);
  };

  // --- STATS LOGIC ---
  useEffect(() => {
    if (showStats) {
      const rawStats = StatsManager.loadAll();
      const statsArray = Object.keys(rawStats).map((key) => ({
        id: key,
        ...rawStats[key]
      }));
      statsArray.sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins;
        return b.games - a.games;
      });
      setAllStats(statsArray);
    }
  }, [showStats]);

  // --- HELPERS ---
  const generateChallengeQueue = () => {
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
    const tier1 = shuffle(DYNAMIC_CHALLENGES.filter((c) => c.tier === 1));
    const tier2 = shuffle(DYNAMIC_CHALLENGES.filter((c) => c.tier === 2));
    const tier3 = shuffle(DYNAMIC_CHALLENGES.filter((c) => c.tier === 3));
    const tier4 = shuffle(DYNAMIC_CHALLENGES.filter((c) => c.tier === 4));
    return [...tier1, ...tier2, ...tier3, ...tier4];
  };

  const getNextChallenge = (queue, currentSuffix) => {
    let tempQueue = [...queue];
    if (tempQueue.length === 0) {
      tempQueue = generateChallengeQueue();
    }
    for (let i = 0; i < tempQueue.length; i++) {
      const challenge = tempQueue[i];
      let isSafe = true;

      if (challenge.id === "NO_VOWELS") {
        if (/[aeiou]/i.test(currentSuffix)) isSafe = false;
      } else if (challenge.id === "MAX_1_VOWEL") {
        if ((currentSuffix.match(/[aeiou]/gi) || []).length > 1) isSafe = false;
      } else if (challenge.id === "NO_DOUBLE") {
        if (/(.)\1/.test(currentSuffix)) isSafe = false;
      } else if (challenge.id === "UNIQUE") {
        if (new Set(currentSuffix).size !== currentSuffix.length) isSafe = false;
      } else if (challenge.id.startsWith("NO_")) {
        const forbiddenPart = challenge.id.replace("NO_", "").toLowerCase();
        const forbiddenChars = forbiddenPart.split("_");
        if (forbiddenChars.some((char) => currentSuffix.includes(char))) isSafe = false;
      }

      if (isSafe) {
        const selected = tempQueue.splice(i, 1)[0];
        return { selected, newQueue: tempQueue };
      }
    }
    const selected = tempQueue.shift();
    return { selected, newQueue: tempQueue };
  };

  function getSuffixOrRule(word) {
    if (gameMode === "CITIES") return word.slice(-1);
    if (gameMode === "RHYME") return targetRhymeRef.current || word.slice(-2);
    if (gameMode === "PHRASE_CHAIN") return word;
    if (gameMode === "MIRROR") return word.charAt(0);
    if (gameMode === "MIRROR_2") return word.slice(0, 2); // MIRROR 2 Logic
    // STEP UP uses standard last letter for connection, but length is the key constraint
    if (gameMode === "STEP_UP") return word.slice(-1); 
    if (gameMode === "STEP_UP_2") return word.slice(-2);
    
    if (language === "ID" && gameMode === "SYLLABLE") {
      const data = syllableMapRef.current[word.toLowerCase()];
      if (data && data.nama) {
        const parts = data.nama.split(".");
        return parts[parts.length - 1];
      }
      const overlap = getIndonesianOverlapSuffix(word);
      return overlap.length > 0 ? overlap : word.slice(-2);
    }
    if (gameMode === "LAST_LETTER" || gameMode === "POINT_RUSH" || gameMode === "DYNAMIC") return word.slice(-1);
    if (gameMode === "SECOND_LETTER") return word.length >= 2 ? word[1] : "";
    if (gameMode === "LAST_2_LETTERS" || gameMode === "POINT_RUSH_2" || gameMode === "DYNAMIC_2") return word.slice(-2);
    if (gameMode === "LAST_3_LETTERS") return word.slice(-3);
    if (gameMode === "LONGER_WORD") return word.slice(-1);
    if (gameMode === "LONGER_2_LETTERS") return word.slice(-2);

    return getEnglishSyllableSuffix(word);
  }
  
  function getRecoverySuffix(word) {
      if (language === "ID") {
          return getIndonesianOverlapSuffix(word);
      } else {
          return getEnglishSyllableSuffix(word);
      }
  }

  function getIndonesianOverlapSuffix(word) {
    const w = word.toLowerCase();
    const vowels = /[aeiou]/gi;
    const lastVowelMatch = [...w.matchAll(vowels)].pop();
    if (!lastVowelMatch) return w.slice(-2);
    if (lastVowelMatch.index === w.length - 1) {
      return w.slice(Math.max(0, w.length - 2));
    }
    return w.slice(lastVowelMatch.index);
  }

  function getRuleDisplay(word) {
    const target = getSuffixOrRule(word).toUpperCase();
    let action = t("rule_start");

    const getChallengeLabel = (challenge) => {
      if (!challenge) return "";
      return language === "ID" && challenge.labelID ? challenge.labelID : challenge.label;
    };

    if (gameMode === "CITIES") {
      return { label: "City Chain", target: target, desc: `${t("rule_end")} '${target}'`, action };
    } else if (gameMode === "PHRASE_CHAIN") {
      return { label: "Phrase Chain", target: target, desc: `${t("rule_phrase")}: ${target} ...`, action: "Add next word" };
    } else if (gameMode === "POINT_RUSH") {
      return { label: "Point Rush", target: target, desc: `1 Letter = 1 ${t("log_pts")}`, action };
    } else if (gameMode === "POINT_RUSH_2") {
      return {
        label: "Point Rush (2 Let)",
        target: target,
        desc: `${t("rule_start")} '${target}' (1 Let=1 ${t("log_pts")})`,
        action
      };
    } else if (gameMode === "DYNAMIC") {
      return {
        label: "Dynamic Chaos",
        target: target,
        desc: activeChallenge ? `${getChallengeLabel(activeChallenge)} + ${t("rule_start")} '${target}'` : `${t("rule_start")} '${target}'`,
        action
      };
    } else if (gameMode === "DYNAMIC_2") {
      return {
        label: "Dynamic Chaos (2)",
        target: target,
        desc: activeChallenge ? `${getChallengeLabel(activeChallenge)} + ${t("rule_start")} '${target}'` : `${t("rule_start")} '${target}'`,
        action
      };
    } else if (gameMode === "RHYME") {
      return { label: "Rhyme Rush", target: targetRhyme.toUpperCase(), desc: `${t("rule_end")} ...${targetRhyme.toUpperCase()}`, action: "Target" };
    } else if (gameMode === "MIRROR") {
      return { label: "Mirror Chain", target: target, desc: `${t("rule_mirror")} '${target}'`, action: "End with" };
    } else if (gameMode === "MIRROR_2") {
      return { label: "Mirror Chain (2)", target: target, desc: `${t("rule_mirror")} (2) '${target}'`, action: "End with" };
    } else if (gameMode === "STEP_UP") {
      const len = word.length;
      if (len >= 10) {
         return { 
             label: "Step Up (Reset)", 
             target: target, 
             desc: `${t("rule_start")} '${target}' (${t("rule_ladder_reset")} -> 3/4)`, 
             action 
         };
      }
      return { 
          label: "Step Up", 
          target: target, 
          desc: `${t("rule_start")} '${target}' (${t("rule_ladder")} -> ${len + 1})`, 
          action 
      };
    } else if (gameMode === "STEP_UP_2") {
      const len = word.length;
      if (len >= 10) {
         return { 
             label: "Step Up 2 (Reset)", 
             target: target, 
             desc: `${t("rule_start")} '${target}' (${t("rule_ladder_reset")} -> 3/4)`, 
             action 
         };
      }
      return { 
          label: "Step Up (2 Letters)", 
          target: target, 
          desc: `${t("rule_start")} '${target}' (${t("rule_ladder")} -> ${len + 1})`, 
          action 
      };
    } else if (gameMode === "LAST_LETTER") {
      return { label: "Last Letter", target: target, desc: `${t("rule_end")} '${target}'`, action };
    } else if (gameMode === "SECOND_LETTER") {
      return { label: "2nd Letter", target: target, desc: `2nd Letter is '${target}'`, action };
    } else if (gameMode === "LAST_2_LETTERS") {
      return { label: "Last 2 Letters", target: target, desc: `${t("rule_end")} '${target}'`, action };
    } else if (gameMode === "LAST_3_LETTERS") {
      return { label: "Last 3 Letters", target: target, desc: `${t("rule_end")} '${target}'`, action };
    } else if (gameMode === "LONGER_WORD") {
      if (word.length >= 10) {
        return {
          label: "Longer Word (Reset)",
          target: `> 3 chars`,
          desc: `${t("rule_start")} '${target}' (> 3 letters - RESET!)`,
          action
        };
      }
      return {
        label: "Longer Word",
        target: `> ${word.length}`,
        desc: `${t("rule_start")} '${target}' (> ${word.length} letters)`,
        action
      };
    } else if (gameMode === "LONGER_2_LETTERS") {
      if (word.length >= 10) {
        return {
          label: "Longer (2 Let) [Reset]",
          target: `> 3 chars`,
          desc: `${t("rule_start")} '${target}' (> 3 letters - RESET!)`,
          action
        };
      }
      return {
        label: "Longer (2 Let)",
        target: `> ${word.length}`,
        desc: `${t("rule_start")} '${target}' (> ${word.length} letters)`,
        action
      };
    } else {
      return { label: "Last Syllable", target: target, desc: `${t("rule_syllable")} '${target}'`, action };
    }
  }

  function getDisplayParts(word) {
    if (!word) return { pre: "", high: "", post: "" };

    if (gameMode === "PHRASE_CHAIN") {
        return { pre: "", high: word, post: "..." };
    }

    if (gameMode === "RHYME") {
      // Highlight the target part
      const tr = targetRhymeRef.current;
      if (tr && word.toLowerCase().endsWith(tr)) {
          const splitIdx = word.length - tr.length;
          return {
              pre: word.slice(0, splitIdx),
              high: word.slice(splitIdx),
              post: ""
          }
      }
    }

    if (gameMode === "MIRROR") {
        // Highlight the FIRST letter (Target for next player)
        return {
            pre: "",
            high: word.slice(0, 1),
            post: word.slice(1)
        }
    }

    if (gameMode === "MIRROR_2") {
        // Highlight the FIRST 2 letters (Target for next player)
        if (word.length < 2) return { pre: "", high: word, post: "" };
        return {
            pre: "",
            high: word.slice(0, 2),
            post: word.slice(2)
        }
    }

    if (gameMode === "SECOND_LETTER") {
      if (word.length < 2) return { pre: word, high: "", post: "" };
      return {
        pre: word.slice(0, 1),
        high: word.slice(1, 2),
        post: word.slice(2)
      };
    }

    const suffix = getSuffixOrRule(word);
    const suffixLen = suffix.length;
    const prefixLen = Math.max(0, word.length - suffixLen);
    return {
      pre: word.slice(0, prefixLen),
      high: suffix,
      post: ""
    };
  }

  function validateConnection(prev, next) {
    if (!prev && gameMode !== "RHYME") return true; // Rhyme allows start without prev
    const p = prev ? prev.toLowerCase() : "";
    const n = next.toLowerCase();

    const currentMode = gameModeRef.current || gameMode;

    if (currentMode === "PHRASE_CHAIN") {
        return phraseDictionary.current.has(`${p} ${n}`);
    }

    if (currentMode === "DYNAMIC" || currentMode === "DYNAMIC_2") {
      const suffix = currentMode === "DYNAMIC_2" ? p.slice(-2) : p.slice(-1);
      
      // FIX: Cegah input sama persis dengan suffix (misal: "AIDS" -> "DS" -> "DS" [Ditolak])
      if (n === suffix) return false; 

      if (!n.startsWith(suffix)) return false;
      if (activeChallenge && activeChallenge.check) {
        if (!activeChallenge.check(n)) {
          const label = languageRef.current === "ID" && activeChallenge.labelID ? activeChallenge.labelID : activeChallenge.label;
          addLog("Game", `⚠️ Gagal: ${label}`);
          return false;
        }
      }
      return true;
    }

    let requiredSuffix = "";
    if (currentMode === "MIRROR") {
        requiredSuffix = p.charAt(0);
        // FIX: Cegah input sama persis dengan target
        if (n === requiredSuffix) return false;
        return n.endsWith(requiredSuffix);
    }

    if (currentMode === "MIRROR_2") {
        if (p.length < 2) return false;
        requiredSuffix = p.slice(0, 2);
        // FIX: Cegah input sama persis dengan target
        if (n === requiredSuffix) return false;
        return n.endsWith(requiredSuffix);
    }
    
    if (currentMode === "STEP_UP") {
        // 1. Check Standard Connection (Last Letter)
        requiredSuffix = p.slice(-1);
        if (n === requiredSuffix) return false; // Prevent single letter repeat if strictly 1 char
        if (!n.startsWith(requiredSuffix)) return false;

        // 2. Check Length Ladder Rule
        if (p.length >= 10) {
            // Reset Condition
            return n.length === 3 || n.length === 4;
        } else {
            // Climb Condition
            return n.length === p.length + 1;
        }
    }

    if (currentMode === "STEP_UP_2") {
        // 1. Check Standard Connection (Last 2 Letters)
        requiredSuffix = p.slice(-2);
        if (n === requiredSuffix) return false; 
        if (!n.startsWith(requiredSuffix)) return false;

        // 2. Check Length Ladder Rule
        if (p.length >= 10) {
            // Reset Condition
            return n.length === 3 || n.length === 4;
        } else {
            // Climb Condition
            return n.length === p.length + 1;
        }
    }

    if (currentMode === "RHYME") {
      const target = targetRhymeRef.current;
      // FIX: Cegah pemain menjawab target rima itu sendiri (misal Target "ALL", jawab "ALL" -> Ditolak)
      if (n === target) return false;
      return n.endsWith(target);
    }
    if (currentMode === "CITIES" || currentMode === "LAST_LETTER" || currentMode === "POINT_RUSH") {
      requiredSuffix = p.slice(-1);
      if (n === requiredSuffix) return false;
      return n.startsWith(requiredSuffix);
    } else if (currentMode === "SECOND_LETTER") {
      if (p.length < 2) return false;
      const targetChar = p[1];
      if (n === targetChar) return false;
      return n.startsWith(targetChar);
    } else if (currentMode === "LAST_2_LETTERS" || currentMode === "POINT_RUSH_2") {
      requiredSuffix = p.slice(-2);
      if (n === requiredSuffix) return false;
      return n.startsWith(requiredSuffix);
    } else if (currentMode === "LAST_3_LETTERS") {
      requiredSuffix = p.slice(-3);
      if (n === requiredSuffix) return false;
      return n.startsWith(requiredSuffix);
    } else if (currentMode === "LONGER_WORD") {
      if (p.slice(-1) !== n[0]) return false;
      if (p.length >= 10) return n.length >= 4;
      return n.length > p.length;
    } else if (currentMode === "LONGER_2_LETTERS") {
      if (!n.startsWith(p.slice(-2))) return false;
      if (p.length >= 10) return n.length >= 4;
      return n.length > p.length;
    } else if (currentMode === "SYLLABLE") {
      let isValid = false;
      let connectionPart = "";

      if (language === "EN") {
        connectionPart = getEnglishSyllableSuffix(p);
        if (n.startsWith(connectionPart)) isValid = true;
      } else {
        const prevData = syllableMapRef.current[p];
        if (prevData && prevData.nama) {
          // Jika ada di kamus, GUNAKAN ATURAN KETAT DARI KAMUS
          const prevSyllables = prevData.nama.split(".");
          const lastSyl = prevSyllables[prevSyllables.length - 1];
          connectionPart = lastSyl;
          if (n.startsWith(lastSyl)) isValid = true;
        } else {
          // FIX: Pindah ke ELSE. Fallback hanya jalan jika kata TIDAK ADA di kamus.
          const maxOverlap = Math.min(p.length, n.length, 4);
          for (let len = maxOverlap; len >= 2; len--) {
            const suffix = p.slice(-len);
            if (n.startsWith(suffix)) {
              connectionPart = suffix;
              isValid = true;
              break;
            }
          }
        }
      }
      if (isValid && n === connectionPart) return false;
      return isValid;
    }
    return false;
  }

  // --- GAME LOGIC ---

  const handleWin = (winner) => {
    const updatedStats = StatsManager.update(winner.uniqueId, true, false, winner.nickname);
    setPlayers((prev) => prev.map((p) => (p.uniqueId === winner.uniqueId ? { ...p, stats: updatedStats } : p)));
    setGameState("ENDED");
    playSound("win");
  };

  const isScoreMode = () => {
    // STEP_UP modes removed from here to make them SURVIVAL/ELIMINATION based
    return gameMode === "POINT_RUSH" || gameMode === "POINT_RUSH_2" || gameMode === "CITIES" || gameMode === "PHRASE_CHAIN" || gameMode === "RHYME" || gameMode === "MIRROR" || gameMode === "MIRROR_2";
  };

  useEffect(() => {
    if (gameState === "PLAYING" && isScoreMode() && winCondition === "TIME") {
      if (globalTimer !== null && globalTimer <= 0) {
        setGameState("ENDED");
        playSound("win");
      }
    }
  }, [globalTimer, gameState, gameMode, winCondition]);

  useEffect(() => {
    if (gameState === "PLAYING" && isScoreMode() && winCondition === "TIME") {
      if (globalTimer === null) setGlobalTimer(gameDuration);

      const interval = setInterval(() => {
        setGlobalTimer((prev) => {
          if (prev === null) return gameDuration;
          return Math.max(0, prev - 1);
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      if (gameState !== "PLAYING") setGlobalTimer(null);
    }
  }, [gameState, gameMode, gameDuration, winCondition]);

  function advanceTurn(currentPlayersList, startIndex) {
    let nextIndex = (startIndex + 1) % currentPlayersList.length;
    let attempts = 0;
    while (currentPlayersList[nextIndex].isEliminated && attempts < currentPlayersList.length) {
      nextIndex = (nextIndex + 1) % currentPlayersList.length;
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

    const newPlayers = currentPlayers.map((p, idx) => (idx === currentIndex ? { ...p, isEliminated: true } : p));

    setPlayers(newPlayers);
    addLog("System", `${playerToEliminate.nickname} ${t("log_eliminated")}`);

    // --- NEW: RHYME MODE ELIMINATION LOGIC ---
    // If someone dies in Rhyme mode, change the target immediately so the next player gets a fresh start.
    if (gameMode === "RHYME" && gameState !== "ENDED") {
        setTimeout(() => {
             changeRhymeTarget();
        }, 500);
        setTurnCount(0); // Reset round count for the new rhyme
    }
    // -----------------------------------------

    if (isScoreMode() && winCondition === "ROUNDS") {
      const activePlayers = newPlayers.filter((p) => !p.isEliminated);
      if (activePlayers.length > 0 && activePlayers.every((p) => (p.turnCount || 0) >= targetRounds)) {
        setGameState("ENDED");
        playSound("win");
        const winner = [...activePlayers].sort((a, b) => (b.score || 0) - (a.score || 0))[0];
        if (winner) handleWin(winner);
        return;
      }
    }

    const activePlayers = newPlayers.filter((p) => !p.isEliminated);
    if (activePlayers.length <= 1) {
      if (activePlayers.length === 1) handleWin(activePlayers[0]);
      else {
        setGameState("ENDED");
        playSound("win");
      }
    } else {
      advanceTurn(newPlayers, currentIndex);
    }
  }

  const wordStartsPhrase = (word) => {
    const prefix = word.toLowerCase() + " ";
    for (const phrase of phraseDictionary.current) {
        if (phrase.startsWith(prefix)) return true;
    }
    return false;
  };

  const findRecoveryWord = (deadEndWord) => {
    const suffix = getRecoverySuffix(deadEndWord).toLowerCase();
    const candidates = [];
    for (const phrase of phraseDictionary.current) {
        const parts = phrase.split(" ");
        if (parts.length > 0) {
            const startWord = parts[0];
            if (startWord.startsWith(suffix)) {
                if (startWord !== deadEndWord.toLowerCase()) {
                    candidates.push(startWord);
                }
            }
        }
    }
    
    if (candidates.length > 0) {
        const randomWord = candidates[Math.floor(Math.random() * candidates.length)];
        return { word: randomWord, suffix: suffix };
    }
    return null;
  };

  function changeRhymeTarget() {
      const targets = rhymeTargetsRef.current;
      if (targets.length > 0) {
          // Select random new target, try to avoid current
          let newTarget = targets[Math.floor(Math.random() * targets.length)];
          if (newTarget === targetRhymeRef.current && targets.length > 1) {
             const alt = targets.filter(t => t !== newTarget);
             newTarget = alt[Math.floor(Math.random() * alt.length)];
          }
          setTargetRhyme(newTarget);
          addLog("System", `${t("rhyme_change")}: ...${newTarget.toUpperCase()}`);
          playSound("notification");
          triggerTableEffect("info");
          showFeedback(`${t("rhyme_change")}: ${newTarget.toUpperCase()}`, "info");
      }
  }

  function submitAnswer(word, forcedUniqueId = null) {
    let playerIndex = currentTurnIndex;
    if (forcedUniqueId) {
      const idx = players.findIndex(p => p.uniqueId === forcedUniqueId);
      if (idx !== -1) playerIndex = idx;
    }

    if (gameMode !== "PHRASE_CHAIN" && !dictionary.has(word)) {
      addLog("Game", `❌ "${word}" ${t("log_invalid")}.`);
      playSound("wrong");
      triggerTableEffect("error");
      showFeedback(`${word} ${t("log_invalid")}`, "error");
      return;
    }

    if (usedWordsRef.current.has(word)) {
      addLog("Game", `❌ "${word}" ${t("log_used")}.`);
      playSound("wrong");
      triggerTableEffect("warning");
      showFeedback(`${word} ${t("log_used")}`, "warning");
      return;
    }

    const isValid = validateConnection(currentWord, word);

    if (isValid) {
      playSound("correct");
      triggerTableEffect("success");
      usedWordsRef.current.add(word);
      setUsedWords(new Set(usedWordsRef.current));
      
      const prevWord = currentWord;
      let nextWord = word;
      
      // --- UPDATE PLAYER STATS (MOVED OUTSIDE isScoreMode CHECK) ---
      let pointsAwarded = word.length;
      if (gameMode === "STEP_UP" || gameMode === "STEP_UP_2") {
          pointsAwarded = 10; // Fixed points for Step Up modes
      }

      // Selalu update state pemain (skor & turnCount) meskipun bukan mode skor
      const newPlayersList = players.map((p, index) => {
        if (index === playerIndex) {
          const newScore = (p.score || 0) + pointsAwarded;
          const newTurnCount = (p.turnCount || 0) + 1;
          return { ...p, score: newScore, turnCount: newTurnCount };
        }
        return p;
      });

      setPlayers(newPlayersList);

      // --- CHECK WIN CONDITIONS (ONLY FOR SCORE MODES) ---
      if (isScoreMode()) {
        let gameEnded = false;

        if (winCondition === "SCORE" && newPlayersList[playerIndex].score >= targetScore) {
          gameEnded = true;
        }
        if (winCondition === "ROUNDS") {
          const activePlayers = newPlayersList.filter((p) => !p.isEliminated);
          if (activePlayers.length > 0 && activePlayers.every((p) => (p.turnCount || 0) >= targetRounds)) {
            gameEnded = true;
          }
        }

        if (gameEnded) {
          const winner = [...newPlayersList].filter((p) => !p.isEliminated).sort((a, b) => (b.score || 0) - (a.score || 0))[0];
          handleWin(winner);
          return;
        }
      }

      // Handle Logs & Point Rush Feedback
      if (isScoreMode()) {
         if (gameMode === "CITIES") {
            const region = cityMetadataRef.current[word];
            if (region) {
                addLog("Game", `✅ ${word.toUpperCase()} (${region}) +${word.length} ${t("log_pts")}`);
            } else {
                addLog("Game", `✅ ${word.toUpperCase()} +${word.length} ${t("log_pts")}`);
            }
        } else if (gameMode === "PHRASE_CHAIN") {
           addLog("Game", `✅ ${prevWord.toUpperCase()} -> ${word.toUpperCase()} (+${word.length} ${t("log_pts")})`);
           if (!wordStartsPhrase(word)) {
               const recovery = findRecoveryWord(word);
               if (recovery) {
                   setTimeout(() => {
                       addLog("System", `${t("chain_broken")} 🔗`);
                       addLog("System", `${t("reconnecting")}: ...${recovery.suffix} -> ${recovery.word.toUpperCase()}`);
                       triggerTableEffect("info");
                       playSound("notification");
                       showFeedback(t("chain_broken"), "info");
                   }, 600);
                   nextWord = recovery.word;
               }
           }
        } else if (gameMode === "RHYME") {
             addLog("Game", `✅ ${word.toUpperCase()} (...${targetRhymeRef.current.toUpperCase()}) +${word.length}`);
        } else if (gameMode === "MIRROR") {
             addLog("Game", `✅ ${word.toUpperCase()} (End: ${word.slice(-1).toUpperCase()}) +${word.length}`);
        } else if (gameMode === "MIRROR_2") {
             addLog("Game", `✅ ${word.toUpperCase()} (End: ${word.slice(-2).toUpperCase()}) +${word.length}`);
        } else {
          addLog("Game", `✅ +${word.length} ${t("log_pts")}!`);
        }
      } else {
        // NON-SCORE MODE LOGGING (Survival)
        if (gameMode === "STEP_UP" || gameMode === "STEP_UP_2") {
             // Tampilkan Log Level Panjang Kata tanpa Poin
             const nextLen = word.length >= 10 ? "Reset" : word.length + 1;
             addLog("Game", `✅ ${word.toUpperCase()} (Len: ${word.length}) ➡️ Next: ${nextLen}`);
        } else {
            const region = cityMetadataRef.current[word];
            if (region) {
              addLog("Game", `✅ ${word.toUpperCase()} (${region})`);
            } else {
              addLog("Game", `✅ ${t("log_correct")} "${word}"`);
            }
        }
      }

      // Set the next word
      setCurrentWord(nextWord);

      // --- RHYME MODE ROTATION LOGIC (UPDATED) ---
      if (gameMode === "RHYME") {
          const activePlayers = playersRef.current.filter(p => !p.isEliminated).length;
          const nextTurn = turnCount + 1;
          
          if (nextTurn >= activePlayers) {
              // Round complete (everyone played once)
              setTimeout(() => {
                  changeRhymeTarget();
              }, 800);
              setTurnCount(0); // Reset counting for the new rhyme
          } else {
              setTurnCount(nextTurn);
          }
      }

      if ((gameMode === "DYNAMIC" || gameMode === "DYNAMIC_2") && gameState !== "ENDED") {
        setTurnCount((prev) => {
          const nextTurn = prev + 1;
          const activePlayersCount = playersRef.current.filter((p) => !p.isEliminated).length;

          if (nextTurn >= Math.max(1, activePlayersCount)) {
            const suffix = gameMode === "DYNAMIC_2" ? word.slice(-2).toLowerCase() : word.slice(-1).toLowerCase();
            const { selected, newQueue } = getNextChallenge(challengeQueueRef.current, suffix);

            setActiveChallenge(selected);
            setChallengeQueue(newQueue);

            const ruleLabel = languageRef.current === "ID" && selected.labelID ? selected.labelID : selected.label;
            addLog("System", `🚨 ${t("log_rule_change")}: ${ruleLabel} 🚨`);
            playSound("tick");

            return 0;
          }
          return nextTurn;
        });
      }

      if (gameState !== "ENDED") {
        advanceTurn(players, currentTurnIndex);
      }
    } else {
      const msg = gameMode === "PHRASE_CHAIN" ? "Invalid Phrase Pair" : (gameMode === "RHYME" ? "Salah Rima" : t("log_bad_link"));
      addLog("Game", `❌ "${word}" ${msg}.`);
      playSound("wrong");
      triggerTableEffect("error");
      showFeedback(`${word} ${msg}`, "error");
    }
  }

  function joinGame(uniqueId, nickname, profilePictureUrl, isBot = false) {
    if (gameState !== "WAITING") return;
    setPlayers((prev) => {
      if (prev.some((p) => p.uniqueId === uniqueId)) return prev;
      if (prev.length >= maxPlayers) return prev;

      playSound("join");
      addLog("System", `${nickname} ${t("log_joined")}`, uniqueId);

      let stats = { wins: 0, games: 0, badges: [] };
      if (!isBot) {
        stats = StatsManager.load(uniqueId);
        stats = StatsManager.update(uniqueId, false, true, nickname);
      }

      return [
        ...prev,
        {
          id: uniqueId,
          uniqueId,
          nickname,
          avatarUrl: profilePictureUrl || getAvatarUrl(uniqueId),
          isEliminated: false,
          color: getRandomColor(),
          isBot: isBot,
          stats: stats,
          score: 0,
          turnCount: 0
        }
      ];
    });
  }

  function addBot() {
    const botNames = ["Bot Alpha", "Bot Beta", "Bot Gamma", "Bot Delta", "Bot Omega", "Bot Zeta"];
    const existingNames = new Set(players.map((p) => p.nickname));
    const availableNames = botNames.filter((n) => !existingNames.has(n));
    const name = availableNames.length > 0 ? availableNames[0] : `Bot ${Math.floor(Math.random() * 1000)}`;
    const id = `bot_${Date.now()}_${Math.random()}`;
    joinGame(id, name, null, true);
  }

  function addHost() {
    const id = "host_player";
    const avatar = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=HOST`;
    joinGame(id, "HOST", avatar, false);
  }

  const loadCitiesData = (citiesArray) => {
    const dictSet = new Set();
    const meta = {};
    citiesArray.forEach((city) => {
      if (!city.name) return;
      const cleanName = normalizeWord(city.name);
      if (cleanName) {
        dictSet.add(cleanName);
        if (city.region) {
          meta[cleanName] = city.region;
        }
      }
    });
    setDictionary(dictSet);
    setCityMetadata(meta);
    setDictLoadedInfo(`Cities (${dictSet.size})`);
    
    // Update Cache
    dictionaryCache.current.CITIES = { dict: dictSet, syl: {}, info: `Cities (${dictSet.size})`, meta: meta };
    
    addLog("System", "Loaded World Cities!");
  };

  function startGame() {
    if (players.length < 2) {
      addLog("System", t("log_need_players"));
      return;
    }
    playSound("start");
    
    const dictArray = Array.from(dictionary);
    let randomStart;
    
    if (gameMode === "PHRASE_CHAIN") {
        const phrases = Array.from(phraseDictionary.current);
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        const parts = randomPhrase.split(" ");
        randomStart = parts[0];
    } else if (gameMode === "RHYME") {
        // Init Rhyme Target
        const targets = rhymeTargetsRef.current;
        const initTarget = targets.length > 0 ? targets[Math.floor(Math.random() * targets.length)] : "ing";
        setTargetRhyme(initTarget);
        // Set display to blank or something, players just need to rhyme with target
        randomStart = ""; 
    } else {
        let candidates = dictArray.filter((w) => w.length >= 3 && w.length <= 6);
        if (candidates.length === 0) candidates = dictArray;
        randomStart = candidates[Math.floor(Math.random() * candidates.length)];
    }

    const initialUsed = new Set(randomStart ? [randomStart] : []);
    setUsedWords(initialUsed);
    usedWordsRef.current = initialUsed;

    // Reset player state for new game
    setPlayers((prev) => prev.map((p) => ({ ...p, score: 0, turnCount: 0, isEliminated: false })));

    if (isScoreMode() && winCondition === "TIME") {
      setGlobalTimer(gameDuration);
    }

    if (gameMode === "DYNAMIC" || gameMode === "DYNAMIC_2") {
      const queue = generateChallengeQueue();
      const { selected, newQueue } = getNextChallenge(queue, "");
      setActiveChallenge(selected);
      setChallengeQueue(newQueue);
      setTurnCount(0);

      const ruleLabel = language === "ID" && selected.labelID ? selected.labelID : selected.label;
      addLog("System", `Mode: DYNAMIC CHAOS!`);
      addLog("System", `Rule: ${ruleLabel}`);
    }
    
    // For Rhyme, set turnCount to 0 for rotation logic
    if (gameMode === "RHYME") {
        setTurnCount(0);
        addLog("System", `Mode: RHYME RUSH! Target: ...${targetRhymeRef.current || ""}`);
    }

    setCurrentWord(randomStart);

    const randomFirstPlayerIndex = Math.floor(Math.random() * players.length);
    setCurrentTurnIndex(randomFirstPlayerIndex);

    setTimer(turnDuration);

    setGameState("PLAYING");
    setShowSettings(false);

    const region = cityMetadataRef.current[randomStart];

    const starterName = players[randomFirstPlayerIndex].nickname;
    addLog("System", `Start: ${starterName} ${t("log_goes_first")}`);

    if (randomStart) {
        if (region) {
          addLog("System", `Word: ${randomStart.toUpperCase()} (${region})`);
        } else {
          addLog("System", `Word: ${randomStart.toUpperCase()}`);
        }
    }
  }

  function resetGame() {
    setGameState("WAITING");
    setPlayers((prev) => prev.map((p) => ({ ...p, isEliminated: false, score: 0, turnCount: 0 })));
    setUsedWords(new Set());
    setCurrentWord("");
    setTargetRhyme("");
    setGlobalTimer(null);
    setTimer(turnDuration);
    addLog("System", t("log_reset"));
  }

  function clearLobby() {
    setGameState("WAITING");
    setPlayers([]);
    setUsedWords(new Set());
    setCurrentWord("");
    setTargetRhyme("");
    setGlobalTimer(null);
    setTimer(turnDuration);
    setTurnCount(0);
    setActiveChallenge(null);
    setChallengeQueue([]);
    addLog("System", t("log_lobby_cleared"));
    playSound("eliminate");
  }

  useEffect(() => {
    if (gameState === "WAITING" && players.length >= maxPlayers) {
      addLog("System", t("log_lobby_full"));
      startGame();
    }
  }, [players, gameState, maxPlayers]);

  function cycleGameMode() {
    const modes = [
      "LAST_LETTER",
      "STEP_UP",
      "STEP_UP_2",
      "RHYME",
      "MIRROR",
      "MIRROR_2", // NEW MODE
      "PHRASE_CHAIN",
      "DYNAMIC",
      "DYNAMIC_2",
      "SECOND_LETTER",
      "POINT_RUSH",
      "POINT_RUSH_2",
      "LAST_2_LETTERS",
      "LAST_3_LETTERS",
      "SYLLABLE",
      "LONGER_WORD",
      "LONGER_2_LETTERS",
      "CITIES"
    ];
    const nextIndex = (modes.indexOf(gameMode) + 1) % modes.length;
    const nextMode = modes[nextIndex];
    setGameMode(nextMode);
  }

  useEffect(() => {
    if (gameMode === "CITIES") {
      if (dictionaryCache.current.CITIES) {
          // Load from Cache
          setDictionary(dictionaryCache.current.CITIES.dict);
          setCityMetadata(dictionaryCache.current.CITIES.meta);
          setDictLoadedInfo(dictionaryCache.current.CITIES.info);
          addLog("System", "Loaded Cities (Cached)");
      } else {
          fetch("/cities.json")
            .then((res) => {
              if (!res.ok) throw new Error("No cities.json");
              return res.json();
            })
            .then((data) => {
              loadCitiesData(data);
            })
            .catch(() => {
              loadCitiesData(FALLBACK_CITIES);
              addLog("System", "Using Fallback Cities");
            });
      }
    } else {
      setCityMetadata({});
      toggleLanguage(true);
    }
  }, [gameMode]);

  function toggleLanguage(forceReload = false) {
    let targetLang = language;
    if (!forceReload) {
      targetLang = language === "EN" ? "ID" : "EN";
      setLanguage(targetLang);
    }
    
    if (dictionaryCache.current[targetLang]) {
        setDictionary(dictionaryCache.current[targetLang].dict);
        setSyllableMap(dictionaryCache.current[targetLang].syl);
        phraseDictionary.current = dictionaryCache.current[targetLang].phrases;
        setDictLoadedInfo(dictionaryCache.current[targetLang].info);
        if(!forceReload) addLog("System", `Switched to ${targetLang} (Cached)`);
    } else {
        if (targetLang === "ID") {
          if (!forceReload) addLog("System", "Switching to Bahasa Indonesia...");
          fetch("/kamus.json")
            .then((res) => res.json())
            .then((json) => {
              let dictSet = new Set();
              let sMap = {};
              let phraseSet = new Set(FALLBACK_PHRASES_ID);
              Object.keys(json).forEach((k) => {
                const cleanKey = normalizeWord(k);
                if (k.includes(" ")) {
                    phraseSet.add(k.toLowerCase());
                    return;
                }
                if (cleanKey) {
                  dictSet.add(cleanKey);
                  if (json[k].nama) sMap[cleanKey] = { nama: json[k].nama.toLowerCase() };
                }
              });
              setDictionary(dictSet);
              setSyllableMap(sMap);
              phraseDictionary.current = phraseSet;
              setDictLoadedInfo(`Kamus.json (${dictSet.size})`);
              dictionaryCache.current.ID = { dict: dictSet, syl: sMap, phrases: phraseSet, info: `Kamus.json (${dictSet.size})` };
            })
            .catch(() => {
              const words = Object.keys(FALLBACK_DICTIONARY_ID_DATA);
              const pSet = new Set(FALLBACK_PHRASES_ID);
              setDictionary(new Set(words));
              setSyllableMap(FALLBACK_DICTIONARY_ID_DATA);
              phraseDictionary.current = pSet;
              setDictLoadedInfo("Default (ID)");
              dictionaryCache.current.ID = { dict: new Set(words), syl: FALLBACK_DICTIONARY_ID_DATA, phrases: pSet, info: "Default (ID)" };
            });
        } else {
          if (!forceReload) addLog("System", "Switching to English...");
          fetch("/dictionary.json")
            .then((res) => res.json())
            .then((data) => {
              let rawWords = Array.isArray(data) ? data : Object.keys(data);
              let phraseSet = new Set(FALLBACK_PHRASES_EN);
              
              const cleanedWords = rawWords
                .filter((w) => {
                    if (w.includes(" ")) {
                        phraseSet.add(w.toLowerCase());
                        return false;
                    }
                    return true;
                })
                .map((w) => normalizeWord(w))
                .filter((w) => w.length > 0);
              const newDict = new Set(cleanedWords);
              setDictionary(newDict);
              setSyllableMap({});
              phraseDictionary.current = phraseSet;
              setDictLoadedInfo(`Dictionary.json (${cleanedWords.length})`);
              dictionaryCache.current.EN = { dict: newDict, syl: {}, phrases: phraseSet, info: `Dictionary.json (${cleanedWords.length})` };
            })
            .catch(() => {
              setDictionary(FALLBACK_DICTIONARY_EN);
              setSyllableMap({});
              phraseDictionary.current = new Set(FALLBACK_PHRASES_EN);
              setDictLoadedInfo("Default (EN)");
              dictionaryCache.current.EN = { dict: FALLBACK_DICTIONARY_EN, syl: {}, phrases: new Set(FALLBACK_PHRASES_EN), info: "Default (EN)" };
            });
        }
    }

    if (!forceReload) {
      setGameState("WAITING");
      setPlayers((prev) => prev.map((p) => ({ ...p, isEliminated: false, score: 0, turnCount: 0 })));
      setUsedWords(new Set());
      setCurrentWord("");
      setTargetRhyme("");
      setGlobalTimer(null);
      setTurnCount(0);
      setActiveChallenge(null);
      setChallengeQueue([]);
      setTimer(turnDuration);
      addLog("System", "Language changed! Lobby kept.");
    }
  }

  function getModeLabel() {
    switch (gameMode) {
      case "LAST_LETTER": return "LETTER";
      case "SECOND_LETTER": return "2ND LETTER";
      case "RHYME": return "RHYME RUSH";
      case "MIRROR": return "MIRROR CHAIN";
      case "MIRROR_2": return "MIRROR (2)"; // NEW LABEL
      case "STEP_UP": return "STEP UP";
      case "STEP_UP_2": return "STEP UP (2)";
      case "POINT_RUSH": return "POINT RUSH";
      case "POINT_RUSH_2": return "POINT RUSH (2)";
      case "LAST_2_LETTERS": return "2 LETTERS";
      case "LAST_3_LETTERS": return "3 LETTERS";
      case "SYLLABLE": return "SYLLABLE";
      case "LONGER_WORD": return "LONGER";
      case "LONGER_2_LETTERS": return "LONGER (2)";
      case "CITIES": return "CITIES";
      case "DYNAMIC": return "DYNAMIC";
      case "DYNAMIC_2": return "DYNAMIC (2)";
      case "PHRASE_CHAIN": return "PHRASE";
      default: return "LETTER";
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (containerRef.current) {
        containerRef.current.requestFullscreen().catch((e) => {
          console.error(`Error attempting to enable fullscreen mode: ${e.message} (${e.name})`);
        });
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }

  // --- HANDLERS ---
  const handleChatEvent = (data) => {
    const { uniqueId, nickname, comment, profilePictureUrl } = data;
    const trimmedComment = comment ? comment.trim() : "";
    if (trimmedComment.toLowerCase() === "!join" || trimmedComment.toLowerCase() === "join") {
      joinGame(uniqueId, nickname, profilePictureUrl);
      return;
    }
    if (gameState === "PLAYING") {
      const currentPlayer = players[currentTurnIndex];

      if (currentPlayer && currentPlayer.uniqueId === uniqueId && !currentPlayer.isEliminated) {
        const cleanGameWord = normalizeWord(trimmedComment);
        if (cleanGameWord.length > 0) {
          submitAnswer(cleanGameWord);
        }
      }
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    const cleanWord = normalizeWord(manualInput);
    if (cleanWord.length > 0) {
      if (gameState === "PLAYING") {
        submitAnswer(cleanWord);
        setManualInput("");
      }
    }
  };

  const handleVirtualInput = (char) => {
    setManualInput((prev) => prev + char);
  };

  const handleVirtualBackspace = () => {
    setManualInput((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
    chatHandlerRef.current = handleChatEvent;
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        let dictSet = new Set();
        let sMap = {};
        let meta = {};
        let phraseSet = new Set();

        if (Array.isArray(json)) {
          if (json.length > 0 && typeof json[0] === "object" && json[0].name) {
            json.forEach((item) => {
              const clean = normalizeWord(item.name);
              if (clean) {
                dictSet.add(clean);
                if (item.region) meta[clean] = item.region;
              }
            });
            setCityMetadata(meta);
            setGameMode("CITIES");
            addLog("System", `Loaded Cities JSON (${dictSet.size})`);
          } else {
            const cleanedWords = json
              .filter((w) => {
                  if (typeof w === "string" && w.includes(" ")) {
                      phraseSet.add(w.toLowerCase());
                      return false;
                  }
                  return typeof w === "string";
              })
              .map((w) => normalizeWord(w))
              .filter((w) => w.length > 0);
            dictSet = new Set(cleanedWords);
            addLog("System", `Loaded Simple Array (${dictSet.size} words)`);
          }
        } else {
          const keys = Object.keys(json);
          keys.forEach((k) => {
            if (k.includes(" ")) {
                phraseSet.add(k.toLowerCase());
                return;
            }
            const cleanKey = normalizeWord(k);
            if (cleanKey) {
              dictSet.add(cleanKey);
              if (json[k].nama) {
                sMap[cleanKey] = { nama: json[k].nama.toLowerCase() };
              }
            }
          });
          addLog("System", `Loaded Rich Dictionary (${dictSet.size} words)`);
        }
        setDictionary(dictSet);
        setSyllableMap(sMap);
        phraseDictionary.current = phraseSet;
        setDictLoadedInfo(`Custom (${dictSet.size})`);
        
        if (phraseSet.size > 0) {
            addLog("System", `Detected ${phraseSet.size} phrases for Phrase Chain mode.`);
        }

      } catch (err) {
        addLog("System", "Error parsing JSON");
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  // --- EFFECTS ---

  useEffect(() => {
    fetch("/dictionary.json")
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        const rawWords = Object.keys(data);
        const cleanedWords = rawWords
          .filter((w) => !w.includes(" "))
          .map((w) => normalizeWord(w))
          .filter((w) => w.length > 0);
        const newDict = new Set(cleanedWords);
        setDictionary(newDict);
        setDictLoadedInfo(`Loaded (${cleanedWords.length})`);
        dictionaryCache.current.EN = { dict: newDict, syl: {}, info: `Loaded (${cleanedWords.length})`, phrases: new Set(FALLBACK_PHRASES_EN) };
      })
      .catch(() => {});

    connectWebSocket();
    return () => {
      if (wsRef.current) wsRef.current.close();
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (gameState === "PLAYING") {
      clearInterval(timerRef.current);
      setTimer(turnDuration);
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

  // BOT LOGIC
  useEffect(() => {
    if (gameState !== "PLAYING") return;
    const currentPlayer = players[currentTurnIndex];
    if (currentPlayer && currentPlayer.isBot && !currentPlayer.isEliminated) {
      const thinkingTime = Math.floor(Math.random() * 2000) + 2000;
      const botTimer = setTimeout(() => {
        // Fix Stale Closure using Refs
        if (currentWordRef.current !== currentWord && gameModeRef.current !== "RHYME") return;
        
        const dictArray = Array.from(dictionary);
        // For rhyme mode, we don't care about usedWords usually in point rush but this game enforces it
        // The validator will check targetRhymeRef for RHYME mode
        const candidates = dictArray.filter((word) => {
          if (usedWordsRef.current.has(word)) return false;
          return validateConnection(currentWordRef.current, word);
        });
        
        if (candidates.length > 0) {
          const choice = candidates[Math.floor(Math.random() * candidates.length)];
          submitAnswer(choice);
        } else {
          addLog("Bot", `${currentPlayer.nickname} ${t("log_stumped")}`);
        }
      }, thinkingTime);
      return () => clearTimeout(botTimer);
    }
  }, [currentTurnIndex, gameState, currentWord, players, dictionary]);

  const connectWebSocket = () => {
    const hostname = fallbackToLocalhostRef.current ? "localhost" : window.location.hostname || "localhost";
    const url = `ws://${hostname}:62024`;
    wsRef.current = new WebSocket(url);
    wsRef.current.onopen = () => {
      addLog("System", `Connected to IndoFinity (${hostname})`);
      fallbackToLocalhostRef.current = false;
    };
    wsRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const { event: eventName, data } = message;
        if (eventName === "chat" && chatHandlerRef.current) {
          chatHandlerRef.current(data);
        }
        if (eventName === "gift") {
          setLastEvent({ type: "gift", ...data });
          setTimeout(() => setLastEvent(null), 3000);
        }
      } catch (err) {
        console.error("WS Error", err);
      }
    };
    wsRef.current.onclose = () => {
      if (!fallbackToLocalhostRef.current && window.location.hostname !== "localhost") {
        fallbackToLocalhostRef.current = true;
        console.log("WebSocket connection failed. Falling back to localhost for next attempt.");
      }
      setTimeout(connectWebSocket, 5000);
    };
    wsRef.current.onerror = (err) => {
      console.warn(`WebSocket Error on ${url}`);
    };
  };

  const simulateJoin = () => {
    const names = ["Andi", "Budi", "Citra", "Dewi", "Eko", "Fajar"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const id = `user_${Math.floor(Math.random() * 1000)}`;
    handleChatEvent({ uniqueId: id, nickname: randomName, comment: "!join" });
  };

  const simulateCorrectAnswer = () => {
    const validWord = Array.from(dictionary).find((w) => validateConnection(currentWord, w) && !usedWords.has(w));
    if (validWord) {
      const currentPlayer = players[currentTurnIndex];
      if (currentPlayer && !currentPlayer.isEliminated) {
        handleChatEvent({ uniqueId: currentPlayer.uniqueId, nickname: currentPlayer.nickname, comment: validWord });
      }
    } else {
      addLog("Debug", "No valid word found.");
    }
  };

  const getWinner = () => {
    if (gameState !== "ENDED") return null;
    const activePlayers = players.filter((p) => !p.isEliminated);
    if (activePlayers.length === 0) return null;
    if (isScoreMode()) {
      return [...activePlayers].sort((a, b) => (b.score || 0) - (a.score || 0))[0];
    }
    return activePlayers[0];
  };

  const getTableStatusClass = () => {
    switch (tableStatus) {
      case "error":
        return "border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.6)] animate-shake";
      case "warning":
        return "border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.6)]";
      case "success":
        return "border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.6)]";
      case "info":
        return "border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.6)] animate-pulse";
      default:
        return "border-slate-700 bg-slate-800 shadow-2xl";
    }
  };

  const cycleWinCondition = () => {
    if (winCondition === "TIME") setWinCondition("SCORE");
    else if (winCondition === "SCORE") setWinCondition("ROUNDS");
    else setWinCondition("TIME");
  };

  // Helper untuk ukuran font dinamis agar tidak kepotong di meja
  const getDynamicFontSize = (word) => {
    const len = word ? word.length : 0;
    if (len > 18) return "text-lg sm:text-2xl"; // Sangat panjang
    if (len > 14) return "text-xl sm:text-3xl"; // Panjang
    if (len > 9) return "text-2xl sm:text-4xl";  // Sedang
    return "text-3xl sm:text-5xl";               // Pendek/Normal
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-900 text-white font-sans overflow-hidden flex flex-col items-center justify-center p-2 sm:p-4 relative">
      {/* HEADER */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 pointer-events-none">
        <h1 className="text-xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-lg">WORD CHAIN</h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mt-1">
          <span className={`w-2 h-2 rounded-full ${wsRef.current?.readyState === 1 ? "bg-green-500" : "bg-red-500"}`}></span>
          <div className="flex gap-2">
            <span className="text-yellow-400 font-bold bg-slate-800 px-2 rounded border border-slate-600">{language}</span>
            <span className="text-blue-400 font-bold bg-slate-800 px-2 rounded border border-slate-600">{getModeLabel()}</span>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 flex flex-col items-end">
        {/* SETTINGS GROUP */}
        <div className="flex gap-2">
          {/* STATS TOGGLE (NEW) */}
          <button
            onClick={() => setShowStats(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full shadow-xl transition-all duration-300 border border-slate-600 bg-slate-800 hover:bg-slate-700 hover:scale-110"
            title="Hall of Fame">
            <BarChart2 className="w-5 h-5 text-yellow-400" />
          </button>

          {/* FULLSCREEN TOGGLE */}
          <button
            onClick={toggleFullscreen}
            className="w-10 h-10 flex items-center justify-center rounded-full shadow-xl transition-all duration-300 border border-slate-600 bg-slate-800 hover:bg-slate-700 hover:scale-110"
            title="Toggle Fullscreen">
            {isFullscreen ? <Minimize className="w-5 h-5 text-slate-300" /> : <Maximize className="w-5 h-5 text-slate-300" />}
          </button>

          {/* SETTINGS TOGGLE */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`w-10 h-10 flex items-center justify-center rounded-full shadow-xl transition-all duration-300 border border-slate-600
                    ${showSettings ? "bg-red-600 hover:bg-red-500 rotate-90" : "bg-slate-800 hover:bg-slate-700 hover:scale-110"}
                `}>
            {showSettings ? <X className="w-5 h-5 text-white" /> : <Settings className="w-5 h-5 text-slate-300" />}
          </button>
        </div>

        <div
          className={`mt-3 flex flex-col gap-3 transition-all duration-300 origin-top-right
             ${showSettings ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 -translate-y-4 pointer-events-none absolute top-10 right-0 w-0 h-0 overflow-hidden"}
        `}>
          <div className="bg-slate-800/90 backdrop-blur-md p-3 rounded-lg border border-slate-600 shadow-2xl flex flex-col gap-3 min-w-[200px]">
            {/* Audio Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-full bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded text-xs font-bold border border-slate-600 transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-2">
                {isMuted ? <VolumeX className="w-3 h-3 text-red-400" /> : <Volume2 className="w-3 h-3 text-green-400" />}
                <span className="text-slate-300">{t("sound")}</span>
              </div>
              <span className="text-white">{isMuted ? "Off" : "On"}</span>
            </button>

            <div className="h-px bg-slate-600/50"></div>

            {/* Language Switch */}
            <button
              onClick={() => toggleLanguage()}
              className="w-full bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded text-xs font-bold border border-slate-600 transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3 text-blue-400" />
                <span className="text-slate-300">{t("language")}</span>
              </div>
              <span className="text-white group-hover:text-yellow-300">{language === "EN" ? "English" : "Indonesia"}</span>
            </button>

            <div className="h-px bg-slate-600/50"></div>

            {/* Game End Condition */}
            <div className="w-full bg-slate-700 p-2 rounded border border-slate-600 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                <span>{t("end_condition")}:</span>
                <button onClick={cycleWinCondition} className="text-blue-400 hover:text-white transition-colors uppercase">
                  {winCondition}
                </button>
              </div>

              {/* Dynamic Slider/Input based on Condition */}
              {winCondition === "TIME" ? (
                <div className="flex items-center gap-1 bg-slate-900 rounded p-1">
                  <Clock className="w-3 h-3 text-blue-400" />
                  <input
                    type="range"
                    min="30"
                    max="300"
                    step="10"
                    value={gameDuration}
                    onChange={(e) => setGameDuration(Number(e.target.value))}
                    className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <span className="text-[10px] font-mono w-8 text-right text-yellow-400">{gameDuration}s</span>
                </div>
              ) : winCondition === "SCORE" ? (
                <div className="flex items-center gap-1 bg-slate-900 rounded p-1">
                  <Target className="w-3 h-3 text-red-400" />
                  <input
                    type="range"
                    min="20"
                    max="200"
                    step="10"
                    value={targetScore}
                    onChange={(e) => setTargetScore(Number(e.target.value))}
                    className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                  <span className="text-[10px] font-mono w-8 text-right text-yellow-400">{targetScore}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 bg-slate-900 rounded p-1">
                  <RefreshCw className="w-3 h-3 text-purple-400" />
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={targetRounds}
                    onChange={(e) => setTargetRounds(Number(e.target.value))}
                    className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <span className="text-[10px] font-mono w-8 text-right text-yellow-400">{targetRounds}</span>
                </div>
              )}
            </div>

            {/* Turn Timer Setting */}
            <div className="flex items-center justify-between gap-3 text-xs mt-1">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-green-400" />
                <span className="font-bold">{t("turn_time")}</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-900 rounded p-0.5 border border-slate-700">
                <button
                  onClick={() => setTurnDuration((d) => Math.max(5, d - 5))}
                  className="w-6 h-6 flex items-center justify-center hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center font-mono font-bold text-yellow-400 text-sm">{turnDuration}s</span>
                <button
                  onClick={() => setTurnDuration((d) => Math.min(60, d + 5))}
                  className="w-6 h-6 flex items-center justify-center hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Max Players Setting */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Users className="w-3.5 h-3.5 text-pink-400" />
                <span className="font-bold">{t("players")}</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-900 rounded p-0.5 border border-slate-700">
                <button
                  onClick={() => setMaxPlayers((n) => Math.max(2, n - 1))}
                  className="w-6 h-6 flex items-center justify-center hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center font-mono font-bold text-yellow-400 text-sm">{maxPlayers}</span>
                <button
                  onClick={() => setMaxPlayers((n) => Math.min(100, n + 1))}
                  className="w-6 h-6 flex items-center justify-center hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 mt-2">
              <span className="truncate max-w-[80px]" title={dictLoadedInfo}>
                {dictLoadedInfo}
              </span>
              <button
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded flex items-center gap-1 transition-colors text-xs text-white">
                <FileJson className="w-3 h-3" /> {t("load_json")}
              </button>
              <input type="file" accept=".json" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
            </div>
            <div className="h-px bg-slate-600/50"></div>
            {/* ADD PLAYERS ROW */}
            <div className="flex gap-2">
              <button
                onClick={addHost}
                className="flex-1 bg-slate-700 hover:bg-slate-600 px-2 py-2 rounded text-xs font-bold border border-slate-600 transition-colors flex items-center justify-center gap-1 group">
                <User className="w-3 h-3 text-blue-400" />
                <span className="text-slate-300 group-hover:text-white">{t("add_host")}</span>
              </button>
              <button
                onClick={addBot}
                className="flex-1 bg-slate-700 hover:bg-slate-600 px-2 py-2 rounded text-xs font-bold border border-slate-600 transition-colors flex items-center justify-center gap-1 group">
                <Bot className="w-3 h-3 text-purple-400" />
                <span className="text-slate-300 group-hover:text-white">{t("add_bot")}</span>
              </button>
            </div>

            <button
              onClick={cycleGameMode}
              className="w-full bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded text-xs font-bold border border-slate-600 transition-colors flex items-center justify-between group">
              <span className="text-slate-300">{t("mode")}:</span>
              <span className="text-yellow-400 group-hover:text-yellow-300">{getModeLabel()}</span>
            </button>
            <button
              onClick={gameState === "WAITING" ? startGame : resetGame}
              className={`w-full px-3 py-2 rounded text-xs font-bold shadow-lg transition-transform active:scale-95 border border-transparent ${gameState === "WAITING" ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 text-white" : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 text-white"}`}>
              {gameState === "WAITING" ? t("start_game") : t("reset_game")}
            </button>

            {/* --- NEW BUTTON: CLEAR LOBBY --- */}
            <button
              onClick={clearLobby}
              className="w-full mt-2 bg-slate-900 hover:bg-red-950 px-3 py-2 rounded text-xs font-bold border border-slate-700 hover:border-red-800 text-slate-500 hover:text-red-400 transition-colors flex items-center justify-center gap-2 group">
              <Delete className="w-3 h-3" />
              {t("clear_lobby")}
            </button>
          </div>

          <div className="bg-black/60 backdrop-blur-md p-2 rounded-lg border border-slate-700 flex flex-col gap-2">
            <div className="text-[10px] uppercase font-bold text-slate-500 text-center tracking-wider">{t("simulation")}</div>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={simulateJoin}
                className="bg-blue-900/60 hover:bg-blue-800 text-[10px] py-1.5 rounded text-blue-200 border border-blue-800/50 flex flex-col items-center justify-center gap-0.5">
                <Users className="w-3 h-3" /> Join
              </button>
              <button
                onClick={simulateCorrectAnswer}
                className="bg-green-900/60 hover:bg-green-800 text-[10px] py-1.5 rounded text-green-200 border border-green-800/50 flex flex-col items-center justify-center gap-0.5">
                <Gamepad2 className="w-3 h-3" /> Ans
              </button>
              <button
                onClick={handleTimeout}
                className="bg-red-900/60 hover:bg-red-800 text-[10px] py-1.5 rounded text-red-200 border border-red-800/50 flex flex-col items-center justify-center gap-0.5">
                <Clock className="w-3 h-3" /> TO
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STATS OVERLAY - HALL OF FAME */}
      {showStats && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300 p-4">
          <div className="bg-slate-900/90 w-full max-w-2xl max-h-[80vh] rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-slate-900 to-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-600 tracking-wider">{t("hall_of_fame")}</h2>
              </div>
              <button onClick={() => setShowStats(false)} className="bg-slate-800 hover:bg-red-900/50 p-2 rounded-full transition-colors text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {/* Badge Legend */}
              <div className="mb-6 bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Info className="w-3 h-3" /> {t("badge_legend")}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="text-lg">👶</span> <span>Rookie</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="text-lg">🥇</span> <span>Winner (1+ Win)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="text-lg">🔥</span> <span>On Fire (3+ Wins)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="text-lg">💀</span> <span>Veteran (5+ Games)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="text-lg">👑</span> <span>Legend (10+ Wins)</span>
                  </div>
                </div>
              </div>

              {/* Player List */}
              <div className="flex flex-col gap-3">
                {allStats.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 italic">{t("no_data")}</div>
                ) : (
                  allStats.map((stat, index) => {
                    const winRate = stat.games > 0 ? Math.round((stat.wins / stat.games) * 100) : 0;

                    // Ranking Styling
                    let rankStyle = "border-slate-700 bg-slate-800/50";
                    let rankIcon = <span className="font-mono font-bold text-slate-500">#{index + 1}</span>;

                    if (index === 0) {
                      rankStyle = "border-yellow-500/50 bg-gradient-to-r from-yellow-900/20 to-slate-900 shadow-[0_0_15px_rgba(234,179,8,0.1)]";
                      rankIcon = <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />;
                    } else if (index === 1) {
                      rankStyle = "border-slate-400/50 bg-gradient-to-r from-slate-800 to-slate-900";
                      rankIcon = <Medal className="w-5 h-5 text-slate-300" />;
                    } else if (index === 2) {
                      rankStyle = "border-orange-700/50 bg-gradient-to-r from-orange-900/20 to-slate-900";
                      rankIcon = <Medal className="w-5 h-5 text-orange-600" />;
                    }

                    return (
                      <div key={stat.id} className={`relative flex items-center p-3 rounded-xl border ${rankStyle} transition-all hover:bg-slate-800 group`}>
                        {/* Rank & Avatar */}
                        <div className="flex items-center gap-4 min-w-[50px] sm:min-w-[150px]">
                          <div className="w-8 flex justify-center">{rankIcon}</div>
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-600 bg-slate-900">
                              <img src={getAvatarUrl(stat.id)} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            {index === 0 && <div className="absolute -top-2 -right-1 text-lg">👑</div>}
                          </div>
                        </div>

                        {/* Name & Stats */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 ml-2">
                          <div className="flex flex-col justify-center">
                            <span className="font-bold text-white text-lg truncate">{stat.nickname || "Unknown"}</span>
                            <div className="flex gap-1 mt-1">
                              {stat.badges &&
                                stat.badges.map((b, i) => (
                                  <span key={i} className="text-sm bg-black/30 rounded px-1">
                                    {b}
                                  </span>
                                ))}
                            </div>
                          </div>

                          {/* Stats Bars */}
                          <div className="flex flex-col justify-center gap-1.5 text-xs">
                            <div className="flex justify-between text-slate-400">
                              <span>
                                {t("stats_wins")}: <span className="text-yellow-400 font-bold">{stat.wins}</span>
                              </span>
                              <span>
                                {t("stats_games")}: <span className="text-blue-400 font-bold">{stat.games}</span>
                              </span>
                            </div>

                            {/* Win Rate Bar */}
                            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden relative group/bar">
                              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${winRate}%` }}></div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] text-slate-500">{t("stats_rate")}</span>
                              <span className="font-mono font-bold text-green-400">{winRate}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 text-center">
              <button onClick={() => setShowStats(false)} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full text-sm font-bold transition-colors border border-slate-600">
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GAME AREA WRAPPER FOR SCALING */}
      <div className="transform scale-[0.85] -translate-y-12 sm:translate-y-0 sm:scale-100 transition-transform duration-300">
        <div className="relative w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] flex items-center justify-center">
          {/* THE TABLE */}
          <div className={`absolute inset-0 rounded-full border-[8px] bg-slate-800 transition-all duration-200 flex items-center justify-center overflow-hidden ${getTableStatusClass()}`}>
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-100 via-gray-900 to-black"></div>
            <div className="relative z-10 text-center flex flex-col items-center">
              {gameState === "WAITING" ? (
                <div className="animate-pulse">
                  <Users className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-400 font-bold">{t("waiting")}</p>
                  <p className="text-xs text-slate-500">{t("type_join")}</p>
                  <p className="text-xl font-mono mt-2">
                    {players.length} / {maxPlayers}
                  </p>
                </div>
              ) : gameState === "ENDED" ? (
                <div className="animate-bounce">
                  <p className="text-xl font-bold text-yellow-400">{t("game_over")}</p>
                  <button
                    onClick={() => {
                      setPlayers([]);
                      setGameState("WAITING");
                    }}
                    className="mt-2 bg-purple-600 px-4 py-1 rounded text-sm">
                    {t("new_game")}
                  </button>
                </div>
              ) : (
                <div>
                  {/* --- MOVED: POINT RUSH HUD INSIDE TABLE --- */}
                  {isScoreMode() && (
                    <div className="mb-3 flex justify-center animate-in slide-in-from-top fade-in duration-500">
                      {winCondition === "TIME" ? (
                        <div
                          className={`px-4 py-1 rounded-full font-mono text-xl font-bold border shadow-[0_0_15px_currentColor] backdrop-blur-md
                                  ${globalTimer !== null && globalTimer <= 10 ? "text-red-500 border-red-500 bg-red-950/40 animate-pulse" : "text-blue-400 border-blue-500/50 bg-slate-900/60"}`}>
                          {globalTimer !== null ? `${Math.floor(globalTimer / 60)}:${(globalTimer % 60).toString().padStart(2, "0")}` : "0:00"}
                        </div>
                      ) : winCondition === "SCORE" ? (
                        <div className="px-4 py-1 rounded-full font-bold border text-yellow-400 border-yellow-500/50 bg-slate-900/60 shadow-[0_0_15px_currentColor] flex items-center gap-2 backdrop-blur-md">
                          <Target className="w-4 h-4" />
                          <span className="text-xs uppercase tracking-wide opacity-80">{t("target")}:</span>
                          <span className="text-lg">{targetScore}</span>
                        </div>
                      ) : (
                        <div className="px-4 py-1 rounded-full font-bold border text-purple-400 border-purple-500/50 bg-slate-900/60 shadow-[0_0_15px_currentColor] flex items-center gap-2 backdrop-blur-md">
                          <RefreshCw className="w-4 h-4" />
                          <span className="text-xs uppercase tracking-wide opacity-80">{t("round")}:</span>
                          <span className="text-lg">
                            {Math.min(...players.filter((p) => !p.isEliminated).map((p) => p.turnCount || 0)) + 1}/{targetRounds}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MODE BADGES */}
                  {gameMode === "CITIES" && (
                    <div className="text-[10px] font-bold bg-blue-900/50 px-2 py-0.5 rounded text-blue-300 mb-1 flex items-center justify-center gap-1 inline-flex">
                      <MapPin className="w-3 h-3" /> CITIES MODE
                    </div>
                  )}
                  {gameMode === "RHYME" && (
                    <div className="text-[10px] font-bold bg-purple-900/50 px-2 py-0.5 rounded text-purple-300 mb-1 flex items-center justify-center gap-1 inline-flex">
                      <Hash className="w-3 h-3" /> RHYME RUSH
                    </div>
                  )}
                  {gameMode === "MIRROR" && (
                    <div className="text-[10px] font-bold bg-pink-900/50 px-2 py-0.5 rounded text-pink-300 mb-1 flex items-center justify-center gap-1 inline-flex animate-pulse">
                      <FlipHorizontal className="w-3 h-3" /> MIRROR CHAIN
                    </div>
                  )}
                  {gameMode === "MIRROR_2" && (
                    <div className="text-[10px] font-bold bg-pink-950/50 px-2 py-0.5 rounded text-pink-200 mb-1 flex items-center justify-center gap-1 inline-flex animate-pulse border border-pink-700/50">
                      <FlipHorizontal className="w-3 h-3" /> MIRROR (2)
                    </div>
                  )}
                  {gameMode === "STEP_UP" && (
                    <div className="text-[10px] font-bold bg-cyan-900/50 px-2 py-0.5 rounded text-cyan-300 mb-1 flex items-center justify-center gap-1 inline-flex animate-bounce">
                      <MoveUpRight className="w-3 h-3" /> STEP UP
                    </div>
                  )}
                  {gameMode === "STEP_UP_2" && (
                    <div className="text-[10px] font-bold bg-cyan-950/50 px-2 py-0.5 rounded text-cyan-200 mb-1 flex items-center justify-center gap-1 inline-flex animate-bounce border border-cyan-700/50">
                      <TrendingUpIcon className="w-3 h-3" /> STEP UP (2)
                    </div>
                  )}
                  {gameMode === "PHRASE_CHAIN" && (
                    <div className="text-[10px] font-bold bg-indigo-900/50 px-2 py-0.5 rounded text-indigo-300 mb-1 flex items-center justify-center gap-1 inline-flex">
                      {tableStatus === "info" ? <Unlink className="w-3 h-3 animate-bounce" /> : <Link className="w-3 h-3" />} PHRASE CHAIN
                    </div>
                  )}
                  {(gameMode === "POINT_RUSH" || gameMode === "POINT_RUSH_2") && (
                    <div className="text-[10px] font-bold bg-green-900/50 px-2 py-0.5 rounded text-green-300 mb-1 flex items-center justify-center gap-1 inline-flex">
                      <Zap className="w-3 h-3" /> POINT RUSH {gameMode === "POINT_RUSH_2" ? "(2)" : ""}
                    </div>
                  )}
                  {(gameMode === "DYNAMIC" || gameMode === "DYNAMIC_2") && (
                    <div className="text-[10px] font-bold bg-orange-900/50 px-2 py-0.5 rounded text-orange-300 mb-1 flex items-center justify-center gap-1 inline-flex">
                      <AlertTriangle className="w-3 h-3" /> DYNAMIC CHAOS {gameMode === "DYNAMIC_2" ? "(2)" : ""}
                    </div>
                  )}

                  <p className="text-slate-500 text-xs uppercase tracking-widest mb-1 mt-1">
                      {gameMode === "RHYME" ? t("rhyme_target") : t("current_word")}
                  </p>
                  
                  {/* --- WORD DISPLAY AREA --- */}
                  <h2 className={`${getDynamicFontSize(gameMode === "RHYME" ? targetRhyme : currentWord)} font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] flex justify-center transition-all duration-300 px-2`}>
                    {(() => {
                        // Special Display for Rhyme Target
                        if (gameMode === "RHYME") {
                            return (
                                <div className="flex flex-col items-center">
                                    <span className="text-4xl text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]">...{targetRhyme.toUpperCase()}</span>
                                    {currentWord && <span className="text-xs text-slate-400 mt-1 font-normal opacity-50">Last: {currentWord.toUpperCase()}</span>}
                                </div>
                            );
                        }
                        
                        const { pre, high, post } = getDisplayParts(currentWord);
                        return (
                            <>
                            <span>{pre.toUpperCase()}</span>
                            <span className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]">{high.toUpperCase()}</span>
                            <span>{post.toUpperCase()}</span>
                            </>
                        );
                    })()}
                  </h2>

                  <div className="flex flex-col items-center">
                    <div className="mt-2 text-sm font-mono text-purple-300 bg-purple-900/30 px-3 py-1 rounded-full border border-purple-500/30 inline-block">
                      {(() => {
                        const rule = getRuleDisplay(currentWord);
                        return (
                          <>
                            {rule.desc}
                            {/* For Rhyme, desc is enough */}
                            {gameMode !== "RHYME" && (
                                <>
                                    <span className="mx-2">→</span>
                                    {rule.action} <span className="font-bold text-yellow-400">{rule.target}</span>
                                </>
                            )}
                          </>
                        );
                      })()}
                    </div>

                    {/* FEEDBACK MESSAGE OVERLAY */}
                    {feedbackMessage && (
                      <div className={`mt-2 px-3 py-1 rounded-md text-xs font-bold animate-bounce ${
                        feedbackMessage.type === 'error' ? 'bg-red-900/80 text-red-200 border border-red-500' :
                        feedbackMessage.type === 'warning' ? 'bg-yellow-900/80 text-yellow-200 border border-yellow-500' :
                        feedbackMessage.type === 'info' ? 'bg-blue-900/80 text-blue-200 border border-blue-500' :
                        'bg-green-900/80 text-green-200'
                      }`}>
                        {feedbackMessage.text}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* PLAYERS */}
          {players.map((player, index) => {
            const angleDeg = index * (360 / Math.max(players.length, 1)) + 90;
            const isTurn = gameState === "PLAYING" && currentTurnIndex === index && !player.isEliminated;

            const maxWins = Math.max(...players.map((p) => p.stats?.wins || 0));
            const isKing = maxWins > 0 && (player.stats?.wins || 0) === maxWins && !player.isEliminated;

            return (
              <div
                key={player.uniqueId}
                className="absolute transition-all duration-500 ease-out flex flex-col items-center justify-center w-20 h-24"
                style={{
                  transform: `rotate(${angleDeg}deg) translate(${gameState === "WAITING" ? 140 : 210}px) rotate(-${angleDeg}deg)`,
                  zIndex: isTurn ? 100 : 20
                }}>
                <div className={`relative group ${player.isEliminated ? "opacity-60 grayscale" : "opacity-100"}`}>
                  {isTurn && <div className="absolute -inset-2 bg-yellow-400 rounded-full animate-ping opacity-75"></div>}

                  {isKing && <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xl z-50 animate-bounce drop-shadow-sm">👑</div>}

                  <div
                    className={`w-14 h-14 rounded-full border-4 overflow-hidden bg-slate-800 z-10 relative shadow-lg 
                                ${isTurn ? "border-yellow-400 scale-110" : isKing ? "border-yellow-300 scale-105" : "border-slate-600"} 
                                ${player.isEliminated ? "border-red-900" : ""} 
                                transition-all duration-300`}>
                    <img src={player.avatarUrl} alt={player.nickname} className={`w-full h-full object-cover transition-all ${isKing ? "brightness-110 contrast-110" : ""}`} />
                  </div>

                  {player.isBot && <div className="absolute -top-1 -right-1 bg-purple-600 text-[8px] px-1 rounded-full text-white font-bold border border-purple-400 z-30">BOT</div>}

                  {isTurn && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-500 text-black font-bold text-xs px-2 py-0.5 rounded-full shadow-lg z-50 whitespace-nowrap">{`${timer}s`}</div>
                  )}
                  {player.isEliminated && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <Skull className="w-8 h-8 text-red-600 drop-shadow-md" />
                    </div>
                  )}
                </div>

                {/* NAME & BADGES */}
                <div className={`mt-[-12px] flex flex-col items-center z-40 relative`}>
                  <div
                    className={`
                                flex items-center gap-1.5 px-3 py-1 rounded-full
                                backdrop-blur-md border shadow-lg transition-all duration-300
                                ${isTurn ? "bg-yellow-500/90 border-yellow-400/50 text-yellow-900 scale-110" : "bg-slate-900/80 border-slate-700/50 text-slate-200"}
                            `}>
                    {player.stats?.wins > 0 && (
                      <div className={`flex items-center gap-0.5 border-r pr-1.5 mr-0.5 ${isTurn ? "border-yellow-700/30" : "border-white/20"}`}>
                        <Trophy className={`w-3 h-3 drop-shadow-sm ${isTurn ? "text-yellow-700" : "text-yellow-400"}`} />
                        <span className={`text-[10px] font-bold font-mono ${isTurn ? "text-yellow-800" : "text-yellow-200"}`}>{player.stats.wins}</span>
                      </div>
                    )}

                    {isScoreMode() && (
                      <div className={`flex items-center gap-0.5 border-r pr-1.5 mr-0.5 ${isTurn ? "border-yellow-700/30" : "border-white/20"}`}>
                        <Zap className={`w-3 h-3 drop-shadow-sm ${isTurn ? "text-yellow-700" : "text-green-400"}`} />
                        <span className={`text-[10px] font-bold font-mono ${isTurn ? "text-yellow-800" : "text-green-200"}`}>{player.score || 0}</span>
                      </div>
                    )}

                    <span className="text-[10px] font-bold tracking-wide truncate max-w-[80px]">{player.nickname}</span>
                  </div>

                  {player.stats?.badges?.length > 0 && (
                    <div className="flex gap-1 mt-1 justify-center">
                      {player.stats.badges.slice(0, 4).map((badge, i) => (
                        <div key={i} className="w-4 h-4 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-[8px] shadow-sm" title="Badge">
                          {badge}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MANUAL INPUT FOR HOST ONLY (WITH VIRTUAL KEYBOARD) */}
      {gameState === "PLAYING" && isHostJoined && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-2 flex flex-col gap-2 items-center">
          {/* SUGGESTIONS LIST (NEW) */}
          {suggestions.length > 0 && (
            <div className="w-full bg-slate-800/95 border border-slate-600 rounded-lg shadow-xl mb-1 overflow-hidden backdrop-blur-md animate-in slide-in-from-bottom-2 fade-in">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setManualInput(s);
                    setSuggestions([]);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-700 text-slate-200 text-sm border-b border-slate-700/50 last:border-0 font-mono transition-colors">
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-600 rounded-full px-4 py-2 w-64 shadow-lg backdrop-blur-md">
            <span className="flex-1 text-center font-mono font-bold text-lg text-white tracking-widest min-h-[1.5rem] uppercase truncate">
              {manualInput || <span className="text-slate-600 text-xs font-sans font-normal opacity-50 lowercase">
                Type answer...
              </span>}
            </span>
            {manualInput && (
              <button onClick={() => setManualInput("")} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
            <button onClick={(e) => handleManualSubmit(e)} className="bg-green-600 text-white p-1.5 rounded-full hover:bg-green-500 shadow-lg active:scale-90 transition-transform">
              <Send className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
            className="text-[10px] text-slate-400 bg-black/40 px-3 py-1 rounded-full hover:bg-black/60 transition-colors flex items-center gap-1 backdrop-blur-sm border border-slate-700/50">
            <Keyboard className="w-3 h-3" /> {showVirtualKeyboard ? "Hide Keyboard" : "Show Keyboard"}
          </button>

          {showVirtualKeyboard && (
            <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-700 shadow-2xl backdrop-blur-md w-full animate-in slide-in-from-bottom-10 fade-in duration-300">
              {["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row, i) => (
                <div key={i} className="flex justify-center gap-1 mb-1 last:mb-0">
                  {row.split("").map((char) => (
                    <button
                      key={char}
                      onClick={() => handleVirtualInput(char)}
                      className="w-7 h-9 sm:w-8 sm:h-10 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold text-sm sm:text-base shadow active:scale-95 transition-all active:bg-slate-500">
                      {char}
                    </button>
                  ))}
                </div>
              ))}
              <div className="flex justify-center gap-1 mt-1 px-1">
                <button
                  onClick={handleVirtualBackspace}
                  className="flex-1 bg-red-900/80 hover:bg-red-800 text-white rounded font-bold text-xs h-9 flex items-center justify-center shadow active:scale-95 gap-1 transition-colors">
                  <Delete className="w-4 h-4" /> DEL
                </button>
                <button
                  onClick={(e) => handleManualSubmit(e)}
                  className="flex-[2] bg-green-700/80 hover:bg-green-600 text-white rounded font-bold text-xs h-9 flex items-center justify-center shadow active:scale-95 transition-colors">
                  ENTER
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* WINNER OVERLAY */}
      {gameState === "ENDED" && getWinner() && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-700">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${1 + Math.random()}s`,
                  animationDelay: `${Math.random()}s`,
                  backgroundColor: ["#FFD700", "#FF69B4", "#00BFFF", "#32CD32"][Math.floor(Math.random() * 4)],
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%"
                }}></div>
            ))}
          </div>
          <div className="text-center transform transition-all animate-in zoom-in-50 duration-500 flex flex-col items-center">
            <div className="relative mb-6">
              <Trophy className="w-32 h-32 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)] animate-bounce" />
              <Star className="absolute -top-2 -right-2 w-12 h-12 text-white animate-spin-slow text-yellow-200" />
              <Star className="absolute -bottom-2 -left-2 w-8 h-8 text-white animate-pulse text-yellow-200" />
            </div>
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 drop-shadow-lg mb-2">{t("winner")}</h2>
            <div className="relative group my-6">
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-full opacity-75 blur-lg group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <img src={getWinner().avatarUrl} alt="Winner" className="relative w-32 h-32 rounded-full border-4 border-yellow-400 shadow-2xl object-cover" />
            </div>
            <div className="bg-slate-800/80 px-8 py-3 rounded-xl border border-yellow-500/50 backdrop-blur-md">
              <p className="text-2xl font-bold text-white tracking-wider">{getWinner().nickname}</p>
              {isScoreMode() && (
                <p className="text-lg font-mono text-green-300 mt-1">
                  {t("score")}: {getWinner().score}
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setPlayers([]);
                setGameState("WAITING");
              }}
              className="mt-8 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-700 text-white font-bold rounded-full shadow-lg hover:shadow-green-500/50 transform hover:scale-105 transition-all">
              {t("play_again")}
            </button>
          </div>
        </div>
      )}

      {/* LOGS - INTERACTIVE FOR HOST */}
      <div className="absolute bottom-12 left-2 w-48 sm:bottom-4 sm:left-4 sm:w-64 h-32 sm:h-48 overflow-y-auto z-40 custom-scrollbar rounded-lg">
        <div className="flex flex-col-reverse justify-end min-h-full gap-1">
          {logs.map((log) => (
            <div 
                key={log.id} 
                className={`flex items-center px-3 py-1 rounded text-[10px] sm:text-xs animate-in slide-in-from-left fade-in transition-colors w-full bg-black/40 backdrop-blur-md cursor-default`}>
              <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                <span className="font-bold text-blue-300">{log.user}:</span> <span className="text-white">{log.message}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GIFT POPUP */}
      {lastEvent && lastEvent.type === "gift" && (
        <div className="absolute top-20 right-4 z-[60] animate-in slide-in-from-right fade-in duration-300 pointer-events-none max-w-[200px]">
          <div className="flex flex-col items-center relative">
            <div className="absolute inset-0 bg-pink-500/50 blur-[40px] rounded-full animate-pulse"></div>

            <div className="relative mb-2">
              <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shadow-2xl">
                <img src={lastEvent.profilePictureUrl || getAvatarUrl(lastEvent.nickname)} alt="Gifter" className="w-full h-full rounded-full object-cover border-2 border-slate-900 bg-slate-800" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black font-black text-[10px] px-2 py-0.5 rounded-full shadow-lg border border-white transform rotate-6">GIFT!</div>
            </div>

            <div className="bg-slate-900/90 border border-pink-500/50 backdrop-blur-xl px-4 py-2 rounded-xl shadow-2xl text-center transform hover:scale-105 transition-transform">
              <p className="text-pink-300 text-[8px] font-bold tracking-widest uppercase mb-0.5">{t("supporter")}</p>
              <div className="flex flex-col">
                <span className="text-sm font-black text-white drop-shadow-md truncate max-w-[150px]">{lastEvent.nickname}</span>
                <span className="text-xs text-slate-300">
                  {t("sent")} <span className="text-yellow-400 font-bold">{lastEvent.giftName}</span> 🎁
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INSTRUCTIONS */}
      <div className="absolute bottom-2 sm:bottom-4 text-center w-full text-slate-500 text-[8px] sm:text-[10px] pointer-events-none z-40">{t("footer")}</div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
}