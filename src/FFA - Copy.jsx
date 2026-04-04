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

// Fallback Avatar SVG (Base64) jika gambar TikTok diblokir/kadaluarsa
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

// ==========================================
// 2. ATURAN DYNAMIC CHAOS (TIERS)
// ==========================================
const DYNAMIC_RULES = [
  { id: "NORMAL", desc: "✨ Normal", check: () => true, tier: 0 },
  // Tier 1 (Mudah)
  { id: "MIN_5", desc: "📏 Min 5 Huruf", check: (w) => w.length >= 5, tier: 1 },
  { id: "MAX_5", desc: "📏 Maks 5 Huruf", check: (w) => w.length <= 5, tier: 1 },
  { id: "ODD", desc: "1️⃣3️⃣5️⃣ Panjang Ganjil", check: (w) => w.length % 2 !== 0, tier: 1 },
  { id: "EVEN", desc: "2️⃣4️⃣6️⃣ Panjang Genap", check: (w) => w.length % 2 === 0, tier: 1 },
  { id: "EXACT_4", desc: "📏 Tepat 4 Huruf", check: (w) => w.length === 4, tier: 1 },

  // Tier 2 (Menengah)
  { id: "HAS_DOUBLE", desc: "👯 Ada Huruf Ganda", check: (w) => /(.)\1/.test(w), tier: 2 },
  { id: "END_VOWEL", desc: "🔤 Akhir: Vokal", check: (w) => /[aeiou]$/i.test(w), tier: 2 },
  { id: "END_CONS", desc: "🔤 Akhir: Konsonan", check: (w) => /[^aeiou]$/i.test(w), tier: 2 },
  { id: "NO_S_R", desc: "🚫 Tanpa 'S' atau 'R'", check: (w) => !/[sr]/i.test(w), tier: 2 },
  { id: "EXACT_6", desc: "📏 Tepat 6 Huruf", check: (w) => w.length === 6, tier: 2 },
  { id: "START_END_CONS", desc: "🧱 Awal & Akhir Konsonan", check: (w) => w.length > 1 && /^[^aeiou].*[^aeiou]$/i.test(w), tier: 2 },
  { id: "HAS_CONSECUTIVE_VOWELS", desc: "🅰️🅾️ Vokal Beruntun", check: (w) => /[aeiou]{2}/i.test(w), tier: 2 },

  // Tier 3 (Sulit)
  { id: "NO_A_I", desc: "🚫 Tanpa 'A' atau 'I'", check: (w) => !/[ai]/i.test(w), tier: 3 },
  { id: "NO_E_O", desc: "🚫 Tanpa 'E' atau 'O'", check: (w) => !/[eo]/i.test(w), tier: 3 },
  { id: "MAX_1_VOWEL", desc: "1️⃣ Maks 1 Vokal", check: (w) => (w.match(/[aeiou]/gi) || []).length <= 1, tier: 3 },
  { id: "MUST_3_VOWELS", desc: "🔤 Min 3 Vokal", check: (w) => (w.match(/[aeiou]/gi) || []).length >= 3, tier: 3 },
  { id: "MIN_7", desc: "📏 Min 7 Huruf", check: (w) => w.length >= 7, tier: 3 },
  { id: "EXACT_2_VOWELS", desc: "2️⃣ Tepat 2 Vokal", check: (w) => (w.match(/[aeiou]/gi) || []).length === 2, tier: 3 },
  { id: "NO_E", desc: "🚫 Tanpa Huruf 'E'", check: (w) => !/e/i.test(w), tier: 3 },
  { id: "NO_A", desc: "🚫 Tanpa Huruf 'A'", check: (w) => !/a/i.test(w), tier: 3 },

  // Tier 4 (Ekstrem / Chaos)
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
  // --- States ---
  const [view, setView] = useState("MENU"); // MENU, PLAYING, GAMEOVER
  
  // Perubahan Poin Global vs Sesi
  const [sessionPlayers, setSessionPlayers] = useState([]); // List poin dalam 1 sesi permainan (5 menit)
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]); // List akumulasi semua sesi
  
  const [currentWord, setCurrentWord] = useState("");
  const [activeRule, setActiveRule] = useState(DYNAMIC_RULES[0]);
  const [usedWords, setUsedWords] = useState(new Set());
  
  // State Khusus Mode Multi Winner
  const [roundAnswers, setRoundAnswers] = useState([]); // Menyimpan semua jawaban valid di satu ronde
  const [answeredThisRound, setAnsweredThisRound] = useState(new Set()); // Cegah user spam jawab di ronde yg sama
  const [currentWordOwner, setCurrentWordOwner] = useState(null); // Profil penemu kata terpanjang
  
  // Timers
  const [globalTimeLeft, setGlobalTimeLeft] = useState(300); // 5 Menit Total Game
  const [wordTimeLeft, setWordTimeLeft] = useState(25); // 25 Detik per Kata
  
  const [toasts, setToasts] = useState([]); // Sistem Toast Notifikasi Baru
  const [inputVal, setInputVal] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [overlapLength, setOverlapLength] = useState(1);
  const [language, setLanguage] = useState("MIX"); // ID, EN, MIX
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInputForm, setShowInputForm] = useState(true); // State untuk menyembunyikan form
  const [gameOverPage, setGameOverPage] = useState(0); // State untuk pagination ranking
  const [dictionary, setDictionary] = useState(FALLBACK_DICTIONARY);
  const [dictLoadedInfo, setDictLoadedInfo] = useState("Memuat Kamus...");
  
  // Socket.IO State
  const [socketStatus, setSocketStatus] = useState("DISCONNECTED");
  const [wsHost, setWsHost] = useState(window.location.hostname || "localhost"); // IP Pintar (Deteksi otomatis)

  // Refs untuk sinkronisasi async/event listener
  const inputRef = useRef(null);
  const gameTimer = useRef(null);
  const toastTimeoutRef = useRef(null); // Ref untuk menahan spam toast
  const currentWordRef = useRef(currentWord);
  const activeRuleRef = useRef(activeRule);
  const usedWordsRef = useRef(usedWords);
  const overlapLengthRef = useRef(overlapLength);
  const dictionaryRef = useRef(dictionary);
  const viewRef = useRef(view);
  const roundAnswersRef = useRef(roundAnswers);
  const answeredThisRoundRef = useRef(answeredThisRound);

  // Fetch Dictionary based on Language
  useEffect(() => {
    const loadDicts = async () => {
      let mixDict = new Set();
      setDictLoadedInfo("Memuat Kamus...");

      if (language === "ID" || language === "MIX") {
        try {
          const resId = await fetch("/kamus.json");
          if (resId.ok) {
            const dataId = await resId.json();
            Object.keys(dataId).forEach(k => {
              if (!k.includes(" ")) mixDict.add(normalizeWord(k));
            });
          }
        } catch (e) { console.warn("Failed to load kamus.json"); }
      }

      if (language === "EN" || language === "MIX") {
        try {
          const resEn = await fetch("/dictionary.json");
          if (resEn.ok) {
            const dataEn = await resEn.json();
            const arr = Array.isArray(dataEn) ? dataEn : Object.keys(dataEn);
            arr.forEach(k => {
              if (!k.includes(" ")) mixDict.add(normalizeWord(k));
            });
          }
        } catch (e) { console.warn("Failed to load dictionary.json"); }
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

  // Sync refs for async callbacks
  useEffect(() => { currentWordRef.current = currentWord; }, [currentWord]);
  useEffect(() => { activeRuleRef.current = activeRule; }, [activeRule]);
  useEffect(() => { usedWordsRef.current = usedWords; }, [usedWords]);
  useEffect(() => { overlapLengthRef.current = overlapLength; }, [overlapLength]);
  useEffect(() => { dictionaryRef.current = dictionary; }, [dictionary]);
  useEffect(() => { viewRef.current = view; }, [view]);
  useEffect(() => { roundAnswersRef.current = roundAnswers; }, [roundAnswers]);
  useEffect(() => { answeredThisRoundRef.current = answeredThisRound; }, [answeredThisRound]);

  // Load Global Leaderboard on mount
  useEffect(() => {
    const saved = localStorage.getItem("rebutan_leaderboard");
    if (saved) setGlobalLeaderboard(JSON.parse(saved));
    
    // Cleanup toast timeout on unmount
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    }
  }, []);

  // Sync fullscreen state changes from outside
  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // --- KONEKSI WEBSOCKET (INDOFINITY / TIKTOK LIVE CONNECTOR) ---
  useEffect(() => {
    let ws;
    let reconnectTimer;

    const connectWebSocket = () => {
      const wsUrl = `ws://${wsHost}:62024`;
      ws = new WebSocket(wsUrl);

      ws.onopen = function () {
        console.log(`Terhubung ke IndoFinity WebSocket di ${wsUrl}`);
        setSocketStatus("CONNECTED");
      };

      ws.onmessage = function (event) {
        try {
          const message = JSON.parse(event.data);
          const { event: eventName, data: eventData } = message; 

          if (eventName === 'chat') {
            const nickname = eventData.nickname || eventData.uniqueId || "Penonton";
            const comment = eventData.comment || eventData.text || "";
            // Menangkap Avatar (Tiktok Connector menggunakan profilePictureUrl)
            const avatar = eventData.profilePictureUrl || eventData.avatarUrl || eventData.profileImage || "";
            
            if (comment) {
              handleAnswer(nickname, comment, avatar);
            }
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      ws.onclose = function () {
        console.log('Koneksi WebSocket ditutup');
        setSocketStatus("DISCONNECTED");
        reconnectTimer = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      };

      ws.onerror = function (err) {
        console.error('WebSocket error:', err);
        ws.close(); 
      };
    };

    connectWebSocket();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws) {
        ws.onclose = null; 
        ws.close();
      }
    };
  }, [wsHost]); 

  // --- Game Mechanics ---
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const playSfx = (type) => { if (soundEnabled) Sound.play(type); };

  const resetLeaderboard = () => {
    if (window.confirm("Yakin ingin mereset (menghapus) semua skor Global Leaderboard?")) {
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
    
    // Hanya simpan 1 toast (replace yang lama), mencegah spam ke bawah
    setToasts([{ id, nickname, points, word, avatar }]);
    
    // Reset timer menghapus toast setiap kali ada yang baru
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    
    toastTimeoutRef.current = setTimeout(() => {
      setToasts([]);
    }, 2500);
  };

  const startGame = () => {
    setSessionPlayers([]); // Kosongkan pemain khusus untuk SESI INI saja
    setUsedWords(new Set());
    setRoundAnswers([]);
    setAnsweredThisRound(new Set());
    setCurrentWordOwner(null);
    
    // Reset toasts and timeouts
    setToasts([]);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    
    setGlobalTimeLeft(300); // 5 Menit
    setWordTimeLeft(25); // 25 Detik per kata
    
    // Kata awal acak
    let validStartWords = dictionary.filter(w => w.length >= overlapLength + 2);
    if (validStartWords.length === 0) validStartWords = dictionary;
    const startWord = validStartWords[Math.floor(Math.random() * validStartWords.length)];
    
    setCurrentWord(startWord);
    setActiveRule(DYNAMIC_RULES[0]);
    
    setView("PLAYING");
  };

  const resolveRound = () => {
    const answers = roundAnswersRef.current;
    
    if (answers.length > 0) {
      // Cari kata terpanjang dari kumpulan jawaban ronde ini
      const longest = answers.reduce((prev, current) => (prev.word.length > current.word.length) ? prev : current);
      
      setCurrentWord(longest.word);
      setCurrentWordOwner({ nickname: longest.nickname, avatar: longest.avatar });
      
      const nextSuffix = longest.word.slice(-overlapLengthRef.current);
      setActiveRule(getValidRule(nextSuffix));
      // Sfx kecil menandakan pergantian ronde/kata terpilih
      if (soundEnabled) playSfx("correct"); 
    } else {
      // Tidak ada yang menjawab, ganti kata otomatis (skip)
      let validStartWords = dictionaryRef.current.filter(w => w.length >= overlapLengthRef.current + 2 && !usedWordsRef.current.has(w));
      if (validStartWords.length === 0) validStartWords = dictionaryRef.current;
      const newWord = validStartWords[Math.floor(Math.random() * validStartWords.length)];
      
      setCurrentWord(newWord);
      setUsedWords(prev => new Set(prev).add(newWord));
      setCurrentWordOwner(null);
      setActiveRule(DYNAMIC_RULES[0]);
      playSfx("timeout");
    }
    
    // Reset status untuk ronde berikutnya
    setRoundAnswers([]);
    setAnsweredThisRound(new Set());
    setWordTimeLeft(25);
  };

  // Logika Utama Menjawab (Mode Jendela Waktu/Multi Winner)
  const handleAnswer = (nickname, textRaw, avatarUrl = "") => {
    if (viewRef.current !== "PLAYING") return;

    // Cegah user yang sudah menjawab benar di ronde ini untuk spam lagi
    if (answeredThisRoundRef.current.has(nickname)) return;

    const words = textRaw.toLowerCase().trim().split(/\s+/);
    if (words.length === 0) return;
    const w = words[0]; 

    const cWord = currentWordRef.current;
    const rule = activeRuleRef.current;
    const overlap = overlapLengthRef.current;

    // 1. Validasi Prefix Overlap
    const suffix = cWord.slice(-overlap);
    if (!w.startsWith(suffix) || w.length <= suffix.length) return;

    // 2. Validasi Kamus & Kata Terpakai
    if (usedWordsRef.current.has(w) || !dictionaryRef.current.includes(w)) return;

    // 3. Validasi Aturan Chaos
    if (!rule.check(w)) return;

    // Jika Valid
    playSfx("correct");
    const points = w.length; // 1 Huruf = 1 Poin

    // Tandai user ini sudah menjawab di ronde ini
    setAnsweredThisRound(prev => new Set(prev).add(nickname));

    // Langsung berikan poin ke sesi
    setSessionPlayers(prev => {
      const existing = prev.find(p => p.username === nickname);
      if (existing) {
        return prev.map(p => p.username === nickname ? { ...p, score: p.score + points, avatar: avatarUrl || p.avatar } : p);
      } else {
        return [...prev, { username: nickname, score: points, id: Date.now() + Math.random(), avatar: avatarUrl }];
      }
    });

    // Langsung berikan poin ke global
    setGlobalLeaderboard(prev => {
      const existing = prev.find(p => p.username === nickname);
      let updatedBoard;
      if (existing) {
        updatedBoard = prev.map(p => p.username === nickname ? { ...p, score: p.score + points, avatar: avatarUrl || p.avatar } : p);
      } else {
        updatedBoard = [...prev, { username: nickname, score: points, id: Date.now() + Math.random(), avatar: avatarUrl }];
      }
      localStorage.setItem("rebutan_leaderboard", JSON.stringify(updatedBoard));
      return updatedBoard;
    });
    
    // Langsung tandai kata terpakai agar tidak ditebak user lain di sisa waktu ronde ini
    setUsedWords(prev => new Set(prev).add(w));
    
    // Simpan jawaban untuk diadu kepanjangannya nanti di akhir ronde
    setRoundAnswers(prev => [...prev, { nickname, word: w, avatar: avatarUrl }]);

    // Tampilkan Toast
    showToast(nickname, points, w.toUpperCase(), avatarUrl);
  };

  // Fallback / Manual Injector
  useEffect(() => {
    window.receiveTikTokChat = (nickname, comment) => {
      handleAnswer(nickname, comment);
    };
    return () => { delete window.receiveTikTokChat; };
  }, []);

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    
    let uname = "Host";
    let guess = inputVal;
    
    if (inputVal.includes(":")) {
      const parts = inputVal.split(":");
      uname = parts[0].trim() || "Host";
      guess = parts[1].trim();
    }
    
    handleAnswer(uname, guess);
    setInputVal(""); 
  };

  // Pagination Timer Logic untuk Game Over
  useEffect(() => {
    if (view === "GAMEOVER") {
      const othersCount = Math.max(0, sessionPlayers.length - 3);
      const totalPages = Math.ceil(othersCount / 5);
      
      if (totalPages > 1) {
        const timer = setInterval(() => {
          setGameOverPage(prev => (prev + 1) % totalPages);
        }, 5000); // Ganti halaman setiap 5 detik
        return () => clearInterval(timer);
      }
    } else {
      setGameOverPage(0); // Reset ke halaman 1 jika bukan di game over
    }
  }, [view, sessionPlayers.length]);

  // Dual Timers Logic
  useEffect(() => {
    if (view === "PLAYING") {
      gameTimer.current = setInterval(() => {
        setGlobalTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });

        // Timer kata hanya decrement di sini, resetnya dilakukan oleh useEffect pengawas di bawah
        setWordTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => {
      clearInterval(gameTimer.current);
    };
  }, [view]);

  // Pengawas Timer Kata (Menyelesaikan Ronde)
  useEffect(() => {
    if (view === "PLAYING" && wordTimeLeft <= 0) {
      resolveRound();
    }
  }, [wordTimeLeft, view]);

  // --- End Game ---
  const endGame = () => {
    clearInterval(gameTimer.current);
    playSfx("win");
    setView("GAMEOVER");
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // ==========================================
  // RENDERERS
  // ==========================================
  
  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center h-full animate-in zoom-in duration-500 w-full max-w-sm mx-auto px-4">
      <div className="relative mb-8">
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 blur-xl opacity-50 rounded-full animate-pulse"></div>
        <Zap className="w-24 h-24 text-yellow-400 relative z-10 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
      </div>
      <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 mb-2 tracking-tighter text-center leading-tight">
        BUNG<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">KATA</span>
      </h1>
      <p className="text-slate-400 mb-8 text-center text-sm leading-relaxed">
        Mode Multi Winner! 1 Kata/Ronde per User.<br/>Semua dapat poin jika benar.<br/><span className="text-yellow-400 font-bold">Kata terpanjang</span> akan jadi awalan selanjutnya!
      </p>

      {/* Connection Status Indicator */}
      <div className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all ${
        socketStatus === "CONNECTED" ? "bg-green-900/30 border-green-500/50 text-green-400" : "bg-red-900/30 border-red-500/50 text-red-400 animate-pulse"
      }`}>
        {socketStatus === "CONNECTED" ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
        {socketStatus === "CONNECTED" ? "TERHUBUNG KE LIVE" : `MENUNGGU KONEKSI (${wsHost}:62024)...`}
      </div>
      
      <div className="flex flex-col gap-3 w-full">
        <button onClick={startGame} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2">
          <Play className="w-5 h-5 fill-white" /> MULAI LIVE GAME
        </button>

        <div className="grid grid-cols-2 gap-2 mt-2 w-full">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="py-2.5 bg-slate-900 rounded-xl text-xs font-bold text-slate-400 flex items-center justify-center gap-2 border border-slate-700 hover:bg-slate-800 transition-colors">
            {soundEnabled ? <Volume2 className="w-4 h-4 text-green-400"/> : <VolumeX className="w-4 h-4 text-red-400"/>} 
            {soundEnabled ? "Sound ON" : "Sound OFF"}
          </button>
          <button onClick={toggleFullscreen} className="py-2.5 bg-slate-900 rounded-xl text-xs font-bold text-slate-400 flex items-center justify-center gap-2 border border-slate-700 hover:bg-slate-800 transition-colors">
            {isFullscreen ? <Minimize className="w-4 h-4 text-blue-400"/> : <Maximize className="w-4 h-4 text-blue-400"/>} 
            {isFullscreen ? "Exit Full" : "Fullscreen"}
          </button>
        </div>

        <div className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700 w-full mt-1">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
            <Globe className="w-4 h-4 text-purple-400" />
            Bahasa
          </div>
          <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
            {["ID", "EN", "MIX"].map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${language === lang ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700 w-full mt-1">
          <span className="text-sm font-bold text-slate-300">Overlap Huruf:</span>
          <div className="flex gap-2">
            {[1, 2, 3].map(num => (
              <button
                key={num}
                onClick={() => setOverlapLength(num)}
                className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center transition-all ${overlapLength === num ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700 w-full mt-1">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
             <Wifi className="w-4 h-4 text-green-400" />
             Host IndoFinity
          </div>
          <input
            type="text"
            value={wsHost}
            onChange={(e) => setWsHost(e.target.value)}
            className="w-32 bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-xs text-center font-mono text-white outline-none focus:border-blue-500 transition-all"
            placeholder="192.168.x.x"
            title="Isi dengan IP PC kamu jika main di HP"
          />
        </div>

        <div className="text-xs font-mono text-slate-500 mt-2 text-center bg-slate-900 px-3 py-2 rounded-xl border border-slate-700">
          Kamus: <span className="text-yellow-400 font-bold">{dictLoadedInfo}</span>
        </div>

        <button onClick={resetLeaderboard} className="flex items-center justify-center gap-2 bg-red-900/30 hover:bg-red-800/60 border border-red-700/50 text-red-400 py-2.5 rounded-xl text-xs font-bold transition-all w-full mt-2">
          <Trash2 className="w-4 h-4" /> Reset Top Leaderboard Global
        </button>
      </div>
    </div>
  );

  const renderGameOver = () => {
    const sorted = [...sessionPlayers].sort((a, b) => b.score - a.score);
    const top1 = sorted[0];
    const top2 = sorted[1];
    const top3 = sorted[2];
    
    const others = sorted.slice(3);
    const PAGE_SIZE = 5;
    const totalPages = Math.ceil(others.length / PAGE_SIZE);
    const currentOthers = others.slice(gameOverPage * PAGE_SIZE, (gameOverPage + 1) * PAGE_SIZE);

    return (
      <div className="flex flex-col items-center justify-start h-full w-full animate-in zoom-in-90 duration-500 px-4 pt-12 sm:pt-16 pb-4">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="absolute w-2 h-2 rounded-full bg-yellow-400 animate-ping" style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, animationDuration: `${1+Math.random()}s`, animationDelay: `${Math.random()}s` }}></div>
          ))}
        </div>

        {/* Mencegah overflow pada device kecil */}
        <div className="bg-slate-900/90 border-2 border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl w-full max-w-[420px] rounded-3xl p-5 sm:p-6 flex flex-col items-center relative z-10 max-h-[95vh] overflow-y-auto no-scrollbar">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-1">SESI BERAKHIR</h2>
          <p className="text-slate-400 text-xs mb-10">Hasil Pertandingan Sesi Ini</p>

          {sorted.length === 0 ? (
            <div className="py-10 text-center text-slate-500 italic flex flex-col items-center">
              <Skull className="w-12 h-12 mb-3 opacity-50" />
              Tidak ada yang berpartisipasi 🥲
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              {/* === PODIUM ESTETIK TOP 3 (Ketinggian Dipendekkan & Turun) === */}
              <div className="flex items-end justify-center gap-2 w-full h-32 sm:h-36 mb-6 mt-4">
                {/* Juara 2 (Kiri) */}
                {top2 && (
                  <div className="flex flex-col items-center justify-end w-1/3 max-w-[90px] h-[75%] relative animate-in slide-in-from-bottom-8 fade-in duration-700 delay-150 fill-mode-both">
                    <div className="absolute -top-14 flex flex-col items-center w-[120%]">
                      {top2.avatar && <img src={top2.avatar} alt="" referrerPolicy="no-referrer" className="w-7 h-7 rounded-full border-2 border-slate-300 mb-1 object-cover shadow-md bg-slate-800" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_AVATAR; }} />}
                      <span className="text-[11px] sm:text-xs font-bold text-slate-300 truncate w-full text-center drop-shadow-md">{top2.username}</span>
                      <span className="text-[9px] sm:text-[10px] font-mono font-black text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full mt-1">{top2.score} Pts</span>
                    </div>
                    <div className="w-full h-full bg-gradient-to-t from-slate-800 to-slate-500 rounded-t-xl border-t-[3px] border-slate-300 shadow-[0_0_15px_rgba(148,163,184,0.2)] flex justify-center pt-2">
                      <span className="font-black text-2xl sm:text-3xl text-slate-300/40">2</span>
                    </div>
                  </div>
                )}

                {/* Juara 1 (Tengah) */}
                {top1 && (
                  <div className="flex flex-col items-center justify-end w-[38%] max-w-[110px] h-full relative animate-in slide-in-from-bottom-12 fade-in duration-700 z-10">
                    <div className="absolute -top-20 flex flex-col items-center w-[120%]">
                      <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] animate-bounce mb-0.5" />
                      {top1.avatar && <img src={top1.avatar} alt="" referrerPolicy="no-referrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-[3px] border-yellow-400 mb-1 object-cover shadow-[0_0_15px_rgba(250,204,21,0.5)] bg-slate-800" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_AVATAR; }} />}
                      <span className="text-xs sm:text-sm font-black text-yellow-400 truncate w-full text-center drop-shadow-md">{top1.username}</span>
                      <span className="text-[10px] sm:text-xs font-mono font-black text-yellow-200 bg-yellow-900/80 border border-yellow-500/50 px-2.5 py-0.5 rounded-full mt-1 shadow-lg">{top1.score} Pts</span>
                    </div>
                    <div className="w-full h-full bg-gradient-to-t from-yellow-900 via-yellow-600 to-yellow-500 rounded-t-xl border-t-[3px] border-yellow-300 shadow-[0_0_25px_rgba(250,204,21,0.4)] flex justify-center pt-2">
                      <span className="font-black text-3xl sm:text-4xl text-yellow-200/50">1</span>
                    </div>
                  </div>
                )}

                {/* Juara 3 (Kanan) */}
                {top3 && (
                  <div className="flex flex-col items-center justify-end w-1/3 max-w-[90px] h-[60%] relative animate-in slide-in-from-bottom-8 fade-in duration-700 delay-300 fill-mode-both">
                    <div className="absolute -top-14 flex flex-col items-center w-[120%]">
                      {top3.avatar && <img src={top3.avatar} alt="" referrerPolicy="no-referrer" className="w-7 h-7 rounded-full border-2 border-orange-400 mb-1 object-cover shadow-md bg-slate-800" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_AVATAR; }} />}
                      <span className="text-[11px] sm:text-xs font-bold text-orange-300 truncate w-full text-center drop-shadow-md">{top3.username}</span>
                      <span className="text-[9px] sm:text-[10px] font-mono font-black text-orange-400 bg-slate-800/80 px-2 py-0.5 rounded-full mt-1">{top3.score} Pts</span>
                    </div>
                    <div className="w-full h-full bg-gradient-to-t from-orange-900 to-orange-700 rounded-t-xl border-t-[3px] border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)] flex justify-center pt-2">
                      <span className="font-black text-2xl sm:text-3xl text-orange-300/40">3</span>
                    </div>
                  </div>
                )}
              </div>

              {/* === LIST RANKING 4 DST (DENGAN TINGGI TETAP/FIXED HEIGHT) === */}
              {others.length > 0 && (
                <div className="w-full relative h-[210px] sm:h-[220px] mb-2 shrink-0">
                  <div className="absolute top-0 left-0 right-0 flex flex-col gap-1.5" key={gameOverPage}>
                    {currentOthers.map((p, idx) => {
                      const actualRank = 4 + (gameOverPage * PAGE_SIZE) + idx;
                      return (
                        <div key={p.id} className="flex justify-between items-center bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/60 rounded-xl px-3 py-1.5 transition-colors animate-in fade-in zoom-in-95 duration-500" style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}>
                          <div className="flex items-center gap-3 overflow-hidden">
                            <span className="text-slate-500 font-bold text-xs w-5">{actualRank}.</span>
                            {p.avatar ? (
                              <img src={p.avatar} alt="" referrerPolicy="no-referrer" className="w-5 h-5 rounded-full object-cover bg-slate-800 shrink-0" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_AVATAR; }} />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-400 shrink-0">{p.username.charAt(0).toUpperCase()}</div>
                            )}
                            <span className="text-slate-200 font-bold text-sm truncate max-w-[150px]">{p.username}</span>
                          </div>
                          <span className="text-green-400 font-mono font-bold text-sm shrink-0">{p.score}</span>
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* Indikator Halaman (Titik-titik) */}
                  {totalPages > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1.5 animate-in fade-in duration-1000">
                      {[...Array(totalPages)].map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === gameOverPage ? 'bg-blue-500 w-4' : 'bg-slate-700 w-1.5'}`} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 w-full mt-2 z-20 shrink-0">
            <button onClick={startGame} className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 text-sm">
              <RotateCcw className="w-4 h-4" /> MAIN LAGI
            </button>
            <button onClick={() => setView("MENU")} className="w-14 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center justify-center transition-all text-slate-300 hover:text-white shadow-lg">
              <Home className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPlaying = () => {
    const overlap = overlapLength;
    const suffix = currentWord.slice(-overlap).toUpperCase();
    const prefix = currentWord.slice(0, -overlap).toUpperCase();

    // TAMPILAN MARQUEE BERJALAN: GUNAKAN POIN AKUMULASI GLOBAL
    const sortedPlayers = [...globalLeaderboard].sort((a,b) => b.score - a.score);
    const top5 = [];
    for (let i = 0; i < 5; i++) {
      if (sortedPlayers[i]) {
        top5.push(sortedPlayers[i]);
      } else {
        top5.push({ id: `empty-${i}`, username: "---", score: 0, isEmpty: true });
      }
    }

    return (
      <div className="flex flex-col h-full w-full mx-auto relative animate-in fade-in duration-300">
        
        {/* === TOP BAR === */}
        <div className="flex justify-between items-center bg-slate-900/80 backdrop-blur-md px-4 py-3 border-b border-slate-800 z-20">
           <div className="flex items-center gap-2 text-slate-300 font-bold bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
             <Clock className="w-4 h-4 text-blue-400" />
             <span className="font-mono">{formatTime(globalTimeLeft)}</span>
           </div>
           
           <div className={`hidden sm:flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border ${
             socketStatus === "CONNECTED" ? "bg-green-900/30 border-green-500/50 text-green-400" : "bg-red-900/30 border-red-500/50 text-red-400"
           }`}>
             {socketStatus === "CONNECTED" ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3 animate-pulse" />}
             {socketStatus === "CONNECTED" ? "LIVE CONNECTED" : "OFFLINE"}
           </div>

           <div className="flex items-center gap-2">
             <button onClick={() => setShowInputForm(!showInputForm)} className={`p-2 rounded-lg transition-colors ${showInputForm ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-blue-400'}`} title="Tampilkan/Sembunyikan Form Host">
               <Keyboard className="w-4 h-4" />
             </button>
             <button onClick={() => setView("MENU")} className="text-slate-400 hover:text-red-400 bg-slate-800 p-2 rounded-lg transition-colors" title="Kembali ke Menu">
               <Home className="w-4 h-4" />
             </button>
           </div>
        </div>

        {/* === SMOOTH MARQUEE TOP 5 LEADERBOARD GLOBAL === */}
        <div className="w-full bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50 py-3 z-10 overflow-hidden shadow-lg flex flex-col">
          {globalLeaderboard.length === 0 ? (
            <div className="w-full text-center text-xs text-slate-500 italic">Belum ada pemain di leaderboard global...</div>
          ) : (
            <div className="flex animate-marquee hover:[animation-play-state:paused]">
              {[...Array(4)].map((_, setIndex) => (
                <div key={`set-${setIndex}`} className="flex gap-4 pr-4">
                  {top5.map((p, i) => (
                    <div key={`rank-${i}`} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm shrink-0 transition-colors duration-300 ${
                        p.isEmpty ? 'bg-slate-800/50 border-slate-700/30 opacity-60' :
                        i === 0 ? 'bg-yellow-900/30 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 
                        i === 1 ? 'bg-slate-800 border-slate-400/50' : 
                        i === 2 ? 'bg-orange-900/20 border-orange-500/50' : 
                        'bg-slate-900/80 border-slate-700/50'
                      }`}>
                      
                      {/* Tampilkan Bulatan Rank */}
                      <div className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black shrink-0 transition-colors duration-300 ${
                        p.isEmpty ? 'bg-slate-700 text-slate-500' :
                        i === 0 ? 'bg-yellow-500 text-black' : 
                        i === 1 ? 'bg-slate-300 text-black' : 
                        i === 2 ? 'bg-orange-500 text-white' : 
                        'bg-slate-700 text-slate-300'
                      }`}>
                        {i+1}
                      </div>

                      {/* Tampilkan Avatar Jika Ada secara berdampingan */}
                      {!p.isEmpty && p.avatar && (
                         <img src={p.avatar} alt="" referrerPolicy="no-referrer" className="w-5 h-5 rounded-full object-cover border border-white/20 bg-slate-800 shrink-0" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_AVATAR; }} />
                      )}

                      <span className={`text-xs font-bold truncate max-w-[120px] transition-colors duration-300 ${p.isEmpty ? 'text-slate-500' : i===0 ? 'text-yellow-100' : 'text-slate-200'}`}>
                        {p.username}
                      </span>
                      <span className={`text-xs font-mono font-black ml-1 ${p.isEmpty ? 'text-slate-600' : 'text-green-400'}`}>
                        {p.isEmpty ? "-" : p.score}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* === TOAST NOTIFICATIONS (TOP RIGHT) === */}
        <div className="absolute top-[120px] right-4 z-50 flex flex-col items-end gap-3 pointer-events-none">
          {toasts.map(toast => (
            <div key={toast.id} className="animate-in slide-in-from-right-8 fade-in duration-300 bg-slate-900/70 backdrop-blur-md border border-white/10 p-2 pr-4 rounded-2xl shadow-xl flex items-center gap-3">
              {toast.avatar ? (
                <img src={toast.avatar} alt={toast.nickname} referrerPolicy="no-referrer" className="w-10 h-10 rounded-full border border-white/20 object-cover shadow-inner bg-slate-800" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_AVATAR; }} />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-inner border border-white/20">
                  {toast.nickname.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white leading-tight drop-shadow-md">{toast.nickname}</span>
                <span className="text-[11px] text-slate-300 leading-tight flex items-center gap-1 mt-0.5">
                  <span className="text-green-400 font-black">+{toast.points} Pts</span> • <span className="font-mono text-slate-200">{toast.word}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* === MAIN ARENA === */}
        {/* Padding atas (pt) dikurangi agar posisi elemen naik lebih ke atas */}
        <div className="flex-1 flex flex-col items-center justify-start pt-6 sm:pt-10 lg:pt-14 p-4 relative overflow-hidden">
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

          {/* Timer diperkecil (w-16 h-16) dan margin bawah dikurangi */}
          <div className="mb-4 relative flex items-center justify-center z-10">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" 
                strokeDasharray="176" 
                strokeDashoffset={176 - (176 * wordTimeLeft) / 25} 
                className={`${wordTimeLeft <= 5 ? 'text-red-500' : 'text-blue-500'} transition-all duration-1000 ease-linear`} 
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-xl font-black font-mono ${wordTimeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{wordTimeLeft}</span>
            </div>
          </div>
          
          <span className="text-slate-400 text-xs sm:text-sm font-bold tracking-widest uppercase mb-1 z-10 text-center">
            Sambung Kata Ini
          </span>
          
          {/* Teks Kata Dibuat Dinamis Menyesuaikan Lebar dan Tidak Wrap */}
          <div 
            className="font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] z-10 flex justify-center text-center px-4 leading-tight whitespace-nowrap w-full"
            style={{ fontSize: `clamp(1.5rem, calc(90vw / ${Math.max(currentWord.length, 6)}), 6.5rem)` }}
          >
            <span>{prefix}</span>
            <span className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]">{suffix}</span>
          </div>

          {/* Current Word Owner Info Minimalis */}
          <div className="h-8 mb-3 mt-1 z-10 flex items-center justify-center">
            {currentWordOwner && (
              <div className="flex items-center gap-1.5 bg-slate-900/50 pr-3 pl-1.5 py-1 rounded-full border border-slate-700/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                {currentWordOwner.avatar ? (
                   <img src={currentWordOwner.avatar} alt="" referrerPolicy="no-referrer" className="w-5 h-5 rounded-full object-cover border border-white/10 bg-slate-800" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = DEFAULT_AVATAR; }} />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    {currentWordOwner.nickname.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-[11px] text-slate-400">Terpanjang dari <strong className="text-slate-200">{currentWordOwner.nickname}</strong></span>
              </div>
            )}
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 sm:p-5 w-full max-w-md flex flex-col items-center justify-center text-center shadow-2xl z-10">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              <AlertTriangle className="w-3 h-3 text-yellow-500" /> ATURAN AKTIF
            </span>
            <div className="flex flex-col gap-1 w-full text-left bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
              <span className="text-sm sm:text-base font-bold text-slate-200">
                1. Awali huruf '<span className="text-yellow-400 text-lg uppercase">{suffix}</span>'
              </span>
              {activeRule.id !== "NORMAL" && (
                <span className="text-sm sm:text-base font-bold text-red-400 flex items-center gap-2">
                  2. {activeRule.desc}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* === BOTTOM SECTION === */}
        {showInputForm && (
          <div className="w-full max-w-4xl mx-auto px-4 pb-4 mt-auto animate-in slide-in-from-bottom-5 duration-300 z-20">
            <form onSubmit={handleInputSubmit} className="flex gap-2 relative bg-slate-800/50 backdrop-blur-md p-2 rounded-2xl border border-slate-700/50 shadow-xl">
              <div className="flex-1 relative flex items-center">
                <MessageSquare className="absolute left-3 w-5 h-5 text-slate-500" />
                <input 
                  ref={inputRef}
                  type="text" 
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Ketik 'Nickname: Kata' atau langsung kata..."
                  className="w-full bg-slate-900/80 border border-slate-600 focus:border-blue-500 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-white placeholder:text-slate-500 outline-none transition-all shadow-inner"
                  autoComplete="off"
                />
              </div>
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 rounded-xl font-bold shadow-[0_0_15px_rgba(37,99,235,0.3)] active:scale-95 transition-all text-sm flex items-center justify-center"
              >
                KIRIM
              </button>
            </form>
          </div>
        )}

      </div>
    );
  };

  return (
    <div className="h-screen w-full bg-slate-950 font-sans text-slate-100 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black"></div>
      
      <div className="relative h-full z-10 flex flex-col">
        {view === "MENU" && renderMenu()}
        {view === "PLAYING" && renderPlaying()}
        {view === "GAMEOVER" && renderGameOver()}
      </div>

      <style>{`
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