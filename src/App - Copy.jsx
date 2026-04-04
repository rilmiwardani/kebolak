import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Upload, Trophy, Link as LinkIcon, Unlink, Play, Info, Lock, Star, CheckCircle2, Timer as TimerIcon, Clock, ArrowRight, ArrowLeft, RefreshCw, Users, Crown, Medal, Sparkles, Gamepad2, MessageCircle, BarChart3, Globe, Trash2, Wifi, Volume2, VolumeX } from 'lucide-react';

// --- AUDIO UTILS (SFX GENERATOR & TTS) ---

const AudioController = {
  ctx: null,
  isMuted: false,

  init: () => {
    if (!AudioController.ctx) {
      AudioController.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },

  playTone: (freq, type, duration, vol = 0.1) => {
    if (AudioController.isMuted || !AudioController.ctx) return;
    try {
      const osc = AudioController.ctx.createOscillator();
      const gain = AudioController.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, AudioController.ctx.currentTime);
      gain.gain.setValueAtTime(vol, AudioController.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, AudioController.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(AudioController.ctx.destination);
      osc.start();
      osc.stop(AudioController.ctx.currentTime + duration);
    } catch (e) { console.error("Audio Error", e); }
  },

  playSuccess: () => {
    // Suara "Tring!" koin
    if (!AudioController.ctx) AudioController.init();
    AudioController.playTone(1200, 'sine', 0.1, 0.2);
    setTimeout(() => AudioController.playTone(1800, 'sine', 0.2, 0.2), 100);
  },

  playError: () => {
    // Suara "Buzz!" salah
    if (!AudioController.ctx) AudioController.init();
    AudioController.playTone(150, 'sawtooth', 0.3, 0.2);
  },

  playPop: () => {
    // Suara "Pop" untuk chat masuk/step
    if (!AudioController.ctx) AudioController.init();
    AudioController.playTone(800, 'triangle', 0.05, 0.1);
  },

  playTick: () => {
    // Suara detak jam
    if (!AudioController.ctx) AudioController.init();
    AudioController.playTone(800, 'square', 0.03, 0.05);
  },

  speak: (text, force = false) => {
    if (AudioController.isMuted && !force) return;
    if (!window.speechSynthesis) return;

    // Cancel antrian sebelumnya supaya tidak numpuk jadi "rap god"
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID'; // Bahasa Indonesia
    utterance.rate = 1.1; // Sedikit lebih cepat biar seru
    utterance.pitch = 1.2; // Sedikit cempreng biar cerewet

    // Cari voice ID kalau ada
    const voices = window.speechSynthesis.getVoices();
    const indoVoice = voices.find(v => v.lang.includes('id'));
    if (indoVoice) utterance.voice = indoVoice;

    window.speechSynthesis.speak(utterance);
  }
};

// --- DATA DUMMY BOT ---
const DUMMY_BOTS = [
  { uniqueId: 'bot_01', nickname: 'RajaPantun', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
  { uniqueId: 'bot_02', nickname: 'NetizenSantuy', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
  { uniqueId: 'bot_03', nickname: 'GamerGanteng', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi' },
  { uniqueId: 'bot_04', nickname: 'BukanBot', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chandra' },
  { uniqueId: 'bot_05', nickname: 'RatuTiktok', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dinda' },
  { uniqueId: 'bot_06', nickname: 'PejuangLive', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Erik' },
  { uniqueId: 'bot_07', nickname: 'SukaJajan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fanny' },
];

// --- KOMPONEN UTILITAS ---

const Particle = ({ delay, color = "bg-white/20" }) => (
  <div 
    className={`absolute rounded-full ${color} animate-float`}
    style={{ 
      left: `${Math.random() * 100}%`, 
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 10 + 2}px`,
      height: `${Math.random() * 10 + 2}px`,
      animationDelay: `${delay}s`,
      animationDuration: `${Math.random() * 10 + 10}s`
    }}
  />
);

const CircularTimer = ({ timeLeft, maxTime }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / maxTime) * circumference;
  
  // Color logic
  let colorClass = "stroke-emerald-400";
  if (timeLeft <= 5) colorClass = "stroke-red-500 animate-pulse";
  else if (timeLeft <= 10) colorClass = "stroke-orange-500";
  else if (timeLeft <= 30) colorClass = "stroke-yellow-400";

  return (
    <div className={`relative flex items-center justify-center w-14 h-14`}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-slate-800"
        />
        <circle
          cx="28"
          cy="28"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`${colorClass} transition-all duration-1000 ease-linear`}
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center font-bold text-sm ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
        {timeLeft}
      </div>
    </div>
  );
};

// --- APLIKASI UTAMA ---

const TikTokLiveGame = () => {
  // --- STATE ---
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedIP, setConnectedIP] = useState('...');
  const [kbbiData, setKbbiData] = useState(null);
  const [isMuted, setIsMuted] = useState(false); // State Mute
  
  // Game State
  const [gameState, setGameState] = useState('idle'); // idle, playing, revealing, showing_summary, round_complete
  const [roundNumber, setRoundNumber] = useState(1);
  const [roundHistory, setRoundHistory] = useState([]); 
  
  // Timer State
  const MAX_TIME = 60; 
  const SUMMARY_TIME = 20; // Waktu tunggu 20 detik
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [summaryTimeLeft, setSummaryTimeLeft] = useState(SUMMARY_TIME);

  // Current Turn State
  const [currentWord, setCurrentWord] = useState(null); 
  const [targetWord, setTargetWord] = useState(null);   
  const [targetMeaning, setTargetMeaning] = useState('');
  const [currentType, setCurrentType] = useState('forward'); 
  const [revealedChars, setRevealedChars] = useState([]); 
  
  // Turn Winners State (Multi-Winner)
  const [turnWinners, setTurnWinners] = useState([]); 
  
  // Visual States
  const [isBrokenChain, setIsBrokenChain] = useState(false);
  const [isSimulation, setIsSimulation] = useState(false); 
  const [leaderboardTab, setLeaderboardTab] = useState('round'); 
  const scrollRef = useRef(null); 
  
  // Ref untuk Handler Event (KUNCI PERBAIKAN)
  const eventHandlerRef = useRef(null);

  // Live Data
  const [leaderboard, setLeaderboard] = useState(() => {
    try {
      const savedData = localStorage.getItem('tiktok_game_leaderboard');
      return savedData ? JSON.parse(savedData) : {};
    } catch (e) {
      console.error("Gagal memuat leaderboard:", e);
      return {};
    }
  });

  const [recentChats, setRecentChats] = useState([]); 
  const [eventLog, setEventLog] = useState(""); 

  // Refs
  const fileInputRef = useRef(null);
  const listEndRef = useRef(null); 
  
  // --- INIT AUDIO & WEBSOCKET ---
  useEffect(() => {
    AudioController.init();
    
    const loadVoices = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    const connectWS = () => {
      const wsHost = window.location.hostname || 'localhost';
      const wsUrl = `ws://${wsHost}:62024`;
      
      setConnectedIP(wsHost);

      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        setIsConnected(true);
        addLog(`Terhubung ke ${wsUrl}`);
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (eventHandlerRef.current) {
             eventHandlerRef.current(message);
          }
        } catch (err) {
          console.error("Parse error:", err);
        }
      };

      socket.onclose = () => {
        setIsConnected(false);
        addLog(`Terputus dari ${wsUrl}. Reconnecting...`);
        setTimeout(connectWS, 3000);
      };

      socket.onerror = (err) => {
        console.error("WS Error", err);
        setIsConnected(false);
      };

      setWs(socket);
    };

    connectWS();
    return () => { if (ws) ws.close(); };
  }, []);

  useEffect(() => {
    AudioController.isMuted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    try {
      localStorage.setItem('tiktok_game_leaderboard', JSON.stringify(leaderboard));
    } catch (e) {
      console.error("Gagal menyimpan leaderboard:", e);
    }
  }, [leaderboard]);

  const resetLeaderboardData = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua data skor pemain?")) {
      setLeaderboard({});
      localStorage.removeItem('tiktok_game_leaderboard');
      addLog("Data leaderboard berhasil direset.");
      AudioController.speak("Data direset bos!");
    }
  };

  // --- HANDLERS (LOGIKA GAME) ---
  
  const handleLiveEvent = (payload) => {
    const { event, data } = payload;
    if (event === 'chat') {
      const { uniqueId, nickname, comment, profilePictureUrl } = data;
      // FIX: Gunakan kombinasi Date.now() + Math.random() untuk ID yang lebih unik
      // agar tidak terjadi warning 'Encountered two children with the same key'
      setRecentChats(prev => [{ id: `${Date.now()}-${Math.random()}`, name: nickname, text: comment, avatar: profilePictureUrl }, ...prev].slice(0, 5));
      
      if (gameState === 'playing' && !isBrokenChain) AudioController.playPop();

      if (gameState === 'playing' && targetWord && !isBrokenChain) {
        checkAnswer(comment, { uniqueId, nickname, avatar: profilePictureUrl });
      }
    }
    
    const donationEvents = ['gift', 'saweria', 'sociabuzz', 'trakteer', 'bagibagi'];
    if (donationEvents.includes(event)) {
      triggerPowerUp(data);
    }
  };

  useEffect(() => {
    eventHandlerRef.current = handleLiveEvent;
  });

  // --- BOT SIMULATION ---
  useEffect(() => {
    if (!isSimulation || gameState !== 'playing' || !targetWord || isBrokenChain) return;

    const chatInterval = setInterval(() => {
        if (Math.random() > 0.6) { 
            const bot = DUMMY_BOTS[Math.floor(Math.random() * DUMMY_BOTS.length)];
            const chats = ["Susah banget kak", "Semangat!", "Halo", "Gas", "Keren", "Aduh salah", "Apa ya jawabannya?", "Next next"];
            const text = Math.random() > 0.3 ? chats[Math.floor(Math.random() * chats.length)] : "salah nih";
            if (eventHandlerRef.current) {
                eventHandlerRef.current({ event: 'chat', data: { uniqueId: bot.uniqueId, nickname: bot.nickname, comment: text, profilePictureUrl: bot.avatar } });
            }
        }
    }, 1500);

    const timer = setTimeout(() => {
       if (Math.random() > 0.5) {
          const bot = DUMMY_BOTS[Math.floor(Math.random() * DUMMY_BOTS.length)];
          if (eventHandlerRef.current) {
             eventHandlerRef.current({ event: 'chat', data: { uniqueId: bot.uniqueId, nickname: bot.nickname, comment: targetWord, profilePictureUrl: bot.avatar } });
          }
       }
    }, 5000 + Math.random() * 10000);

    return () => {
        clearInterval(chatInterval);
        clearTimeout(timer);
    };
  }, [isSimulation, gameState, targetWord, isBrokenChain]);

  // --- SCROLL & TRANSITION ---
  useEffect(() => {
    if (listEndRef.current && (gameState === 'playing' || gameState === 'revealing')) {
      setTimeout(() => {
        listEndRef.current.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      }, 100); 
    }
  }, [roundHistory, currentWord, isBrokenChain, gameState]);

  useEffect(() => {
    if (gameState === 'revealing') {
      const timer = setTimeout(() => {
        setGameState('showing_summary');
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  // --- AUTO SCROLL SUMMARY ---
  useEffect(() => {
    let scrollInterval;
    if (gameState === 'showing_summary' && scrollRef.current) {
      const el = scrollRef.current;
      const startTimeout = setTimeout(() => {
        if (!el) return;
        scrollInterval = setInterval(() => {
          if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) {
            clearInterval(scrollInterval);
            setTimeout(proceedToNextStep, 2000);
          } else {
            el.scrollTop += 1;
          }
        }, 30);
      }, 1500); 

      if (el.scrollHeight <= el.clientHeight) {
         setTimeout(proceedToNextStep, 3000); 
         clearTimeout(startTimeout);
      }

      return () => {
        clearTimeout(startTimeout);
        clearInterval(scrollInterval);
      };
    }
  }, [gameState]);

  // --- TIMERS & TTS WARNINGS ---
  useEffect(() => {
    let interval;
    if (gameState === 'playing' && timeLeft > 0 && !isBrokenChain) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
            if (prev === 11) {
                AudioController.playTick();
                AudioController.speak("Sepuluh detik lagi, ayo cepetan!");
            } else if (prev <= 5 && prev > 0) {
                AudioController.playTick();
            }
            return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing' && !isBrokenChain) {
      handleTimeout();
    }
    return () => clearInterval(interval);
  }, [timeLeft, gameState, isBrokenChain]);

  useEffect(() => {
    let interval;
    if (gameState === 'round_complete' && summaryTimeLeft > 0) {
      interval = setInterval(() => {
        setSummaryTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (summaryTimeLeft === 0 && gameState === 'round_complete') {
      nextRound(); 
    }
    return () => clearInterval(interval);
  }, [summaryTimeLeft, gameState]);

  useEffect(() => {
    if (gameState === 'round_complete') {
        if (summaryTimeLeft > 10) {
            setLeaderboardTab('round');
        } else {
            setLeaderboardTab('global');
        }
    }
  }, [summaryTimeLeft, gameState]);

  const handleTimeout = () => {
    setGameState('revealing');
    
    // --- PERBAIKAN: Cek pemenang sebelum komentar gagal ---
    if (turnWinners.length > 0) {
        // Kasus: Ada pemenang (Waktu habis setelah sudden death)
        AudioController.playTone(600, 'sine', 0.1, 0.1); 
        AudioController.speak(`Waktu habis! Mari kita lihat skornya.`);
    } else {
        // Kasus: Tidak ada yang menjawab
        AudioController.playError();
        const failPhrases = [
            "Yah, waktu habis bestie!", 
            "Gak ada yang tau nih?", 
            "Waduh, zonk semua!", 
            "Aduh, sayang sekali waktu habis!"
        ];
        AudioController.speak(failPhrases[Math.floor(Math.random() * failPhrases.length)] + ` Jawabannya adalah ${targetWord}`);
    }
    // -----------------------------------------------------

    const winnerDisplay = turnWinners.length > 0 ? turnWinners[0] : {
      uniqueId: 'system', nickname: 'Tidak Ada', avatar: '', isSystem: true
    };
    
    const solvedItem = {
      start: currentWord,
      end: targetWord,
      type: currentType,
      meaning: targetMeaning,
      solver: winnerDisplay, 
      allWinners: turnWinners
    };
    
    setRoundHistory(prev => [...prev, solvedItem]);
    addLog(`Waktu Habis! Jawaban: ${targetWord}`);
  };

  const proceedToNextStep = () => {
    if (roundHistory.length + 1 >= 10) { 
       setGameState('round_complete');
       setSummaryTimeLeft(SUMMARY_TIME);
       setLeaderboardTab('round'); 
       AudioController.speak("Ronde selesai! Mari kita lihat siapa juaranya.");
    } else {
       nextTurn(targetWord);
    }
  };

  const checkAnswer = (text, user) => {
    if (!text || !targetWord) return;
    const cleanInput = text.trim().toLowerCase();
    const cleanTarget = targetWord.trim().toLowerCase();
    if (cleanInput === cleanTarget) {
      handleValidAnswer(user);
    }
  };

  const handleValidAnswer = (user) => {
    setTurnWinners(prev => {
      if (prev.find(u => u.uniqueId === user.uniqueId)) return prev;
      
      const newWinners = [...prev, user];
      
      if (newWinners.length === 1) {
          AudioController.playSuccess();
          const praisePhrases = [`Mantap ${user.nickname}!`, `Wih, ${user.nickname} pinter banget!`];
          AudioController.speak(praisePhrases[Math.floor(Math.random() * praisePhrases.length)]);
          setTimeLeft(current => Math.min(current, 10));
      } else {
          AudioController.playTone(1500, 'sine', 0.1, 0.1); 
      }

      setLeaderboard(board => {
        const newBoard = { ...board };
        if (!newBoard[user.uniqueId]) {
          newBoard[user.uniqueId] = { 
            name: user.nickname, 
            score: 0, 
            roundScore: 0, 
            avatar: user.avatar 
          };
        }
        newBoard[user.uniqueId].score += 10;
        newBoard[user.uniqueId].roundScore = (newBoard[user.uniqueId].roundScore || 0) + 10;
        return newBoard;
      });

      addLog(`✅ ${user.nickname} benar!`);
      return newWinners;
    });
  };

  const triggerPowerUp = (data) => {
    addLog(`DONASI! Hint Aktif!`);
    AudioController.playSuccess();
    AudioController.speak("Wuih, ada yang sawer! Hint gratis buat kalian!");
    
    if (targetWord) {
      const unrevealedIndices = targetWord.split('').map((_, i) => i).filter(i => !revealedChars.includes(i));
      if (unrevealedIndices.length > 0) {
        const randomIdx = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
        setRevealedChars(prev => [...prev, randomIdx]);
      }
    }
  };

  // --- DATA PROCESSING ---
  const processJson = (json) => {
    const map = {};
    let count = 0;
    Object.keys(json).forEach(key => {
      const parts = key.toLowerCase().split(' ');
      if (parts.length === 2) {
        const wordA = parts[0].replace(/[^a-z]/g, ''); 
        const wordB = parts[1].replace(/[^a-z]/g, ''); 
        let meaningText = "-";
        if (json[key].submakna && Array.isArray(json[key].submakna) && json[key].submakna.length > 0) {
            const rawMeaning = json[key].submakna[0];
            meaningText = typeof rawMeaning === 'string' ? rawMeaning : JSON.stringify(rawMeaning);
        }
        if (!map[wordA]) map[wordA] = [];
        map[wordA].push({ full: key, source: wordA, target: wordB, type: 'forward', meaning: meaningText });
        if (!map[wordB]) map[wordB] = [];
        map[wordB].push({ full: key, source: wordB, target: wordA, type: 'reverse', meaning: meaningText });
        count++;
      }
    });
    return { map, count };
  };

  const loadSimulationData = () => {
    const dummyData = {
      "juru masak": { "submakna": ["Orang yang pekerjaannya memasak"] },
      "masak air": { "submakna": ["Memanaskan air hingga mendidih"] },
      "air mata": { "submakna": ["Cairan yang keluar dari mata saat menangis"] },
      "mata sapi": { "submakna": ["Telur goreng yang kuningnya utuh"] },
      "sapi perah": { "submakna": ["Sapi yang dipelihara untuk diambil susunya"] },
      "perah keringat": { "submakna": ["Bekerja keras"] },
      "keringat dingin": { "submakna": ["Perasaan takut atau cemas"] },
      "dingin hati": { "submakna": ["Tidak menaruh perasaaan; tidak gembira"] },
      "hati kecil": { "submakna": ["Perasaan batin yang sebenarnya"] },
      "kecil hati": { "submakna": ["Tawar hatinya; hilang keberanian"] },
      "hati batu": { "submakna": ["Keras hati; tidak menaruh belas kasihan"] },
      "batu loncatan": { "submakna": ["Sarana untuk maju"] }
    };
    const { map, count } = processJson(dummyData);
    setKbbiData(map);
    setIsSimulation(true); 
    addLog(`Mode Simulasi Aktif.`);
    AudioController.speak("Mode simulasi aktif. Ayo kita coba gamenya!");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target.result);
        const { map, count } = processJson(json);
        setKbbiData(map);
        setIsSimulation(false); 
        addLog(`DB Ready: ${count} frasa.`);
        AudioController.speak("Data berhasil dimuat. Gas main!");
      } catch (err) { addLog("Error JSON."); }
    };
    reader.readAsText(file);
  };

  const startNewGame = () => {
    if (AudioController.ctx && AudioController.ctx.state === 'suspended') {
      AudioController.ctx.resume();
    }
    if (!kbbiData) return;
    setRoundNumber(1);
    AudioController.speak("Halo guys, selamat datang di Kata Berkait! Ayo tebak kata selanjutnya!");
    startRound();
  };

  const startRound = () => {
    setRoundHistory([]);
    setLeaderboard(prev => {
        const newBoard = {...prev};
        Object.keys(newBoard).forEach(key => {
            newBoard[key].roundScore = 0;
        });
        return newBoard;
    });

    const keys = Object.keys(kbbiData);
    const randomStart = keys[Math.floor(Math.random() * keys.length)];
    nextTurn(randomStart, true);
  };

  const nextTurn = (startWordRaw, isFirst = false) => {
    setGameState('playing');
    setTurnWinners([]); 
    
    const startWord = startWordRaw.toLowerCase().replace(/[^a-z]/g, '');
    let allCandidates = kbbiData[startWord] || [];

    // --- LOGIKA ANTI-LOOPING ---
    const usedWords = new Set();
    usedWords.add(startWord);
    roundHistory.forEach(item => {
      usedWords.add(item.start);
      usedWords.add(item.end);
    });

    // Filter kandidat yang targetnya belum pernah muncul
    const validCandidates = allCandidates.filter(c => !usedWords.has(c.target));
    
    // Jika ada kandidat valid, gunakan itu. Jika tidak, anggap buntu (untuk memutus loop)
    const finalCandidates = validCandidates.length > 0 ? validCandidates : [];

    if (finalCandidates.length === 0) {
      addLog(`Buntu/Looping di "${startWord}". Ganti kata!`);
      setIsBrokenChain(true);
      AudioController.playError();
      AudioController.speak("Yah, kata ini bikin looping atau buntu! Mencari kata baru...");
      
      setTimeout(() => {
        const keys = Object.keys(kbbiData);
        const randomStart = keys[Math.floor(Math.random() * keys.length)];
        const newCandidates = kbbiData[randomStart];
        
        // Safety check jika randomStart juga buntu (sangat jarang terjadi jika DB besar)
        if (newCandidates && newCandidates.length > 0) {
            const newSelected = newCandidates[Math.floor(Math.random() * newCandidates.length)];
            setIsBrokenChain(false);
            setCurrentWord(randomStart);
            setTargetWord(newSelected.target);
            setTargetMeaning(newSelected.meaning);
            setCurrentType(newSelected.type);
            setRevealedChars([]);
            setTimeLeft(MAX_TIME);
            AudioController.speak(`Kata baru adalah: ${randomStart}. Ayo lanjutannya apa?`);
        } else {
            // Fallback extreme case (coba lagi)
            nextTurn(randomStart, true); 
        }
      }, 3000);
      return; 
    } 

    setCurrentWord(startWord);
    const selected = finalCandidates[Math.floor(Math.random() * finalCandidates.length)];
    setTargetWord(selected.target);
    setTargetMeaning(selected.meaning);
    setCurrentType(selected.type); 
    setRevealedChars([]);
    setTimeLeft(MAX_TIME); 

    if (!isFirst) {
        const introPhrases = ["Lanjutannya adalah...", "Kata berikutnya...", "Gas, apa nih lanjutannya..."];
        const phrase = introPhrases[Math.floor(Math.random() * introPhrases.length)];
        setTimeout(() => AudioController.speak(`${phrase} ${startWord}`), 500);
    }
  };

  const nextRound = () => {
    setRoundNumber(prev => prev + 1);
    startRound();
  };

  const addLog = (msg) => setEventLog(prev => `> ${msg}\n${prev}`);

  const sortedLeaderboard = useMemo(() => {
    return Object.values(leaderboard).sort((a, b) => b.score - a.score);
  }, [leaderboard]);

  const roundLeaderboard = useMemo(() => {
    return Object.values(leaderboard)
      .filter(u => u.roundScore > 0) 
      .sort((a, b) => b.roundScore - a.roundScore);
  }, [leaderboard]);

  const displayLeaderboard = leaderboardTab === 'global' ? sortedLeaderboard : roundLeaderboard;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-white overflow-hidden">
      
      {/* PHONE FRAME */}
      <div className="relative w-full max-w-md aspect-[9/19] bg-slate-900 rounded-[2.5rem] shadow-2xl border-8 border-slate-800 overflow-hidden flex flex-col z-10">
        
        {/* --- DYNAMIC BACKGROUND --- */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1e1b4b_0%,_#020617_100%)]">
           <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
           {[...Array(15)].map((_, i) => <Particle key={i} delay={i * 0.5} />)}
           <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-indigo-600/20 to-transparent pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-purple-900/40 to-transparent pointer-events-none" />
        </div>

        {/* --- HEADER --- */}
        <div className="flex flex-col z-20">
          <div className="p-4 flex justify-between items-center bg-black/10 backdrop-blur-md border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-red-500'}`} />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase leading-none">
                  {isConnected ? 'LIVE' : 'OFFLINE'}
                </span>
                <span className="text-[8px] text-slate-500 font-mono leading-none mt-0.5 max-w-[80px] truncate">
                   {connectedIP}:62024
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
                 {/* Mute Button */}
                <button 
                  onClick={() => setIsMuted(!isMuted)} 
                  className={`p-1.5 rounded-full border border-white/10 ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white'}`}
                >
                    {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                </button>

                <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10 flex items-center gap-2">
                  <Trophy size={12} className="text-yellow-400" />
                  <span className="text-xs font-bold">Ronde {roundNumber}</span>
                </div>
            </div>
          </div>

          {/* --- TOP 3 LEADERBOARD --- */}
          {gameState !== 'round_complete' && (
            <div className="bg-black/20 backdrop-blur-sm border-b border-white/5 py-2 px-4 animate-slide-up">
               <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                 <div className="flex-shrink-0 bg-yellow-500/20 px-2 py-1 rounded border border-yellow-500/30 flex items-center gap-1">
                    <Trophy size={10} className="text-yellow-400" />
                    <span className="text-[9px] font-bold text-yellow-400 uppercase">Top 3</span>
                 </div>
                 {sortedLeaderboard.slice(0, 3).map((user) => (
                   <div key={user.uniqueId} className="flex-shrink-0 flex items-center gap-2 bg-slate-800/60 rounded-full pl-1 pr-3 py-0.5 border border-slate-700/50">
                     <img src={user.avatar} className="w-4 h-4 rounded-full bg-slate-700" alt=""/>
                     <div className="flex flex-col leading-none">
                       <span className="text-[8px] font-bold text-slate-200 max-w-[40px] truncate">{user.name}</span>
                       <span className="text-[8px] text-yellow-500 font-mono">{user.score}</span>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>

        {/* --- MAIN GAME CONTENT --- */}
        <div className="flex-1 relative z-10 flex flex-col overflow-hidden">
          
          {/* STATE: UPLOAD */}
          {!kbbiData && (
             <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 text-center animate-fade-in">
               <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                 <Upload className="w-10 h-10 text-white" />
               </div>
               <div>
                 <h2 className="text-2xl font-bold text-white mb-2">Setup Game</h2>
                 <p className="text-sm text-slate-400">Upload file JSON KBBI untuk memulai.</p>
               </div>
               <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
               <button onClick={() => fileInputRef.current?.click()} className="px-8 py-3 bg-white text-indigo-900 rounded-xl font-bold shadow-lg active:scale-95 transition-all">
                 Pilih File JSON
               </button>

               <button onClick={loadSimulationData} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-900/30 transition-all active:scale-95 animate-bounce-in mt-4 border border-indigo-400/50">
                 <Gamepad2 size={20} />
                 Masuk Simulasi (Demo)
               </button>
             </div>
          )}

          {/* STATE: IDLE / START */}
          {kbbiData && gameState === 'idle' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8 text-center animate-fade-in">
               <div className="relative">
                 <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 animate-pulse"></div>
                 <LinkIcon className="w-24 h-24 text-yellow-400 relative z-10" />
               </div>
               <h1 className="text-5xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                 Kata<br/><span className="text-yellow-400">Berkait</span>
               </h1>
               <div className="bg-slate-800/60 p-4 rounded-xl backdrop-blur border border-white/10 w-full">
                 <ul className="text-left text-sm space-y-2 text-slate-300">
                   <li className="flex gap-2"><CheckCircle2 size={16} className="text-green-400" /> Jawab kata selanjutnya</li>
                   <li className="flex gap-2"><Users size={16} className="text-blue-400" /> Multi-Winner (Semua bisa menang)</li>
                   <li className="flex gap-2"><Clock size={16} className="text-red-400" /> 10 Detik terakhir = Sudden Death!</li>
                 </ul>
                 {isSimulation && (
                    <div className="mt-3 bg-indigo-500/20 text-indigo-300 text-xs py-1 px-2 rounded border border-indigo-500/30 text-center animate-pulse">
                        Mode Simulasi Aktif
                    </div>
                 )}
               </div>
               
               <div className="flex gap-2 w-full">
                 <button onClick={startNewGame} className="flex-1 py-4 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl font-black text-xl shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2">
                   <Play size={24} fill="black" /> MULAI
                 </button>
                 
                 <button 
                   onClick={resetLeaderboardData}
                   className="px-4 py-4 bg-red-900/50 hover:bg-red-900/80 text-red-400 rounded-xl font-bold border border-red-800 transition-all"
                   title="Reset Data Leaderboard"
                 >
                   <Trash2 size={24} />
                 </button>
               </div>
            </div>
          )}

          {/* STATE: PLAYING / REVEALING / SUMMARY */}
          {kbbiData && (gameState === 'playing' || gameState === 'revealing' || gameState === 'showing_summary') && (
            <div className="flex-1 flex flex-col w-full h-full relative">
              
              {/* Progress Bar */}
              <div className="h-1 bg-slate-800 w-full">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${(roundHistory.length / 10) * 100}%` }}
                />
              </div>

              {/* Game Area */}
              <div className="flex-1 flex flex-col justify-center items-stretch p-4 pb-24 space-y-0 relative z-0">
                
                {/* Previous Chain Item (Only Last One) */}
                {roundHistory.length > 0 && !isBrokenChain && roundHistory.slice(-1).map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center animate-slide-up opacity-80 scale-90 mb-1">
                    <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-white/5 shadow-sm">
                      <span className="text-indigo-300 font-bold uppercase">{item.start}</span>
                      {item.type === 'reverse' ? (
                        <ArrowLeft size={14} className="text-orange-500" />
                      ) : (
                        <ArrowRight size={14} className="text-slate-500" />
                      )}
                      <span className="text-green-400 font-bold uppercase">{item.end}</span>
                    </div>
                    <div className="h-6 w-0.5 bg-gradient-to-b from-slate-700 to-indigo-500/50 my-1"></div>
                  </div>
                ))}
                
                {/* --- MAIN CARD --- */}
                {isBrokenChain ? (
                  // VISUAL RANTAI PUTUS
                  <div ref={listEndRef} className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-8 border border-red-500/50 shadow-[0_0_40px_rgba(220,38,38,0.3)] animate-bounce-in flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-red-900/20 animate-pulse"></div>
                    <div className="bg-red-500/20 p-6 rounded-full mb-4 relative z-10">
                      <Unlink size={48} className="text-red-500" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase mb-2 relative z-10">Rantai Putus!</h2>
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 relative z-10">
                      <RefreshCw size={12} className="animate-spin" />
                      Mencari kata baru...
                    </div>
                  </div>
                ) : (
                  // ACTIVE WORD CARD
                  <div ref={listEndRef} className={`bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border shadow-[0_0_30px_rgba(79,70,229,0.15)] animate-pop-in relative overflow-hidden transition-all duration-300 ${gameState === 'showing_summary' ? 'border-yellow-500/50 shadow-yellow-500/20' : timeLeft <= 10 && gameState === 'playing' ? 'border-red-500/50 shadow-red-900/20' : currentType === 'reverse' ? 'border-orange-500/50 shadow-orange-500/20' : 'border-indigo-500/30'}`}>
                    
                    {/* Border Indicator */}
                    <div className={`absolute top-0 left-0 w-1 h-full transition-colors duration-500 ${gameState === 'showing_summary' ? 'bg-yellow-500' : timeLeft <= 10 && gameState === 'playing' ? 'bg-red-500' : currentType === 'reverse' ? 'bg-orange-500' : 'bg-indigo-500'}`}></div>
                    
                    {/* Top Right */}
                    <div className="absolute top-3 right-3 flex gap-2">
                       {turnWinners.length > 0 && gameState === 'playing' && (
                          <div className="flex items-center gap-1 text-xs font-bold text-white bg-green-500 px-2 py-1 rounded animate-pulse">
                             <Users size={12} /> {turnWinners.length}
                          </div>
                       )}
                       <div className="text-xs font-bold text-slate-500 bg-black/30 px-2 py-1 rounded">
                         Step {roundHistory.length + 1}/10
                       </div>
                    </div>

                    {/* Word Info */}
                    <div className="text-xs uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-2">
                      <LinkIcon size={12} /> Kata Penghubung
                    </div>
                    <div className="text-3xl font-black text-white uppercase tracking-tight mb-4 drop-shadow-md flex justify-between items-center">
                      {currentWord}
                      {gameState === 'playing' && (
                         <div className="ml-2">
                            <CircularTimer timeLeft={timeLeft} maxTime={MAX_TIME} />
                         </div>
                      )}
                    </div>

                    {/* Arrow Indicator */}
                    <div className="flex justify-center my-2 relative h-8">
                       {currentType === 'reverse' ? (
                          <div className="absolute top-0 flex flex-col items-center">
                             <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider mb-1">Arah Mundur</span>
                             <ArrowLeft size={24} className="text-orange-500" strokeWidth={3} />
                          </div>
                       ) : (
                          <div className="absolute top-0">
                             <ArrowRight size={24} className="text-indigo-400 rotate-90" strokeWidth={3} />
                          </div>
                       )}
                    </div>

                    {/* CONTENT AREA */}
                    {gameState === 'showing_summary' ? (
                        <div className="mt-4 animate-fade-in">
                           <div className="bg-black/30 rounded-xl overflow-hidden border border-white/5 relative">
                              <div className="px-3 py-2 bg-white/5 border-b border-white/5 flex justify-between items-center">
                                 <span className="text-xs font-bold text-yellow-400 flex items-center gap-1"><Crown size={12}/> Pemenang ({turnWinners.length})</span>
                              </div>
                              <div ref={scrollRef} className="max-h-[180px] overflow-y-auto no-scrollbar relative p-2 space-y-1">
                                 {turnWinners.length === 0 ? (
                                    <div className="text-center text-xs text-slate-500 py-4 italic">Tidak ada yang menjawab benar.</div>
                                 ) : (
                                    turnWinners.map((winner, idx) => (
                                       <div key={idx} className="flex items-center gap-2 bg-slate-800/50 p-1.5 rounded border border-white/5">
                                          <div className="w-5 h-5 rounded-full bg-slate-700 overflow-hidden flex-shrink-0">
                                             <img src={winner.avatar} alt="" className="w-full h-full object-cover"/>
                                          </div>
                                          <div className="text-xs text-white font-bold truncate flex-1">{winner.nickname}</div>
                                          <div className="text-[10px] text-yellow-500 font-mono">+10</div>
                                       </div>
                                    ))
                                 )}
                              </div>
                              {turnWinners.length > 6 && (
                                 <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                              )}
                           </div>
                           <div className="text-center mt-3 text-[10px] text-slate-500 animate-pulse">
                              Lanjut ke soal berikutnya...
                           </div>
                        </div>
                    ) : (
                        <>
                           <div className={`text-xs uppercase tracking-widest mb-2 font-bold transition-colors duration-300 mt-6 ${currentType === 'reverse' ? 'text-orange-300' : 'text-indigo-300'}`}>
                             {gameState === 'revealing' 
                               ? (turnWinners.length > 0 ? 'JAWABAN TEPAT!' : 'WAKTU HABIS!') 
                               : (currentType === 'reverse' ? 'Tebak Kata Sebelumnya' : 'Tebak Lanjutannya')}
                           </div>

                           <div className="flex flex-wrap gap-2 mb-4">
                             {targetWord && targetWord.split('').map((char, idx) => {
                               const isRevealed = revealedChars.includes(idx);
                               let boxClass = 'bg-slate-900/50 text-transparent border-slate-700'; 
                               
                               if (gameState === 'revealing') {
                                  if (turnWinners.length > 0) {
                                     boxClass = 'bg-emerald-500 text-white border-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.4)] transform scale-105';
                                  } else {
                                     boxClass = 'bg-red-500 text-white border-red-600 opacity-80';
                                  }
                               } else if (isRevealed) {
                                  boxClass = 'bg-white text-slate-900 border-indigo-500';
                               }

                               return (
                                 <div key={idx} className={`
                                   w-8 h-10 rounded border-b-4 flex items-center justify-center text-xl font-bold transition-all duration-300
                                   ${boxClass}
                                 `}>
                                   {char.toUpperCase()}
                                 </div>
                               );
                             })}
                           </div>

                           <div className="bg-black/20 rounded p-3 border border-white/5 flex gap-3 items-start">
                             <Info className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                             <p className="text-xs text-slate-300 italic leading-relaxed">
                               "{targetMeaning}"
                             </p>
                           </div>
                        </>
                    )}

                  </div>
                )}
                
                {/* Future Locked Slots */}
                <div className="flex justify-center mt-4 gap-1 opacity-20">
                    {[...Array(Math.max(0, 9 - roundHistory.length))].map((_, i) => (
                       <div key={i} className="w-2 h-2 rounded-full bg-slate-500"></div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* STATE: ROUND COMPLETE / LEADERBOARD SCREEN */}
          {gameState === 'round_complete' && (
            <div className="flex-1 flex flex-col items-center p-4 relative z-20 overflow-hidden">
               {/* Background Overlay */}
               <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-0"></div>
               
               {/* Content Container */}
               <div className="relative z-10 w-full h-full flex flex-col animate-fade-in">
                  
                  {/* Title & Tabs */}
                  <div className="text-center mb-4">
                     <h2 className="text-xl font-black text-white uppercase mb-2">
                        Papan Peringkat
                     </h2>
                     <div className="flex justify-center gap-2 p-1 bg-slate-800 rounded-lg mx-auto w-fit">
                        <button 
                           onClick={() => setLeaderboardTab('global')}
                           className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${leaderboardTab === 'global' ? 'bg-indigo-600 text-white shadow ring-2 ring-indigo-400' : 'text-slate-400 hover:text-white opacity-50'}`}
                        >
                           <Globe size={12} className="inline mr-1"/> Top Global
                        </button>
                        <button 
                           onClick={() => setLeaderboardTab('round')}
                           className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${leaderboardTab === 'round' ? 'bg-emerald-600 text-white shadow ring-2 ring-emerald-400' : 'text-slate-400 hover:text-white opacity-50'}`}
                        >
                           <BarChart3 size={12} className="inline mr-1"/> Ronde Ini
                        </button>
                     </div>
                  </div>

                  {/* --- PODIUM JUARA 1 (Based on Active Tab) --- */}
                  {displayLeaderboard.length > 0 ? (
                     <div className="flex justify-center mb-6">
                        <div className="relative flex flex-col items-center">
                           {/* Crown Animation */}
                           <div className="absolute -top-8 animate-bounce">
                              <Crown size={40} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" fill="#fbbf24" />
                           </div>
                           
                           {/* Avatar Frame */}
                           <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-b from-yellow-300 to-yellow-600 shadow-[0_0_30px_rgba(234,179,8,0.6)] z-10">
                              <img 
                                 src={displayLeaderboard[0].avatar} 
                                 className="w-full h-full rounded-full object-cover border-4 border-slate-900" 
                                 alt="Winner"
                              />
                              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-slate-900 font-black text-xs px-3 py-1 rounded-full border border-yellow-200 shadow-lg">
                                 #1
                              </div>
                           </div>

                           {/* Name & Score */}
                           <div className="mt-4 text-center">
                              <div className="text-xl font-black text-white">{displayLeaderboard[0].name}</div>
                              <div className="text-sm font-mono text-yellow-400 font-bold bg-slate-800/80 px-3 py-1 rounded-full mt-1 border border-yellow-500/30">
                                 {leaderboardTab === 'global' ? displayLeaderboard[0].score : displayLeaderboard[0].roundScore} PTS
                              </div>
                           </div>
                           
                           {/* Sparkles */}
                           <Sparkles className="absolute -right-8 top-0 text-yellow-200 animate-pulse" size={20} />
                           <Sparkles className="absolute -left-8 bottom-10 text-yellow-200 animate-pulse delay-75" size={16} />
                        </div>
                     </div>
                  ) : (
                     <div className="flex-1 flex items-center justify-center text-slate-500 text-sm italic">
                        Belum ada data skor.
                     </div>
                  )}

                  {/* --- LIST TOP 10 (Scrollable) --- */}
                  <div className="flex-1 bg-slate-800/50 rounded-t-2xl border-t border-white/10 p-4 overflow-y-auto no-scrollbar mask-image-gradient-top">
                     <div className="space-y-2">
                        {displayLeaderboard.slice(1, 10).map((user) => (
                           <div key={user.uniqueId} className="flex items-center gap-3 bg-slate-900/80 p-2 rounded-xl border border-white/5 transform transition-all hover:scale-[1.02]">
                              <div className="w-8 h-8 flex items-center justify-center font-bold text-slate-500 bg-slate-800 rounded-lg text-xs">
                                 #{displayLeaderboard.indexOf(user) + 2}
                              </div>
                              <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-slate-600">
                                 <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <div className="text-sm font-bold text-white truncate">{user.name}</div>
                              </div>
                              <div className="text-xs font-mono font-bold text-indigo-400">
                                 {leaderboardTab === 'global' ? user.score : user.roundScore}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* --- AUTO START FOOTER --- */}
                  <div className="p-4 bg-slate-900/90 border-t border-white/5 backdrop-blur">
                     <div className="flex flex-col items-center gap-2">
                        <div className="text-xs text-slate-400 uppercase tracking-widest animate-pulse">
                           Ronde Berikutnya Dalam
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                           <div 
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000 ease-linear"
                              style={{ width: `${(summaryTimeLeft / SUMMARY_TIME) * 100}%` }}
                           />
                        </div>
                        <div className="text-2xl font-black text-white font-mono">
                           00:{summaryTimeLeft < 10 ? `0${summaryTimeLeft}` : summaryTimeLeft}
                        </div>
                        <button 
                           onClick={nextRound}
                           className="text-[10px] text-slate-500 hover:text-white underline mt-1"
                        >
                           Lewati & Mulai Sekarang
                        </button>
                     </div>
                  </div>

               </div>
            </div>
          )}

        </div>

        {/* --- FOOTER (Chat Only) --- */}
        {gameState !== 'round_complete' && (
           <div className="bg-black/40 backdrop-blur-md border-t border-white/5 z-20 relative min-h-[80px]">
             <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none overflow-hidden p-4 mask-image-gradient">
               {recentChats.map((chat) => (
                 <div key={chat.id} className="bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full mb-2 w-fit max-w-[80%] flex items-center gap-2 animate-slide-right shadow-lg border border-white/5">
                   <img src={chat.avatar} className="w-5 h-5 rounded-full" alt=""/>
                   <span className="text-[10px] font-bold text-yellow-400">{chat.name}</span>
                   <span className="text-[10px] truncate">{chat.text}</span>
                 </div>
               ))}
             </div>
           </div>
        )}

      </div>

      {/* --- CSS UTILS (Inject Styles) --- */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          50% { transform: translate(10px, -20px); opacity: 0.5; }
        }
        .animate-float { animation: float 10s infinite ease-in-out; }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }

        @keyframes slide-right {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-right { animation: slide-right 0.3s ease-out; }

        @keyframes pop-in {
          0% { transform: scale(0.9); opacity: 0; }
          60% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in { animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }

        @keyframes bounce-in {
          0% { transform: translate(-50%, -50%) scale(0); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
        .animate-bounce-in { animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        
        @keyframes fade-in {
           from { opacity: 0; } to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }

        .mask-image-gradient { mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent); }
        .mask-image-gradient-top { mask-image: linear-gradient(to bottom, transparent, black 10%); }
      `}</style>

    </div>
  );
};

export default TikTokLiveGame;