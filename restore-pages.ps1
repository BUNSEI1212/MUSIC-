# 恢复页面组件的脚本
Write-Host "开始恢复页面内容..."

# 恢复可视化页面
$visualizerPageContent = @"
import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAudioAnalyzer } from '../hooks/useAudioAnalyzer';
import * as visualEffects from '../utils/visualEffects';

// 样式组件
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

const Button = styled.button<{ \$primary?: boolean }>`
  background-color: \${props => props.\$primary ? '#9c27b0' : '#333'};
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: \${props => props.\$primary ? '#ba68c8' : '#444'};
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

const Progress = styled.div<{ \$width: string }>`
  height: 100%;
  width: \${props => props.\$width};
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
  PARTICLES = 'particles'
}

// 示例音乐列表
const SAMPLE_TRACKS = [
  { name: '示例音乐 1', url: 'https://assets.codepen.io/4358584/Anitek_-_Komorebi.mp3' },
  { name: '示例音乐 2', url: 'https://assets.codepen.io/4358584/Moonbase_-_Dinos.mp3' },
  { name: '示例音乐 3', url: 'https://assets.codepen.io/4358584/n-Dimensions_-_Cyber_Diva.mp3' }
];

function VisualizerPage() {
  // 音频分析钩子
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
  
  // 状态管理
  const [visualType, setVisualType] = useState<VisualizationType>(VisualizationType.SPECTRUM_BARS);
  const [startColor, setStartColor] = useState('#9c27b0');
  const [endColor, setEndColor] = useState('#3f51b5');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [fileName, setFileName] = useState('未选择文件');
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<visualEffects.Particle[]>([]);
  
  // 初始化画布
  useEffect(() => {
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext('2d');
      
      // 设置画布尺寸
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
      
      // 如果是粒子效果，初始化粒子
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
  
  // 监听音频事件
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
  
  // 绘制可视化效果
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
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
    
    // 清理动画帧
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioData, visualType, startColor, endColor]);
  
  // 处理文件输入
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFileName(file.name);
      loadAudio(file);
    }
  };
  
  // 处理示例音乐选择
  const handleSampleTrack = (url: string) => {
    loadAudioFromUrl(url);
    const track = SAMPLE_TRACKS.find(t => t.url === url);
    if (track) {
      setFileName(track.name);
    }
  };
  
  // 处理进度条点击
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = offsetX / rect.width;
    
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
  };
  
  // 处理音量变化
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolumeState(newVolume);
    setVolume(newVolume);
  };
  
  // 格式化时间显示
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return \`\${minutes}:\${seconds < 10 ? '0' : ''}\${seconds}\`;
  };
  
  return (
    <VisualizerContainer>
      <Title>音乐可视化</Title>
      
      <ControlPanel>
        <ControlRow>
          <ControlGroup>
            <Label>1. 选择音乐</Label>
            <FileInputLabel>
              <FileInput 
                type="file" 
                accept="audio/*" 
                onChange={handleFileChange} 
              />
              选择文件
            </FileInputLabel>
            <span style={{ marginLeft: '10px', color: '#999' }}>{fileName}</span>
          </ControlGroup>
          
          <ControlGroup>
            <Label>示例音乐</Label>
            <Select onChange={(e) => handleSampleTrack(e.target.value)}>
              <option value="">选择示例音乐</option>
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
            <Label>2. 控制播放</Label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button \$primary onClick={play} disabled={!audioData.ready}>
                播放
              </Button>
              <Button onClick={pause} disabled={!isPlaying}>
                暂停
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
            <Label>进度：{formatTime(currentTime)} / {formatTime(duration)}</Label>
            <ProgressBar onClick={handleProgressClick}>
              <Progress \$width={\`\${(currentTime / duration) * 100 || 0}%\`} />
            </ProgressBar>
          </ControlGroup>
        </ControlRow>
        
        <ControlRow>
          <ControlGroup>
            <Label>3. 选择可视化效果</Label>
            <Select 
              value={visualType} 
              onChange={(e) => setVisualType(e.target.value as VisualizationType)}
            >
              <option value={VisualizationType.SPECTRUM_BARS}>频谱柱状图</option>
              <option value={VisualizationType.WAVEFORM}>波形图</option>
              <option value={VisualizationType.CIRCULAR}>圆形频谱</option>
              <option value={VisualizationType.PARTICLES}>粒子系统</option>
            </Select>
          </ControlGroup>
          
          <ControlGroup>
            <Label>自定义颜色</Label>
            <ColorInputGroup>
              <ColorInput 
                type="color" 
                value={startColor} 
                onChange={(e) => setStartColor(e.target.value)} 
              />
              <span style={{ color: '#999' }}>至</span>
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
"@

Set-Content -Path "src/pages/VisualizerPage.tsx" -Value $visualizerPageContent

# 恢复画廊页面
$galleryPageContent = @"
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const GalleryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  color: #ba68c8;
  margin-bottom: 40px;
  text-align: center;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
`;

const GalleryCard = styled.div`
  background-color: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }
`;

const CardImage = styled.div<{ \$background: string }>`
  height: 200px;
  background-image: \${props => \`url(\${props.\$background})\`};
  background-size: cover;
  background-position: center;
  position: relative;
`;

const CardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7));
  display: flex;
  align-items: flex-end;
  padding: 20px;
`;

const CardAuthor = styled.span`
  background-color: rgba(156, 39, 176, 0.8);
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const CardTitle = styled.h3`
  color: #e1bee7;
  margin-bottom: 10px;
  font-size: 1.2rem;
`;

const CardDescription = styled.p`
  color: #bbb;
  margin-bottom: 20px;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardStats = styled.div`
  display: flex;
  gap: 15px;
  color: #999;
  font-size: 0.8rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ViewButton = styled(Link)`
  background-color: #9c27b0;
  color: white;
  padding: 8px 15px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #ba68c8;
  }
`;

// 示例作品数据
const galleryItems = [
  {
    id: 1,
    title: '电子音乐频谱可视化',
    author: '音乐爱好者',
    description: '使用颗粒物效果展示电子舞曲的能量节奏，伴随音乐的每一拍都有动态响应。',
    image: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    likes: 324,
    views: 4587
  },
  {
    id: 2,
    title: '古典音乐波形艺术',
    author: '古典迷',
    description: '贝多芬第九交响曲的优美旋律通过流畅的波形线条呈现，色彩随着乐章变化而变幻。',
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1631&q=80',
    likes: 189,
    views: 2135
  },
  {
    id: 3,
    title: '爵士乐圆形频谱',
    author: '爵士手',
    description: '萨克斯独奏的细腻音色通过动态圆形频谱展示，体现出爵士乐即兴创作的自由与活力。',
    image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    likes: 256,
    views: 3421
  },
  {
    id: 4,
    title: '摇滚频谱艺术',
    author: '摇滚迷',
    description: '重金属音乐的强烈节奏和吉他独奏通过强烈对比色和动态柱状图表现出来。',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    likes: 423,
    views: 5678
  },
  {
    id: 5,
    title: '环境音乐粒子系统',
    author: '声音艺术家',
    description: '自然环境声音采样产生的平静粒子流动，体现出大自然的和谐与韵律。',
    image: 'https://images.unsplash.com/photo-1558865869-c93f6f8482af?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1481&q=80',
    likes: 157,
    views: 1832
  },
  {
    id: 6,
    title: '流行音乐动态波形',
    author: '流行音乐制作人',
    description: '当代流行歌曲的人声和伴奏分离后产生的互动波形，展示人声与音乐的完美融合。',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    likes: 289,
    views: 3245
  }
];

function GalleryPage() {
  return (
    <GalleryContainer>
      <Title>可视化作品库</Title>
      
      <GalleryGrid>
        {galleryItems.map(item => (
          <GalleryCard key={item.id}>
            <CardImage \$background={item.image}>
              <CardOverlay>
                <CardAuthor>{item.author}</CardAuthor>
              </CardOverlay>
            </CardImage>
            <CardContent>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
              <CardFooter>
                <CardStats>
                  <StatItem>
                    <span role="img" aria-label="likes">❤️</span> {item.likes}
                  </StatItem>
                  <StatItem>
                    <span role="img" aria-label="views">👁️</span> {item.views}
                  </StatItem>
                </CardStats>
                <ViewButton to={\`/visualizer?id=\${item.id}\`}>查看</ViewButton>
              </CardFooter>
            </CardContent>
          </GalleryCard>
        ))}
      </GalleryGrid>
    </GalleryContainer>
  );
}

export default GalleryPage;
"@

Set-Content -Path "src/pages/GalleryPage.tsx" -Value $galleryPageContent

Write-Host "已恢复 VisualizerPage.tsx 和 GalleryPage.tsx 的原始中文内容"
Write-Host "注意：还需要恢复其他页面，包括："
Write-Host "- src/pages/HomePage.tsx"
Write-Host "- src/pages/ProfilePage.tsx"
Write-Host "- README.md" 