import React, { useEffect, useRef } from "react";

const MusicVisualizer = ({ audioElement }) => {
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (audioElement) {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioElement);

      analyser.fftSize = 256; // Розмір FFT (чим більше, тим точніше)
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      analyserRef.current = analyser;
    }
  }, [audioElement]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const analyser = analyserRef.current;

    if (!canvas || !ctx || !analyser) return;

    const renderVisualizer = () => {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 100; // Радіус кола
      const barWidth = 5; // Ширина стовпців
      const barCount = 64; // Кількість стовпців
      const angleStep = (Math.PI * 2) / barCount;

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i];
        const barHeight = (value / 255) * 100; // Висота стовпця залежить від частоти
        const angle = i * angleStep;

        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barHeight);
        const y2 = centerY + Math.sin(angle) * (radius + barHeight);

        ctx.strokeStyle = `rgb(${value}, ${255 - value}, ${value / 2})`; // Динамічний колір
        ctx.lineWidth = barWidth;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(renderVisualizer);
    };

    renderVisualizer();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      style={{ display: "block", margin: "0 auto" }}
    />
  );
};

export default MusicVisualizer;
