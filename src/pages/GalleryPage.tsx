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

const CardImage = styled.div<{ $background: string }>`
  height: 200px;
  background-image: ${props => `url(${props.$background})`};
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

// サンプル作品データ
const galleryItems = [
  {
    id: 1,
    title: 'エレクトロニック音楽スペクトラム可視化',
    author: '音楽愛好家',
    description: 'パーティクルエフェクトを使用して電子ダンスミュージックのエネルギッシュなリズムを表現し、音楽の一拍ごとに動的に反応します。',
    image: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    likes: 324,
    views: 4587
  },
  {
    id: 2,
    title: 'クラシック音楽波形アート',
    author: 'クラシック愛好家',
    description: 'ベートーヴェンの第九交響曲の美しいメロディーが流れるような波形で表現され、色彩は楽章の変化に合わせて変化します。',
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1631&q=80',
    likes: 189,
    views: 2135
  },
  {
    id: 3,
    title: 'ジャズ円形スペクトラム',
    author: 'ジャズプレイヤー',
    description: 'サックスソロの繊細な音色が動的な円形スペクトラムで表現され、ジャズ即興の自由さと活力を体現しています。',
    image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    likes: 256,
    views: 3421
  },
  {
    id: 4,
    title: 'ロックスペクトラムアート',
    author: 'ロック愛好家',
    description: 'ヘビーメタル音楽の強烈なリズムとギターソロが、強いコントラストカラーと動的なバーチャートで表現されています。',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    likes: 423,
    views: 5678
  },
  {
    id: 5,
    title: '環境音楽パーティクルシステム',
    author: 'サウンドアーティスト',
    description: '自然環境のサウンドサンプルから生成された穏やかなパーティクルの流れで、自然の調和とリズムを表現しています。',
    image: 'https://images.unsplash.com/photo-1558865869-c93f6f8482af?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1481&q=80',
    likes: 157,
    views: 1832
  },
  {
    id: 6,
    title: 'ポップミュージック動的波形',
    author: 'ポップミュージックプロデューサー',
    description: '現代のポップソングのボーカルとバッキングを分離して生成されたインタラクティブな波形で、声と音楽の完璧な融合を示しています。',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    likes: 289,
    views: 3245
  }
];

function GalleryPage() {
  return (
    <GalleryContainer>
      <Title>可視化ギャラリー</Title>
      
      <GalleryGrid>
        {galleryItems.map(item => (
          <GalleryCard key={item.id}>
            <CardImage $background={item.image}>
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
                <ViewButton to={`/visualizer?id=${item.id}`}>表示</ViewButton>
              </CardFooter>
            </CardContent>
          </GalleryCard>
        ))}
      </GalleryGrid>
    </GalleryContainer>
  );
}

export default GalleryPage;