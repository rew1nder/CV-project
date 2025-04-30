import { useEffect, useState, useRef } from "react";
import "./App.css";
import "./MusicBlock.css";
import ParticlesComponent from "./components/Particles";
import {
  FaArrowRight,
  FaArrowLeft,
  FaVolumeUp,
  FaPlay,
  FaPause,
  FaBackward,
  FaForward,
  FaRandom,
  FaRedo,
} from "react-icons/fa";

const scrambledCode = [
  "const 名称 = 'タラス';",
  "const 苗字 = 'セン';",
  "const 職業 = 'フロントエンド開発者';",
  "const メール = 'ディロヴィー・タラス@gmail.com';",
  "const %#decode(名称, 苗字) -> 'Taras Sen';",
  "const %#decode(職業) -> 'Front-End Developer';",
  "const %#decode(メール) -> 'diloviytaras@gmail.com';",
  "const アイコン = icons;",
  "function (アイコン) {",
  "  return アイコン;",
];

const alphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

const App = () => {
  const [codeLines, setCodeLines] = useState([]);
  const [displayText, setDisplayText] = useState({
    name: "",
    title: "",
    email: "",
  });
  const [fadeKeys, setFadeKeys] = useState({ name: 0, title: 0, email: 0 });
  const [iconsVisible, setIconsVisible] = useState(false);
  const [showMusicBlock, setShowMusicBlock] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const gainNodeRef = useRef(null);
  const trackRefs = useRef([]);
  const audioBuffersRef = useRef({});
  const startTimeRef = useRef(0);
  const pauseTimeRef = useRef(0);
  const animationFrameRef = useRef(null);
  const speedChangeTimeoutRef = useRef(null);
  const lastUpdateRef = useRef(0);

  const tracks = [
    {
      title: "1  Lord Of Chaos",
      artist: "Ken Carson",
      audioUrl: "/Songs/1 Lord Of Chaos - Ken Carson.mp3",
    },
    {
      title: "2  Xposed",
      artist: "Ken Carson",
      audioUrl: "/Songs/2 Xposed - Ken Carson.mp3",
    },
    {
      title: "3  Money Spread",
      artist: "Ken Carson",
      audioUrl: "/Songs/3 Money Spread - Ken Carson.mp3",
    },
    {
      title: "4  Root Of All Evil",
      artist: "Ken Carson",
      audioUrl: "/Songs/4 Root Of All Evil - Ken Carson.mp3",
    },
    {
      title: "5  K-Hole",
      artist: "Ken Carson",
      audioUrl: "/Songs/5 K-Hole - Ken Carson.mp3",
    },
    {
      title: "7  Trap Jump",
      artist: "Ken Carson",
      audioUrl: "/Songs/6 Trap Jump - Ken Carson.mp3",
    },
    {
      title: "8  Blakk Rokkstar",
      artist: "Ken Carson",
      audioUrl: "/Songs/7 Blakk Rokkstar - Ken Carson.mp3",
    },
    {
      title: "9  LiveLeak",
      artist: "Ken Carson",
      audioUrl: "/Songs/8 LiveLeak - Ken Carson.mp3",
    },
    {
      title: "10 Diamonds",
      artist: "Ken Carson",
      audioUrl: "/Songs/9 Diamonds - Ken Carson.mp3",
    },
    {
      title: "11 Dismantled",
      artist: "Ken Carson",
      audioUrl: "/Songs/10 Dismantled - Ken Carson.mp3",
    },
    {
      title: "12 200 Kash",
      artist: "Ken Carson",
      audioUrl: "/Songs/11 200 Kash - Ken Carson.mp3",
    },
    {
      title: "13 Down2Earth",
      artist: "Ken Carson",
      audioUrl: "/Songs/12 Down2Earth - Ken Carson.mp3",
    },
    {
      title: "14 Confetti",
      artist: "Ken Carson",
      audioUrl: "/Songs/13 Confetti - Ken Carson.mp3",
    },
    {
      title: "15 Naked",
      artist: "Ken Carson",
      audioUrl: "/Songs/14 Naked - Ken Carson.mp3",
    },
    {
      title: "16 Kryptonite",
      artist: "Ken Carson",
      audioUrl: "/Songs/15 Kryptonite - Ken Carson.mp3",
    },
    {
      title: "17 Psycho",
      artist: "Ken Carson",
      audioUrl: "/Songs/16 Psycho - Ken Carson.mp3",
    },
    {
      title: "18 Inferno",
      artist: "Ken Carson",
      audioUrl: "/Songs/17 Inferno - Ken Carson.mp3",
    },
    {
      title: "19 Thx",
      artist: "Ken Carson",
      audioUrl: "/Songs/18 Thx - Ken Carson.mp3",
    },
    {
      title: "20 2000",
      artist: "Ken Carson",
      audioUrl: "/Songs/19 2000 - Ken Carson.mp3",
    },
    {
      title: "21 Evolution",
      artist: "Ken Carson",
      audioUrl: "/Songs/20 Evolution - Ken Carson.mp3",
    },
    {
      title: "22 Ghoul",
      artist: "Ken Carson",
      audioUrl: "/Songs/21 Ghoul - Ken Carson.mp3",
    },
    {
      title: "23 Off The Meter (with Playboi Carti & Destroy Lonely)",
      artist: "Ken Carson",
      audioUrl: "/Songs/22 Ken Carson - Off The Meter.mp3",
    },
  ];

  // Initialize AudioContext and preload all tracks
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
      window.webkitAudioContext)();
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.connect(audioContextRef.current.destination);

    // Preload all tracks
    const preloadTracks = async () => {
      console.log("Starting preload of all tracks...");
      const startTime = performance.now();
      for (let i = 0; i < tracks.length; i++) {
        if (!audioBuffersRef.current[i]) {
          await loadTrack(i);
        }
      }
      const endTime = performance.now();
      console.log(`All tracks preloaded in ${endTime - startTime} ms`);
    };
    preloadTracks();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (speedChangeTimeoutRef.current) {
        clearTimeout(speedChangeTimeoutRef.current);
      }
    };
  }, []);

  // Update duration when currentTrack changes
  useEffect(() => {
    if (audioBuffersRef.current[currentTrack]) {
      setDuration(audioBuffersRef.current[currentTrack].duration);
      console.log(
        "Duration set for current track:",
        audioBuffersRef.current[currentTrack].duration
      );
    }
  }, [currentTrack]);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        volume,
        audioContextRef.current.currentTime
      );
    }
  }, [volume]);

  // Restore playback when switching to music block
  useEffect(() => {
    if (showMusicBlock && playing) {
      createSourceNode(pauseTimeRef.current);
    }
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [showMusicBlock]);

  // Update progress using requestAnimationFrame
  const updateProgress = () => {
    if (!playing || !audioContextRef.current || !sourceNodeRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      console.log("Progress update stopped:", {
        playing,
        audioContext: !!audioContextRef.current,
        sourceNode: !!sourceNodeRef.current,
      });
      return;
    }
    const currentTime =
      (audioContextRef.current.currentTime - startTimeRef.current) * speed;
    const clampedTime = Math.max(0, Math.min(currentTime, duration || 0));
    const now = performance.now();
    if (now - lastUpdateRef.current >= 50) {
      setProgress(clampedTime);
      lastUpdateRef.current = now;
      console.log("Progress updated:", {
        currentTime,
        clampedTime,
        duration,
        delta: currentTime - clampedTime,
      });
    }
    if (clampedTime < (duration || Infinity)) {
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    } else {
      setProgress(duration || 0);
      cancelAnimationFrame(animationFrameRef.current);
      setPlaying(false);
    }
  };

  // Create and configure audio source node
  const createSourceNode = (startTime = 0) => {
    if (!audioBuffersRef.current[currentTrack] || !audioContextRef.current) {
      console.log("Cannot create source node:", {
        buffer: !!audioBuffersRef.current[currentTrack],
        audioContext: !!audioContextRef.current,
      });
      return;
    }

    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }

    sourceNodeRef.current = audioContextRef.current.createBufferSource();
    sourceNodeRef.current.buffer = audioBuffersRef.current[currentTrack];
    sourceNodeRef.current.playbackRate.setValueAtTime(
      speed,
      audioContextRef.current.currentTime
    );
    sourceNodeRef.current.connect(gainNodeRef.current);
    sourceNodeRef.current.start(0, startTime / speed);
    startTimeRef.current =
      audioContextRef.current.currentTime - startTime / speed;

    sourceNodeRef.current.onended = () => {
      if (!playing) return;
      if (
        audioContextRef.current.currentTime - startTimeRef.current <
        duration / speed
      )
        return;
      if (isRepeat) {
        createSourceNode(0);
        setPlaying(true);
      } else {
        changeTrack(currentTrack + 1, false); // Автоматичний перехід
      }
    };

    cancelAnimationFrame(animationFrameRef.current);
    lastUpdateRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(updateProgress);
  };

  // Handle track change
  const changeTrack = (index, isManualSelection = false) => {
    if (isManualSelection) {
      setIsShuffle(false); // Вимикаємо Shuffle при ручному виборі
    }

    let newIndex = index;

    if (!isManualSelection && isShuffle) {
      newIndex = Math.floor(Math.random() * tracks.length);
    } else {
      if (index < 0) {
        newIndex = tracks.length - 1;
      } else if (index >= tracks.length) {
        newIndex = 0;
      }
    }

    setCurrentTrack(newIndex);
    setProgress(0);
    pauseTimeRef.current = 0;
    if (!playing) setPlaying(true);
  };
  // Handle track change
  useEffect(() => {
    const loadAndPlay = async () => {
      if (!audioBuffersRef.current[currentTrack]) {
        console.log(`Track ${currentTrack} not in cache, loading...`);
        await loadTrack(currentTrack);
      }
      setProgress(0);
      pauseTimeRef.current = 0;
      if (playing) {
        createSourceNode();
      }
    };
    loadAndPlay();
  }, [currentTrack]);

  // Load track function
  const loadTrack = async (trackIndex) => {
    const startTime = performance.now();
    if (audioBuffersRef.current[trackIndex]) {
      console.log(
        `Track ${trackIndex} already in cache, duration:`,
        audioBuffersRef.current[trackIndex].duration
      );
      return;
    }
    try {
      const response = await fetch(tracks[trackIndex].audioUrl);
      if (!response.ok)
        throw new Error(`Failed to load ${tracks[trackIndex].audioUrl}`);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(
        arrayBuffer
      );
      audioBuffersRef.current[trackIndex] = audioBuffer;
      if (trackIndex === currentTrack) {
        setDuration(audioBuffer.duration);
      }
      const endTime = performance.now();
      console.log(
        `Track ${trackIndex} loaded in ${endTime - startTime} ms, duration:`,
        audioBuffer.duration
      );
    } catch (err) {
      console.error(`Error loading track ${trackIndex}:`, err);
    }
  };

  // Handle play/pause
  const togglePlay = () => {
    if (!audioBuffersRef.current[currentTrack]) return;

    if (!playing) {
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
      createSourceNode(pauseTimeRef.current);
    } else {
      pauseTimeRef.current =
        (audioContextRef.current.currentTime - startTimeRef.current) * speed;
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
      }
      cancelAnimationFrame(animationFrameRef.current);
    }
    setPlaying(!playing);
  };

  // Handle seeking
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setProgress(newTime);
    pauseTimeRef.current = newTime;
    if (playing) {
      createSourceNode(newTime);
    }
  };

  // Handle speed adjustment with debounce
  const adjustSpeed = (e) => {
    const newSpeed = parseFloat(e.target.value);
    setSpeed(newSpeed);
    if (playing && sourceNodeRef.current) {
      if (speedChangeTimeoutRef.current) {
        clearTimeout(speedChangeTimeoutRef.current);
      }
      speedChangeTimeoutRef.current = setTimeout(() => {
        const currentTime =
          (audioContextRef.current.currentTime - startTimeRef.current) * speed;
        pauseTimeRef.current = currentTime;
        createSourceNode(currentTime);
      }, 100);
    }
  };

  // Shuffle and repeat toggles
  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
  };

  const toggleRepeat = () => {
    setIsRepeat((prev) => !prev);
  };

  // Volume adjustment
  const adjustVolume = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  // Scroll active track into view
  useEffect(() => {
    const activeTrack = trackRefs.current[currentTrack];
    if (activeTrack) {
      activeTrack.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [currentTrack]);

  // Code typing animation
  useEffect(() => {
    let currentLine = 0;
    let currentChar = 0;
    let tempCodeLines = [];
    let interval = setInterval(typeCode, 20);

    function typeCode() {
      if (currentLine < scrambledCode.length) {
        const line = scrambledCode[currentLine];
        if (!tempCodeLines[currentLine]) tempCodeLines[currentLine] = "";
        tempCodeLines[currentLine] += line[currentChar] || "";
        setCodeLines([...tempCodeLines]);
        currentChar++;
        if (currentChar >= line.length) {
          handleRightBlock(currentLine);
          currentChar = 0;
          currentLine++;
        }
      } else {
        clearInterval(interval);
        setIconsVisible(true);
      }
    }

    return () => clearInterval(interval);
  }, []);

  const animateLetterByLetter = (field, finalText, speed = 25, steps = 8) => {
    const length = finalText.length;
    const displayArr = Array(length).fill("");
    let stepCount = 0;
    const interval = setInterval(() => {
      for (let i = 0; i < length; i++) {
        if (stepCount < steps) {
          displayArr[i] = alphabet[Math.floor(Math.random() * alphabet.length)];
        } else {
          displayArr[i] = finalText[i];
        }
      }
      setDisplayText((prev) => ({ ...prev, [field]: displayArr.join("") }));
      stepCount++;
      if (stepCount > steps) clearInterval(interval);
    }, speed);
  };

  const fadeIn = (field, value) => {
    setDisplayText((prev) => ({ ...prev, [field]: value }));
    setFadeKeys((prev) => ({ ...prev, [field]: prev[field] + 1 }));
  };

  const handleRightBlock = (lineIndex) => {
    if (lineIndex === 0) fadeIn("name", "タラス");
    if (lineIndex === 1) fadeIn("name", "タラス セン");
    if (lineIndex === 2) fadeIn("title", "フロントエンド開発者");
    if (lineIndex === 3) fadeIn("email", "ディロヴィー・タラス@gmail.com");
    if (lineIndex === 4) animateLetterByLetter("name", "Taras Sen", 25, 25);
    if (lineIndex === 5)
      animateLetterByLetter("title", "Front-End Developer", 25, 25);
    if (lineIndex === 6)
      animateLetterByLetter("email", "diloviytaras@gmail.com", 25, 25);
    if (lineIndex === 7) setIconsVisible(true);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="container">
      <ParticlesComponent id="tsparticles" />
      <div className="content">
        {!showMusicBlock && (
          <>
            <div className="code-block">
              {codeLines.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
            <div className="text-block">
              <h1 key={fadeKeys.name} className="erd-style fade-in name">
                <a
                  href="https://www.linkedin.com/in/taras-sen/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {displayText.name}
                </a>
              </h1>
              <div key={fadeKeys.title} className="title fade-in">
                {displayText.title}
              </div>
              <div key={fadeKeys.email} className="email fade-in">
                <a
                  href="mailto:diloviytaras@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {displayText.email}
                </a>
              </div>
              {iconsVisible && (
                <div className="icons fade-in">
                  <a
                    href="https://t.me/wegonbeokay999"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="https://img.icons8.com/ios-filled/50/telegram.png"
                      alt="Telegram"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/rew1nderr?igsh=anFhbXo3ZzR4anVs&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="https://img.icons8.com/ios-filled/50/instagram-new--v1.png"
                      alt="Instagram"
                    />
                  </a>
                  <a
                    href="https://github.com/rew1nder"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="https://img.icons8.com/ios-filled/50/github.png"
                      alt="GitHub"
                    />
                  </a>
                  <a
                    href="https://discord.com/users/401350525167206410"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="https://img.icons8.com/ios-filled/50/discord-logo.png"
                      alt="Discord"
                    />
                  </a>
                  <img
                    src="https://img.icons8.com/ios-filled/50/html.png"
                    alt="html"
                  />
                  <img
                    src="https://img.icons8.com/ios-filled/50/css.png"
                    alt="CSS"
                  />
                  <img
                    src="https://img.icons8.com/ios-filled/50/javascript.png"
                    alt="JS"
                  />
                  <img
                    src="https://img.icons8.com/ios-filled/50/react-native.png"
                    alt="React"
                    className="rotate-react"
                  />
                </div>
              )}
            </div>
          </>
        )}

        {showMusicBlock && (
          <div className="music-block fade-in">
            <div className="album-info">
              <img
                src="/Songs/cover.gif"
                alt="Album Cover"
                className="album-cover"
              />
              <div className="album-meta">
                <h2 className="album-title">More Chaos</h2>
                <h3 className="album-artist">Ken Carson</h3>
                <p className="album-release">Released April 11, 2025</p>
              </div>
            </div>
            <div className="tracks">
              {tracks.map((track, index) => {
                const numberMatch = track.title.match(/^(\d+)/);
                const number = numberMatch ? numberMatch[1] : "";
                const titleWithoutNumber = track.title.replace(/^(\d+\s*)/, "");

                return (
                  <div
                    key={index}
                    ref={(el) => (trackRefs.current[index] = el)}
                    className={`track ${
                      index === currentTrack ? "active" : ""
                    }`}
                    onClick={() => changeTrack(index, true)}
                  >
                    {index === currentTrack && playing ? ( // Еквалайзер тільки для активного треку, який грає
                      <span className="equalizer">
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                      </span>
                    ) : (
                      <span className="Number">{number}</span> // Показуємо номер треку, якщо не грає
                    )}{" "}
                    {titleWithoutNumber}
                  </div>
                );
              })}
            </div>

            <div className="music-controls">
              <div className="progress-container">
                <span className="current-time">{formatTime(progress)}</span>
                <div className="progress-bar-wrapper">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: duration
                        ? `${(progress / duration) * 100}%`
                        : "0%",
                    }}
                  ></div>
                  <input
                    type="range"
                    className="progress-bar"
                    min="0"
                    max={duration || 0}
                    step="0.1"
                    value={progress}
                    onChange={handleSeek}
                    onMouseUp={() => {
                      if (playing) {
                        createSourceNode(pauseTimeRef.current);
                      }
                    }}
                    onTouchEnd={() => {
                      if (playing) {
                        createSourceNode(pauseTimeRef.current);
                      }
                    }}
                  />
                </div>
                <span className="total-time">{formatTime(duration)}</span>
              </div>
              <div className="track-controls">
                <button
                  className={`shuffle-button ${isShuffle ? "active" : ""}`}
                  onClick={toggleShuffle}
                >
                  <FaRandom />
                </button>
                <FaBackward
                  onClick={() => changeTrack(currentTrack - 1, false)}
                />
                <div className="play-button" onClick={togglePlay}>
                  {playing ? <FaPause /> : <FaPlay />}
                </div>
                <FaForward
                  onClick={() => changeTrack(currentTrack + 1, false)}
                />
                <button
                  className={`repeat-button ${isRepeat ? "active" : ""}`}
                  onClick={toggleRepeat}
                >
                  <FaRedo />
                </button>
              </div>
              <div className="audio-controls">
                <div className="volume-control">
                  <label htmlFor="volumeRange" className="no-select">
                    🔊 Volume
                  </label>
                  <input
                    id="volumeRange"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={adjustVolume}
                  />
                  <span className="volume-value no-select">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <div className="speed-control">
                  <label htmlFor="speedRange" className="no-select">
                    ⏩ Speed + Pitch
                  </label>
                  <input
                    id="speedRange"
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.01"
                    value={speed}
                    onChange={adjustSpeed}
                  />
                  <span className="speed-value no-select">
                    {Math.round(speed * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {iconsVisible && (
          <div
            className={`toggle-button ${
              showMusicBlock ? "left-position" : "right-position"
            }`}
            onClick={() => setShowMusicBlock(!showMusicBlock)}
          >
            <i></i>
            <svg>
              <use xlinkHref="#circle"></use>
            </svg>
          </div>
        )}

        <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
          <symbol
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 44 44"
            id="circle"
            fill="none"
            stroke="currentColor"
          >
            <circle r="20" cx="22" cy="22"></circle>
          </symbol>
        </svg>
      </div>
    </div>
  );
};

export default App;
