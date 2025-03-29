import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';

interface AudioAnalyzerOptions {
  fftSize?: number;
  smoothingTimeConstant?: number;
}

interface AudioData {
  waveform: Float32Array;
  frequencies: Uint8Array;
  amplitudes: Uint8Array;
  volume: number;
  ready: boolean;
}

const defaultOptions: AudioAnalyzerOptions = {
  fftSize: 2048,
  smoothingTimeConstant: 0.8,
};

export function useAudioAnalyzer(options: AudioAnalyzerOptions = {}) {
  const opts = { ...defaultOptions, ...options };
  
  // 状态
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioSource, setAudioSource] = useState<MediaElementAudioSourceNode | null>(null);
  const [audioData, setAudioData] = useState<AudioData>({
    waveform: new Float32Array(0),
    frequencies: new Uint8Array(0),
    amplitudes: new Uint8Array(0),
    volume: 0,
    ready: false,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState<string | null>(null);
  
  // 引用
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // 初始化音频上下文
  useEffect(() => {
    if (!audioContext) {
      const context = new AudioContext();
      setAudioContext(context);
    }
    
    return () => {
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [audioContext]);
  
  // 设置音频元素
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.addEventListener('play', () => setIsPlaying(true));
      audio.addEventListener('pause', () => setIsPlaying(false));
      audio.addEventListener('ended', () => setIsPlaying(false));
      audioRef.current = audio;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);
  
  // 加载音频文件
  useEffect(() => {
    if (audioRef.current && audioFile) {
      audioRef.current.src = audioFile;
      audioRef.current.load();
    }
  }, [audioFile]);
  
  // 设置分析器
  useEffect(() => {
    if (audioContext && audioRef.current && !audioSource) {
      const source = audioContext.createMediaElementSource(audioRef.current);
      const analyzer = audioContext.createAnalyser();
      
      analyzer.fftSize = opts.fftSize as number;
      analyzer.smoothingTimeConstant = opts.smoothingTimeConstant as number;
      
      source.connect(analyzer);
      analyzer.connect(audioContext.destination);
      
      setAudioSource(source);
      analyzerRef.current = analyzer;
      
      // 初始化数据数组
      setAudioData(prev => ({
        ...prev,
        waveform: new Float32Array(analyzer.fftSize),
        frequencies: new Uint8Array(analyzer.frequencyBinCount),
        amplitudes: new Uint8Array(analyzer.frequencyBinCount),
        ready: true,
      }));
    }
  }, [audioContext, audioSource, opts.fftSize, opts.smoothingTimeConstant]);
  
  // 分析音频数据
  useEffect(() => {
    if (!analyzerRef.current || !audioData.ready || !isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }
    
    const analyzer = analyzerRef.current;
    const waveform = new Float32Array(analyzer.fftSize);
    const frequencies = new Uint8Array(analyzer.frequencyBinCount);
    const amplitudes = new Uint8Array(analyzer.frequencyBinCount);
    
    const updateData = () => {
      analyzer.getFloatTimeDomainData(waveform);
      analyzer.getByteFrequencyData(frequencies);
      analyzer.getByteTimeDomainData(amplitudes);
      
      // 计算音量
      let sum = 0;
      for (let i = 0; i < waveform.length; i++) {
        sum += waveform[i] * waveform[i];
      }
      const volume = Math.sqrt(sum / waveform.length);
      
      setAudioData({
        waveform,
        frequencies,
        amplitudes,
        volume,
        ready: true,
      });
      
      animationFrameRef.current = requestAnimationFrame(updateData);
    };
    
    animationFrameRef.current = requestAnimationFrame(updateData);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [audioData.ready, isPlaying]);
  
  // 处理用户操作的函数
  const loadAudio = (file: File) => {
    const url = URL.createObjectURL(file);
    setAudioFile(url);
  };
  
  const loadAudioFromUrl = (url: string) => {
    setAudioFile(url);
  };
  
  const play = () => {
    if (audioRef.current && audioContext) {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      audioRef.current.play();
    }
  };
  
  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };
  
  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
  
  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  };
  
  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };
  
  return {
    audioData,
    isPlaying,
    audioRef,
    loadAudio,
    loadAudioFromUrl,
    play,
    pause,
    stop,
    setVolume,
    seek,
  };
}