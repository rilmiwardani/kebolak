import React, { useState, useEffect, useRef } from 'react';
import { Users, Clock, Settings, Trophy, Star, Plus, Minus, X, Gamepad2, FileJson, Skull, Bot, User, Keyboard, Send, Globe, Maximize, Minimize, Delete, Volume2, VolumeX, Medal, TrendingUp, AlertTriangle, MapPin, Music } from 'lucide-react';

// ... (DATA DICTIONARY & CITIES TETAP SAMA SEPERTI SEBELUMNYA)
// --- FALLBACK DICTIONARY (ENGLISH) ---
const FALLBACK_DICTIONARY_EN = new Set([
  "apple", "ant", "arrow", "axe", "area", "art", "arm", "air", "act", "age", "aim", "aid",
  "ball", "bat", "bear", "bed", "bee", "bell", "bird", "blue", "boat", "book", "box", "boy", "bread", "bus", "baby",
  "cat", "car", "cup", "cow", "coat", "cake", "city", "cloud", "class", "chair", "chicken", "child", "clock", "cold",
  "dog", "day", "door", "desk", "duck", "doll", "dress", "dark", "date", "dance", "dream", "drink", "drive", "dust",
  "egg", "eye", "ear", "end", "east", "earth", "event", "exam", "edge", "exit", "energy", "engine", "eagle", "elephant", "eel", "eerie",
  "fish", "fan", "farm", "fat", "fire", "fly", "food", "foot", "fox", "frog", "fun", "face", "flag", "flower", "forest",
  "goat", "gold", "girl", "game", "glass", "grass", "green", "gun", "gift", "gate", "group", "guitar", "ghost", "glove",
  "hat", "hen", "hot", "house", "hill", "hand", "head", "home", "hair", "heart", "horse", "hour", "happy", "hero",
  "ice", "ink", "iron", "idea", "island", "image", "item", "insect", "inside", "issue", "input", "index", "icon", "ion", "iota",
  "jam", "jar", "jet", "job", "joy", "juice", "joke", "jump", "jacket", "jeep", "jungle", "jewel", "judge", "joint",
  "key", "king", "kite", "knee", "knife", "knot", "kick", "kid", "kitchen", "keyboard",
  "lamp", "leg", "lip", "lock", "log", "love", "low", "light", "lake", "leaf", "life", "line", "lion", "list", "lemon",
  "man", "map", "mat", "moon", "milk", "mouse", "mouth", "money", "music", "mother", "monkey", "market", "metal", "magic",
  "net", "nut", "nose", "neck", "name", "night", "north", "nurse", "nest", "news", "noise", "note", "number", "nature",
  "owl", "oil", "orange", "ocean", "office", "onion", "open", "order", "oven", "owner", "object", "opera", "orbit", "out", "oops", "ooze", "outdoor",
  "pen", "pig", "pin", "pot", "pan", "park", "part", "past", "path", "pay", "peace", "people", "pie", "picture", "paper",
  "queen", "quiz", "quick", "quiet", "queue", "quest", "quality", "quote", "quarter",
  "rat", "red", "run", "rain", "rice", "road", "rock", "roof", "room", "rope", "rose", "ring", "river", "radio", "rabbit",
  "sun", "sea", "sky", "son", "star", "ship", "shoe", "shop", "snow", "sock", "song", "soup", "sand", "school", "sheep", "sister",
  "top", "toy", "tree", "tea", "tie", "toe", "time", "table", "tail", "tank", "tape", "taxi", "team", "tent", "test", "tiger",
  "umbrella", "uncle", "unit", "use", "user", "uniform", "union", "update", "urban", "urge", "upset", "under",
  "van", "vase", "vest", "view", "voice", "village", "video", "value", "virus", "visit",
  "wall", "way", "web", "well", "wind", "wolf", "wood", "water", "watch", "week", "white", "window", "woman", "world",
  "xray", "xenon", "xerox",
  "yak", "yam", "year", "yellow", "yes", "you", "young", "yard", "yacht", "yogurt", "youth",
  "zebra", "zero", "zoo", "zone", "zinc", "zipper", "zoom"
]);

// --- FALLBACK DICTIONARY (INDONESIA - Mockup) ---
const FALLBACK_DICTIONARY_ID_DATA = {
  "makan": { "nama": "ma.kan" },
  "minum": { "nama": "mi.num" },
  "lari": { "nama": "la.ri" },
  "jalan": { "nama": "ja.lan" },
  "hutan": { "nama": "hu.tan" },
  "langit": { "nama": "la.ngit" },
  "tanah": { "nama": "ta.nah" },
  "api": { "nama": "a.pi" },
  "air": { "nama": "a.ir" },
  "udara": { "nama": "u.da.ra" },
  "eretan": { "nama": "e.ret.an" },
  "tanam": { "nama": "ta.nam" },
  "nama": { "nama": "na.ma" },
  "mana": { "nama": "ma.na" },
  "nanas": { "nama": "na.nas" },
  "nasib": { "nama": "na.sib" },
  "ibu": { "nama": "i.bu" },
  "budi": { "nama": "bu.di" },
  "ikan": { "nama": "i.kan" },
  "kancil": { "nama": "kan.cil" }
};

// --- FALLBACK CITIES (Mockup) ---
const FALLBACK_CITIES = [
  { name: "Tokyo", region: "Japan" },
  { name: "Jakarta", region: "Indonesia" },
  { name: "New York", region: "USA" },
  { name: "London", region: "UK" },
  { name: "Paris", region: "France" },
  { name: "Berlin", region: "Germany" },
  { name: "Moscow", region: "Russia" },
  { name: "Beijing", region: "China" },
  { name: "Sydney", region: "Australia" },
  { name: "Cairo", region: "Egypt" },
  { name: "Bukwo", region: "Uganda" },
  { name: "Bula", region: "Philippines" },
  { name: "Bula Atumba", region: "Angola" },
  { name: "Bulacan", region: "Philippines" },
  { name: "Nairobi", region: "Kenya" },
  { name: "Istanbul", region: "Turkey" },
  { name: "Lima", region: "Peru" },
  { name: "Amsterdam", region: "Netherlands" },
  { name: "Madrid", region: "Spain" },
  { name: "Dubai", region: "UAE" }
];

// --- UTILS ---
const getRandomColor = () => {
  const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getAvatarUrl = (id) => `https://api.dicebear.com/7.x/adventurer/svg?seed=${id}`;

// Normalization Helper to handle "Zeydābād" -> "zeydabad"
const normalizeWord = (word) => {
  if (typeof word !== 'string') return '';
  return word
    .normalize("NFD") 
    .replace(/[\u0300-\u036f]/g, "") 
    .toLowerCase()
    .replace(/[^a-z]/g, ""); 
};

// Helper: English Syllable Logic (Modified for Game Fun)
const getEnglishSyllableSuffix = (word) => {
    if (!word) return '';
    const w = word.toLowerCase();
    const vowelRegex = /[aeiouy]+/gi;
    const matches = [...w.matchAll(vowelRegex)];
    const isLeEnding = /[^aeiouy]le$/.test(w);
    let relevantMatches = matches;

    if (w.endsWith('e') && !isLeEnding && matches.length > 1) {
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
            const data = localStorage.getItem('word_chain_stats');
            const stats = data ? JSON.parse(data) : {};
            return stats[uniqueId] || { wins: 0, games: 0, badges: [] };
        } catch (e) {
            console.error("Stats Load Error", e);
            return { wins: 0, games: 0, badges: [] };
        }
    },
    update: (uniqueId, isWin) => {
        try {
            const data = localStorage.getItem('word_chain_stats');
            const allStats = data ? JSON.parse(data) : {};
            const playerStats = allStats[uniqueId] || { wins: 0, games: 0, badges: [] };

            playerStats.games += 1;
            if (isWin) playerStats.wins += 1;

            const newBadges = new Set(playerStats.badges);
            if (playerStats.games === 1) newBadges.add('👶'); 
            
            if (playerStats.wins >= 1) {
                newBadges.add('🥇'); 
                newBadges.delete('👶'); 
            }

            if (playerStats.wins >= 3) newBadges.add('🔥');   
            if (playerStats.games >= 5) newBadges.add('💀');  
            if (playerStats.wins >= 10) newBadges.add('👑');  

            playerStats.badges = Array.from(newBadges);
            allStats[uniqueId] = playerStats;
            
            localStorage.setItem('word_chain_stats', JSON.stringify(allStats));
            return playerStats;
        } catch (e) {
            console.error("Stats Save Error", e);
            return { wins: 0, games: 0, badges: [] };
        }
    }
};

// --- SOUND MANAGER (Web Audio API) ---
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
        if(ctx.state === 'suspended') ctx.resume();

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
        switch(effect) {
            case 'join':
                SoundManager.playTone(600, 'sine', 0.1, 0.1);
                setTimeout(() => SoundManager.playTone(800, 'sine', 0.1, 0.1), 100);
                break;
            case 'correct':
                SoundManager.playTone(523.25, 'triangle', 0.1, 0.1); 
                setTimeout(() => SoundManager.playTone(659.25, 'triangle', 0.1, 0.1), 100); 
                setTimeout(() => SoundManager.playTone(783.99, 'triangle', 0.3, 0.1), 200); 
                break;
            case 'wrong':
                SoundManager.playTone(150, 'sawtooth', 0.3, 0.1);
                setTimeout(() => SoundManager.playTone(100, 'sawtooth', 0.3, 0.1), 150);
                break;
            case 'eliminate':
                SoundManager.playTone(400, 'sawtooth', 0.5, 0.1, 100);
                break;
            case 'tick':
                SoundManager.playTone(800, 'square', 0.05, 0.05);
                break;
            case 'start':
                SoundManager.playTone(440, 'sine', 0.1, 0.1);
                setTimeout(() => SoundManager.playTone(880, 'sine', 0.4, 0.1), 200);
                break;
            case 'win':
                [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50].forEach((freq, i) => {
                    setTimeout(() => SoundManager.playTone(freq, 'square', 0.2, 0.1), i * 150);
                });
                break;
            default: break;
        }
    }
};

export default function WordChainGame() {
  // Game State
  const [players, setPlayers] = useState([]); 
  const [gameState, setGameState] = useState('WAITING'); 
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [usedWords, setUsedWords] = useState(new Set());
  const [gameMode, setGameMode] = useState('LAST_LETTER'); 
  const [language, setLanguage] = useState('EN'); 
  
  // Table Feedback State
  const [tableStatus, setTableStatus] = useState('idle'); 
  const tableStatusTimeout = useRef(null);

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
  const [manualInput, setManualInput] = useState('');
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [dictLoadedInfo, setDictLoadedInfo] = useState('Default (EN)');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Refs
  const timerRef = useRef(null);
  const wsRef = useRef(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null); 
  const fallbackToLocalhostRef = useRef(false); 
  
  // Refs for State Access
  const playersRef = useRef(players);
  const turnIndexRef = useRef(currentTurnIndex);
  const turnDurationRef = useRef(turnDuration);
  const chatHandlerRef = useRef(null); 
  const usedWordsRef = useRef(usedWords); 
  const syllableMapRef = useRef(syllableMap);
  const isMutedRef = useRef(isMuted);
  const cityMetadataRef = useRef(cityMetadata); 

  // Sync refs
  useEffect(() => { playersRef.current = players; }, [players]);
  useEffect(() => { turnIndexRef.current = currentTurnIndex; }, [currentTurnIndex]);
  useEffect(() => { turnDurationRef.current = turnDuration; }, [turnDuration]);
  useEffect(() => { syllableMapRef.current = syllableMap; }, [syllableMap]);
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);
  useEffect(() => { cityMetadataRef.current = cityMetadata; }, [cityMetadata]);

  const isHostJoined = players.some(p => p.uniqueId === 'host_player');

  // --- AUDIO HELPER ---
  const playSound = (effect) => {
      if (!isMutedRef.current) {
          SoundManager.play(effect);
      }
  };

  // --- LOGGING ---
  const addLog = (user, message) => {
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setLogs(prev => [{ user, message, id: uniqueId }, ...prev].slice(0, 5));
  };

  // --- TRIGGER TABLE EFFECT ---
  const triggerTableEffect = (status) => {
      if (tableStatusTimeout.current) clearTimeout(tableStatusTimeout.current);
      setTableStatus(status);
      tableStatusTimeout.current = setTimeout(() => {
          setTableStatus('idle');
      }, 500); 
  };

  // --- HELPERS ---
  function getSuffixOrRule(word) {
      if (gameMode === 'CITIES') return word.slice(-1); 

      // STRICT RHYME Logic (Always 2 letters)
      if (gameMode === 'RHYME') {
          return word.length >= 2 ? word.slice(-2) : word;
      }

      if (language === 'ID' && gameMode === 'SYLLABLE') {
          const data = syllableMapRef.current[word.toLowerCase()];
          if (data && data.nama) {
              const parts = data.nama.split('.');
              return parts[parts.length - 1]; 
          }
          const overlap = getIndonesianOverlapSuffix(word);
          return overlap.length > 0 ? overlap : word.slice(-2);
      }
      if (gameMode === 'LAST_LETTER') return word.slice(-1);
      if (gameMode === 'SECOND_LETTER') return word.length >= 2 ? word[1] : '';
      if (gameMode === 'LAST_2_LETTERS') return word.slice(-2);
      if (gameMode === 'LAST_3_LETTERS') return word.slice(-3);
      if (gameMode === 'LONGER_WORD') return word.slice(-1); 
      // UPDATED: Logic for LONGER_2_LETTERS
      if (gameMode === 'LONGER_2_LETTERS') return word.slice(-2);

      return getEnglishSyllableSuffix(word);
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
    let action = "Start with"; 

    if (gameMode === 'CITIES') {
        return { label: "City Chain", target: target, desc: `Ends with '${target}'`, action };
    }
    else if (gameMode === 'RHYME') {
        action = "End with"; 
        return { label: "Strict Rhyme", target: target, desc: `Ends with '${target}'`, action };
    }
    else if (gameMode === 'LAST_LETTER') {
        return { label: "Last Letter", target: target, desc: `Ends with '${target}'`, action };
    } 
    else if (gameMode === 'SECOND_LETTER') {
        return { label: "2nd Letter", target: target, desc: `2nd Letter is '${target}'`, action };
    }
    else if (gameMode === 'LAST_2_LETTERS') {
        return { label: "Last 2 Letters", target: target, desc: `Ends with '${target}'`, action };
    } else if (gameMode === 'LAST_3_LETTERS') {
        return { label: "Last 3 Letters", target: target, desc: `Ends with '${target}'`, action };
    } else if (gameMode === 'LONGER_WORD') {
        if (word.length >= 10) {
             return { 
                label: "Longer Word (Reset)", 
                target: `> 3 chars`, 
                desc: `Start '${target}' (> 3 letters - RESET!)`,
                action
            };
        }
        return { 
            label: "Longer Word", 
            target: `> ${word.length}`, 
            desc: `Start '${target}' (> ${word.length} letters)`,
            action
        };
    } 
    // UPDATED: Display for LONGER_2_LETTERS
    else if (gameMode === 'LONGER_2_LETTERS') {
        if (word.length >= 10) {
             return { 
                label: "Longer (2 Let) [Reset]", 
                target: `> 3 chars`, 
                desc: `Start '${target}' (> 3 letters - RESET!)`,
                action
            };
        }
        return { 
            label: "Longer (2 Let)", 
            target: `> ${word.length}`, 
            desc: `Start '${target}' (> ${word.length} letters)`,
            action
        };
    }
    else {
        return { label: "Last Syllable", target: target, desc: `Syllable '${target}'`, action };
    }
  }

  function getDisplayParts(word) {
      if (!word) return { pre: '', high: '', post: '' };

      if (gameMode === 'RHYME') {
          const suffix = getSuffixOrRule(word);
          const suffixLen = suffix.length;
          const prefixLen = Math.max(0, word.length - suffixLen);
          return {
              pre: word.slice(0, prefixLen),
              high: suffix,
              post: ''
          };
      }

      if (gameMode === 'SECOND_LETTER') {
          if (word.length < 2) return { pre: word, high: '', post: '' };
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
          post: '' 
      };
  }

  function validateConnection(prev, next) {
    if (!prev) return true; 
    const p = prev.toLowerCase();
    const n = next.toLowerCase();

    let requiredSuffix = "";

    // STRICT RHYME Validation
    if (gameMode === 'RHYME') {
        requiredSuffix = p.length >= 2 ? p.slice(-2) : p; 
        if (n === requiredSuffix && p.length <= 2) return false;
        return n.endsWith(requiredSuffix);
    }

    if (gameMode === 'CITIES' || gameMode === 'LAST_LETTER') {
        requiredSuffix = p.slice(-1);
        if (n === requiredSuffix) return false; 
        return n.startsWith(requiredSuffix);
    }
    else if (gameMode === 'SECOND_LETTER') {
        if (p.length < 2) return false; 
        const targetChar = p[1];
        if (n === targetChar) return false;
        return n.startsWith(targetChar);
    }
    else if (gameMode === 'LAST_2_LETTERS') {
        requiredSuffix = p.slice(-2);
        if (n === requiredSuffix) return false; 
        return n.startsWith(requiredSuffix);
    }
    else if (gameMode === 'LAST_3_LETTERS') {
        requiredSuffix = p.slice(-3);
        if (n === requiredSuffix) return false;
        return n.startsWith(requiredSuffix);
    }
    else if (gameMode === 'LONGER_WORD') {
        if (p.slice(-1) !== n[0]) return false;
        if (p.length >= 10) {
            return n.length >= 4;
        }
        return n.length > p.length;
    }
    // UPDATED: Validation for LONGER_2_LETTERS
    else if (gameMode === 'LONGER_2_LETTERS') {
        // Base Connection: Starts with last 2 letters
        if (!n.startsWith(p.slice(-2))) return false;

        // Length Check (with Soft Reset)
        if (p.length >= 10) {
            return n.length >= 4; 
        }
        return n.length > p.length;
    }
    else if (gameMode === 'SYLLABLE') {
        let isValid = false;
        let connectionPart = "";

        if (language === 'EN') {
            connectionPart = getEnglishSyllableSuffix(p);
            if (n.startsWith(connectionPart)) {
                isValid = true;
            }
        } else {
            const prevData = syllableMapRef.current[p];
            if (prevData && prevData.nama) {
                const prevSyllables = prevData.nama.split('.');
                const lastSyl = prevSyllables[prevSyllables.length - 1];
                connectionPart = lastSyl;
                if (n.startsWith(lastSyl)) {
                    isValid = true;
                }
            }
            if (!isValid) {
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
        if (isValid && n === connectionPart) {
             return false; 
        }
        return isValid;
    }
    return false;
  }

  // --- GAME LOGIC ---

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
    playSound('eliminate'); // SFX
    const currentPlayers = playersRef.current;
    const currentIndex = turnIndexRef.current;
    const playerToEliminate = currentPlayers[currentIndex];
    
    if (!playerToEliminate || playerToEliminate.isEliminated) return;

    const newPlayers = [...currentPlayers];
    newPlayers[currentIndex] = { ...playerToEliminate, isEliminated: true };
    setPlayers(newPlayers);
    addLog('System', `${playerToEliminate.nickname} eliminated!`);

    const activePlayers = newPlayers.filter(p => !p.isEliminated);
    if (activePlayers.length <= 1) {
        setGameState('ENDED');
        playSound('win'); // SFX
        if (activePlayers.length === 1) {
            const winner = activePlayers[0];
            addLog('System', `WINNER: ${winner.nickname} 🎉`);
            if (!winner.isBot) {
                const newStats = StatsManager.update(winner.uniqueId, true);
                setPlayers(prev => prev.map(p => 
                    p.uniqueId === winner.uniqueId ? { ...p, stats: newStats } : p
                ));
            }
        } else {
            addLog('System', `Game Over! No winners.`);
        }
    } else {
        advanceTurn(newPlayers, currentIndex);
    }
  }

  function submitAnswer(word) {
    if (!dictionary.has(word)) {
      addLog('Game', `❌ "${word}" invalid.`);
      playSound('wrong'); 
      triggerTableEffect('error'); 
      return; 
    }
    
    if (usedWordsRef.current.has(word)) {
      addLog('Game', `❌ "${word}" used.`);
      playSound('wrong'); 
      triggerTableEffect('warning');
      return;
    }

    const isValid = validateConnection(currentWord, word);
    
    if (isValid) {
      playSound('correct'); 
      triggerTableEffect('success'); 
      usedWordsRef.current.add(word);
      setUsedWords(new Set(usedWordsRef.current));
      setCurrentWord(word);
      
      // DISPLAY CITY REGION IF AVAILABLE
      const region = cityMetadataRef.current[word];
      if (region) {
          addLog('Game', `✅ ${word.toUpperCase()} (${region})`);
      } else {
          addLog('Game', `✅ Correct! "${word}"`);
      }
      
      advanceTurn(players, currentTurnIndex);
    } else {
      addLog('Game', `❌ "${word}" bad link.`);
      playSound('wrong'); 
      triggerTableEffect('error'); 
    }
  }

  function joinGame(uniqueId, nickname, profilePictureUrl, isBot = false) {
    if (gameState !== 'WAITING') return;
    setPlayers(prev => {
      if (prev.some(p => p.uniqueId === uniqueId)) return prev; 
      if (prev.length >= maxPlayers) return prev; 
      
      playSound('join'); // SFX
      addLog('System', `${nickname} joined!`);

      // Load Stats
      let stats = { wins: 0, games: 0, badges: [] };
      if (!isBot) {
         stats = StatsManager.load(uniqueId);
         stats = StatsManager.update(uniqueId, false); 
      }

      return [...prev, {
        id: uniqueId, uniqueId, nickname,
        avatarUrl: profilePictureUrl || getAvatarUrl(uniqueId), 
        isEliminated: false, color: getRandomColor(),
        isBot: isBot,
        stats: stats
      }];
    });
  }

  function addBot() {
      const botNames = ["Bot Alpha", "Bot Beta", "Bot Gamma", "Bot Delta", "Bot Omega", "Bot Zeta"];
      const existingNames = new Set(players.map(p => p.nickname));
      const availableNames = botNames.filter(n => !existingNames.has(n));
      const name = availableNames.length > 0 ? availableNames[0] : `Bot ${Math.floor(Math.random()*1000)}`;
      const id = `bot_${Date.now()}_${Math.random()}`;
      joinGame(id, name, null, true);
  }

  function addHost() {
      const id = 'host_player';
      const avatar = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=HOST`;
      joinGame(id, 'HOST', avatar, false);
  }

  // --- LOADING CITIES LOGIC ---
  const loadCitiesData = (citiesArray) => {
      const dictSet = new Set();
      const meta = {};
      citiesArray.forEach(city => {
          if (!city.name) return;
          // UPDATED: Use normalization
          const cleanName = normalizeWord(city.name); 
          if (cleanName) {
              dictSet.add(cleanName);
              if (city.region) {
                  // Store pretty name or region for display
                  meta[cleanName] = city.region; 
              }
          }
      });
      setDictionary(dictSet);
      setCityMetadata(meta);
      setDictLoadedInfo(`Cities (${dictSet.size})`);
      addLog('System', 'Loaded World Cities!');
  };

  function startGame() {
    if (players.length < 2) {
      addLog('System', 'Need at least 2 players.');
      return;
    }
    playSound('start'); // SFX
    const dictArray = Array.from(dictionary);
    
    let randomStart;
    
    let candidates = dictArray.filter(w => w.length >= 3 && w.length <= 6);
    
    // Fallback if no easy words found
    if (candidates.length === 0) candidates = dictArray;
    
    randomStart = candidates[Math.floor(Math.random() * candidates.length)];
    
    const initialUsed = new Set([randomStart]);
    setUsedWords(initialUsed);
    usedWordsRef.current = initialUsed; 

    setCurrentWord(randomStart);
    setCurrentTurnIndex(0);
    setGameState('PLAYING'); 
    setShowSettings(false); 
    
    // Show region for starting word if city mode
    const region = cityMetadataRef.current[randomStart];
    if (region) {
        addLog('System', `Start: ${randomStart.toUpperCase()} (${region})`);
    } else {
        addLog('System', `Game Started! First: ${randomStart.toUpperCase()}`);
    }
  }

  // NEW FUNCTION TO REVIVE PLAYERS ON RESET
  function resetGame() {
      setGameState('WAITING');
      setPlayers(prev => prev.map(p => ({ ...p, isEliminated: false }))); // Revive Logic
      setUsedWords(new Set());
      setCurrentWord('');
      addLog('System', 'Game Reset! Players revived.');
  }

  useEffect(() => {
    if (gameState === 'WAITING' && players.length >= maxPlayers) {
        addLog('System', 'Lobby Full! Auto-starting...');
        startGame();
    }
  }, [players, gameState, maxPlayers]);


  // UPDATED: Logic to Switch Dictionaries based on Mode
  function cycleGameMode() {
      // UPDATED: Added LONGER_2_LETTERS to the cycle
      const modes = ['LAST_LETTER', 'SECOND_LETTER', 'RHYME', 'LAST_2_LETTERS', 'LAST_3_LETTERS', 'SYLLABLE', 'LONGER_WORD', 'LONGER_2_LETTERS', 'CITIES'];
      const nextIndex = (modes.indexOf(gameMode) + 1) % modes.length;
      const nextMode = modes[nextIndex];
      setGameMode(nextMode);
  }

  // Effect to load dictionary when mode changes
  useEffect(() => {
      if (gameMode === 'CITIES') {
          // Attempt to load cities.json, fallback to mock data
          fetch('/cities.json')
            .then(res => {
                if(!res.ok) throw new Error("No cities.json");
                return res.json();
            })
            .then(data => {
                loadCitiesData(data);
            })
            .catch(() => {
                loadCitiesData(FALLBACK_CITIES); // Load mock data
                addLog('System', 'Using Fallback Cities');
            });
      } else {
          // Revert to Standard Language Dictionary
          setCityMetadata({}); // Clear city data
          toggleLanguage(true); // Force reload current language
      }
  }, [gameMode]);

  function toggleLanguage(forceReload = false) {
      // If forceReload is true, we just reload the current language
      let targetLang = language;
      if (!forceReload) {
          targetLang = language === 'EN' ? 'ID' : 'EN';
          setLanguage(targetLang);
      }

      if (targetLang === 'ID') {
          if (!forceReload) addLog('System', 'Switching to Bahasa Indonesia...');
          fetch('/kamus.json')
            .then(res => res.json())
            .then(json => {
                let dictSet = new Set();
                let sMap = {};
                Object.keys(json).forEach(k => {
                    if (k.includes(' ')) return; 
                    // UPDATED: Use normalizeWord
                    const cleanKey = normalizeWord(k);
                    if (cleanKey) {
                        dictSet.add(cleanKey);
                        if (json[k].nama) sMap[cleanKey] = { nama: json[k].nama.toLowerCase() };
                    }
                });
                setDictionary(dictSet);
                setSyllableMap(sMap);
                setDictLoadedInfo(`Kamus.json (${dictSet.size})`);
            })
            .catch(() => {
                const words = Object.keys(FALLBACK_DICTIONARY_ID_DATA);
                setDictionary(new Set(words));
                setSyllableMap(FALLBACK_DICTIONARY_ID_DATA);
                setDictLoadedInfo('Default (ID)');
            });

      } else {
          if (!forceReload) addLog('System', 'Switching to English...');
          fetch('/dictionary.json')
            .then(res => res.json())
            .then(data => {
                 let rawWords = Array.isArray(data) ? data : Object.keys(data);
                 // UPDATED: Use normalizeWord
                 const cleanedWords = rawWords
                    .filter(w => !w.includes(' '))
                    .map(w => normalizeWord(w))
                    .filter(w => w.length > 0);
                 setDictionary(new Set(cleanedWords));
                 setSyllableMap({});
                 setDictLoadedInfo(`Dictionary.json (${cleanedWords.length})`);
            })
            .catch(() => {
                setDictionary(FALLBACK_DICTIONARY_EN);
                setSyllableMap({});
                setDictLoadedInfo('Default (EN)');
            });
      }
      
      if (!forceReload) {
          setGameState('WAITING');
          setPlayers([]);
      }
  }

  function getModeLabel() {
      switch(gameMode) {
          case 'LAST_LETTER': return 'LETTER';
          case 'SECOND_LETTER': return '2ND LETTER';
          case 'RHYME': return 'RHYME'; 
          case 'LAST_2_LETTERS': return '2 LETTERS';
          case 'LAST_3_LETTERS': return '3 LETTERS';
          case 'SYLLABLE': return 'SYLLABLE';
          case 'LONGER_WORD': return 'LONGER';
          case 'LONGER_2_LETTERS': return 'LONGER (2)'; // UPDATED: Label
          case 'CITIES': return 'CITIES';
          default: return 'LETTER';
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

    if (trimmedComment.toLowerCase() === '!join' || trimmedComment.toLowerCase() === 'join') {
      joinGame(uniqueId, nickname, profilePictureUrl); 
      return;
    }

    if (gameState === 'PLAYING') {
      const currentPlayer = players[currentTurnIndex];
      if (currentPlayer && currentPlayer.uniqueId === uniqueId && !currentPlayer.isEliminated) {
        // UPDATED: Use normalizeWord
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
      // UPDATED: Use normalizeWord
      const cleanWord = normalizeWord(manualInput);
      if (cleanWord.length > 0) {
          if (gameState === 'PLAYING') {
              submitAnswer(cleanWord);
              setManualInput('');
          }
      }
  };

  const handleVirtualInput = (char) => {
    setManualInput(prev => prev + char);
  };

  const handleVirtualBackspace = () => {
    setManualInput(prev => prev.slice(0, -1));
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

        if (Array.isArray(json)) {
            if (json.length > 0 && typeof json[0] === 'object' && json[0].name) {
                 json.forEach(item => {
                     const clean = normalizeWord(item.name);
                     if (clean) {
                         dictSet.add(clean);
                         if (item.region) meta[clean] = item.region;
                     }
                 });
                 setCityMetadata(meta);
                 setGameMode('CITIES'); 
                 addLog('System', `Loaded Cities JSON (${dictSet.size})`);
            } else {
                const cleanedWords = json
                    .filter(w => typeof w === 'string' && !w.includes(' ')) 
                    .map(w => normalizeWord(w))
                    .filter(w => w.length > 0);
                dictSet = new Set(cleanedWords);
                addLog('System', `Loaded Simple Array (${dictSet.size} words)`);
            }
        } else {
            const keys = Object.keys(json);
            keys.forEach(k => {
                if (k.includes(' ')) return; 
                const cleanKey = normalizeWord(k);
                if (cleanKey) {
                    dictSet.add(cleanKey);
                    if (json[k].nama) {
                        sMap[cleanKey] = { nama: json[k].nama.toLowerCase() };
                    }
                }
            });
            addLog('System', `Loaded Rich Dictionary (${dictSet.size} words)`);
        }
        
        setDictionary(dictSet);
        setSyllableMap(sMap);
        setDictLoadedInfo(`Custom (${dictSet.size})`);
      } catch (err) {
        addLog('System', 'Error parsing JSON');
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  // --- EFFECTS ---

  useEffect(() => {
    fetch('/dictionary.json')
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        const rawWords = Object.keys(data);
        // UPDATED: Use normalizeWord
        const cleanedWords = rawWords
            .filter(w => !w.includes(' '))
            .map(w => normalizeWord(w))
            .filter(w => w.length > 0);
        setDictionary(new Set(cleanedWords));
        setDictLoadedInfo(`Loaded (${cleanedWords.length})`);
      })
      .catch(() => {});

    connectWebSocket();
    return () => {
      if (wsRef.current) wsRef.current.close();
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      clearInterval(timerRef.current);
      setTimer(turnDuration);
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 5 && prev > 0) playSound('tick'); // SFX Tick
          if (prev <= 1) {
            handleTimeout(); 
            return turnDurationRef.current;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [currentTurnIndex, gameState, turnDuration]);

  // BOT LOGIC
  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    
    const currentPlayer = players[currentTurnIndex];
    if (currentPlayer && currentPlayer.isBot && !currentPlayer.isEliminated) {
        const thinkingTime = Math.floor(Math.random() * 2000) + 2000;
        const botTimer = setTimeout(() => {
            const dictArray = Array.from(dictionary);
            const candidates = dictArray.filter(word => {
                if (usedWordsRef.current.has(word)) return false;
                return validateConnection(currentWord, word);
            });

            if (candidates.length > 0) {
                const choice = candidates[Math.floor(Math.random() * candidates.length)];
                submitAnswer(choice);
            } else {
                addLog('Bot', `${currentPlayer.nickname} is stumped!`);
            }
        }, thinkingTime);
        return () => clearTimeout(botTimer);
    }
  }, [currentTurnIndex, gameState, currentWord, players, dictionary]);

  // UPDATED: Dynamic WebSocket Connection with Fallback
  const connectWebSocket = () => {
    const hostname = fallbackToLocalhostRef.current ? 'localhost' : (window.location.hostname || 'localhost');
    const url = `ws://${hostname}:62024`;

    wsRef.current = new WebSocket(url);
    
    wsRef.current.onopen = () => {
        addLog('System', `Connected to IndoFinity (${hostname})`);
        fallbackToLocalhostRef.current = false;
    };

    wsRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const { event: eventName, data } = message;
        
        if (eventName === 'chat' && chatHandlerRef.current) {
            chatHandlerRef.current(data);
        }
        if (eventName === 'gift') {
           setLastEvent({ type: 'gift', ...data });
           setTimeout(() => setLastEvent(null), 3000);
        }
      } catch (err) { console.error('WS Error', err); }
    };
    
    wsRef.current.onclose = () => {
        if (!fallbackToLocalhostRef.current && window.location.hostname !== 'localhost') {
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
    handleChatEvent({ uniqueId: id, nickname: randomName, comment: '!join' });
  };
  
  const simulateCorrectAnswer = () => {
      const validWord = Array.from(dictionary).find(w => validateConnection(currentWord, w) && !usedWords.has(w));
      if (validWord) {
          const currentPlayer = players[currentTurnIndex];
          if(currentPlayer && !currentPlayer.isEliminated) {
             handleChatEvent({ uniqueId: currentPlayer.uniqueId, nickname: currentPlayer.nickname, comment: validWord });
          }
      } else {
          addLog("Debug", "No valid word found.");
      }
  };

  const getWinner = () => {
      if (gameState !== 'ENDED') return null;
      return players.find(p => !p.isEliminated);
  };

  // --- STYLE HELPER FOR TABLE ---
  const getTableStatusClass = () => {
      switch(tableStatus) {
          case 'error': return 'border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.6)] animate-shake';
          case 'warning': return 'border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.6)]';
          case 'success': return 'border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.6)]';
          default: return 'border-slate-700 bg-slate-800 shadow-2xl';
      }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-900 text-white font-sans overflow-hidden flex flex-col items-center justify-center p-2 sm:p-4 relative">
      {/* HEADER */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 pointer-events-none">
        <h1 className="text-xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-lg">
          WORD CHAIN
        </h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mt-1">
          <span className={`w-2 h-2 rounded-full ${wsRef.current?.readyState === 1 ? 'bg-green-500' : 'bg-red-500'}`}></span>
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
            {/* FULLSCREEN TOGGLE */}
            <button 
                onClick={toggleFullscreen}
                className="w-10 h-10 flex items-center justify-center rounded-full shadow-xl transition-all duration-300 border border-slate-600 bg-slate-800 hover:bg-slate-700 hover:scale-110"
                title="Toggle Fullscreen"
            >
                {isFullscreen ? <Minimize className="w-5 h-5 text-slate-300" /> : <Maximize className="w-5 h-5 text-slate-300" />}
            </button>

            {/* SETTINGS TOGGLE */}
            <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`w-10 h-10 flex items-center justify-center rounded-full shadow-xl transition-all duration-300 border border-slate-600
                    ${showSettings ? 'bg-red-600 hover:bg-red-500 rotate-90' : 'bg-slate-800 hover:bg-slate-700 hover:scale-110'}
                `}
            >
                {showSettings ? <X className="w-5 h-5 text-white" /> : <Settings className="w-5 h-5 text-slate-300" />}
            </button>
        </div>

        <div className={`mt-3 flex flex-col gap-3 transition-all duration-300 origin-top-right
             ${showSettings ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 -translate-y-4 pointer-events-none absolute top-10 right-0 w-0 h-0 overflow-hidden'}
        `}>
            <div className="bg-slate-800/90 backdrop-blur-md p-3 rounded-lg border border-slate-600 shadow-2xl flex flex-col gap-3 min-w-[200px]">
                {/* Audio Toggle */}
                <button onClick={() => setIsMuted(!isMuted)} className="w-full bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded text-xs font-bold border border-slate-600 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-2">
                        {isMuted ? <VolumeX className="w-3 h-3 text-red-400" /> : <Volume2 className="w-3 h-3 text-green-400" />}
                        <span className="text-slate-300">Sound</span>
                    </div>
                    <span className="text-white">{isMuted ? 'Off' : 'On'}</span>
                </button>

                <div className="h-px bg-slate-600/50"></div>

                {/* Language Switch */}
                <button onClick={() => toggleLanguage()} className="w-full bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded text-xs font-bold border border-slate-600 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3 text-blue-400" />
                        <span className="text-slate-300">Language</span>
                    </div>
                    <span className="text-white group-hover:text-yellow-300">{language === 'EN' ? 'English' : 'Indonesia'}</span>
                </button>

                <div className="h-px bg-slate-600/50"></div>

                {/* Timer Setting */}
                <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        <span className="font-bold">Timer</span>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-900 rounded p-0.5 border border-slate-700">
                        <button onClick={() => setTurnDuration(d => Math.max(5, d - 5))} className="w-6 h-6 flex items-center justify-center hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"><Minus className="w-3 h-3" /></button>
                        <span className="w-8 text-center font-mono font-bold text-yellow-400 text-sm">{turnDuration}s</span>
                        <button onClick={() => setTurnDuration(d => Math.min(60, d + 5))} className="w-6 h-6 flex items-center justify-center hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"><Plus className="w-3 h-3" /></button>
                    </div>
                </div>

                {/* Max Players Setting (NEW) */}
                <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300">
                        <Users className="w-3.5 h-3.5 text-pink-400" />
                        <span className="font-bold">Players</span>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-900 rounded p-0.5 border border-slate-700">
                        <button onClick={() => setMaxPlayers(n => Math.max(2, n - 1))} className="w-6 h-6 flex items-center justify-center hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"><Minus className="w-3 h-3" /></button>
                        <span className="w-8 text-center font-mono font-bold text-yellow-400 text-sm">{maxPlayers}</span>
                        <button onClick={() => setMaxPlayers(n => Math.min(100, n + 1))} className="w-6 h-6 flex items-center justify-center hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"><Plus className="w-3 h-3" /></button>
                    </div>
                </div>
                
                <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 mt-2">
                    <span className="truncate max-w-[80px]" title={dictLoadedInfo}>{dictLoadedInfo}</span>
                    <button onClick={() => fileInputRef.current && fileInputRef.current.click()} className="bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded flex items-center gap-1 transition-colors text-xs text-white">
                        <FileJson className="w-3 h-3" /> Load JSON
                    </button>
                    <input type="file" accept=".json" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                </div>
                <div className="h-px bg-slate-600/50"></div>
                 {/* ADD PLAYERS ROW */}
                 <div className="flex gap-2">
                    <button onClick={addHost} className="flex-1 bg-slate-700 hover:bg-slate-600 px-2 py-2 rounded text-xs font-bold border border-slate-600 transition-colors flex items-center justify-center gap-1 group">
                        <User className="w-3 h-3 text-blue-400" />
                        <span className="text-slate-300 group-hover:text-white">+Host</span>
                    </button>
                    <button onClick={addBot} className="flex-1 bg-slate-700 hover:bg-slate-600 px-2 py-2 rounded text-xs font-bold border border-slate-600 transition-colors flex items-center justify-center gap-1 group">
                        <Bot className="w-3 h-3 text-purple-400" />
                        <span className="text-slate-300 group-hover:text-white">+Bot</span>
                    </button>
                 </div>

                 <button onClick={cycleGameMode} className="w-full bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded text-xs font-bold border border-slate-600 transition-colors flex items-center justify-between group">
                    <span className="text-slate-300">Mode:</span>
                    <span className="text-yellow-400 group-hover:text-yellow-300">{getModeLabel()}</span>
                </button>
                <button onClick={gameState === 'WAITING' ? startGame : resetGame} className={`w-full px-3 py-2 rounded text-xs font-bold shadow-lg transition-transform active:scale-95 border border-transparent ${gameState === 'WAITING' ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 text-white' : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 text-white'}`}>
                    {gameState === 'WAITING' ? 'START GAME' : 'RESET GAME'}
                </button>
            </div>
            
            <div className="bg-black/60 backdrop-blur-md p-2 rounded-lg border border-slate-700 flex flex-col gap-2">
                <div className="text-[10px] uppercase font-bold text-slate-500 text-center tracking-wider">Simulation</div>
                <div className="grid grid-cols-3 gap-1">
                    <button onClick={simulateJoin} className="bg-blue-900/60 hover:bg-blue-800 text-[10px] py-1.5 rounded text-blue-200 border border-blue-800/50 flex flex-col items-center justify-center gap-0.5"><Users className="w-3 h-3" /> Join</button>
                    <button onClick={simulateCorrectAnswer} className="bg-green-900/60 hover:bg-green-800 text-[10px] py-1.5 rounded text-green-200 border border-green-800/50 flex flex-col items-center justify-center gap-0.5"><Gamepad2 className="w-3 h-3" /> Ans</button>
                    <button onClick={handleTimeout} className="bg-red-900/60 hover:bg-red-800 text-[10px] py-1.5 rounded text-red-200 border border-red-800/50 flex flex-col items-center justify-center gap-0.5"><Clock className="w-3 h-3" /> TO</button>
                </div>
            </div>
        </div>
      </div>

      {/* GAME AREA WRAPPER FOR SCALING */}
      <div className="transform scale-[0.85] -translate-y-12 sm:translate-y-0 sm:scale-100 transition-transform duration-300">
          <div className="relative w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] flex items-center justify-center">
            {/* THE TABLE */}
            {/* UPDATED: Removed overlay logic, applied simple class switching for feedback */}
            <div className={`absolute inset-0 rounded-full border-[8px] bg-slate-800 transition-all duration-200 flex items-center justify-center overflow-hidden ${getTableStatusClass()}`}>
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-100 via-gray-900 to-black"></div>
                <div className="relative z-10 text-center flex flex-col items-center">
                    {gameState === 'WAITING' ? (
                    <div className="animate-pulse">
                        <Users className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                        <p className="text-slate-400 font-bold">WAITING FOR PLAYERS...</p>
                        <p className="text-xs text-slate-500">Type <span className="text-yellow-400">!join</span></p>
                        <p className="text-xl font-mono mt-2">{players.length} / {maxPlayers}</p>
                    </div>
                    ) : gameState === 'ENDED' ? (
                    <div className="animate-bounce">
                        <p className="text-xl font-bold text-yellow-400">GAME OVER</p>
                        <button onClick={() => {setPlayers([]); setGameState('WAITING');}} className="mt-2 bg-purple-600 px-4 py-1 rounded text-sm">New Game</button>
                    </div>
                    ) : (
                    <div>
                        {gameMode === 'CITIES' && <div className="text-[10px] font-bold bg-blue-900/50 px-2 py-0.5 rounded text-blue-300 mb-1 flex items-center justify-center gap-1"><MapPin className="w-3 h-3"/> CITIES MODE</div>}
                        {gameMode === 'RHYME' && <div className="text-[10px] font-bold bg-purple-900/50 px-2 py-0.5 rounded text-purple-300 mb-1 flex items-center justify-center gap-1"><Music className="w-3 h-3"/> RHYME MODE</div>}
                        <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">CURRENT WORD</p>
                        <h2 className="text-3xl sm:text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] flex justify-center">
                            {(() => {
                                const { pre, high, post } = getDisplayParts(currentWord);
                                return (
                                    <>
                                    <span>{pre.toUpperCase()}</span>
                                    <span className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]">{high.toUpperCase()}</span>
                                    <span>{post.toUpperCase()}</span>
                                    </>
                                )
                            })()}
                        </h2>
                        <div className="mt-2 text-sm font-mono text-purple-300 bg-purple-900/30 px-3 py-1 rounded-full border border-purple-500/30 inline-block">
                            {(() => {
                                const rule = getRuleDisplay(currentWord);
                                return (
                                    <>
                                    {rule.desc}
                                    <span className="mx-2">→</span>
                                    {/* UPDATED: Dynamic Action Text */}
                                    {rule.action} <span className="font-bold text-yellow-400">{rule.target}</span>
                                    {rule.extra && <div className="text-[10px] text-slate-400 mt-1">{rule.extra}</div>}
                                    </>
                                )
                            })()}
                        </div>
                    </div>
                    )}
                </div>
            </div>

            {/* PLAYERS */}
            {players.map((player, index) => {
                const angleDeg = (index * (360 / Math.max(players.length, 1))) + 90; 
                const isTurn = gameState === 'PLAYING' && currentTurnIndex === index && !player.isEliminated;

                return (
                    <div 
                        key={player.uniqueId}
                        className="absolute transition-all duration-500 ease-out flex flex-col items-center justify-center w-20 h-24"
                        style={{
                            transform: `rotate(${angleDeg}deg) translate(${gameState === 'WAITING' ? 140 : 210}px) rotate(-${angleDeg}deg)`,
                            zIndex: isTurn ? 100 : 20 // UPDATED: Bring active player to front
                        }}
                    >
                        <div className={`relative group ${player.isEliminated ? 'opacity-40 grayscale' : 'opacity-100'}`}>
                            {isTurn && (
                                <div className="absolute -inset-2 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                            )}
                            <div className={`w-14 h-14 rounded-full border-4 overflow-hidden bg-slate-800 z-10 relative shadow-lg ${isTurn ? 'border-yellow-400 scale-110' : 'border-slate-600'} ${player.isEliminated ? 'border-red-900' : ''} transition-all duration-300`}>
                                <img src={player.avatarUrl} alt={player.nickname} className="w-full h-full object-cover" />
                            </div>
                            
                            {/* BOT BADGE */}
                            {player.isBot && (
                                <div className="absolute -top-1 -right-1 bg-purple-600 text-[8px] px-1 rounded-full text-white font-bold border border-purple-400 z-30">
                                    BOT
                                </div>
                            )}

                            {isTurn && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-500 text-black font-bold text-xs px-2 py-0.5 rounded-full shadow-lg z-50 whitespace-nowrap">
                                    {timer}s
                                </div>
                            )}
                            {player.isEliminated && (
                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <Skull className="w-8 h-8 text-red-600 drop-shadow-md" />
                                </div>
                            )}
                        </div>
                        
                        {/* NAME & BADGES - UPDATED DESIGN */}
                        <div className={`mt-[-12px] flex flex-col items-center z-40 relative`}> {/* Negative margin to overlap avatar */}
                            {/* Name Pill */}
                            <div className={`
                                flex items-center gap-1.5 px-3 py-1 rounded-full
                                backdrop-blur-md border shadow-lg transition-all duration-300
                                ${isTurn 
                                    ? 'bg-yellow-500/90 border-yellow-400/50 text-yellow-900 scale-110' 
                                    : 'bg-slate-900/80 border-slate-700/50 text-slate-200'}
                            `}>
                                {/* Trophy Section */}
                                {player.stats?.wins > 0 && (
                                    <div className={`flex items-center gap-0.5 border-r pr-1.5 mr-0.5 ${isTurn ? 'border-yellow-700/30' : 'border-white/20'}`}>
                                        <Trophy className={`w-3 h-3 drop-shadow-sm ${isTurn ? 'text-yellow-700' : 'text-yellow-400'}`} />
                                        <span className={`text-[10px] font-bold font-mono ${isTurn ? 'text-yellow-800' : 'text-yellow-200'}`}>{player.stats.wins}</span>
                                    </div>
                                )}

                                {/* Name */}
                                <span className="text-[10px] font-bold tracking-wide truncate max-w-[80px]">
                                    {player.nickname}
                                </span>
                            </div>

                            {/* Badges Row */}
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
      {gameState === 'PLAYING' && isHostJoined && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-2 flex flex-col gap-2 items-center">
            
            {/* Input Display Area */}
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-600 rounded-full px-4 py-2 w-64 shadow-lg backdrop-blur-md">
                 <span className="flex-1 text-center font-mono font-bold text-lg text-white tracking-widest min-h-[1.5rem] uppercase">
                    {manualInput || <span className="text-slate-600 text-xs font-sans font-normal opacity-50 lowercase">Type answer...</span>}
                 </span>
                 {manualInput && (
                     <button onClick={() => setManualInput('')} className="text-slate-400 hover:text-white">
                        <X className="w-4 h-4" />
                     </button>
                 )}
                 <button 
                    onClick={(e) => handleManualSubmit(e)} 
                    className="bg-green-600 text-white p-1.5 rounded-full hover:bg-green-500 shadow-lg active:scale-90 transition-transform"
                 >
                    <Send className="w-3 h-3" />
                 </button>
            </div>

            {/* Toggle Keyboard Button */}
            <button 
                onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
                className="text-[10px] text-slate-400 bg-black/40 px-3 py-1 rounded-full hover:bg-black/60 transition-colors flex items-center gap-1 backdrop-blur-sm border border-slate-700/50"
            >
                <Keyboard className="w-3 h-3" /> {showVirtualKeyboard ? "Hide Keyboard" : "Show Keyboard"}
            </button>

            {/* Minimalist Virtual Keyboard */}
            {showVirtualKeyboard && (
                <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-700 shadow-2xl backdrop-blur-md w-full animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* QWERTY Rows */}
                    {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row, i) => (
                        <div key={i} className="flex justify-center gap-1 mb-1 last:mb-0">
                            {row.split('').map(char => (
                                <button
                                    key={char}
                                    onClick={() => handleVirtualInput(char)}
                                    className="w-7 h-9 sm:w-8 sm:h-10 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold text-sm sm:text-base shadow active:scale-95 transition-all active:bg-slate-500"
                                >
                                    {char}
                                </button>
                            ))}
                        </div>
                    ))}
                    {/* Action Row */}
                     <div className="flex justify-center gap-1 mt-1 px-1">
                         <button 
                            onClick={handleVirtualBackspace}
                            className="flex-1 bg-red-900/80 hover:bg-red-800 text-white rounded font-bold text-xs h-9 flex items-center justify-center shadow active:scale-95 gap-1 transition-colors"
                         >
                            <Delete className="w-4 h-4" /> DEL
                         </button>
                         <button 
                            onClick={(e) => handleManualSubmit(e)}
                            className="flex-[2] bg-green-700/80 hover:bg-green-600 text-white rounded font-bold text-xs h-9 flex items-center justify-center shadow active:scale-95 transition-colors"
                         >
                            ENTER
                         </button>
                     </div>
                </div>
            )}
        </div>
      )}

      {/* WINNER OVERLAY */}
      {gameState === 'ENDED' && getWinner() && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-700">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="absolute animate-ping" style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDuration: `${1 + Math.random()}s`,
                        animationDelay: `${Math.random()}s`,
                        backgroundColor: ['#FFD700', '#FF69B4', '#00BFFF', '#32CD32'][Math.floor(Math.random() * 4)],
                        width: '8px', height: '8px', borderRadius: '50%'
                    }}></div>
                ))}
            </div>
            <div className="text-center transform transition-all animate-in zoom-in-50 duration-500 flex flex-col items-center">
                <div className="relative mb-6">
                    <Trophy className="w-32 h-32 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)] animate-bounce" />
                    <Star className="absolute -top-2 -right-2 w-12 h-12 text-white animate-spin-slow text-yellow-200" />
                    <Star className="absolute -bottom-2 -left-2 w-8 h-8 text-white animate-pulse text-yellow-200" />
                </div>
                <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 drop-shadow-lg mb-2">WINNER!</h2>
                <div className="relative group my-6">
                    <div className="absolute -inset-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-full opacity-75 blur-lg group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <img src={getWinner().avatarUrl} alt="Winner" className="relative w-32 h-32 rounded-full border-4 border-yellow-400 shadow-2xl object-cover" />
                </div>
                <div className="bg-slate-800/80 px-8 py-3 rounded-xl border border-yellow-500/50 backdrop-blur-md">
                    <p className="text-2xl font-bold text-white tracking-wider">{getWinner().nickname}</p>
                </div>
                <button onClick={() => {setPlayers([]); setGameState('WAITING');}} className="mt-8 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-700 text-white font-bold rounded-full shadow-lg hover:shadow-green-500/50 transform hover:scale-105 transition-all">PLAY AGAIN</button>
            </div>
        </div>
      )}

      {/* LOGS */}
      <div className="absolute bottom-12 left-2 w-48 sm:bottom-4 sm:left-4 sm:w-64 h-32 sm:h-48 overflow-hidden pointer-events-none opacity-80 z-40">
          <div className="flex flex-col justify-end h-full gap-1">
              {logs.map((log) => (
                  <div key={log.id} className="bg-black/40 backdrop-blur-md px-3 py-1 rounded text-[10px] sm:text-xs animate-in slide-in-from-left fade-in">
                      <span className="font-bold text-blue-300">{log.user}:</span> <span className="text-white">{log.message}</span>
                  </div>
              ))}
          </div>
      </div>
      
      {/* GIFT POPUP */}
      {lastEvent && lastEvent.type === 'gift' && (
          <div className="absolute top-1/4 animate-bounce bg-pink-500 text-white px-6 py-3 rounded-xl shadow-xl z-50 border-4 border-white">
              <span className="font-bold">{lastEvent.nickname}</span> sent {lastEvent.giftName}! 🎁
          </div>
      )}

      {/* INSTRUCTIONS */}
      <div className="absolute bottom-2 sm:bottom-4 text-center w-full text-slate-500 text-[8px] sm:text-[10px] pointer-events-none z-40">
          Use !join to play • Answer in chat • No repeating words
      </div>

      <style>{`
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