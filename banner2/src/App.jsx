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
  const audioRef = useRef(new Audio());
  const trackRefs = useRef([]);
  const [progress, setProgress] = useState(0); // Поточний час треку
  const [duration, setDuration] = useState(0); // Загальний час треку
  const [isShuffle, setIsShuffle] = useState(false); // Стан для шафлу
  const [isRepeat, setIsRepeat] = useState(false); // Стан для повтору

  const tracks = [
    {
      title: "Lord Of Chaos",
      artist: "Ken Carson",
      audioUrl: "src/Songs/1 Lord Of Chaos - Ken Carson.mp3",
    },
    {
      title: "Xposed",
      artist: "Ken Carson",
      audioUrl: "src/Songs/2 Xposed - Ken Carson.mp3",
    },
    {
      title: "Money Spread",
      artist: "Ken Carson",
      audioUrl: "src/Songs/3 Money Spread - Ken Carson.mp3",
    },
    {
      title: "Root Of All Evil",
      artist: "Ken Carson",
      audioUrl: "src/Songs/4 Root Of All Evil - Ken Carson.mp3",
    },
    {
      title: "K-Hole",
      artist: "Ken Carson",
      audioUrl: "src/Songs/5 K-Hole - Ken Carson.mp3",
    },
    {
      title: "Trap Jump",
      artist: "Ken Carson",
      audioUrl: "src/Songs/6 Trap Jump - Ken Carson.mp3",
    },
    {
      title: "Blakk Rokkstar",
      artist: "Ken Carson",
      audioUrl: "src/Songs/7 Blakk Rokkstar - Ken Carson.mp3",
    },
    {
      title: "LiveLeak",
      artist: "Ken Carson",
      audioUrl: "src/Songs/8 LiveLeak - Ken Carson.mp3",
    },
    {
      title: "Diamonds",
      artist: "Ken Carson",
      audioUrl: "src/Songs/9 Diamonds - Ken Carson.mp3",
    },
    {
      title: "Dismantled",
      artist: "Ken Carson",
      audioUrl: "src/Songs/10 Dismantled - Ken Carson.mp3",
    },
    {
      title: "200 Kash",
      artist: "Ken Carson",
      audioUrl: "src/Songs/11 200 Kash - Ken Carson.mp3",
    },
    {
      title: "Down2Earth",
      artist: "Ken Carson",
      audioUrl: "src/Songs/12 Down2Earth - Ken Carson.mp3",
    },
    {
      title: "Confetti",
      artist: "Ken Carson",
      audioUrl: "src/Songs/13 Confetti - Ken Carson.mp3",
    },
    {
      title: "Naked",
      artist: "Ken Carson",
      audioUrl: "src/Songs/14 Naked - Ken Carson.mp3",
    },
    {
      title: "Kryptonite",
      artist: "Ken Carson",
      audioUrl: "src/Songs/15 Kryptonite - Ken Carson.mp3",
    },
    {
      title: "Psycho",
      artist: "Ken Carson",
      audioUrl: "src/Songs/16 Psycho - Ken Carson.mp3",
    },
    {
      title: "Inferno",
      artist: "Ken Carson",
      audioUrl: "src/Songs/17 Inferno - Ken Carson.mp3",
    },
    {
      title: "Thx",
      artist: "Ken Carson",
      audioUrl: "src/Songs/18 Thx - Ken Carson.mp3",
    },
    {
      title: "2000",
      artist: "Ken Carson",
      audioUrl: "src/Songs/19 2000 - Ken Carson.mp3",
    },
    {
      title: "Evolution",
      artist: "Ken Carson",
      audioUrl: "src/Songs/20 Evolution - Ken Carson.mp3",
    },
    {
      title: "Ghoul",
      artist: "Ken Carson",
      audioUrl: "src/Songs/21 Ghoul - Ken Carson.mp3",
    },
    {
      title: "Off The Meter",
      artist: "Ken Carson",
      audioUrl: "src/Songs/22 Ken Carson - Off The Meter.mp3",
    },
  ];

  useEffect(() => {
    audioRef.current.src = tracks[currentTrack].audioUrl;
    audioRef.current.volume = volume;
    audioRef.current.playbackRate = speed;
    if (playing) audioRef.current.play();
    audioRef.current.onloadedmetadata = () => {
      setDuration(audioRef.current.duration); // Встановлюємо тривалість треку
    };
  }, [currentTrack]);
  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime); // Оновлюємо поточний час треку
        setDuration(audioRef.current.duration); // Оновлюємо загальну тривалість треку
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", updateProgress);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", updateProgress);
      }
    };
  }, []);
  useEffect(() => {
    audioRef.current.volume = volume;
    audioRef.current.playbackRate = speed;
  }, [volume, speed]);

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

  const togglePlay = () => {
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch((err) => console.error("Playback error:", err));
    }
    setPlaying(!playing);
  };
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime; // Оновлюємо час треку
      setProgress(newTime); // Оновлюємо стан прогресу
    }
  };
  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev); // Перемикаємо стан шафлу
  };

  const toggleRepeat = () => {
    setIsRepeat((prev) => !prev); // Перемикаємо стан повтору
  };
  const changeTrack = (index) => {
    setIsRepeat(false);

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrack(randomIndex);
    } else {
      if (index < 0) {
        setCurrentTrack(tracks.length - 1);
      } else if (index >= tracks.length) {
        setCurrentTrack(0);
      } else {
        setCurrentTrack(index);
      }
    }

    audioRef.current.currentTime = 0;
    audioRef.current.pause(); // Зупиняємо попередній трек
    audioRef.current
      .play()
      .catch((err) => console.error("Playback error:", err)); // Відтворюємо новий трек
    setPlaying(true);
  };
  useEffect(() => {
    console.log("Shuffle button class:", isShuffle ? "active" : "inactive");
    console.log("Repeat button class:", isRepeat ? "active" : "inactive");
  }, [isShuffle, isRepeat]);
  const adjustVolume = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  // Додаємо обробник завершення треку
  useEffect(() => {
    const handleTrackEnd = () => {
      if (isRepeat) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      } else {
        changeTrack(currentTrack + 1);
      }
    };

    const audio = audioRef.current;
    audio.addEventListener("ended", handleTrackEnd);

    return () => {
      audio.removeEventListener("ended", handleTrackEnd);
    };
  }, [isRepeat, currentTrack, changeTrack]);
  const adjustSpeed = (e) => {
    const newSpeed = parseFloat(e.target.value);
    setSpeed(newSpeed);
    audioRef.current.playbackRate = newSpeed;
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  return (
    <div className="container">
      <ParticlesComponent />
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
                    href="https://t.me/yourtelegramusername"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="https://img.icons8.com/ios-filled/50/telegram.png"
                      alt="Telegram"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/yourinstagramusername/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="https://img.icons8.com/ios-filled/50/instagram-new--v1.png"
                      alt="Instagram"
                    />
                  </a>
                  <a
                    href="https://github.com/yourgithubusername"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="https://img.icons8.com/ios-filled/50/github.png"
                      alt="GitHub"
                    />
                  </a>
                  <a
                    href="https://discord.com/users/yourdiscordusername"
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
                src="src/Songs/cover.gif"
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
              {tracks.map((track, index) => (
                <div
                  key={index}
                  ref={(el) => (trackRefs.current[index] = el)}
                  className={`track ${index === currentTrack ? "active" : ""}`}
                  onClick={() => changeTrack(index)}
                >
                  {track.title}
                </div>
              ))}
            </div>

            <div className="music-controls">
              <div className="progress-container">
                <span className="current-time">{formatTime(progress)}</span>
                <div className="progress-bar-wrapper">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${(progress / duration) * 100}%` }}
                  ></div>
                  <input
                    type="range"
                    className="progress-bar"
                    min="0"
                    max={duration || 0}
                    value={progress}
                    onChange={(e) => handleSeek(e)}
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
                <FaBackward onClick={() => changeTrack(currentTrack - 1)} />
                <div className="play-button" onClick={togglePlay}>
                  {playing ? <FaPause /> : <FaPlay />}
                </div>
                <FaForward onClick={() => changeTrack(currentTrack + 1)} />
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
                    ⏩ Speed
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
