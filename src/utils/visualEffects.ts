// 定义常用的可视化效果

// 颜色工具
export const getGradientColor = (
  startColor: string,
  endColor: string, 
  percent: number
): string => {
  // 解析颜色
  const start = {
    r: parseInt(startColor.slice(1, 3), 16),
    g: parseInt(startColor.slice(3, 5), 16),
    b: parseInt(startColor.slice(5, 7), 16)
  };
  
  const end = {
    r: parseInt(endColor.slice(1, 3), 16),
    g: parseInt(endColor.slice(3, 5), 16),
    b: parseInt(endColor.slice(5, 7), 16)
  };
  
  // 计算渐变颜色
  const r = Math.floor(start.r + percent * (end.r - start.r));
  const g = Math.floor(start.g + percent * (end.g - start.g));
  const b = Math.floor(start.b + percent * (end.b - start.b));
  
  // 转换为十六进制
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// 频谱柱状图
export const drawSpectrumBars = (
  ctx: CanvasRenderingContext2D,
  frequencies: Uint8Array,
  width: number,
  height: number,
  options: {
    barWidth?: number;
    barSpacing?: number;
    startColor?: string;
    endColor?: string;
    minHeight?: number;
    maxFreq?: number;
  } = {}
) => {
  const {
    barWidth = 5,
    barSpacing = 2,
    startColor = '#9c27b0',
    endColor = '#3f51b5',
    minHeight = 5,
    maxFreq = frequencies.length * 0.75 // 只显示频率范围的75%，高频部分通常人耳听不到
  } = options;
  
  ctx.clearRect(0, 0, width, height);
  
  const totalBars = Math.min(Math.floor(width / (barWidth + barSpacing)), maxFreq);
  const frequencyStep = Math.floor(frequencies.length / totalBars);
  
  for (let i = 0; i < totalBars; i++) {
    // 使用对数分布使低频更加清晰
    const index = Math.floor(Math.pow(i / totalBars, 2) * maxFreq);
    const value = frequencies[index] / 255; // 归一化到0-1
    
    const barHeight = Math.max(minHeight, value * height);
    const x = i * (barWidth + barSpacing);
    const y = height - barHeight;
    
    // 根据频率和音量生成颜色
    const colorPercent = value;
    const barColor = getGradientColor(startColor, endColor, colorPercent);
    
    ctx.fillStyle = barColor;
    ctx.fillRect(x, y, barWidth, barHeight);
  }
};

// 波形图
export const drawWaveform = (
  ctx: CanvasRenderingContext2D,
  waveform: Float32Array,
  width: number,
  height: number,
  options: {
    lineWidth?: number;
    color?: string;
    filled?: boolean;
    mirror?: boolean;
  } = {}
) => {
  const {
    lineWidth = 2,
    color = '#ba68c8',
    filled = false,
    mirror = false
  } = options;
  
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  
  const centerY = height / 2;
  const step = Math.ceil(waveform.length / width);
  
  ctx.beginPath();
  
  if (filled) {
    ctx.moveTo(0, centerY);
  }
  
  for (let i = 0; i < width; i++) {
    const index = Math.floor(i * step);
    const value = waveform[index];
    
    // 计算y坐标，波形值范围是-1到1
    const y = mirror
      ? centerY + value * centerY // 将波形映射到整个高度
      : centerY + value * (centerY * 0.8); // 留出一些边距
      
    if (i === 0) {
      ctx.moveTo(i, y);
    } else {
      ctx.lineTo(i, y);
    }
  }
  
  if (filled) {
    ctx.lineTo(width, centerY);
    ctx.fill();
  } else {
    ctx.stroke();
  }
};

// 圆形频谱
export const drawCircularSpectrum = (
  ctx: CanvasRenderingContext2D,
  frequencies: Uint8Array,
  width: number,
  height: number,
  options: {
    radius?: number;
    startColor?: string;
    endColor?: string;
    lineWidth?: number;
    rotation?: number;
  } = {}
) => {
  const {
    radius = Math.min(width, height) / 3,
    startColor = '#9c27b0',
    endColor = '#3f51b5',
    lineWidth = 2,
    rotation = 0
  } = options;
  
  ctx.clearRect(0, 0, width, height);
  
  const centerX = width / 2;
  const centerY = height / 2;
  const maxBars = 180; // 圆周上的点数
  const step = Math.ceil(frequencies.length / maxBars);
  
  for (let i = 0; i < maxBars; i++) {
    const index = Math.floor(i * step);
    const value = frequencies[index] / 255; // 归一化到0-1
    
    const barLength = radius * (0.5 + value * 0.5); // 长度在半径的50%-100%之间变化
    const angle = (i / maxBars) * Math.PI * 2 + rotation;
    
    const x1 = centerX + Math.cos(angle) * radius;
    const y1 = centerY + Math.sin(angle) * radius;
    
    const x2 = centerX + Math.cos(angle) * (radius + barLength);
    const y2 = centerY + Math.sin(angle) * (radius + barLength);
    
    const color = getGradientColor(startColor, endColor, value);
    
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
};

// 粒子系统
export interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  angle: number;
  life: number;
  opacity: number;
}

export const createParticles = (
  count: number,
  width: number,
  height: number,
  options: {
    minSize?: number;
    maxSize?: number;
    startColor?: string;
    endColor?: string;
    maxSpeed?: number;
    baseLife?: number;
  } = {}
): Particle[] => {
  const {
    minSize = 2,
    maxSize = 8,
    startColor = '#9c27b0',
    endColor = '#3f51b5',
    maxSpeed = 2,
    baseLife = 100
  } = options;
  
  const particles: Particle[] = [];
  
  for (let i = 0; i < count; i++) {
    const percent = Math.random();
    const size = minSize + Math.random() * (maxSize - minSize);
    
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size,
      color: getGradientColor(startColor, endColor, percent),
      speed: Math.random() * maxSpeed,
      angle: Math.random() * Math.PI * 2,
      life: baseLife + Math.random() * baseLife,
      opacity: 0.7 + Math.random() * 0.3
    });
  }
  
  return particles;
};

export const updateParticles = (
  particles: Particle[],
  width: number,
  height: number,
  volume: number
): Particle[] => {
  return particles.map(particle => {
    // 根据音量调整速度
    const adjustedSpeed = particle.speed * (1 + volume * 3);
    
    // 更新位置
    const newX = particle.x + Math.cos(particle.angle) * adjustedSpeed;
    const newY = particle.y + Math.sin(particle.angle) * adjustedSpeed;
    
    // 如果粒子离开画布，将其重置到另一边
    const x = newX < 0 ? width : newX > width ? 0 : newX;
    const y = newY < 0 ? height : newY > height ? 0 : newY;
    
    // 递减生命值
    const life = particle.life - 1;
    
    // 如果生命值用完，重新创建粒子
    if (life <= 0) {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: particle.size,
        color: particle.color,
        speed: particle.speed,
        angle: Math.random() * Math.PI * 2,
        life: 100 + Math.random() * 100,
        opacity: 0.7 + Math.random() * 0.3
      };
    }
    
    return {
      ...particle,
      x,
      y,
      life
    };
  });
};

export const drawParticles = (
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  volume: number
) => {
  particles.forEach(particle => {
    // 根据音量和生命值调整大小和不透明度
    const sizeMultiplier = 1 + volume * 2;
    const size = particle.size * sizeMultiplier;
    const opacity = (particle.opacity * particle.life) / 200;
    
    ctx.globalAlpha = opacity;
    ctx.fillStyle = particle.color;
    
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
    ctx.fill();
  });
  
  ctx.globalAlpha = 1;
};

// 存储音频瀑布图的历史数据
let waterfallHistory: number[][] = [];

// 音频瀑布图
export const drawAudioWaterfall = (
  ctx: CanvasRenderingContext2D,
  frequencies: Uint8Array,
  width: number,
  height: number,
  options: {
    startColor?: string;
    endColor?: string;
    speed?: number;
  } = {}
) => {
  const {
    startColor = '#9c27b0',
    endColor = '#3f51b5',
    speed = 2
  } = options;
  
  const frequencyBins = 64; // 采样的频率点数
  const step = Math.floor(frequencies.length / frequencyBins);
  
  // 如果历史数据为空，初始化
  if (waterfallHistory.length === 0) {
    for (let i = 0; i < Math.floor(height / speed); i++) {
      const row = Array(frequencyBins).fill(0);
      waterfallHistory.push(row);
    }
  }
  
  // 获取当前帧的频率数据
  const currentFrame = [];
  for (let i = 0; i < frequencyBins; i++) {
    const index = Math.floor(i * step);
    currentFrame.push(frequencies[index] / 255); // 归一化到0-1
  }
  
  // 更新历史数据
  waterfallHistory.unshift(currentFrame);
  if (waterfallHistory.length > Math.floor(height / speed)) {
    waterfallHistory.pop();
  }
  
  // 清除画布
  ctx.clearRect(0, 0, width, height);
  
  // 绘制瀑布图
  const binWidth = width / frequencyBins;
  
  waterfallHistory.forEach((row, rowIndex) => {
    const y = rowIndex * speed;
    
    row.forEach((value, binIndex) => {
      const x = binIndex * binWidth;
      const color = getGradientColor(startColor, endColor, value);
      
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(x, y, binWidth, speed);
    });
  });
  
  ctx.globalAlpha = 1;
};

// 万花筒效果
export const drawKaleidoscope = (
  ctx: CanvasRenderingContext2D,
  frequencies: Uint8Array,
  width: number,
  height: number,
  options: {
    startColor?: string;
    endColor?: string;
    segments?: number;
    rotation?: number;
  } = {}
) => {
  const {
    startColor = '#9c27b0',
    endColor = '#3f51b5',
    segments = 8,
    rotation = 0
  } = options;
  
  // 清除画布
  ctx.clearRect(0, 0, width, height);
  
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) * 0.8;
  
  // 保存当前状态
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  
  // 创建一个基本图形
  const basePattern = (ctx: CanvasRenderingContext2D) => {
    const frequencyBins = 32;
    const step = Math.floor(frequencies.length / frequencyBins);
    
    for (let i = 0; i < frequencyBins; i++) {
      const index = Math.floor(i * step);
      const value = frequencies[index] / 255; // 归一化到0-1
      
      const angle = (i / frequencyBins) * Math.PI * 2 / segments;
      const length = radius * value;
      
      const x = Math.cos(angle) * length;
      const y = Math.sin(angle) * length;
      
      const color = getGradientColor(startColor, endColor, value);
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 5 + value * 15, 0, Math.PI * 2);
      ctx.fill();
      
      // 连接到中心的线
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  };
  
  // 绘制多个反射的图形
  for (let s = 0; s < segments; s++) {
    ctx.save();
    ctx.rotate((s / segments) * Math.PI * 2);
    basePattern(ctx);
    ctx.restore();
  }
  
  // 恢复状态
  ctx.restore();
};

// 有机形态
export const drawOrganicForm = (
  ctx: CanvasRenderingContext2D,
  frequencies: Uint8Array,
  waveform: Float32Array,
  width: number,
  height: number,
  options: {
    startColor?: string;
    endColor?: string;
    complexity?: number;
  } = {}
) => {
  const {
    startColor = '#9c27b0',
    endColor = '#3f51b5',
    complexity = 0.7
  } = options;
  
  // 清除画布
  ctx.clearRect(0, 0, width, height);
  
  const centerX = width / 2;
  const centerY = height / 2;
  const baseRadius = Math.min(centerX, centerY) * 0.6;
  
  const frequencyBins = 32;
  const step = Math.floor(frequencies.length / frequencyBins);
  
  // 计算平均振幅
  let avgAmplitude = 0;
  for (let i = 0; i < frequencies.length; i++) {
    avgAmplitude += frequencies[i] / 255;
  }
  avgAmplitude /= frequencies.length;
  
  // 绘制有机形态
  ctx.beginPath();
  
  for (let i = 0; i <= frequencyBins; i++) {
    const angle = (i / frequencyBins) * Math.PI * 2;
    
    // 使用频率数据和波形数据创建有机的变形效果
    const freqIndex = Math.floor(i * step) % frequencies.length;
    const waveIndex = Math.floor(i * waveform.length / frequencyBins) % waveform.length;
    
    const frequency = frequencies[freqIndex] / 255;
    const wave = (waveform[waveIndex] + 1) / 2; // 转换到0-1范围
    
    // 结合频率和波形数据
    const variation = frequency * wave * complexity;
    const radius = baseRadius * (0.7 + variation * 0.5);
    
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.closePath();
  
  // 创建渐变填充
  const gradient = ctx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, baseRadius
  );
  gradient.addColorStop(0, startColor);
  gradient.addColorStop(1, endColor);
  
  // 填充和描边
  ctx.fillStyle = gradient;
  ctx.fill();
  
  ctx.strokeStyle = getGradientColor(startColor, endColor, avgAmplitude);
  ctx.lineWidth = 2;
  ctx.stroke();
};

// 俄罗斯方块效果
interface TetrisBlock {
  x: number;
  y: number;
  type: number;
  rotation: number;
  color: string;
}

// 俄罗斯方块块类型形状
const TETRIS_SHAPES = [
  // I形
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  // J形
  [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  // L形
  [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ],
  // O形
  [
    [1, 1],
    [1, 1]
  ],
  // S形
  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ],
  // T形
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  // Z形
  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ]
];

// 存储当前的方块和网格
let tetrisGrid: number[][] = [];
let activeBlocks: TetrisBlock[] = [];
let tetrisLastUpdate = 0;

// 初始化俄罗斯方块网格
const initTetrisGrid = (cols: number, rows: number) => {
  tetrisGrid = [];
  for (let i = 0; i < rows; i++) {
    tetrisGrid.push(Array(cols).fill(0));
  }
};

// 创建新的方块
const createTetrisBlock = (cols: number, startColor: string, endColor: string): TetrisBlock => {
  const type = Math.floor(Math.random() * TETRIS_SHAPES.length);
  const color = getGradientColor(startColor, endColor, Math.random());
  
  return {
    x: Math.floor(cols / 2) - Math.floor(TETRIS_SHAPES[type][0].length / 2),
    y: 0,
    type,
    rotation: 0,
    color
  };
};

// 绘制俄罗斯方块效果
export const drawTetris = (
  ctx: CanvasRenderingContext2D,
  frequencies: Uint8Array,
  width: number,
  height: number,
  options: {
    startColor?: string;
    endColor?: string;
    speed?: number;
  } = {}
) => {
  const {
    startColor = '#9c27b0',
    endColor = '#3f51b5',
    speed = 1
  } = options;
  
  // 计算网格尺寸
  const cols = 12;
  const rows = 20;
  const cellSize = Math.min(width / cols, height / rows);
  const gridWidth = cols * cellSize;
  const gridHeight = rows * cellSize;
  const offsetX = (width - gridWidth) / 2;
  const offsetY = (height - gridHeight) / 2;
  
  // 初始化网格
  if (tetrisGrid.length === 0) {
    initTetrisGrid(cols, rows);
  }
  
  // 根据音频数据控制游戏速度
  const now = Date.now();
  const avgFreq = Array.from(frequencies).reduce((sum, val) => sum + val, 0) / frequencies.length;
  const normalizedFreq = avgFreq / 255;
  
  // 音量越大，方块下落越快
  const updateInterval = 1000 - normalizedFreq * 800;
  
  // 音量脉冲添加新方块
  if (normalizedFreq > 0.6 && Math.random() < 0.1) {
    activeBlocks.push(createTetrisBlock(cols, startColor, endColor));
  }
  
  // 更新方块位置
  if (now - tetrisLastUpdate > updateInterval) {
    tetrisLastUpdate = now;
    
    // 创建初始方块
    if (activeBlocks.length === 0) {
      activeBlocks.push(createTetrisBlock(cols, startColor, endColor));
    }
    
    // 尝试移动活动方块
    activeBlocks.forEach(block => {
      block.y += 1;
      
      // 如果方块触底或碰到其他方块，固定它并创建新方块
      const shape = TETRIS_SHAPES[block.type];
      let hitBottom = false;
      
      // 检查是否触底
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x] === 0) continue;
          
          const gridY = block.y + y;
          const gridX = block.x + x;
          
          // 检查是否到达底部或碰到其他方块
          if (gridY >= rows || (gridY >= 0 && tetrisGrid[gridY][gridX] !== 0)) {
            hitBottom = true;
            break;
          }
        }
        if (hitBottom) break;
      }
      
      // 如果触底，将方块固定到网格
      if (hitBottom) {
        // 回退一步
        block.y -= 1;
        
        // 将方块添加到网格
        for (let y = 0; y < shape.length; y++) {
          for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] === 0) continue;
            
            const gridY = block.y + y;
            const gridX = block.x + x;
            
            if (gridY >= 0 && gridY < rows && gridX >= 0 && gridX < cols) {
              tetrisGrid[gridY][gridX] = 1;
            }
          }
        }
      }
    });
    
    // 删除已固定的方块
    activeBlocks = activeBlocks.filter(block => {
      const shape = TETRIS_SHAPES[block.type];
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x] === 0) continue;
          
          const gridY = block.y + y;
          const gridX = block.x + x;
          
          // 如果方块已经添加到网格中，则删除它
          if (gridY >= 0 && gridY < rows && gridX >= 0 && gridX < cols && tetrisGrid[gridY][gridX] === 1) {
            return false;
          }
        }
      }
      return true;
    });
    
    // 清除完整的行
    for (let y = rows - 1; y >= 0; y--) {
      if (tetrisGrid[y].every(cell => cell === 1)) {
        // 移除该行
        tetrisGrid.splice(y, 1);
        // 在顶部添加新行
        tetrisGrid.unshift(Array(cols).fill(0));
      }
    }
    
    // 根据音量随机添加新方块
    if (Math.random() < 0.1 * normalizedFreq) {
      activeBlocks.push(createTetrisBlock(cols, startColor, endColor));
    }
  }
  
  // 清除画布
  ctx.clearRect(0, 0, width, height);
  
  // 绘制网格背景
  ctx.fillStyle = '#111';
  ctx.fillRect(offsetX, offsetY, gridWidth, gridHeight);
  
  // 绘制边框
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.strokeRect(offsetX, offsetY, gridWidth, gridHeight);
  
  // 绘制固定方块
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (tetrisGrid[y][x] === 1) {
        const cellX = offsetX + x * cellSize;
        const cellY = offsetY + y * cellSize;
        
        // 根据频率选择颜色
        const freqIndex = (x + y) % frequencies.length;
        const colorPercent = frequencies[freqIndex] / 255;
        const color = getGradientColor(startColor, endColor, colorPercent);
        
        ctx.fillStyle = color;
        ctx.fillRect(cellX, cellY, cellSize - 1, cellSize - 1);
      }
    }
  }
  
  // 绘制活动方块
  activeBlocks.forEach(block => {
    const shape = TETRIS_SHAPES[block.type];
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] === 0) continue;
        
        const cellX = offsetX + (block.x + x) * cellSize;
        const cellY = offsetY + (block.y + y) * cellSize;
        
        if (
          cellX >= offsetX && 
          cellX < offsetX + gridWidth && 
          cellY >= offsetY && 
          cellY < offsetY + gridHeight
        ) {
          ctx.fillStyle = block.color;
          ctx.fillRect(cellX, cellY, cellSize - 1, cellSize - 1);
        }
      }
    }
  });
};

// 卡通嘴型同步
// 存储嘴型状态
let mouthRadius = 0;
let eyeState = 0;
let blinkCounter = 0;

// 绘制卡通人物嘴型同步效果
export const drawLipSync = (
  ctx: CanvasRenderingContext2D,
  frequencies: Uint8Array,
  waveform: Float32Array,
  width: number,
  height: number,
  options: {
    faceColor?: string;
    lipColor?: string;
  } = {}
) => {
  const {
    faceColor = '#ffcc99',
    lipColor = '#ff6666'
  } = options;
  
  // 清除画布
  ctx.clearRect(0, 0, width, height);
  
  const centerX = width / 2;
  const centerY = height / 2;
  const faceSize = Math.min(width, height) * 0.6;
  
  // 计算平均音量和低频强度
  let avgVolume = 0;
  let bassIntensity = 0;
  
  // 获取低频能量（嘴巴张开程度）
  for (let i = 0; i < 10; i++) {
    bassIntensity += frequencies[i] / 255;
  }
  bassIntensity /= 10;
  
  // 获取总体音量（表情活跃度）
  for (let i = 0; i < frequencies.length; i++) {
    avgVolume += frequencies[i] / 255;
  }
  avgVolume /= frequencies.length;
  
  // 平滑嘴型变化
  mouthRadius = mouthRadius * 0.7 + bassIntensity * 0.3 * faceSize * 0.3;
  
  // 眨眼控制
  blinkCounter++;
  if (blinkCounter > 120 || (avgVolume > 0.7 && Math.random() > 0.7)) {
    eyeState = (eyeState + 1) % 3;
    if (eyeState === 0) {
      blinkCounter = 0;
    }
  }
  
  // 绘制脸部
  ctx.fillStyle = faceColor;
  ctx.beginPath();
  ctx.arc(centerX, centerY, faceSize / 2, 0, Math.PI * 2);
  ctx.fill();
  
  // 绘制嘴巴
  ctx.fillStyle = lipColor;
  ctx.beginPath();
  ctx.ellipse(
    centerX, 
    centerY + faceSize * 0.15, 
    mouthRadius * 1.5, 
    mouthRadius, 
    0, 
    0, 
    Math.PI * 2
  );
  ctx.fill();
  
  // 绘制嘴内（黑色）
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(
    centerX, 
    centerY + faceSize * 0.15, 
    mouthRadius * 1.2, 
    mouthRadius * 0.7, 
    0, 
    0, 
    Math.PI * 2
  );
  ctx.fill();
  
  // 根据波形绘制舌头
  let tongueHeight = 0;
  for (let i = 0; i < waveform.length; i += 10) {
    tongueHeight += Math.abs(waveform[i]);
  }
  tongueHeight = tongueHeight / (waveform.length / 10) * mouthRadius * 0.8;
  
  if (tongueHeight > 0.01) {
    ctx.fillStyle = '#ff9999';
    ctx.beginPath();
    ctx.ellipse(
      centerX, 
      centerY + faceSize * 0.15 + mouthRadius * 0.2, 
      mouthRadius * 0.8, 
      tongueHeight, 
      0, 
      0, 
      Math.PI
    );
    ctx.fill();
  }
  
  // 绘制眼睛
  const eyeX1 = centerX - faceSize * 0.15;
  const eyeX2 = centerX + faceSize * 0.15;
  const eyeY = centerY - faceSize * 0.1;
  const eyeSize = faceSize * 0.1;
  
  // 眼白
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(eyeX1, eyeY, eyeSize, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(eyeX2, eyeY, eyeSize, 0, Math.PI * 2);
  ctx.fill();
  
  // 眼珠（根据音频移动）
  const eyeMoveX = (frequencies[15] / 255 - 0.5) * eyeSize * 0.5;
  const eyeMoveY = (frequencies[20] / 255 - 0.5) * eyeSize * 0.5;
  
  if (eyeState === 0) {
    // 正常眼睛
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(eyeX1 + eyeMoveX, eyeY + eyeMoveY, eyeSize * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(eyeX2 + eyeMoveX, eyeY + eyeMoveY, eyeSize * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    // 眼神反光
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(eyeX1 + eyeMoveX + eyeSize * 0.1, eyeY + eyeMoveY - eyeSize * 0.1, eyeSize * 0.1, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(eyeX2 + eyeMoveX + eyeSize * 0.1, eyeY + eyeMoveY - eyeSize * 0.1, eyeSize * 0.1, 0, Math.PI * 2);
    ctx.fill();
  } else if (eyeState === 1) {
    // 半闭眼
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(eyeX1, eyeY, eyeSize * 0.4, eyeSize * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(eyeX2, eyeY, eyeSize * 0.4, eyeSize * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // 闭眼
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(eyeX1 - eyeSize * 0.5, eyeY);
    ctx.lineTo(eyeX1 + eyeSize * 0.5, eyeY);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(eyeX2 - eyeSize * 0.5, eyeY);
    ctx.lineTo(eyeX2 + eyeSize * 0.5, eyeY);
    ctx.stroke();
  }
  
  // 绘制眉毛（随着高频变化）
  const browRaise = Math.max(0, frequencies[30] / 255 - 0.5) * faceSize * 0.1;
  
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  
  // 左眉毛
  ctx.beginPath();
  ctx.moveTo(eyeX1 - eyeSize * 1.2, eyeY - eyeSize * 1.2 - browRaise);
  ctx.lineTo(eyeX1 + eyeSize * 0.8, eyeY - eyeSize - browRaise * 0.5);
  ctx.stroke();
  
  // 右眉毛
  ctx.beginPath();
  ctx.moveTo(eyeX2 + eyeSize * 1.2, eyeY - eyeSize * 1.2 - browRaise);
  ctx.lineTo(eyeX2 - eyeSize * 0.8, eyeY - eyeSize - browRaise * 0.5);
  ctx.stroke();
  
  // 根据音量添加表情变化（脸红）
  if (avgVolume > 0.6) {
    ctx.fillStyle = 'rgba(255, 150, 150, 0.3)';
    ctx.beginPath();
    ctx.arc(centerX - faceSize * 0.25, centerY + faceSize * 0.05, faceSize * 0.12, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(centerX + faceSize * 0.25, centerY + faceSize * 0.05, faceSize * 0.12, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // 绘制音符（在强拍时）
  if (avgVolume > 0.65 && Math.random() > 0.7) {
    const noteSize = faceSize * 0.15;
    const noteX = centerX + faceSize * 0.6 * (Math.random() * 2 - 1);
    const noteY = centerY - faceSize * 0.7;
    
    ctx.fillStyle = '#9c27b0';
    ctx.beginPath();
    ctx.ellipse(noteX, noteY, noteSize * 0.6, noteSize * 0.4, Math.PI * 0.25, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#9c27b0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(noteX + noteSize * 0.5, noteY);
    ctx.lineTo(noteX + noteSize * 0.5, noteY - noteSize * 1.2);
    ctx.stroke();
  }
};

// 音乐流星雨
interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  color: string;
  width: number;
  trail: {x: number, y: number}[];
}

let meteors: Meteor[] = [];
let lastMeteorTime = 0;

// 创建流星
const createMeteor = (canvasWidth: number, canvasHeight: number, startColor: string, endColor: string): Meteor => {
  const x = Math.random() * canvasWidth;
  const y = -50; // 从画布上方开始
  const length = 20 + Math.random() * 80;
  const speed = 3 + Math.random() * 7;
  const color = getGradientColor(startColor, endColor, Math.random());
  const width = 1 + Math.random() * 3;
  
  return {
    x, 
    y,
    length,
    speed,
    color,
    width,
    trail: []
  };
};

// 音乐流星雨效果
export const drawMusicMeteorShower = (
  ctx: CanvasRenderingContext2D,
  frequencies: Uint8Array,
  waveform: Float32Array,
  width: number,
  height: number,
  options: {
    startColor?: string;
    endColor?: string;
    density?: number;
    background?: string;
  } = {}
) => {
  const {
    startColor = '#9c27b0',
    endColor = '#3f51b5',
    density = 1,
    background = 'rgba(0, 0, 0, 0.05)'
  } = options;
  
  // 计算音频能量
  let energy = 0;
  for (let i = 0; i < frequencies.length; i++) {
    energy += frequencies[i] / 255;
  }
  energy /= frequencies.length;
  
  // 半透明背景，创造拖尾效果
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);
  
  // 生成新的流星
  const now = Date.now();
  const bassEnergy = frequencies.slice(0, 10).reduce((sum, val) => sum + val / 255, 0) / 10;
  
  // 根据低频能量和密度控制流星生成频率
  if (now - lastMeteorTime > 300 / (bassEnergy * 2 * density) && Math.random() < bassEnergy * density) {
    meteors.push(createMeteor(width, height, startColor, endColor));
    lastMeteorTime = now;
  }
  
  // 更新和绘制流星
  meteors = meteors.filter(meteor => {
    // 更新位置
    meteor.y += meteor.speed * (1 + energy * 2); // 音频能量加速
    meteor.x += meteor.speed * 0.5; // 轻微向右移动
    
    // 存储轨迹点
    meteor.trail.push({x: meteor.x, y: meteor.y});
    if (meteor.trail.length > 10) {
      meteor.trail.shift();
    }
    
    // 绘制流星
    ctx.beginPath();
    
    // 绘制主体
    const gradient = ctx.createLinearGradient(
      meteor.x, 
      meteor.y, 
      meteor.x, 
      meteor.y - meteor.length
    );
    gradient.addColorStop(0, meteor.color);
    gradient.addColorStop(1, 'transparent');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = meteor.width;
    ctx.moveTo(meteor.x, meteor.y);
    ctx.lineTo(meteor.x - meteor.speed * 0.5, meteor.y - meteor.length);
    ctx.stroke();
    
    // 绘制轨迹点
    ctx.fillStyle = meteor.color;
    for (let i = 0; i < meteor.trail.length; i++) {
      const point = meteor.trail[i];
      const size = (i / meteor.trail.length) * meteor.width * 0.8;
      ctx.beginPath();
      ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // 随机添加闪光点
    if (Math.random() < 0.3) {
      const sparkX = meteor.x + (Math.random() - 0.5) * 5;
      const sparkY = meteor.y - Math.random() * meteor.length * 0.8;
      
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // 如果流星超出画布底部，则删除
    return meteor.y < height + 100;
  });
  
  // 绘制星空背景
  for (let i = 0; i < frequencies.length; i += 5) {
    const x = (i / frequencies.length) * width;
    const y = height * 0.5 + (waveform[i] || 0) * height * 0.3;
    const intensity = frequencies[i] / 255;
    
    if (intensity > 0.2) {
      const starSize = intensity * 2;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.7})`;
      ctx.beginPath();
      ctx.arc(x, y, starSize, 0, Math.PI * 2);
      ctx.fill();
      
      // 星星光芒
      if (intensity > 0.7) {
        const glowSize = starSize * 3;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
        glow.addColorStop(0, `rgba(255, 255, 255, ${intensity * 0.5})`);
        glow.addColorStop(1, 'transparent');
        
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, glowSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  
  // 在高能量时绘制北极光效果
  if (energy > 0.5) {
    const auroras = Math.floor(3 + energy * 4);
    
    for (let i = 0; i < auroras; i++) {
      const auroraY = height * (0.7 + Math.random() * 0.2);
      const auroraHeight = height * 0.2 * energy;
      
      const curvePoints = [];
      const segments = 20;
      
      for (let j = 0; j <= segments; j++) {
        const px = (j / segments) * width;
        // 使用音频数据波形控制高度
        const frequencyIndex = Math.floor((j / segments) * waveform.length);
        const waveValue = waveform[frequencyIndex] || 0;
        
        const py = auroraY - Math.abs(waveValue) * auroraHeight;
        curvePoints.push({x: px, y: py});
      }
      
      // 绘制平滑曲线
      ctx.beginPath();
      ctx.moveTo(curvePoints[0].x, curvePoints[0].y);
      
      for (let j = 0; j < curvePoints.length - 1; j++) {
        const current = curvePoints[j];
        const next = curvePoints[j + 1];
        const midX = (current.x + next.x) / 2;
        const midY = (current.y + next.y) / 2;
        
        ctx.quadraticCurveTo(current.x, current.y, midX, midY);
      }
      
      // 创建渐变
      const gradient = ctx.createLinearGradient(0, auroraY - auroraHeight, 0, auroraY);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.5, getGradientColor(startColor, endColor, i / auroras));
      gradient.addColorStop(1, 'transparent');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2 + energy * 5;
      ctx.globalAlpha = 0.7;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
};

// 声音花园
interface Flower {
  x: number;
  y: number;
  size: number;
  rotation: number;
  petals: number;
  color: string;
  stemLength: number;
  stemWidth: number;
  growthStage: number;
  maxGrowth: number;
  bloomSpeed: number;
  swayAngle: number;
  swaySpeed: number;
}

interface Leaf {
  x: number;
  y: number;
  size: number;
  angle: number;
  color: string;
}

// 花朵管理
let flowers: Flower[] = [];
let leaves: Leaf[] = [];
let lastFlowerTime = 0;
let gardenBackground: ImageData | null = null;

// 创建花朵
const createFlower = (
  width: number, 
  height: number, 
  startColor: string, 
  endColor: string
): Flower => {
  const flowerBedWidth = width * 0.8;
  const x = width * 0.1 + Math.random() * flowerBedWidth;
  const groundY = height * 0.85;
  const stemLength = 50 + Math.random() * 150;
  const y = groundY - stemLength;
  
  return {
    x,
    y,
    size: 10 + Math.random() * 40,
    rotation: Math.random() * Math.PI * 2,
    petals: 5 + Math.floor(Math.random() * 7),
    color: getGradientColor(startColor, endColor, Math.random()),
    stemLength,
    stemWidth: 1 + Math.random() * 3,
    growthStage: 0, // 0-1表示生长程度
    maxGrowth: 0.8 + Math.random() * 0.2, // 最大生长程度
    bloomSpeed: 0.001 + Math.random() * 0.003,
    swayAngle: 0,
    swaySpeed: 0.01 + Math.random() * 0.03
  };
};

// 创建叶子
const createLeaf = (
  flowerX: number, 
  stemLength: number, 
  groundY: number, 
  color: string
): Leaf => {
  const yPos = groundY - Math.random() * stemLength * 0.7;
  const angle = (Math.random() > 0.5 ? 1 : -1) * (Math.PI / 4 + Math.random() * Math.PI / 4);
  
  return {
    x: flowerX,
    y: yPos,
    size: 10 + Math.random() * 15,
    angle,
    color: color
  };
};

// 声音花园效果
export const drawSoundGarden = (
  ctx: CanvasRenderingContext2D,
  frequencies: Uint8Array,
  waveform: Float32Array,
  width: number,
  height: number,
  options: {
    startColor?: string;
    endColor?: string;
    flowerDensity?: number;
    leafColor?: string;
  } = {}
) => {
  const {
    startColor = '#FF1493', // 深粉色
    endColor = '#9370DB',  // 中紫色
    flowerDensity = 1,
    leafColor = '#4CAF50' // 绿色
  } = options;
  
  const groundY = height * 0.85;
  
  // 初始化背景缓存
  if (!gardenBackground) {
    gardenBackground = ctx.createImageData(width, height);
    const data = gardenBackground.data;
    
    // 创建天空渐变
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        
        // 地面
        if (y > groundY) {
          data[index] = 121;     // R
          data[index + 1] = 85;  // G
          data[index + 2] = 72;  // B
          data[index + 3] = 255; // A
        } 
        // 天空
        else {
          const skyRatio = y / groundY;
          data[index] = Math.floor(135 * (1 - skyRatio) + 176 * skyRatio);     // R
          data[index + 1] = Math.floor(206 * (1 - skyRatio) + 224 * skyRatio); // G
          data[index + 2] = Math.floor(235 * (1 - skyRatio) + 230 * skyRatio); // B
          data[index + 3] = 255; // A
        }
      }
    }
  }
  
  // 绘制背景
  ctx.putImageData(gardenBackground, 0, 0);
  
  // 计算音频能量
  let energy = 0;
  for (let i = 0; i < frequencies.length; i++) {
    energy += frequencies[i] / 255;
  }
  energy /= frequencies.length;
  
  // 获取低频能量（生长速度）
  let bassEnergy = 0;
  for (let i = 0; i < 10; i++) {
    bassEnergy += frequencies[i] / 255;
  }
  bassEnergy /= 10;
  
  // 根据音频能量添加新花朵
  const now = Date.now();
  if (now - lastFlowerTime > 2000 / flowerDensity && 
      flowers.length < 20 * flowerDensity && 
      Math.random() < bassEnergy * flowerDensity * 0.3) {
    const newFlower = createFlower(width, height, startColor, endColor);
    flowers.push(newFlower);
    
    // 为花朵添加叶子
    const leafCount = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < leafCount; i++) {
      leaves.push(createLeaf(newFlower.x, newFlower.stemLength, groundY, leafColor));
    }
    
    lastFlowerTime = now;
  }
  
  // 绘制草地纹理
  ctx.fillStyle = '#7CB342'; // 浅草绿
  for (let x = 0; x < width; x += 4) {
    const grassHeight = 5 + Math.sin(x * 0.1) * 3 + Math.random() * 5;
    ctx.fillRect(x, groundY - grassHeight, 2, grassHeight);
  }
  
  // 绘制随机小花
  for (let i = 0; i < 30 * flowerDensity; i++) {
    const x = Math.random() * width;
    const y = groundY - Math.random() * 10;
    const size = 1 + Math.random() * 2;
    
    ctx.fillStyle = getGradientColor(startColor, endColor, Math.random());
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // 按y坐标排序花朵，确保前面的花朵覆盖后面的花朵
  flowers.sort((a, b) => (a.y + a.stemLength) - (b.y + b.stemLength));
  
  // 更新和绘制花朵
  flowers = flowers.filter(flower => {
    // 根据音频能量更新生长阶段
    flower.growthStage = Math.min(
      flower.maxGrowth, 
      flower.growthStage + flower.bloomSpeed * (1 + bassEnergy * 3)
    );
    
    // 更新摇摆角度，基于高频部分
    const highFreqEnergy = frequencies[30] / 255;
    flower.swayAngle += flower.swaySpeed * Math.sin(Date.now() * 0.001) * (1 + highFreqEnergy);
    flower.swayAngle *= 0.95; // 阻尼
    
    // 花茎随着音频摇摆
    const stemEndX = flower.x + Math.sin(flower.swayAngle) * flower.stemLength * 0.2;
    const stemEndY = flower.y;
    
    // 绘制花茎
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = flower.stemWidth;
    ctx.beginPath();
    ctx.moveTo(flower.x, groundY);
    
    // 曲线花茎
    const cp1x = flower.x + Math.sin(flower.swayAngle * 0.5) * flower.stemLength * 0.1;
    const cp1y = groundY - flower.stemLength * 0.5;
    
    ctx.bezierCurveTo(cp1x, cp1y, stemEndX, stemEndY + flower.stemLength * 0.3, stemEndX, stemEndY);
    ctx.stroke();
    
    // 只绘制生长阶段的花朵
    if (flower.growthStage > 0.1) {
      // 保存上下文
      ctx.save();
      ctx.translate(stemEndX, stemEndY);
      ctx.rotate(flower.rotation + flower.swayAngle * 0.2);
      
      const scaleFactor = flower.growthStage;
      ctx.scale(scaleFactor, scaleFactor);
      
      // 花芯
      ctx.fillStyle = '#FFC107'; // 黄色花蕊
      ctx.beginPath();
      ctx.arc(0, 0, flower.size * 0.2, 0, Math.PI * 2);
      ctx.fill();
      
      // 花瓣
      for (let i = 0; i < flower.petals; i++) {
        const petalAngle = (i / flower.petals) * Math.PI * 2;
        const petalSize = flower.size * (0.8 + Math.sin(Date.now() * 0.005 + i) * 0.05);
        
        ctx.fillStyle = flower.color;
        ctx.beginPath();
        
        // 创建花瓣形状
        ctx.ellipse(
          Math.cos(petalAngle) * flower.size * 0.5,
          Math.sin(petalAngle) * flower.size * 0.5,
          petalSize * 0.25,
          petalSize * 0.5,
          petalAngle,
          0,
          Math.PI * 2
        );
        
        ctx.fill();
      }
      
      // 恢复上下文
      ctx.restore();
    }
    
    // 保持生长完成的花朵
    return flower.growthStage < flower.maxGrowth || flower.growthStage >= flower.maxGrowth;
  });
  
  // 更新和绘制叶子
  leaves = leaves.filter(leaf => {
    ctx.save();
    ctx.translate(leaf.x, leaf.y);
    ctx.rotate(leaf.angle + Math.sin(Date.now() * 0.002) * 0.1);
    
    // 绘制叶子形状
    ctx.fillStyle = leaf.color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      leaf.size * 0.5, -leaf.size * 0.5,
      leaf.size, -leaf.size * 0.2,
      leaf.size * 1.5, 0
    );
    ctx.bezierCurveTo(
      leaf.size, leaf.size * 0.2,
      leaf.size * 0.5, leaf.size * 0.5,
      0, 0
    );
    ctx.fill();
    
    // 叶脉
    ctx.strokeStyle = 'rgba(0, 100, 0, 0.5)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(leaf.size, 0);
    ctx.stroke();
    
    for (let i = 1; i <= 3; i++) {
      const y = leaf.size * 0.25 * i / 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(leaf.size * 0.5, y, leaf.size * 0.7, y * 0.8);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(leaf.size * 0.5, -y, leaf.size * 0.7, -y * 0.8);
      ctx.stroke();
    }
    
    ctx.restore();
    
    // 保留所有叶子
    return true;
  });
  
  // 根据波形绘制蝴蝶
  if (energy > 0.4) {
    const butterflyCount = Math.floor(energy * 5);
    
    for (let i = 0; i < butterflyCount; i++) {
      // 使用波形作为路径
      const timeOffset = Date.now() * 0.001 + i * 10;
      const xPos = (Math.sin(timeOffset * 0.2) * 0.5 + 0.5) * width;
      const yPos = groundY * 0.5 + Math.sin(timeOffset * 0.3) * groundY * 0.3;
      
      const wingSize = 5 + Math.sin(timeOffset) * 5;
      const wingAngle = Math.sin(timeOffset * 10) * 0.5;
      
      // 蝴蝶身体
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(xPos, yPos, 5, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // 翅膀
      ctx.fillStyle = getGradientColor(startColor, endColor, i / butterflyCount);
      
      // 左翅
      ctx.save();
      ctx.translate(xPos, yPos);
      ctx.rotate(-Math.PI / 4 - wingAngle);
      ctx.beginPath();
      ctx.ellipse(0, -wingSize, wingSize, wingSize * 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      
      // 右翅
      ctx.save();
      ctx.translate(xPos, yPos);
      ctx.rotate(Math.PI / 4 + wingAngle);
      ctx.beginPath();
      ctx.ellipse(0, -wingSize, wingSize, wingSize * 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  
  // 如果音频能量高，添加阳光光束
  if (energy > 0.6) {
    const sunX = width * 0.8;
    const sunY = height * 0.15;
    const sunRadius = 40 * energy;
    
    // 太阳
    const sunGradient = ctx.createRadialGradient(
      sunX, sunY, 0,
      sunX, sunY, sunRadius
    );
    sunGradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
    sunGradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.6)');
    sunGradient.addColorStop(1, 'rgba(255, 69, 0, 0)');
    
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // 光束
    const beamCount = Math.floor(5 + energy * 5);
    
    for (let i = 0; i < beamCount; i++) {
      const angle = (i / beamCount) * Math.PI * 2 + Date.now() * 0.0005;
      const length = width * 0.5 * (0.5 + energy * 0.5);
      
      const endX = sunX + Math.cos(angle) * length;
      const endY = sunY + Math.sin(angle) * length;
      
      const beamGradient = ctx.createLinearGradient(sunX, sunY, endX, endY);
      beamGradient.addColorStop(0, 'rgba(255, 255, 0, 0.3)');
      beamGradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
      
      ctx.strokeStyle = beamGradient;
      ctx.lineWidth = 3 + energy * 10;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.moveTo(sunX, sunY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
};

// DNA螺旋
interface DNANode {
  x: number;
  y: number;
  z: number;
  color: string;
  baseColor: string;
  pairColor: string;
  size: number;
  rotation: number;
}

// DNA效果配置
let dnaNodes: DNANode[] = [];
let dnaRotation = 0;

// 初始化DNA节点
const initDNA = (count: number, startColor: string, endColor: string, pairStartColor: string, pairEndColor: string) => {
  dnaNodes = [];
  for (let i = 0; i < count; i++) {
    // 错开两条链的节点位置
    const isBase = i % 2 === 0;
    const zPos = i * 15; // 节点间距
    
    // 为每对碱基分配颜色
    const colorPos = Math.floor(i / 2) / (count / 2);
    const baseColor = getGradientColor(startColor, endColor, colorPos);
    const pairColor = getGradientColor(pairStartColor, pairEndColor, colorPos);
    
    dnaNodes.push({
      x: 0,
      y: 0,
      z: zPos,
      color: isBase ? baseColor : pairColor,
      baseColor,
      pairColor,
      size: 8,
      rotation: 0
    });
  }
};

// DNA螺旋效果
export const drawDNAHelix = (
  ctx: CanvasRenderingContext2D,
  frequencies: Uint8Array,
  waveform: Float32Array,
  width: number,
  height: number,
  options: {
    startColor?: string;
    endColor?: string;
    pairStartColor?: string;
    pairEndColor?: string;
    rotationSpeed?: number;
    density?: number;
    background?: string;
  } = {}
) => {
  const {
    startColor = '#9c27b0',
    endColor = '#3f51b5',
    pairStartColor = '#4CAF50',
    pairEndColor = '#8BC34A',
    rotationSpeed = 0.005,
    density = 1,
    background = '#000'
  } = options;
  
  // 初始化DNA节点
  if (dnaNodes.length === 0) {
    initDNA(70 * density, startColor, endColor, pairStartColor, pairEndColor);
  }
  
  // 清除画布并设置背景
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);
  
  // 计算音频能量
  let energy = 0;
  for (let i = 0; i < frequencies.length; i++) {
    energy += frequencies[i] / 255;
  }
  energy /= frequencies.length;
  
  // 根据音频能量更新旋转
  dnaRotation += rotationSpeed * (1 + energy);
  
  // 3D透视参数
  const centerX = width / 2;
  const centerY = height / 2;
  const perspective = 500;
  const camZ = 150;
  const helix = {
    radius: 50 + energy * 30,
    pitch: 100 // 螺旋节距
  };
  
  // 对节点按Z坐标排序，实现正确的遮挡效果
  const sortedNodes = [...dnaNodes].sort((a, b) => b.z - a.z);
  
  // 跟踪同一Z位置的两个节点，用于绘制连接线
  let connectionPairs: {node1: DNANode, node2: DNANode}[] = [];
  
  // 分析音频波形用于变形
  const waveformEnergy = waveform.reduce((sum, val) => sum + Math.abs(val), 0) / waveform.length;
  
  // 根据低频能量控制螺旋扭曲
  let bassEnergy = 0;
  for (let i = 0; i < 10; i++) {
    bassEnergy += frequencies[i] / 255;
  }
  bassEnergy /= 10;
  
  // 更新并绘制DNA节点
  for (let i = 0; i < dnaNodes.length; i++) {
    const node = dnaNodes[i];
    
    // 将节点位置在螺旋上
    const isBase = i % 2 === 0;
    const pairIndex = isBase ? i + 1 : i - 1;
    const hasPair = pairIndex >= 0 && pairIndex < dnaNodes.length;
    
    // 计算螺旋位置
    const angle = (node.z / helix.pitch) * Math.PI * 2 + dnaRotation;
    const spiralRadius = helix.radius * (1 + Math.sin(angle * 3 + Date.now() * 0.001) * 0.1 * bassEnergy);
    
    // 交错两条链的相位
    const phaseOffset = isBase ? 0 : Math.PI;
    
    // 添加频率数据造成的形变
    const freqIndex = Math.floor((i / dnaNodes.length) * frequencies.length);
    const freqValue = frequencies[freqIndex] / 255;
    
    // 根据音频数据计算节点的3D位置
    node.x = Math.cos(angle + phaseOffset) * (spiralRadius + freqValue * 20);
    node.y = Math.sin(angle + phaseOffset) * (spiralRadius + freqValue * 20);
    
    // 增加波形变形
    const waveOffset = Math.sin(Date.now() * 0.001 + i * 0.1) * waveformEnergy * 30;
    
    // 进行视锥透视变换
    const scale = perspective / (perspective + node.z - camZ + waveOffset);
    const x2d = centerX + node.x * scale;
    const y2d = centerY + node.y * scale;
    
    // 节点大小根据距离变化
    const nodeSize = node.size * scale * (1 + freqValue * 0.5);
    
    // 保存投影位置用于绘制连接线
    sortedNodes[i].x = x2d;
    sortedNodes[i].y = y2d;
    sortedNodes[i].size = nodeSize;
    
    // 如果是一对中的第一个，保存它们的关系用于绘制连接线
    if (isBase && hasPair) {
      connectionPairs.push({node1: node, node2: dnaNodes[pairIndex]});
    }
  }
  
  // 先绘制两条螺旋骨架
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  
  // 第一条链
  ctx.beginPath();
  let firstNode = true;
  for (let i = 0; i < sortedNodes.length; i += 2) {
    const node = sortedNodes[i];
    if (firstNode) {
      ctx.moveTo(node.x, node.y);
      firstNode = false;
    } else {
      ctx.lineTo(node.x, node.y);
    }
  }
  ctx.stroke();
  
  // 第二条链
  ctx.beginPath();
  firstNode = true;
  for (let i = 1; i < sortedNodes.length; i += 2) {
    const node = sortedNodes[i];
    if (firstNode) {
      ctx.moveTo(node.x, node.y);
      firstNode = false;
    } else {
      ctx.lineTo(node.x, node.y);
    }
  }
  ctx.stroke();
  
  // 绘制连接碱基对的线
  for (const pair of connectionPairs) {
    const node1 = pair.node1;
    const node2 = pair.node2;
    
    // 计算两点的透视位置
    const scale1 = perspective / (perspective + node1.z - camZ);
    const x1 = centerX + node1.x * scale1;
    const y1 = centerY + node1.y * scale1;
    
    const scale2 = perspective / (perspective + node2.z - camZ);
    const x2 = centerX + node2.x * scale2;
    const y2 = centerY + node2.y * scale2;
    
    // 根据频率数据改变连接线的样式
    const pairIndex = Math.floor((node1.z / (70 * density * 15)) * frequencies.length);
    const pairFreq = pairIndex < frequencies.length ? frequencies[pairIndex] / 255 : 0;
    
    // 绘制碱基对连接线
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, node1.baseColor);
    gradient.addColorStop(1, node2.pairColor);
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1 + pairFreq * 2;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    // 在高能量时添加发光效果
    if (pairFreq > 0.7) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }
  
  // 最后绘制所有节点
  for (const node of sortedNodes) {
    // 在高频能量大时使节点像素化
    const freqIndex = Math.floor((node.z / (70 * density * 15)) * frequencies.length);
    const freq = freqIndex < frequencies.length ? frequencies[freqIndex] / 255 : 0;
    
    if (freq > 0.8) {
      // 像素化效果
      const pixelSize = 2 + freq * 3;
      for (let px = -2; px <= 2; px++) {
        for (let py = -2; py <= 2; py++) {
          if (Math.random() < freq * 0.8) {
            ctx.fillStyle = node.color;
            ctx.fillRect(
              node.x + px * pixelSize, 
              node.y + py * pixelSize, 
              pixelSize, 
              pixelSize
            );
          }
        }
      }
    } else {
      // 正常圆形节点
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      ctx.fill();
      
      // 在节点上添加高光
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(node.x - node.size * 0.3, node.y - node.size * 0.3, node.size * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // 在高能量时添加辉光效果
  if (energy > 0.6) {
    ctx.fillStyle = `rgba(255, 255, 255, ${energy * 0.1})`;
    ctx.fillRect(0, 0, width, height);
    
    // 添加光束
    for (let i = 0; i < 5; i++) {
      const beamX = centerX + (Math.random() - 0.5) * width * 0.8;
      const beamY = centerY + (Math.random() - 0.5) * height * 0.8;
      
      const gradient = ctx.createRadialGradient(
        beamX, beamY, 0,
        beamX, beamY, 100 * energy
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${energy * 0.3})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(beamX, beamY, 100 * energy, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

// 数字水纹
interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  opacity: number;
  speed: number;
  thickness: number;
}

interface DataParticle {
  x: number;
  y: number;
  char: string;
  color: string;
  opacity: number;
  size: number;
  velocity: { x: number, y: number };
}

// 存储当前的水纹和数字粒子
let ripples: Ripple[] = [];
let dataParticles: DataParticle[] = [];
let lastRippleTime = 0;

// 创建水纹
const createRipple = (posX: number, posY: number, startColor: string, endColor: string, energy: number): Ripple => {
  const colorPercent = Math.random();
  const color = getGradientColor(startColor, endColor, colorPercent);
  const maxRadius = 100 + Math.random() * 150 * energy;
  
  return {
    x: posX,
    y: posY,
    radius: 0,
    maxRadius,
    color,
    opacity: 0.8,
    speed: 1 + Math.random() * 2 * energy,
    thickness: 2 + Math.random() * 3 * energy
  };
};

// 创建数字粒子
const createDataParticle = (posX: number, posY: number, startColor: string, endColor: string): DataParticle => {
  const color = getGradientColor(startColor, endColor, Math.random());
  const chars = '01';
  
  return {
    x: posX,
    y: posY,
    char: chars.charAt(Math.floor(Math.random() * chars.length)),
    color,
    opacity: 0.5 + Math.random() * 0.5,
    size: 10 + Math.random() * 10,
    velocity: {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2
    }
  };
};

// 数字水纹效果
export const drawDigitalRipple = (
  ctx: CanvasRenderingContext2D,
  frequencies: Uint8Array,
  waveform: Float32Array,
  width: number,
  height: number,
  options: {
    startColor?: string;
    endColor?: string;
    density?: number;
    particleCount?: number;
    rippleThreshold?: number;
    background?: string;
  } = {}
) => {
  const {
    startColor = '#00bcd4',
    endColor = '#3f51b5',
    density = 1,
    particleCount = 100,
    rippleThreshold = 0.6,
    background = 'rgba(0, 0, 0, 0.2)'
  } = options;
  
  // 半透明背景，形成拖尾效果
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);
  
  // 计算音频能量
  let energy = 0;
  for (let i = 0; i < frequencies.length; i++) {
    energy += frequencies[i] / 255;
  }
  energy /= frequencies.length;
  
  // 根据低频能量创建水纹
  let bassEnergy = 0;
  for (let i = 0; i < 10; i++) {
    bassEnergy += frequencies[i] / 255;
  }
  bassEnergy /= 10;
  
  // 创建数字粒子
  if (dataParticles.length < particleCount * density) {
    const newParticleCount = Math.floor(particleCount * density) - dataParticles.length;
    for (let i = 0; i < newParticleCount; i++) {
      dataParticles.push(createDataParticle(
        Math.random() * width,
        Math.random() * height,
        startColor,
        endColor
      ));
    }
  }
  
  // 在响应大声音时生成新的水纹
  const now = Date.now();
  if (bassEnergy > rippleThreshold && now - lastRippleTime > 300 / (density * bassEnergy)) {
    // 使用波形数据确定水纹位置
    const waveIndex = Math.floor(Math.random() * waveform.length);
    const xPos = width * 0.5 + waveform[waveIndex] * width * 0.4;
    const yPos = height * 0.5 + Math.random() * height * 0.4;
    
    ripples.push(createRipple(xPos, yPos, startColor, endColor, bassEnergy));
    lastRippleTime = now;
    
    // 在水纹中心添加额外的数字粒子爆发
    const burstCount = Math.floor(5 + bassEnergy * 15);
    for (let i = 0; i < burstCount; i++) {
      const particle = createDataParticle(xPos, yPos, startColor, endColor);
      // 爆发速度更快
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      particle.velocity.x = Math.cos(angle) * speed;
      particle.velocity.y = Math.sin(angle) * speed;
      dataParticles.push(particle);
    }
  }
  
  // 更新和绘制水纹
  ripples = ripples.filter(ripple => {
    ripple.radius += ripple.speed;
    ripple.opacity = Math.max(0, ripple.opacity - 0.01);
    
    // 只绘制一定不透明度的水纹
    if (ripple.opacity > 0.05) {
      ctx.strokeStyle = ripple.color;
      ctx.lineWidth = ripple.thickness;
      ctx.globalAlpha = ripple.opacity;
      
      // 添加数字化效果
      const segments = Math.floor(12 + energy * 12);
      const segmentAngle = (Math.PI * 2) / segments;
      
      // 数字化水纹
      for (let i = 0; i < segments; i++) {
        // 扭曲各段
        const freqIndex = Math.floor((i / segments) * frequencies.length);
        const freqValue = frequencies[freqIndex] / 255;
        
        const startAngle = i * segmentAngle;
        const endAngle = startAngle + segmentAngle;
        
        // 扰动半径
        const radiusVariation = 1 + freqValue * 0.3;
        
        ctx.beginPath();
        ctx.arc(
          ripple.x, 
          ripple.y, 
          ripple.radius * radiusVariation, 
          startAngle, 
          endAngle
        );
        ctx.stroke();
      }
      
      ctx.globalAlpha = 1;
    }
    
    // 当水纹半径超过最大值或不透明度太低时，移除它
    return ripple.radius < ripple.maxRadius && ripple.opacity > 0.05;
  });
  
  // 更新和绘制数字粒子
  dataParticles = dataParticles.filter(particle => {
    // 更新位置
    particle.x += particle.velocity.x;
    particle.y += particle.velocity.y;
    
    // 如果离开画布，重置到另一边
    if (particle.x < 0) particle.x = width;
    if (particle.x > width) particle.x = 0;
    if (particle.y < 0) particle.y = height;
    if (particle.y > height) particle.y = 0;
    
    // 在水纹附近的粒子受到影响
    for (const ripple of ripples) {
      const dx = particle.x - ripple.x;
      const dy = particle.y - ripple.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // 当粒子接近水纹边缘时
      const rippleEdgeDistance = Math.abs(distance - ripple.radius);
      if (rippleEdgeDistance < 20) {
        // 增加粒子大小和改变颜色
        particle.size *= 1.05;
        
        // 给粒子加上一个指向或远离水纹中心的力
        const angle = Math.atan2(dy, dx);
        const force = 0.2 * (1 - rippleEdgeDistance / 20);
        particle.velocity.x += Math.cos(angle) * force;
        particle.velocity.y += Math.sin(angle) * force;
        
        // 随机改变字符
        if (Math.random() < 0.1) {
          particle.char = Math.random() < 0.5 ? '0' : '1';
        }
      }
    }
    
    // 限制粒子速度
    const speed = Math.sqrt(
      particle.velocity.x * particle.velocity.x + 
      particle.velocity.y * particle.velocity.y
    );
    if (speed > 5) {
      particle.velocity.x = (particle.velocity.x / speed) * 5;
      particle.velocity.y = (particle.velocity.y / speed) * 5;
    }
    
    // 缓慢恢复原来的大小
    particle.size = particle.size * 0.99 + (10 + Math.random() * 10) * 0.01;
    
    // 根据频率变化字体大小和字符
    const freqIndex = Math.floor((particle.x / width) * frequencies.length);
    const freqValue = frequencies[freqIndex] / 255;
    
    if (freqValue > 0.7 && Math.random() < 0.2) {
      particle.char = Math.random() < 0.5 ? '0' : '1';
    }
    
    // 绘制数字粒子
    ctx.font = `${Math.floor(particle.size)}px monospace`;
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = particle.opacity;
    ctx.fillText(particle.char, particle.x, particle.y);
    ctx.globalAlpha = 1;
    
    return true;
  });
  
  // 添加闪烁效果
  const flashCount = Math.floor(energy * 10);
  for (let i = 0; i < flashCount; i++) {
    if (Math.random() < 0.3) {
      const flashX = Math.random() * width;
      const flashY = Math.random() * height;
      
      ctx.fillStyle = getGradientColor(startColor, endColor, Math.random());
      ctx.font = `${Math.floor(15 + Math.random() * 20)}px monospace`;
      ctx.fillText(Math.random() < 0.5 ? '0' : '1', flashX, flashY);
    }
  }
  
  // 在高能量时添加矩阵代码雨效果
  if (energy > 0.7) {
    const codeRainCount = Math.floor(10 + energy * 20);
    
    for (let i = 0; i < codeRainCount; i++) {
      const x = Math.random() * width;
      let y = -20;
      
      const columnHeight = Math.floor(5 + Math.random() * 15);
      const charSize = 12 + Math.random() * 8;
      
      for (let j = 0; j < columnHeight; j++) {
        const charOpacity = 1 - (j / columnHeight);
        
        if (charOpacity > 0.1) {
          ctx.font = `${Math.floor(charSize)}px monospace`;
          ctx.fillStyle = `rgba(0, 255, 140, ${charOpacity})`;
          ctx.fillText(Math.random() < 0.5 ? '0' : '1', x, y + j * charSize);
        }
      }
    }
  }
};

// 粒子文字
interface TextParticle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  color: string;
  size: number;
  dx: number;
  dy: number;
  vx: number;
  vy: number;
  force: number;
  angle: number;
  distance: number;
  random: number;
  alpha: number;
  brightness: number;
}

// 存储文字粒子
let textParticles: TextParticle[] = [];
let particleText = '音楽';
let textSize = 80;
let textInitialized = false;

// 初始化文字粒子
const initTextParticles = (
  ctx: CanvasRenderingContext2D,
  text: string,
  size: number,
  width: number,
  height: number,
  startColor: string,
  endColor: string
) => {
  // 调整文本位置
  ctx.font = `bold ${size}px Arial`;
  ctx.textAlign = 'center';
  
  // 清除之前的粒子
  textParticles = [];
  
  // 创建临时画布用于获取文本像素
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  
  if (!tempCtx) return;
  
  tempCanvas.width = width;
  tempCanvas.height = height;
  
  // 在临时画布上绘制文本
  tempCtx.font = `bold ${size}px Arial`;
  tempCtx.fillStyle = '#ffffff';
  tempCtx.textAlign = 'center';
  tempCtx.textBaseline = 'middle';
  tempCtx.fillText(text, width / 2, height / 2);
  
  // 获取像素数据
  const imageData = tempCtx.getImageData(0, 0, width, height).data;
  
  // 采样步长（调整以控制粒子数量）
  const sampleStep = 4 + Math.floor(size / 30);
  
  // 创建文字粒子
  for (let y = 0; y < height; y += sampleStep) {
    for (let x = 0; x < width; x += sampleStep) {
      const index = (y * width + x) * 4;
      // 只为不透明像素创建粒子
      if (imageData[index + 3] > 128) {
        const colorPos = Math.random();
        const color = getGradientColor(startColor, endColor, colorPos);
        
        textParticles.push({
          x: width / 2 + (Math.random() - 0.5) * width,
          y: height / 2 + (Math.random() - 0.5) * height,
          originX: x,
          originY: y,
          color,
          size: 1 + Math.random() * 3,
          dx: 0,
          dy: 0,
          vx: 0,
          vy: 0,
          force: 0,
          angle: 0,
          distance: 0,
          random: Math.random(),
          alpha: 0,
          brightness: 0
        });
      }
    }
  }
  
  textInitialized = true;
};

// 粒子文字效果
export const drawParticleText = (
  ctx: CanvasRenderingContext2D,
  frequencies: Uint8Array,
  waveform: Float32Array,
  width: number,
  height: number,
  options: {
    text?: string;
    startColor?: string;
    endColor?: string;
    particleSize?: number;
    textSize?: number;
    easeDistance?: number;
    interactive?: boolean;
    background?: string;
  } = {}
) => {
  const {
    text = '音楽',
    startColor = '#ff4081',
    endColor = '#7c4dff',
    particleSize = 2,
    textSize: customTextSize = 80,
    easeDistance = 8,
    interactive = true,
    background = 'rgba(0, 0, 0, 0.05)'
  } = options;
  
  // 如果文字或大小改变，重新初始化粒子
  if (!textInitialized || particleText !== text || textSize !== customTextSize) {
    particleText = text;
    textSize = customTextSize;
    initTextParticles(ctx, text, textSize, width, height, startColor, endColor);
  }
  
  // 绘制半透明背景
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);
  
  // 计算音频能量
  let energy = 0;
  for (let i = 0; i < frequencies.length; i++) {
    energy += frequencies[i] / 255;
  }
  energy /= frequencies.length;
  
  // 获取低频能量
  let bassEnergy = 0;
  for (let i = 0; i < 10; i++) {
    bassEnergy += frequencies[i] / 255;
  }
  bassEnergy /= 10;
  
  // 获取高频能量
  let highEnergy = 0;
  for (let i = frequencies.length - 20; i < frequencies.length; i++) {
    highEnergy += frequencies[i] / 255;
  }
  highEnergy /= 20;
  
  // 创建鼠标交互的影响
  const mouseX = width / 2;
  const mouseY = height / 2;
  
  // 根据音频波形创建波动效果
  const waveX = Math.sin(Date.now() * 0.001) * width * 0.1;
  const waveY = Math.cos(Date.now() * 0.001) * height * 0.1;
  
  // 更新和绘制所有粒子
  for (let i = 0; i < textParticles.length; i++) {
    const particle = textParticles[i];
    
    // 调整目标位置，添加基于频率的扰动
    const frequencyIndex = Math.floor((i / textParticles.length) * frequencies.length);
    const frequencyValue = frequencies[frequencyIndex] / 255;
    
    // 根据频率调整粒子的目标位置
    const targetX = particle.originX + waveX * frequencyValue * 2;
    const targetY = particle.originY + waveY * frequencyValue * 2;
    
    // 计算距离
    particle.dx = targetX - particle.x;
    particle.dy = targetY - particle.y;
    particle.distance = Math.sqrt(particle.dx * particle.dx + particle.dy * particle.dy);
    
    // 力的计算
    particle.force = -easeDistance * (1 - particle.distance / easeDistance);
    
    // 如果粒子接近目标位置，减小力
    if (particle.distance < easeDistance) {
      particle.force = (particle.distance - easeDistance) * (particle.random * 0.1 + 0.12);
    }
    
    // 计算角度
    particle.angle = Math.atan2(particle.dy, particle.dx);
    
    // 应用力
    particle.vx += Math.cos(particle.angle) * particle.force;
    particle.vy += Math.sin(particle.angle) * particle.force;
    
    // 添加鼠标/触摸交互
    if (interactive) {
      // 计算到鼠标位置的距离
      const mouseForceRadius = 50 * (1 + bassEnergy);
      const dx = particle.x - mouseX - waveX * bassEnergy * 10;
      const dy = particle.y - mouseY - waveY * bassEnergy * 10;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // 施加鼠标斥力
      if (distance < mouseForceRadius) {
        const angle = Math.atan2(dy, dx);
        const force = (mouseForceRadius - distance) / mouseForceRadius;
        particle.vx += Math.cos(angle) * force * (1 + bassEnergy * 10);
        particle.vy += Math.sin(angle) * force * (1 + bassEnergy * 10);
      }
    }
    
    // 添加随机性
    particle.vx += (Math.random() - 0.5) * (0.1 + highEnergy * 0.2);
    particle.vy += (Math.random() - 0.5) * (0.1 + highEnergy * 0.2);
    
    // 阻尼
    particle.vx *= 0.92;
    particle.vy *= 0.92;
    
    // 更新位置
    particle.x += particle.vx;
    particle.y += particle.vy;
    
    // 计算不透明度（基于到原点的距离）
    particle.alpha = Math.min(1, 1 - (particle.distance / 200));
    if (particle.alpha < 0) particle.alpha = 0;
    
    // 根据音频数据调整亮度
    particle.brightness = 0.8 + frequencyValue * 0.5;
    
    // 在高能量时添加脉冲效果
    if (energy > 0.7 && Math.random() < 0.2) {
      particle.size = particleSize * (1 + Math.random() * 2);
      particle.brightness = 1.5;
    } else {
      // 缓慢恢复原来的大小
      particle.size = particle.size * 0.95 + particleSize * 0.05;
    }
    
    // 绘制粒子
    ctx.globalAlpha = particle.alpha;
    ctx.fillStyle = particle.color;
    
    // 根据能量决定是否绘制为圆形或正方形
    if (energy > 0.6 && Math.random() < 0.3) {
      // 正方形
      const size = particle.size * 1.2 * particle.brightness;
      ctx.fillRect(
        particle.x - size / 2,
        particle.y - size / 2,
        size,
        size
      );
    } else {
      // 圆形
      ctx.beginPath();
      ctx.arc(
        particle.x,
        particle.y,
        particle.size * particle.brightness,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    
    // 高能量时添加连接线
    if (energy > 0.8) {
      // 查找临近粒子并连线
      for (let j = i + 1; j < textParticles.length; j++) {
        const otherParticle = textParticles[j];
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 25) {
          ctx.globalAlpha = (1 - distance / 25) * 0.2 * particle.alpha * otherParticle.alpha;
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.stroke();
        }
      }
    }
  }
  
  // 重置全局透明度
  ctx.globalAlpha = 1;
  
  // 添加整体模糊效果
  if (energy > 0.5) {
    ctx.fillStyle = `rgba(0, 0, 0, ${0.05 * energy})`;
    ctx.fillRect(0, 0, width, height);
  }
  
  // 在高能量时添加闪烁效果
  if (energy > 0.7) {
    for (let i = 0; i < 10; i++) {
      if (Math.random() < 0.2) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = 1 + Math.random() * 3;
        
        ctx.fillStyle = getGradientColor(startColor, endColor, Math.random());
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
};

// 注释掉新添加的效果类型
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
  // 暂时注释掉新添加的效果
  // MUSIC_METEOR = 'musicMeteor',
  // SOUND_GARDEN = 'soundGarden',
  // DNA_HELIX = 'dnaHelix',
  // DIGITAL_RIPPLE = 'digitalRipple',
  // PARTICLE_TEXT = 'particleText'
}