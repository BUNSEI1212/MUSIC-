import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAudioAnalyzer } from '../hooks/useAudioAnalyzer';
import * as visualEffects from '../utils/visualEffects';

// スタイルコンポーネント
const VisualizerContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  color: #ba68c8;
  margin-bottom: 20px;
  text-align: center;
`;

const ControlPanel = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
`;

const ControlRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ControlGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #ddd;
  font-weight: 500;
`;

const Button = styled.button<{ $primary?: boolean }>`
  background-color: ${props => props.$primary ? '#9c27b0' : '#333'};
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$primary ? '#ba68c8' : '#444'};
  }
  
  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  background-color: #333;
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #444;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  appearance: none;
  cursor: pointer;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(186, 104, 200, 0.3);
  }
`;

const ColorInput = styled.input`
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: transparent;
  
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  
  &::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
  }
`;

const ColorInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: #333;
  border-radius: 3px;
  margin-top: 5px;
  position: relative;
  cursor: pointer;
`;

const Progress = styled.div<{ $width: string }>`
  height: 100%;
  width: ${props => props.$width};
  background-color: #ba68c8;
  border-radius: 3px;
`;

const CanvasContainer = styled.div`
  width: 100%;
  height: 500px;
  overflow: hidden;
  border-radius: 8px;
  background-color: #111;
  position: relative;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`;

// 定义可视化效果类型
enum VisualizationType {
  SPECTRUM_BARS = 'spectrumBars',
  WAVEFORM = 'waveform',
  CIRCULAR = 'circular',
  PARTICLES = 'particles',
  KALEIDOSCOPE = 'kaleidoscope',
  AUDIO_WATERFALL = 'audioWaterfall',
  ORGANIC_FORM = 'organicForm',
  TETRIS = 'tetris',
  LIP_SYNC = 'lipSync',
  MUSIC_METEOR = 'musicMeteor',
  SOUND_GARDEN = 'soundGarden',
  DNA_HELIX = 'dnaHelix',
  DIGITAL_RIPPLE = 'digitalRipple',
  PARTICLE_TEXT = 'particleText'
}

// サンプル音楽リスト
const SAMPLE_TRACKS = [
  { name: 'サンプル音楽 1', url: 'https://assets.codepen.io/4358584/Anitek_-_Komorebi.mp3' },
  { name: 'サンプル音楽 2', url: 'https://assets.codepen.io/4358584/Moonbase_-_Dinos.mp3' },
  { name: 'サンプル音楽 3', url: 'https://assets.codepen.io/4358584/n-Dimensions_-_Cyber_Diva.mp3' }
];

function VisualizerPage() {
  // オーディオ分析フック
  const { 
    audioData, 
    isPlaying, 
    audioRef,
    loadAudio, 
    loadAudioFromUrl, 
    play, 
    pause, 
    stop, 
    setVolume 
  } = useAudioAnalyzer();
  
  // 状態管理
  const [visualType, setVisualType] = useState<VisualizationType>(VisualizationType.SPECTRUM_BARS);
  const [startColor, setStartColor] = useState('#9c27b0');
  const [endColor, setEndColor] = useState('#3f51b5');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [fileName, setFileName] = useState('ファイルが選択されていません');
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<visualEffects.Particle[]>([]);
  
  // 初期化画布
  useEffect(() => {
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext('2d');
      
      // 設定画布サイズ
      const resizeCanvas = () => {
        if (canvasRef.current) {
          const container = canvasRef.current.parentElement;
          if (container) {
            canvasRef.current.width = container.clientWidth;
            canvasRef.current.height = container.clientHeight;
          }
        }
      };
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      // もし粒子効果なら初期化粒子
      if (visualType === VisualizationType.PARTICLES && canvasRef.current) {
        particlesRef.current = visualEffects.createParticles(
          100, 
          canvasRef.current.width, 
          canvasRef.current.height,
          { startColor, endColor }
        );
      }
      
      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }
  }, [visualType, startColor, endColor]);
  
  // 音楽イベント監聽
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const timeUpdateHandler = () => {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      };
      
      audio.addEventListener('timeupdate', timeUpdateHandler);
      audio.addEventListener('loadedmetadata', timeUpdateHandler);
      
      return () => {
        audio.removeEventListener('timeupdate', timeUpdateHandler);
        audio.removeEventListener('loadedmetadata', timeUpdateHandler);
      };
    }
  }, [audioRef]);
  
  // 描画視覚化効果
  useEffect(() => {
    // 如果数据未准备好或没有播放，不执行动画
    if (!audioData.ready || !canvasCtxRef.current || !canvasRef.current) {
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvasCtxRef.current;
    
    const draw = () => {
      if (!ctx || !canvas) return;
      
      const { frequencies, waveform, volume } = audioData;
      
      switch (visualType) {
        case VisualizationType.SPECTRUM_BARS:
          visualEffects.drawSpectrumBars(ctx, frequencies, canvas.width, canvas.height, {
            startColor,
            endColor
          });
          break;
        
        case VisualizationType.WAVEFORM:
          visualEffects.drawWaveform(ctx, waveform, canvas.width, canvas.height, {
            color: startColor,
            filled: true
          });
          break;
          
        case VisualizationType.CIRCULAR:
          visualEffects.drawCircularSpectrum(ctx, frequencies, canvas.width, canvas.height, {
            startColor,
            endColor,
            rotation: Date.now() * 0.0005
          });
          break;
          
        case VisualizationType.PARTICLES:
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // 更新粒子位置
          particlesRef.current = visualEffects.updateParticles(
            particlesRef.current, 
            canvas.width, 
            canvas.height, 
            volume
          );
          // 绘制粒子
          visualEffects.drawParticles(ctx, particlesRef.current, volume);
          break;
          
        case VisualizationType.KALEIDOSCOPE:
          visualEffects.drawKaleidoscope(ctx, frequencies, canvas.width, canvas.height, {
            startColor,
            endColor,
            segments: 8,
            rotation: Date.now() * 0.0002
          });
          break;
          
        case VisualizationType.AUDIO_WATERFALL:
          visualEffects.drawAudioWaterfall(ctx, frequencies, canvas.width, canvas.height, {
            startColor,
            endColor,
            speed: 2
          });
          break;
          
        case VisualizationType.ORGANIC_FORM:
          visualEffects.drawOrganicForm(ctx, frequencies, waveform, canvas.width, canvas.height, {
            startColor,
            endColor,
            complexity: 0.7 + volume * 0.3
          });
          break;
          
        case VisualizationType.TETRIS:
          visualEffects.drawTetris(ctx, frequencies, canvas.width, canvas.height, {
            startColor,
            endColor,
            speed: 1 + volume * 2
          });
          break;
          
        case VisualizationType.LIP_SYNC:
          visualEffects.drawLipSync(ctx, frequencies, waveform, canvas.width, canvas.height, {
            faceColor: startColor,
            lipColor: endColor
          });
          break;
          
        case VisualizationType.MUSIC_METEOR:
          visualEffects.drawMusicMeteorShower(ctx, frequencies, waveform, canvas.width, canvas.height, {
            startColor,
            endColor,
            density: 1 + volume
          });
          break;
          
        case VisualizationType.SOUND_GARDEN:
          visualEffects.drawSoundGarden(ctx, frequencies, waveform, canvas.width, canvas.height, {
            startColor,
            endColor,
            flowerDensity: 1 + volume * 0.5
          });
          break;
          
        case VisualizationType.DNA_HELIX:
          visualEffects.drawDNAHelix(ctx, frequencies, waveform, canvas.width, canvas.height, {
            startColor,
            endColor,
            pairStartColor: '#4CAF50',
            pairEndColor: '#8BC34A'
          });
          break;
          
        case VisualizationType.DIGITAL_RIPPLE:
          visualEffects.drawDigitalRipple(ctx, frequencies, waveform, canvas.width, canvas.height, {
            startColor,
            endColor,
            density: 1 + volume
          });
          break;
          
        case VisualizationType.PARTICLE_TEXT:
          visualEffects.drawParticleText(ctx, frequencies, waveform, canvas.width, canvas.height, {
            text: '音楽',
            startColor,
            endColor,
            textSize: 80
          });
          break;
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
    
    // アニメーションフレームをクリア
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioData, visualType, startColor, endColor]);
  
  // ファイル入力処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // 检查是否为NCM格式文件
      if (file.name.toLowerCase().endsWith('.ncm')) {
        alert('不支持NCM格式文件。请先将NCM转换为MP3或WAV格式后再上传。');
        return;
      }
      
      setFileName(file.name);
      loadAudio(file);
    }
  };
  
  // サンプル音楽選択処理
  const handleSampleTrack = (url: string) => {
    loadAudioFromUrl(url);
    const track = SAMPLE_TRACKS.find(t => t.url === url);
    if (track) {
      setFileName(track.name);
    }
  };
  
  // 進行状況クリック処理
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = offsetX / rect.width;
    
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
  };
  
  // 音量変更処理
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolumeState(newVolume);
    setVolume(newVolume);
  };
  
  // 時間表示フォーマット
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  return (
    <VisualizerContainer>
      <Title>音楽可視化</Title>
      
      <ControlPanel>
        <ControlRow>
          <ControlGroup>
            <Label>1. 音楽を選択</Label>
            <FileInputLabel>
              <FileInput 
                type="file" 
                accept="audio/*" 
                onChange={handleFileChange} 
              />
              ファイルを選択
            </FileInputLabel>
            <span style={{ marginLeft: '10px', color: '#999' }}>{fileName}</span>
          </ControlGroup>
          
          <ControlGroup>
            <Label>サンプル音楽</Label>
            <Select onChange={(e) => handleSampleTrack(e.target.value)}>
              <option value="">サンプル音楽を選択</option>
              {SAMPLE_TRACKS.map((track, index) => (
                <option key={index} value={track.url}>
                  {track.name}
                </option>
              ))}
            </Select>
          </ControlGroup>
        </ControlRow>
        
        <ControlRow>
          <ControlGroup>
            <Label>2. 再生コントロール</Label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button $primary onClick={play} disabled={!audioData.ready}>
                再生
              </Button>
              <Button onClick={pause} disabled={!isPlaying}>
                一時停止
              </Button>
              <Button onClick={stop} disabled={!audioData.ready}>
                停止
              </Button>
            </div>
          </ControlGroup>
          
          <ControlGroup>
            <Label>音量：{Math.round(volume * 100)}%</Label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              style={{ width: '100%' }}
            />
          </ControlGroup>
        </ControlRow>
        
        <ControlRow>
          <ControlGroup>
            <Label>進行状況：{formatTime(currentTime)} / {formatTime(duration)}</Label>
            <ProgressBar onClick={handleProgressClick}>
              <Progress $width={`${(currentTime / duration) * 100 || 0}%`} />
            </ProgressBar>
          </ControlGroup>
        </ControlRow>
        
        <ControlRow>
          <ControlGroup>
            <Label>3. 視覚化効果を選択</Label>
            <Select 
              value={visualType} 
              onChange={(e) => setVisualType(e.target.value as VisualizationType)}
            >
              <option value={VisualizationType.SPECTRUM_BARS}>スペクトラムバー</option>
              <option value={VisualizationType.WAVEFORM}>波形</option>
              <option value={VisualizationType.CIRCULAR}>円形スペクトラム</option>
              <option value={VisualizationType.PARTICLES}>パーティクルシステム</option>
              <option value={VisualizationType.KALEIDOSCOPE}>万華鏡エフェクト</option>
              <option value={VisualizationType.AUDIO_WATERFALL}>オーディオウォーターフォール</option>
              <option value={VisualizationType.ORGANIC_FORM}>オーガニックフォーム</option>
              <option value={VisualizationType.TETRIS}>テトリス</option>
              <option value={VisualizationType.LIP_SYNC}>リップシンク</option>
              <option value={VisualizationType.MUSIC_METEOR}>流星雨</option>
              <option value={VisualizationType.SOUND_GARDEN}>音の庭</option>
              <option value={VisualizationType.DNA_HELIX}>DNAらせん</option>
              <option value={VisualizationType.DIGITAL_RIPPLE}>デジタル波紋</option>
              <option value={VisualizationType.PARTICLE_TEXT}>パーティクルテキスト</option>
            </Select>
          </ControlGroup>
          
          <ControlGroup>
            <Label>カスタムカラー</Label>
            <ColorInputGroup>
              <ColorInput 
                type="color" 
                value={startColor} 
                onChange={(e) => setStartColor(e.target.value)} 
              />
              <span style={{ color: '#999' }}>から</span>
              <ColorInput 
                type="color" 
                value={endColor} 
                onChange={(e) => setEndColor(e.target.value)} 
              />
            </ColorInputGroup>
          </ControlGroup>
        </ControlRow>
      </ControlPanel>
      
      <CanvasContainer>
        <Canvas ref={canvasRef} />
      </CanvasContainer>
    </VisualizerContainer>
  );
}

export default VisualizerPage;