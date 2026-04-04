import React, { useState, useEffect, useRef } from "react";
import { 
  Trophy, Clock, Users, Zap, AlertTriangle, 
  Medal, Play, RotateCcw, Home, Crown, Keyboard, 
  Volume2, VolumeX, Sparkles, Skull, Maximize, Minimize, Globe, MessageSquare, Timer, Wifi, WifiOff, Trash2
} from "lucide-react";

// ==========================================
// 1. KAMUS & DATA (FALLBACK)
// ==========================================
const FALLBACK_DICTIONARY = [
  "apel", "ayam", "air", "api", "awan", "akar", "buku", "batu", "bola", "babi", "burung", "bintang", "bunga",
  "cinta", "cahaya", "cicak", "cuka", "cacing", "daun", "dinding", "dada", "dewa", "danau", "daging",
  "elang", "emas", "ekor", "ember", "es", "empat", "enam", "gajah", "gunung", "gigi", "garam", "guru", "gelas",
  "hutan", "hujan", "hari", "hati", "hidung", "hitam", "hijau", "ikan", "itik", "ibu", "intan", "indah",
  "jalan", "jendela", "jari", "jantung", "jamur", "kucing", "kuda", "kaca", "kopi", "kertas", "kasur", "kuning",
  "laut", "langit", "laba", "lilin", "luka", "lebah", "makan", "minum", "mata", "meja", "mobil", "merah", "malam"
];

const normalizeWord = (word) => {
  if (typeof word !== "string") return "";
  return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z\s]/g, "").trim();
};

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

// ==========================================
// 2. ATURAN DYNAMIC CHAOS (TIERS)
// ==========================================
const DYNAMIC_RULES = [
  { id: "NORMAL", desc: "✨ Normal", check: () => true, tier: 0 },
  { id: "MIN_5", desc: "📏 Min 5 Huruf", check: (w) => w.length >= 5, tier: 1 },
  { id: "MAX_5", desc: "📏 Maks 5 Huruf", check: (w) => w.length <= 5, tier: 1 },
  { id: "ODD", desc: "1️⃣3️⃣5️⃣ Panjang Ganjil", check: (w) => w.length % 2 !== 0, tier: 1 },
  { id: "EVEN", desc: "2️⃣4️⃣6️⃣ Panjang Genap", check: (w) => w.length % 2 === 0, tier: 1 },
  { id: "EXACT_4", desc: "📏 Tepat 4 Huruf", check: (w) => w.length === 4, tier: 1 },
  { id: "HAS_DOUBLE", desc: "👯 Ada Huruf Ganda", check: (w) => /(.)\1/.test(w), tier: 2 },
  { id: "END_VOWEL", desc: "🔤 Akhir: Vokal", check: (w) => /[aeiou]$/i.test(w), tier: 2 },
  { id: "END_CONS", desc: "🔤 Akhir: Konsonan", check: (w) => /[^aeiou]$/i.test(w), tier: 2 },
  { id: "NO_S_R", desc: "🚫 Tanpa 'S' atau 'R'", check: (w) => !/[sr]/i.test(w), tier: 2 },
  { id: "EXACT_6", desc: "📏 Tepat 6 Huruf", check: (w) => w.length === 6, tier: 2 },
  { id: "START_END_CONS", desc: "🧱 Awal & Akhir Konsonan", check: (w) => w.length > 1 && /^[^aeiou].*[^aeiou]$/i.test(w), tier: 2 },
  { id: "HAS_CONSECUTIVE_VOWELS", desc: "🅰️🅾️ Vokal Beruntun", check: (w) => /[aeiou]{2}/i.test(w), tier: 2 },
  { id: "NO_A_I", desc: "🚫 Tanpa 'A' atau 'I'", check: (w) => !/[ai]/i.test(w), tier: 3 },
  { id: "NO_E_O", desc: "🚫 Tanpa 'E' atau 'O'", check: (w) => !/[eo]/i.test(w), tier: 3 },
  { id: "MAX_1_VOWEL", desc: "1️⃣ Maks 1 Vokal", check: (w) => (w.match(/[aeiou]/gi) || []).length <= 1, tier: 3 },
  { id: "MUST_3_VOWELS", desc: "🔤 Min 3 Vokal", check: (w) => (w.match(/[aeiou]/gi) || []).length >= 3, tier: 3 },
  { id: "MIN_7", desc: "📏 Min 7 Huruf", check: (w) => w.length >= 7, tier: 3 },
  { id: "EXACT_2_VOWELS", desc: "2️⃣ Tepat 2 Vokal", check: (w) => (w.match(/[aeiou]/gi) || []).length === 2, tier: 3 },
  { id: "NO_E", desc: "🚫 Tanpa Huruf 'E'", check: (w) => !/e/i.test(w), tier: 3 },
  { id: "NO_A", desc: "🚫 Tanpa Huruf 'A'", check: (w) => !/a/i.test(w), tier: 3 },
  { id: "NO_VOWELS", desc: "💀 Tanpa Vokal", check: (w) => !/[aeiou]/i.test(w), tier: 4 },
  { id: "SAME_START_END", desc: "🔄 Awal = Akhir", check: (w) => w.length > 1 && w[0].toLowerCase() === w[w.length - 1].toLowerCase(), tier: 4 },
  { id: "UNIQUE", desc: "🌟 Huruf Unik Saja", check: (w) => new Set(w).size === w.length, tier: 4 },
  { id: "SECOND_VOWEL", desc: "🔤 Huruf Ke-2: Vokal", check: (w) => w.length > 1 && /[aeiou]/.test(w[1]), tier: 4 },
  { id: "CONTAINS_Y_Z_X", desc: "🔠 Mengandung Y, Z, atau X", check: (w) => /[yzx]/i.test(w), tier: 4 },
  { id: "HAS_CONSECUTIVE_CONS", desc: "🧱 3+ Konsonan Beruntun", check: (w) => /[^aeiou]{3}/i.test(w), tier: 4 },
  { id: "MIDDLE_VOWEL", desc: "🎯 Huruf Tengah Vokal", check: (w) => w.length % 2 !== 0 && /[aeiou]/i.test(w[Math.floor(w.length / 2)]), tier: 4 }
];

// ==========================================
// 3. SOUND MANAGER
// ==========================================
const Sound = {
  ctx: null,
  init: () => { if (!Sound.ctx) Sound.ctx = new (window.AudioContext || window.webkitAudioContext)(); },
  play: (type) => {
    if (!Sound.ctx) Sound.init();
    if (Sound.ctx.state === "suspended") Sound.ctx.resume();
    const osc = Sound.ctx.createOscillator();
    const gain = Sound.ctx.createGain();
    osc.connect(gain); gain.connect(Sound.ctx.destination);
    
    if (type === "correct") {
      osc.type = "sine"; osc.frequency.setValueAtTime(600, Sound.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, Sound.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, Sound.ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, Sound.ctx.currentTime + 0.2);
      osc.start(); osc.stop(Sound.ctx.currentTime + 0.2);
    } else if (type === "wrong") {
      osc.type = "sawtooth"; osc.frequency.setValueAtTime(150, Sound.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, Sound.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, Sound.ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, Sound.ctx.currentTime + 0.3);
      osc.start(); osc.stop(Sound.ctx.currentTime + 0.3);
    } else if (type === "timeout") {
      osc.type = "square"; osc.frequency.setValueAtTime(200, Sound.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, Sound.ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.2, Sound.ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, Sound.ctx.currentTime + 0.4);
      osc.start(); osc.stop(Sound.ctx.currentTime + 0.4);
    } else if (type === "win") {
      osc.type = "triangle";
      [440, 554, 659, 880].forEach((freq, i) => {
        const o = Sound.ctx.createOscillator(); const g = Sound.ctx.createGain();
        o.type = "triangle"; o.frequency.value = freq;
        o.connect(g); g.connect(Sound.ctx.destination);
        g.gain.setValueAtTime(0, Sound.ctx.currentTime + i * 0.1);
        g.gain.linearRampToValueAtTime(0.2, Sound.ctx.currentTime + i * 0.1 + 0.05);
        g.gain.exponentialRampToValueAtTime(0.01, Sound.ctx.currentTime + i * 0.1 + 0.3);
        o.start(Sound.ctx.currentTime + i * 0.1); o.stop(Sound.ctx.currentTime + i * 0.1 + 0.3);
      });
    }
  }
};

// ==========================================
// 4. MAIN COMPONENT
// ==========================================
export default function App() {
  const [view, setView] = useState("MENU"); 
  const [sessionPlayers, setSessionPlayers] = useState([]); 
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]); 
  const [currentWord, setCurrentWord] = useState("");
  const [activeRule, setActiveRule] = useState(DYNAMIC_RULES[0]);
  const [usedWords, setUsedWords] = useState(new Set());
  const [roundAnswers, setRoundAnswers] = useState([]); 
  const [answeredThisRound, setAnsweredThisRound] = useState(new Set()); 
  const [currentWordOwner, setCurrentWordOwner] = useState(null); 
  const [globalTimeLeft, setGlobalTimeLeft] = useState(300); 
  const [wordTimeLeft, setWordTimeLeft] = useState(25); 
  const [toasts, setToasts] = useState([]); 
  const [inputVal, setInputVal] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [overlapLength, setOverlapLength] = useState(1);
  const [language, setLanguage] = useState("MIX"); 
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInputForm, setShowInputForm] = useState(true); 
  
  // State untuk pagination
  const [gameOverPage, setGameOverPage] = useState(0); 
  const [playingPage, setPlayingPage] = useState(0); 

  const [dictionary, setDictionary] = useState(FALLBACK_DICTIONARY);
  const [dictLoadedInfo, setDictLoadedInfo] = useState("Memuat Kamus...");
  const [socketStatus, setSocketStatus] = useState("DISCONNECTED");
  const [wsHost, setWsHost] = useState(window.location.hostname || "localhost"); 
  
  // State untuk 3D Mouse Parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const inputRef = useRef(null);
  const gameTimer = useRef(null);
  const toastTimeoutRef = useRef(null); 
  const currentWordRef = useRef(currentWord);
  const activeRuleRef = useRef(activeRule);
  const usedWordsRef = useRef(usedWords);
  const overlapLengthRef = useRef(overlapLength);
  const dictionaryRef = useRef(dictionary);
  const viewRef = useRef(view);
  const roundAnswersRef = useRef(roundAnswers);
  const answeredThisRoundRef = useRef(answeredThisRound);

  // Efek Mouse Tracking untuk Efek 3D
  const handleMouseMove = (e) => {
    if (view !== "PLAYING") return;
    const x = (e.clientX / window.innerWidth - 0.5) * 20; // max rot 20deg
    const y = (e.clientY / window.innerHeight - 0.5) * -20;
    setMousePos({ x, y });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [view]);

  useEffect(() => {
    const loadDicts = async () => {
      let mixDict = new Set();
      setDictLoadedInfo("Memuat Kamus...");
      if (language === "ID" || language === "MIX") {
        try {
          const resId = await fetch("/kamus.json");
          if (resId.ok) {
            const dataId = await resId.json();
            Object.keys(dataId).forEach(k => { if (!k.includes(" ")) mixDict.add(normalizeWord(k)); });
          }
        } catch (e) {}
      }
      if (language === "EN" || language === "MIX") {
        try {
          const resEn = await fetch("/dictionary.json");
          if (resEn.ok) {
            const dataEn = await resEn.json();
            const arr = Array.isArray(dataEn) ? dataEn : Object.keys(dataEn);
            arr.forEach(k => { if (!k.includes(" ")) mixDict.add(normalizeWord(k)); });
          }
        } catch (e) {}
      }
      if (mixDict.size > 0) {
        setDictionary(Array.from(mixDict).filter(w => w.length > 0));
        setDictLoadedInfo(`${language} (${mixDict.size} kata)`);
      } else {
        setDictionary(FALLBACK_DICTIONARY);
        setDictLoadedInfo("Data Bawaan");
      }
    };
    loadDicts();
  }, [language]);

  useEffect(() => { currentWordRef.current = currentWord; }, [currentWord]);
  useEffect(() => { activeRuleRef.current = activeRule; }, [activeRule]);
  useEffect(() => { usedWordsRef.current = usedWords; }, [usedWords]);
  useEffect(() => { overlapLengthRef.current = overlapLength; }, [overlapLength]);
  useEffect(() => { dictionaryRef.current = dictionary; }, [dictionary]);
  useEffect(() => { viewRef.current = view; }, [view]);
  useEffect(() => { roundAnswersRef.current = roundAnswers; }, [roundAnswers]);
  useEffect(() => { answeredThisRoundRef.current = answeredThisRound; }, [answeredThisRound]);

  useEffect(() => {
    const saved = localStorage.getItem("rebutan_leaderboard");
    if (saved) setGlobalLeaderboard(JSON.parse(saved));
    return () => { if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current); }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    let ws; let reconnectTimer;
    const connectWebSocket = () => {
      const wsUrl = `ws://${wsHost}:62024`;
      ws = new WebSocket(wsUrl);
      ws.onopen = function () { setSocketStatus("CONNECTED"); };
      ws.onmessage = function (event) {
        try {
          const message = JSON.parse(event.data);
          const { event: eventName, data: eventData } = message; 
          if (eventName === 'chat') {
            const nickname = eventData.nickname || eventData.uniqueId || "Penonton";
            const comment = eventData.comment || eventData.text || "";
            const avatar = eventData.profilePictureUrl || eventData.avatarUrl || eventData.profileImage || "";
            if (comment) handleAnswer(nickname, comment, avatar);
          }
        } catch (error) {}
      };
      ws.onclose = function () {
        setSocketStatus("DISCONNECTED");
        reconnectTimer = setTimeout(() => connectWebSocket(), 5000);
      };
      ws.onerror = function () { ws.close(); };
    };
    connectWebSocket();
    return () => { clearTimeout(reconnectTimer); if (ws) { ws.onclose = null; ws.close(); } };
  }, [wsHost]); 

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
    else if (document.exitFullscreen) document.exitFullscreen();
  };

  const playSfx = (type) => { if (soundEnabled) Sound.play(type); };

  const resetLeaderboard = () => {
    if (window.confirm("Yakin ingin mereset semua skor Global Leaderboard?")) {
      setGlobalLeaderboard([]);
      localStorage.removeItem("rebutan_leaderboard");
    }
  };

  const getValidRule = (wordSuffix) => {
    const validWords = dictionaryRef.current.filter(w => !usedWordsRef.current.has(w) && w.startsWith(wordSuffix) && w.length > wordSuffix.length);
    const shuffledRules = [...DYNAMIC_RULES].sort(() => Math.random() - 0.5);
    for (const rule of shuffledRules) {
      if (validWords.some(w => rule.check(w))) return rule;
    }
    return DYNAMIC_RULES[0]; 
  };

  const showToast = (nickname, points, word, avatar) => {
    const id = Date.now();
    setToasts([{ id, nickname, points, word, avatar }]);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToasts([]), 2500);
  };

  const startGame = () => {
    setSessionPlayers([]); setUsedWords(new Set()); setRoundAnswers([]); setAnsweredThisRound(new Set()); setCurrentWordOwner(null);
    setToasts([]); if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setGlobalTimeLeft(300); setWordTimeLeft(25);
    
    let validStartWords = dictionary.filter(w => w.length >= overlapLength + 2);
    if (validStartWords.length === 0) validStartWords = dictionary;
    const startWord = validStartWords[Math.floor(Math.random() * validStartWords.length)];
    
    setCurrentWord(startWord); setActiveRule(DYNAMIC_RULES[0]); setView("PLAYING");
  };

  const resolveRound = () => {
    const answers = roundAnswersRef.current;
    if (answers.length > 0) {
      const longest = answers.reduce((prev, current) => (prev.word.length > current.word.length) ? prev : current);
      setCurrentWord(longest.word); setCurrentWordOwner({ nickname: longest.nickname, avatar: longest.avatar });
      const nextSuffix = longest.word.slice(-overlapLengthRef.current);
      setActiveRule(getValidRule(nextSuffix));
      if (soundEnabled) playSfx("correct"); 
    } else {
      let validStartWords = dictionaryRef.current.filter(w => w.length >= overlapLengthRef.current + 2 && !usedWordsRef.current.has(w));
      if (validStartWords.length === 0) validStartWords = dictionaryRef.current;
      const newWord = validStartWords[Math.floor(Math.random() * validStartWords.length)];
      setCurrentWord(newWord); setUsedWords(prev => new Set(prev).add(newWord));
      setCurrentWordOwner(null); setActiveRule(DYNAMIC_RULES[0]); playSfx("timeout");
    }
    setRoundAnswers([]); setAnsweredThisRound(new Set()); setWordTimeLeft(25);
  };

  const handleAnswer = (nickname, textRaw, avatarUrl = "") => {
    if (viewRef.current !== "PLAYING") return;
    if (answeredThisRoundRef.current.has(nickname)) return;
    const words = textRaw.toLowerCase().trim().split(/\s+/);
    if (words.length === 0) return;
    const w = words[0]; 
    const cWord = currentWordRef.current;
    const rule = activeRuleRef.current;
    const overlap = overlapLengthRef.current;

    const suffix = cWord.slice(-overlap);
    if (!w.startsWith(suffix) || w.length <= suffix.length) return;
    if (usedWordsRef.current.has(w) || !dictionaryRef.current.includes(w)) return;
    if (!rule.check(w)) return;

    playSfx("correct");
    const points = w.length; 
    setAnsweredThisRound(prev => new Set(prev).add(nickname));

    setSessionPlayers(prev => {
      const existing = prev.find(p => p.username === nickname);
      if (existing) return prev.map(p => p.username === nickname ? { ...p, score: p.score + points, avatar: avatarUrl || p.avatar } : p);
      return [...prev, { username: nickname, score: points, id: Date.now() + Math.random(), avatar: avatarUrl }];
    });

    setGlobalLeaderboard(prev => {
      const existing = prev.find(p => p.username === nickname);
      let updatedBoard;
      if (existing) updatedBoard = prev.map(p => p.username === nickname ? { ...p, score: p.score + points, avatar: avatarUrl || p.avatar } : p);
      else updatedBoard = [...prev, { username: nickname, score: points, id: Date.now() + Math.random(), avatar: avatarUrl }];
      localStorage.setItem("rebutan_leaderboard", JSON.stringify(updatedBoard));
      return updatedBoard;
    });
    
    setUsedWords(prev => new Set(prev).add(w));
    setRoundAnswers(prev => [...prev, { nickname, word: w, avatar: avatarUrl }]);
    showToast(nickname, points, w.toUpperCase(), avatarUrl);
  };

  useEffect(() => {
    window.receiveTikTokChat = (nickname, comment) => handleAnswer(nickname, comment);
    return () => { delete window.receiveTikTokChat; };
  }, []);

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    let uname = "Host"; let guess = inputVal;
    if (inputVal.includes(":")) {
      const parts = inputVal.split(":"); uname = parts[0].trim() || "Host"; guess = parts[1].trim();
    }
    handleAnswer(uname, guess); setInputVal(""); 
  };

  // Pagination Timer Logic untuk Game Over
  useEffect(() => {
    if (view === "GAMEOVER") {
      const othersCount = Math.max(0, sessionPlayers.length - 3);
      const totalPages = Math.ceil(othersCount / 5);
      if (totalPages > 1) {
        const timer = setInterval(() => setGameOverPage(prev => (prev + 1) % totalPages), 5000); 
        return () => clearInterval(timer);
      }
    } else { setGameOverPage(0); }
  }, [view, sessionPlayers.length]);

  // Pagination Timer Logic untuk Daftar Peringkat Live (Playing)
  useEffect(() => {
    if (view === "PLAYING") {
      const othersCount = Math.max(0, globalLeaderboard.length - 5);
      const totalPages = Math.ceil(othersCount / 10);
      if (totalPages > 1) {
        const timer = setInterval(() => setPlayingPage(prev => (prev + 1) % totalPages), 5000); 
        return () => clearInterval(timer);
      }
    } else { setPlayingPage(0); }
  }, [view, globalLeaderboard.length]);

  useEffect(() => {
    if (view === "PLAYING") {
      gameTimer.current = setInterval(() => {
        setGlobalTimeLeft(prev => { if (prev <= 1) { endGame(); return 0; } return prev - 1; });
        setWordTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(gameTimer.current);
  }, [view]);

  useEffect(() => { if (view === "PLAYING" && wordTimeLeft <= 0) resolveRound(); }, [wordTimeLeft, view]);

  const endGame = () => { clearInterval(gameTimer.current); playSfx("win"); setView("GAMEOVER"); };
  const formatTime = (seconds) => { const m = Math.floor(seconds / 60); const s = seconds % 60; return `${m}:${s.toString().padStart(2, '0')}`; };

  // ==========================================
  // RENDERERS
  // ==========================================
  
  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center h-full animate-in zoom-in duration-500 w-full max-w-sm mx-auto px-4 z-10 perspective-container">
      <div className="relative mb-8 transform-3d hover:-translate-y-2 transition-transform duration-500">
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 blur-xl opacity-60 rounded-full animate-pulse"></div>
        <Zap className="w-24 h-24 text-yellow-400 relative z-10 drop-shadow-[0_10px_15px_rgba(250,204,21,0.6)] animate-bounce" />
      </div>
      <h1 className="text-6xl font-black text-white mb-2 tracking-tighter text-center leading-tight text-3d-title">
        BUNG<br/><span className="text-yellow-400 text-3d-yellow">KATA</span>
      </h1>
      <p className="text-slate-300 mb-8 text-center text-sm leading-relaxed glass-3d p-3 rounded-xl">
        Mode Multi Winner! 1 Kata/Ronde per User.<br/>Semua dapat poin jika benar.<br/><span className="text-yellow-400 font-bold">Kata terpanjang</span> jadi awalan selanjutnya!
      </p>

      <div className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all shadow-3d-btn ${
        socketStatus === "CONNECTED" ? "bg-green-900/50 border-green-500/50 text-green-400" : "bg-red-900/50 border-red-500/50 text-red-400 animate-pulse"
      }`}>
        {socketStatus === "CONNECTED" ? <Wifi className="w-4 h-4 drop-shadow-md" /> : <WifiOff className="w-4 h-4 drop-shadow-md" />}
        {socketStatus === "CONNECTED" ? "TERHUBUNG KE LIVE" : `MENUNGGU KONEKSI (${wsHost}:62024)...`}
      </div>
      
      <div className="flex flex-col gap-3 w-full">
        <button onClick={startGame} className="btn-3d w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-black text-lg text-white flex items-center justify-center gap-2">
          <Play className="w-5 h-5 fill-white" /> MULAI LIVE GAME
        </button>

        <div className="grid grid-cols-2 gap-3 mt-2 w-full">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="btn-3d-alt py-3 bg-slate-800 rounded-xl text-xs font-bold text-slate-300 flex items-center justify-center gap-2 border border-slate-600">
            {soundEnabled ? <Volume2 className="w-4 h-4 text-green-400"/> : <VolumeX className="w-4 h-4 text-red-400"/>} 
            {soundEnabled ? "Sound ON" : "Sound OFF"}
          </button>
          <button onClick={toggleFullscreen} className="btn-3d-alt py-3 bg-slate-800 rounded-xl text-xs font-bold text-slate-300 flex items-center justify-center gap-2 border border-slate-600">
            {isFullscreen ? <Minimize className="w-4 h-4 text-blue-400"/> : <Maximize className="w-4 h-4 text-blue-400"/>} 
            {isFullscreen ? "Exit Full" : "Fullscreen"}
          </button>
        </div>

        <div className="flex items-center justify-between glass-3d p-3 rounded-xl border border-slate-600 w-full mt-1">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
            <Globe className="w-4 h-4 text-purple-400" /> Bahasa
          </div>
          <div className="flex gap-1">
            {["ID", "EN", "MIX"].map(lang => (
              <button key={lang} onClick={() => setLanguage(lang)} className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${language === lang ? 'bg-purple-500 text-white shadow-[0_4px_0_#7e22ce,0_5px_10px_rgba(0,0,0,0.5)] translate-y-[-2px]' : 'bg-slate-700 text-slate-400 hover:bg-slate-600 shadow-[0_2px_0_#475569]'}`}>
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between glass-3d p-3 rounded-xl border border-slate-600 w-full mt-1">
          <span className="text-sm font-bold text-slate-200">Overlap Huruf:</span>
          <div className="flex gap-2">
            {[1, 2, 3].map(num => (
              <button key={num} onClick={() => setOverlapLength(num)} className={`w-10 h-10 rounded-lg font-black text-lg flex items-center justify-center transition-all ${overlapLength === num ? 'bg-blue-500 text-white shadow-[0_4px_0_#1d4ed8,0_5px_10px_rgba(0,0,0,0.5)] translate-y-[-2px]' : 'bg-slate-700 text-slate-400 hover:bg-slate-600 shadow-[0_2px_0_#475569]'}`}>
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between glass-3d p-3 rounded-xl border border-slate-600 w-full mt-1">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
             <Wifi className="w-4 h-4 text-green-400 drop-shadow-md" /> Host IndoFinity
          </div>
          <input type="text" value={wsHost} onChange={(e) => setWsHost(e.target.value)} className="w-32 bg-slate-900/80 border-b-2 border-slate-500 rounded-lg px-2 py-1.5 text-xs text-center font-mono text-white outline-none focus:border-blue-500 transition-all shadow-inner" placeholder="192.168.x.x" />
        </div>

        <button onClick={resetLeaderboard} className="flex items-center justify-center gap-2 bg-red-900/50 hover:bg-red-800 border border-red-700 text-red-300 py-3 rounded-xl text-xs font-black transition-all w-full mt-3 shadow-[0_4px_0_#7f1d1d,0_5px_10px_rgba(0,0,0,0.4)] active:translate-y-[4px] active:shadow-none">
          <Trash2 className="w-4 h-4" /> RESET LEADERBOARD GLOBAL
        </button>
      </div>
    </div>
  );

  const renderGameOver = () => {
    const sorted = [...sessionPlayers].sort((a, b) => b.score - a.score);
    const top1 = sorted[0]; const top2 = sorted[1]; const top3 = sorted[2];
    const others = sorted.slice(3);
    const PAGE_SIZE = 5;
    const totalPages = Math.ceil(others.length / PAGE_SIZE);
    const currentOthers = others.slice(gameOverPage * PAGE_SIZE, (gameOverPage + 1) * PAGE_SIZE);

    return (
      <div className="flex flex-col items-center justify-start h-full w-full animate-in zoom-in-90 duration-700 px-4 pt-10 sm:pt-12 pb-4 perspective-container">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="absolute w-3 h-3 rounded-full bg-yellow-400/50 blur-[2px] animate-float" style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, animationDuration: `${2+Math.random()*3}s`, animationDelay: `${Math.random()}s` }}></div>
          ))}
        </div>

        <div className="glass-3d border-t-2 border-l-2 border-slate-600/50 shadow-[0_20px_50px_rgba(0,0,0,0.8)] w-full max-w-[440px] rounded-3xl p-5 sm:p-6 flex flex-col items-center relative z-10 max-h-[95vh] overflow-y-auto no-scrollbar transform-3d">
          <h2 className="text-4xl font-black text-white mb-1 text-3d-title animate-pulse-slow">SESI BERAKHIR</h2>
          <p className="text-slate-300 font-semibold text-xs mb-8 bg-slate-800/80 px-4 py-1 rounded-full shadow-inner border border-slate-700">Hasil Pertandingan</p>

          {sorted.length === 0 ? (
            <div className="py-10 text-center text-slate-500 italic flex flex-col items-center glass-3d rounded-2xl w-full">
              <Skull className="w-12 h-12 mb-3 opacity-50 drop-shadow-lg" /> Tidak ada yang berpartisipasi 🥲
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              {/* === 3D PODIUM === */}
              <div className="flex items-end justify-center gap-3 w-full h-40 sm:h-44 mb-8 mt-6 perspective-[1000px]">
                
                {/* Rank 2 (Kiri) */}
                {top2 && (
                  <div className="flex flex-col items-center justify-end w-[28%] max-w-[90px] h-[70%] relative animate-in slide-in-from-bottom-12 duration-700 delay-150 preserve-3d">
                    <div className="absolute -top-16 flex flex-col items-center w-[130%] transform hover:scale-110 transition-transform cursor-pointer">
                      <div className="relative">
                         <div className="absolute inset-0 bg-slate-400 rounded-full blur-md opacity-50"></div>
                         {top2.avatar && <img src={top2.avatar} alt="" referrerPolicy="no-referrer" className="w-10 h-10 rounded-full border-[3px] border-slate-300 mb-1 object-cover relative z-10 shadow-[0_5px_10px_rgba(0,0,0,0.5)]" onError={(e) => { e.currentTarget.onerror=null; e.currentTarget.src=DEFAULT_AVATAR; }} />}
                      </div>
                      <span className="text-[11px] sm:text-xs font-black text-white truncate w-full text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{top2.username}</span>
                      <span className="text-[10px] font-mono font-black text-slate-200 bg-slate-700/90 border border-slate-400/50 px-2 py-0.5 rounded-md mt-1 shadow-md">{top2.score}</span>
                    </div>
                    {/* 3D Block Base */}
                    <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 rounded-t-lg shadow-[inset_2px_2px_5px_rgba(255,255,255,0.3),-5px_5px_15px_rgba(0,0,0,0.6)] flex justify-center pt-2 relative overflow-hidden before:absolute before:inset-0 before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)] before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-1000">
                      <span className="font-black text-3xl sm:text-4xl text-slate-400/50 drop-shadow-md">2</span>
                    </div>
                  </div>
                )}

                {/* Rank 1 (Tengah) */}
                {top1 && (
                  <div className="flex flex-col items-center justify-end w-[35%] max-w-[120px] h-full relative animate-in slide-in-from-bottom-16 duration-700 z-20 preserve-3d">
                    <div className="absolute -top-24 flex flex-col items-center w-[130%] transform hover:scale-110 transition-transform cursor-pointer">
                      <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.9)] animate-float mb-0.5" />
                      <div className="relative">
                         <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-60"></div>
                         {top1.avatar && <img src={top1.avatar} alt="" referrerPolicy="no-referrer" className="w-14 h-14 rounded-full border-[4px] border-yellow-400 mb-1 object-cover relative z-10 shadow-[0_8px_15px_rgba(0,0,0,0.6)]" onError={(e) => { e.currentTarget.onerror=null; e.currentTarget.src=DEFAULT_AVATAR; }} />}
                      </div>
                      <span className="text-xs sm:text-sm font-black text-yellow-300 truncate w-full text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)] mt-1">{top1.username}</span>
                      <span className="text-[11px] sm:text-xs font-mono font-black text-yellow-100 bg-yellow-700/90 border border-yellow-400/80 px-3 py-1 rounded-md mt-1 shadow-lg">{top1.score} Pts</span>
                    </div>
                    {/* 3D Block Base */}
                    <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-t-lg shadow-[inset_2px_2px_10px_rgba(255,255,255,0.5),-8px_8px_20px_rgba(0,0,0,0.7)] flex justify-center pt-3 relative overflow-hidden before:absolute before:inset-0 before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-1000">
                      <span className="font-black text-4xl sm:text-5xl text-yellow-200/50 drop-shadow-lg">1</span>
                    </div>
                  </div>
                )}

                {/* Rank 3 (Kanan) */}
                {top3 && (
                  <div className="flex flex-col items-center justify-end w-[28%] max-w-[90px] h-[50%] relative animate-in slide-in-from-bottom-8 duration-700 delay-300 preserve-3d">
                    <div className="absolute -top-16 flex flex-col items-center w-[130%] transform hover:scale-110 transition-transform cursor-pointer">
                      <div className="relative">
                         <div className="absolute inset-0 bg-orange-500 rounded-full blur-md opacity-40"></div>
                         {top3.avatar && <img src={top3.avatar} alt="" referrerPolicy="no-referrer" className="w-9 h-9 rounded-full border-[3px] border-orange-400 mb-1 object-cover relative z-10 shadow-[0_5px_10px_rgba(0,0,0,0.5)]" onError={(e) => { e.currentTarget.onerror=null; e.currentTarget.src=DEFAULT_AVATAR; }} />}
                      </div>
                      <span className="text-[11px] sm:text-xs font-black text-white truncate w-full text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{top3.username}</span>
                      <span className="text-[10px] font-mono font-black text-orange-200 bg-orange-900/90 border border-orange-500/50 px-2 py-0.5 rounded-md mt-1 shadow-md">{top3.score}</span>
                    </div>
                    {/* 3D Block Base */}
                    <div className="w-full h-full bg-gradient-to-br from-orange-600 to-orange-800 rounded-t-lg shadow-[inset_2px_2px_5px_rgba(255,255,255,0.3),-5px_5px_15px_rgba(0,0,0,0.6)] flex justify-center pt-2 relative overflow-hidden before:absolute before:inset-0 before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)] before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-1000">
                      <span className="font-black text-3xl sm:text-4xl text-orange-300/40 drop-shadow-md">3</span>
                    </div>
                  </div>
                )}
              </div>

              {/* === LIST RANKING 4 DST === */}
              {others.length > 0 && (
                <div className="w-full relative h-[210px] sm:h-[220px] mb-3 shrink-0">
                  <div className="absolute top-0 left-0 right-0 flex flex-col gap-2" key={gameOverPage}>
                    {currentOthers.map((p, idx) => {
                      const actualRank = 4 + (gameOverPage * PAGE_SIZE) + idx;
                      return (
                        <div key={p.id} className="flex justify-between items-center glass-3d hover:bg-slate-700/60 rounded-xl px-4 py-2 transition-transform animate-in fade-in zoom-in-95 duration-500 hover:translate-x-1" style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}>
                          <div className="flex items-center gap-3 overflow-hidden">
                            <span className="text-slate-400 font-black text-sm w-5 drop-shadow-md">{actualRank}.</span>
                            {p.avatar ? (
                              <img src={p.avatar} alt="" referrerPolicy="no-referrer" className="w-7 h-7 rounded-full object-cover shadow-[0_2px_5px_rgba(0,0,0,0.5)] border border-slate-500 shrink-0" onError={(e) => { e.currentTarget.onerror=null; e.currentTarget.src=DEFAULT_AVATAR; }} />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-[10px] font-black text-white shadow-[0_2px_5px_rgba(0,0,0,0.5)] border border-slate-500 shrink-0">{p.username.charAt(0).toUpperCase()}</div>
                            )}
                            <span className="text-white font-bold text-sm truncate max-w-[150px] drop-shadow-sm">{p.username}</span>
                          </div>
                          <span className="text-green-400 font-mono font-black text-sm bg-slate-900/80 px-2 py-0.5 rounded-md shadow-inner border border-slate-700 shrink-0">{p.score}</span>
                        </div>
                      )
                    })}
                  </div>
                  {totalPages > 1 && (
                    <div className="absolute -bottom-1 left-0 right-0 flex justify-center gap-2 animate-in fade-in duration-1000">
                      {[...Array(totalPages)].map((_, i) => (
                        <div key={i} className={`h-2 rounded-full transition-all duration-500 shadow-md ${i === gameOverPage ? 'bg-blue-400 w-6 shadow-[0_0_8px_rgba(96,165,250,0.8)]' : 'bg-slate-600 w-2'}`} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 w-full mt-4 z-20 shrink-0">
            <button onClick={startGame} className="btn-3d flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-black text-white flex items-center justify-center gap-2 text-sm tracking-wide">
              <RotateCcw className="w-5 h-5 drop-shadow-md" /> MAIN LAGI
            </button>
            <button onClick={() => setView("MENU")} className="btn-3d-alt w-16 bg-slate-700 rounded-xl flex items-center justify-center text-slate-300 hover:text-white border border-slate-600">
              <Home className="w-6 h-6 drop-shadow-md" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPlaying = () => {
    const suffix = currentWord.slice(-overlapLength).toUpperCase();
    const prefix = currentWord.slice(0, -overlapLength).toUpperCase();
    
    // TAMPILAN MARQUEE BERJALAN: GUNAKAN POIN AKUMULASI GLOBAL (TOP 5)
    const sortedPlayers = [...globalLeaderboard].sort((a,b) => b.score - a.score);
    const top5 = [];
    for (let i = 0; i < 5; i++) {
      if (sortedPlayers[i]) top5.push(sortedPlayers[i]);
      else top5.push({ id: `empty-${i}`, username: "---", score: 0, isEmpty: true });
    }

    // PEMBAGIAN DAFTAR PERINGKAT BAWAH KOTAK ATURAN (RANK 6 KE ATAS) DENGAN PAGINATION
    const others = sortedPlayers.slice(5);
    const PLAYING_PAGE_SIZE = 10;
    const totalPlayingPages = Math.ceil(others.length / PLAYING_PAGE_SIZE);
    
    // Mengambil 10 data untuk halaman aktif
    const currentOthers = others.slice(playingPage * PLAYING_PAGE_SIZE, (playingPage + 1) * PLAYING_PAGE_SIZE);
    
    // Membagi 10 data tersebut ke 2 kolom
    const col1 = currentOthers.slice(0, 5).map((p, i) => ({ ...p, actualRank: 6 + (playingPage * PLAYING_PAGE_SIZE) + i }));
    const col2 = currentOthers.slice(5, 10).map((p, i) => ({ ...p, actualRank: 11 + (playingPage * PLAYING_PAGE_SIZE) + i }));

    return (
      <div className="flex flex-col h-full w-full mx-auto relative animate-in fade-in duration-500 perspective-container">
        
        {/* === TOP BAR === */}
        <div className="flex justify-between items-center glass-3d px-4 py-3 border-b border-slate-700 z-20 shadow-[0_5px_15px_rgba(0,0,0,0.5)] relative shrink-0">
           <div className="flex items-center gap-2 text-slate-200 font-black bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-600 shadow-inner">
             <Clock className="w-4 h-4 text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)] animate-pulse" />
             <span className="font-mono text-lg">{formatTime(globalTimeLeft)}</span>
           </div>
           
           <div className={`hidden sm:flex items-center gap-2 text-xs font-black px-4 py-2 rounded-full border shadow-md ${
             socketStatus === "CONNECTED" ? "bg-green-900/60 border-green-500/50 text-green-400" : "bg-red-900/60 border-red-500/50 text-red-400"
           }`}>
             {socketStatus === "CONNECTED" ? <Wifi className="w-3 h-3 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]" /> : <WifiOff className="w-3 h-3 animate-pulse drop-shadow-[0_0_5px_rgba(248,113,113,0.8)]" />}
             {socketStatus === "CONNECTED" ? "LIVE CONNECTED" : "OFFLINE"}
           </div>

           <div className="flex items-center gap-3">
             <button onClick={() => setShowInputForm(!showInputForm)} className={`btn-3d-alt p-2.5 rounded-xl border ${showInputForm ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400 hover:text-blue-400'}`} title="Tampilkan/Sembunyikan Form">
               <Keyboard className="w-5 h-5 drop-shadow-md" />
             </button>
             <button onClick={() => setView("MENU")} className="btn-3d-alt bg-slate-800 border-slate-600 p-2.5 rounded-xl text-slate-400 hover:text-red-400" title="Kembali ke Menu">
               <Home className="w-5 h-5 drop-shadow-md" />
             </button>
           </div>
        </div>

        {/* === 3D MARQUEE === */}
        <div className="w-full bg-slate-900/70 border-b border-slate-700/80 py-3 z-10 overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.6)] flex flex-col relative shrink-0 before:absolute before:inset-0 before:shadow-[inset_0_5px_10px_rgba(0,0,0,0.5)] before:pointer-events-none">
          {globalLeaderboard.length === 0 ? (
            <div className="w-full text-center text-xs font-bold text-slate-500">Belum ada pemain di leaderboard global...</div>
          ) : (
            <div className="flex animate-marquee hover:[animation-play-state:paused]">
              {[...Array(4)].map((_, setIndex) => (
                <div key={`set-${setIndex}`} className="flex gap-4 pr-4">
                  {top5.map((p, i) => (
                    <div key={`rank-${i}`} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-b-2 shadow-md shrink-0 transition-transform duration-300 hover:scale-105 cursor-pointer ${
                        p.isEmpty ? 'bg-slate-800/50 border-slate-700/30 opacity-60' :
                        i === 0 ? 'bg-gradient-to-r from-yellow-700 to-yellow-900 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 
                        i === 1 ? 'bg-gradient-to-r from-slate-600 to-slate-800 border-slate-400' : 
                        i === 2 ? 'bg-gradient-to-r from-orange-700 to-orange-900 border-orange-500' : 
                        'bg-slate-800 border-slate-600'
                      }`}>
                      <div className={`w-6 h-6 flex items-center justify-center rounded-md text-[11px] font-black shrink-0 shadow-inner ${
                        p.isEmpty ? 'bg-slate-700 text-slate-500' : i === 0 ? 'bg-yellow-400 text-yellow-900' : i === 1 ? 'bg-slate-300 text-slate-800' : i === 2 ? 'bg-orange-400 text-orange-900' : 'bg-slate-700 text-slate-300'
                      }`}>
                        #{i+1}
                      </div>
                      {!p.isEmpty && p.avatar && (
                         <img src={p.avatar} alt="" referrerPolicy="no-referrer" className="w-6 h-6 rounded-md object-cover border border-white/20 bg-slate-800 shrink-0 shadow-sm" onError={(e) => { e.currentTarget.onerror=null; e.currentTarget.src=DEFAULT_AVATAR; }} />
                      )}
                      <span className={`text-xs font-black truncate max-w-[120px] drop-shadow-md ${p.isEmpty ? 'text-slate-500' : i===0 ? 'text-yellow-100' : 'text-white'}`}>{p.username}</span>
                      <span className={`text-xs font-mono font-black ml-1 bg-black/40 px-1.5 rounded ${p.isEmpty ? 'text-slate-600' : 'text-green-400 shadow-inner'}`}>{p.isEmpty ? "-" : p.score}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* === 3D TOAST NOTIFICATIONS === */}
        <div className="absolute top-[130px] right-4 z-50 flex flex-col items-end gap-3 pointer-events-none perspective-[800px]">
          {toasts.map(toast => (
            <div key={toast.id} className="animate-in slide-in-from-right-10 fade-in duration-500 glass-3d border-r-2 border-b-2 border-white/10 p-2 pr-5 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.6)] flex items-center gap-3 transform rotate-y-[-5deg] rotate-x-[5deg]">
              {toast.avatar ? (
                <img src={toast.avatar} alt={toast.nickname} referrerPolicy="no-referrer" className="w-12 h-12 rounded-xl border border-white/20 object-cover shadow-[0_5px_10px_rgba(0,0,0,0.5)] bg-slate-800" onError={(e) => { e.currentTarget.onerror=null; e.currentTarget.src=DEFAULT_AVATAR; }} />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-[0_5px_10px_rgba(0,0,0,0.5)] border border-white/20">
                  {toast.nickname.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm font-black text-white leading-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{toast.nickname}</span>
                <span className="text-xs text-slate-200 font-bold leading-tight flex items-center gap-1 mt-1 bg-black/30 px-2 py-0.5 rounded-md shadow-inner w-max">
                  <span className="text-green-400 drop-shadow-[0_0_3px_rgba(74,222,128,0.5)]">+{toast.points} Pts</span> • <span className="font-mono text-yellow-300">{toast.word}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* === 3D MAIN ARENA === */}
        <div className="flex-1 flex flex-col items-center justify-start pt-6 sm:pt-8 lg:pt-10 p-4 relative overflow-y-auto no-scrollbar preserve-3d" 
             style={{ transform: `rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)`, transition: 'transform 0.1s ease-out' }}>
          
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none transform translate-z-[-100px]"></div>

          {/* 3D Timer Ring */}
          <div className="mb-4 relative flex items-center justify-center z-10 transform translate-z-[50px] drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)]">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-slate-800/80 drop-shadow-md" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="5" fill="transparent" 
                strokeDasharray="176" strokeDashoffset={176 - (176 * wordTimeLeft) / 25} 
                strokeLinecap="round"
                className={`${wordTimeLeft <= 5 ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]'} transition-all duration-1000 ease-linear`} 
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center glass-3d w-11 h-11 rounded-full border border-white/10">
              <span className={`text-xl font-black font-mono drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ${wordTimeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{wordTimeLeft}</span>
            </div>
          </div>
          
          <span className="text-slate-300 text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase mb-1 z-10 text-center drop-shadow-md bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700/50 transform translate-z-[30px]">
            Sambung Kata Ini
          </span>
          
          {/* HUGE 3D TEXT */}
          <div className="z-10 flex justify-center text-center px-4 leading-tight whitespace-nowrap w-full transform translate-z-[80px] hover:scale-105 transition-transform duration-500 cursor-default"
               style={{ fontSize: `clamp(2rem, calc(80vw / ${Math.max(currentWord.length, 6)}), 7rem)` }}>
            <span className="font-black text-white text-3d leading-none">{prefix}</span>
            <span className="font-black text-yellow-400 text-3d-yellow leading-none">{suffix}</span>
          </div>

          {/* 3D Owner Badge */}
          <div className="h-10 mb-4 mt-2 z-10 flex items-center justify-center transform translate-z-[40px]">
            {currentWordOwner && (
              <div className="flex items-center gap-2 glass-3d pr-4 pl-2 py-1.5 rounded-xl border-b-2 border-r-2 border-slate-600/50 animate-in fade-in slide-in-from-bottom-5 duration-700 hover:-translate-y-1 transition-transform cursor-pointer">
                {currentWordOwner.avatar ? (
                   <img src={currentWordOwner.avatar} alt="" referrerPolicy="no-referrer" className="w-6 h-6 rounded-lg object-cover border border-white/20 shadow-[0_2px_5px_rgba(0,0,0,0.5)] bg-slate-800" onError={(e) => { e.currentTarget.onerror=null; e.currentTarget.src=DEFAULT_AVATAR; }} />
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-[11px] font-black text-white shadow-md border border-slate-500">
                    {currentWordOwner.nickname.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-[10px] sm:text-xs font-bold text-slate-300 drop-shadow-md">Terpanjang dari <strong className="text-white text-xs sm:text-sm tracking-wide">{currentWordOwner.nickname}</strong></span>
              </div>
            )}
          </div>

          {/* 3D Rule Box */}
          <div className="glass-3d rounded-2xl p-4 w-full max-w-md flex flex-col items-center justify-center text-center shadow-[0_20px_40px_rgba(0,0,0,0.6)] border-t border-l border-white/10 border-b-4 border-r-4 border-black/40 z-10 transform translate-z-[20px] hover:-translate-y-1 transition-transform">
            <span className="text-[9px] text-yellow-400 font-black uppercase tracking-widest mb-2.5 flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-md border border-yellow-500/30 shadow-inner">
              <AlertTriangle className="w-3 h-3" /> ATURAN AKTIF
            </span>
            <div className="flex flex-col gap-1 w-full text-left bg-black/30 p-3 rounded-xl border-t border-l border-white/5 border-b border-r border-black/50 shadow-inner">
              <span className="text-xs sm:text-sm font-black text-slate-200 drop-shadow-md">
                1. Awali huruf '<span className="text-yellow-400 text-base uppercase bg-yellow-900/30 px-1.5 rounded border border-yellow-500/30 ml-1">{suffix}</span>'
              </span>
              {activeRule.id !== "NORMAL" && (
                <span className="text-xs sm:text-sm font-black text-red-400 flex items-center gap-2 drop-shadow-md mt-0.5">
                  2. {activeRule.desc}
                </span>
              )}
            </div>
          </div>

          {/* === COMPACT PAGINATED LEADERBOARD 2 KOLOM (RANK 6+) === */}
          {others.length > 0 && (
            <div className="w-full max-w-2xl mt-5 z-10 transform translate-z-[15px] relative h-[210px] shrink-0">
              <div className="absolute top-0 left-0 right-0 flex gap-3 px-2" key={playingPage}>
                
                {/* Kolom 1 */}
                <div className="flex-1 flex flex-col gap-2">
                  {col1.map(p => (
                    <div key={p.id} className="flex items-center justify-between glass-3d hover:bg-slate-700/50 border border-slate-600/30 rounded-lg px-2 sm:px-3 py-1.5 transition-colors shadow-sm animate-in fade-in zoom-in-95 duration-500">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-slate-400 font-black text-[10px] sm:text-xs w-4 sm:w-5 shrink-0 drop-shadow-md">{p.actualRank}.</span>
                        {p.avatar ? (
                          <img src={p.avatar} alt="" referrerPolicy="no-referrer" className="w-5 h-5 rounded-md object-cover border border-slate-500 shadow-sm bg-slate-800 shrink-0" onError={(e) => { e.currentTarget.onerror=null; e.currentTarget.src=DEFAULT_AVATAR; }} />
                        ) : (
                          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-[9px] font-bold text-white shadow-sm border border-slate-500 shrink-0">{p.username.charAt(0).toUpperCase()}</div>
                        )}
                        <span className="text-slate-200 font-bold text-[11px] sm:text-xs truncate max-w-[80px] sm:max-w-[130px] drop-shadow-sm">{p.username}</span>
                      </div>
                      <span className="text-green-400 font-mono font-black text-[11px] sm:text-xs shrink-0 ml-1 bg-slate-900/60 px-1.5 py-0.5 rounded shadow-inner">{p.score}</span>
                    </div>
                  ))}
                </div>

                {/* Kolom 2 */}
                {col2.length > 0 && (
                  <div className="flex-1 flex flex-col gap-2">
                    {col2.map(p => (
                      <div key={p.id} className="flex items-center justify-between glass-3d hover:bg-slate-700/50 border border-slate-600/30 rounded-lg px-2 sm:px-3 py-1.5 transition-colors shadow-sm animate-in fade-in zoom-in-95 duration-500">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="text-slate-400 font-black text-[10px] sm:text-xs w-4 sm:w-5 shrink-0 drop-shadow-md">{p.actualRank}.</span>
                          {p.avatar ? (
                            <img src={p.avatar} alt="" referrerPolicy="no-referrer" className="w-5 h-5 rounded-md object-cover border border-slate-500 shadow-sm bg-slate-800 shrink-0" onError={(e) => { e.currentTarget.onerror=null; e.currentTarget.src=DEFAULT_AVATAR; }} />
                          ) : (
                            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-[9px] font-bold text-white shadow-sm border border-slate-500 shrink-0">{p.username.charAt(0).toUpperCase()}</div>
                          )}
                          <span className="text-slate-200 font-bold text-[11px] sm:text-xs truncate max-w-[80px] sm:max-w-[130px] drop-shadow-sm">{p.username}</span>
                        </div>
                        <span className="text-green-400 font-mono font-black text-[11px] sm:text-xs shrink-0 ml-1 bg-slate-900/60 px-1.5 py-0.5 rounded shadow-inner">{p.score}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Indikator Halaman (Titik-titik) */}
              {totalPlayingPages > 1 && (
                <div className="absolute -bottom-2 left-0 right-0 flex justify-center gap-2 animate-in fade-in duration-1000">
                  {[...Array(totalPlayingPages)].map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 shadow-md ${i === playingPage ? 'bg-blue-400 w-5 shadow-[0_0_8px_rgba(96,165,250,0.8)]' : 'bg-slate-600 w-1.5'}`} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* === 3D BOTTOM SECTION === */}
        {showInputForm && (
          <div className="w-full max-w-4xl mx-auto px-4 pb-6 mt-auto animate-in slide-in-from-bottom-8 duration-500 z-20 transform translate-z-[60px] shrink-0">
            <form onSubmit={handleInputSubmit} className="flex gap-2 relative glass-3d p-2 rounded-2xl border-t border-l border-white/10 border-b-4 border-r-4 border-black/50 shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
              <div className="flex-1 relative flex items-center">
                <MessageSquare className="absolute left-4 w-5 h-5 text-slate-400 drop-shadow-sm" />
                <input 
                  ref={inputRef} type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Ketik 'Nickname: Kata' atau langsung kata..."
                  className="w-full bg-slate-900/90 border-2 border-slate-700 focus:border-blue-500 rounded-xl pl-12 pr-4 py-3.5 text-sm font-black text-white placeholder:text-slate-500 outline-none transition-all shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)]"
                  autoComplete="off"
                />
              </div>
              <button type="submit" className="btn-3d bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 rounded-xl font-black text-sm flex items-center justify-center tracking-wide">
                KIRIM
              </button>
            </form>
          </div>
        )}

      </div>
    );
  };

  return (
    <div className="h-screen w-full bg-slate-950 font-sans text-slate-100 overflow-hidden relative selection:bg-blue-500 selection:text-white">
      {/* Deep 3D Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black z-0"></div>
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] [background-size:20px_20px] z-0"></div>

      <div className="relative h-full z-10 flex flex-col">
        {view === "MENU" && renderMenu()}
        {view === "PLAYING" && renderPlaying()}
        {view === "GAMEOVER" && renderGameOver()}
      </div>

      <style>{`
        /* Utilitas Custom untuk 3D Estetik */
        .perspective-container {
          perspective: 1200px;
          transform-style: preserve-3d;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .transform-3d {
          transform: translateZ(20px);
        }
        
        /* Glassmorphism 3D tebal */
        .glass-3d {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        /* Teks 3D Berlapis */
        .text-3d {
          text-shadow: 
            0 1px 0 #475569, 
            0 2px 0 #334155, 
            0 3px 0 #1e293b, 
            0 4px 0 #0f172a, 
            0 5px 0 #000000, 
            0 15px 20px rgba(0,0,0,0.6),
            0 25px 30px rgba(0,0,0,0.4);
        }
        .text-3d-yellow {
          text-shadow: 
            0 1px 0 #ca8a04, 
            0 2px 0 #a16207, 
            0 3px 0 #854d0e, 
            0 4px 0 #713f12, 
            0 5px 0 #422006, 
            0 15px 20px rgba(250,204,21,0.3),
            0 25px 30px rgba(0,0,0,0.5);
        }
        .text-3d-title {
          text-shadow: 
            0 2px 0 #64748b, 
            0 4px 0 #475569, 
            0 6px 0 #334155, 
            0 8px 0 #1e293b, 
            0 20px 30px rgba(0,0,0,0.7);
        }

        /* Tombol 3D */
        .btn-3d {
          border-top: 1px solid rgba(255,255,255,0.3);
          border-bottom: 4px solid rgba(0,0,0,0.5);
          box-shadow: 0 10px 20px rgba(0,0,0,0.4);
          transition: all 0.15s ease;
        }
        .btn-3d:active {
          border-bottom-width: 0px;
          transform: translateY(4px);
          box-shadow: 0 2px 5px rgba(0,0,0,0.4);
        }
        .btn-3d-alt {
          border-top: 1px solid rgba(255,255,255,0.1);
          border-bottom: 3px solid rgba(0,0,0,0.6);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          transition: all 0.15s ease;
        }
        .btn-3d-alt:active {
          border-bottom-width: 0px;
          transform: translateY(3px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .shadow-3d-btn {
          box-shadow: 0 4px 0 rgba(0,0,0,0.4), 0 8px 15px rgba(0,0,0,0.3);
        }

        /* Animasi Melayang */
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-delay-1 { animation: float 4s ease-in-out 1s infinite; }
        .animate-float-delay-2 { animation: float 4s ease-in-out 2s infinite; }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.02); }
        }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}