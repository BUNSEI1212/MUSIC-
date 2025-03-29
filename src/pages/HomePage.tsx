import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #4a148c 0%, #7b1fa2 100%);
  border-radius: 12px;
  margin-bottom: 3rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #e1bee7, #ba68c8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin-bottom: 2rem;
  color: #e0e0e0;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const HeroButton = styled(Link)`
  display: inline-block;
  background-color: #ba68c8;
  color: white;
  font-weight: 600;
  padding: 0.8rem 2rem;
  border-radius: 30px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(186, 104, 200, 0.4);
  
  &:hover {
    background-color: #9c27b0;
    transform: translateY(-3px);
    box-shadow: 0 7px 25px rgba(186, 104, 200, 0.5);
  }
`;

const FeaturesSection = styled.section`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #ba68c8;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background-color: #1e1e1e;
  border-radius: 8px;
  padding: 2rem;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #e1bee7;
`;

const FeatureDescription = styled.p`
  color: #bbb;
  line-height: 1.6;
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #ba68c8;
`;

const DemoSection = styled.section`
  margin-bottom: 4rem;
  background-color: #1e1e1e;
  border-radius: 12px;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DemoImage = styled.img`
  max-width: 100%;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const DemoText = styled.p`
  text-align: center;
  max-width: 600px;
  margin-bottom: 2rem;
  color: #ddd;
  line-height: 1.6;
`;

const HowItWorksSection = styled.section`
  margin-bottom: 4rem;
`;

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const StepItem = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #9c27b0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  flex-shrink: 0;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  color: #e1bee7;
`;

const StepDescription = styled.p`
  color: #bbb;
  line-height: 1.6;
`;

function HomePage() {
  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle>音楽可視化クリエイティブプラットフォーム</HeroTitle>
        <HeroSubtitle>
          先進的な音声分析技術で、音楽を視覚アートに変換します。あなたの音楽をアップロードし、独自の視覚体験を作成し、あなたの創造性を共有しましょう。
        </HeroSubtitle>
        <HeroButton to="/visualizer">作成を開始</HeroButton>
      </HeroSection>
      
      <FeaturesSection>
        <SectionTitle>プラットフォームの特徴</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>🎵</FeatureIcon>
            <FeatureTitle>リアルタイム音声分析</FeatureTitle>
            <FeatureDescription>
              Web Audio APIを使用して、音声スペクトル、ビート、音程をリアルタイムで分析し、動的に反応する視覚効果を作成します。
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🎨</FeatureIcon>
            <FeatureTitle>多様な視覚化効果</FeatureTitle>
            <FeatureDescription>
              スペクトル分析、波形、粒子システムなど、さまざまな視覚化効果を提供し、カスタムカラーやパラメータもサポートしています。
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>💾</FeatureIcon>
            <FeatureTitle>保存と共有</FeatureTitle>
            <FeatureDescription>
              あなたの視覚作品を画像や動画として保存し、SNSで簡単に共有したり、あなたのウェブサイトに埋め込んだりすることができます。
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
      
      <DemoSection>
        <SectionTitle>クリエイティブショーケース</SectionTitle>
        <DemoImage 
          src="https://images.unsplash.com/photo-1614149162883-504ce4d13909?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
          alt="音楽可視化サンプル" 
        />
        <DemoText>
          すべての音楽には独自の視覚表現があります。私たちのプラットフォームを通じて、音楽の周波数、音量、ビートに基づいて驚くべき視覚効果を作成できます。
          ダイナミックなスペクトルバーから滑らかな波形ライン、インタラクティブな粒子システムまで、あなただけの音楽ビジュアルアートをカスタマイズしましょう。
        </DemoText>
        <HeroButton to="/gallery">ギャラリーを閲覧</HeroButton>
      </DemoSection>
      
      <HowItWorksSection>
        <SectionTitle>使用方法</SectionTitle>
        <StepsContainer>
          <StepItem>
            <StepNumber>1</StepNumber>
            <StepContent>
              <StepTitle>音楽をアップロードまたは選択</StepTitle>
              <StepDescription>
                お気に入りの音楽ファイルをアップロードするか、提供されているサンプルから選択してください。MP3、WAV、OGGなどの一般的な音声フォーマットをサポートしています。
              </StepDescription>
            </StepContent>
          </StepItem>
          
          <StepItem>
            <StepNumber>2</StepNumber>
            <StepContent>
              <StepTitle>視覚化効果を選択</StepTitle>
              <StepDescription>
                さまざまな視覚効果からお好みのスタイルを選び、色、形、アニメーションパラメータを調整して、ユニークな視覚体験を作成します。
              </StepDescription>
            </StepContent>
          </StepItem>
          
          <StepItem>
            <StepNumber>3</StepNumber>
            <StepContent>
              <StepTitle>リアルタイムプレビューと調整</StepTitle>
              <StepDescription>
                音楽を再生し、視覚効果をリアルタイムで確認しながら、最適な結果を得るためにパラメータを微調整します。
              </StepDescription>
            </StepContent>
          </StepItem>
          
          <StepItem>
            <StepNumber>4</StepNumber>
            <StepContent>
              <StepTitle>保存して共有</StepTitle>
              <StepDescription>
                満足したら、作品を保存してSNSで共有したり、画像や動画ファイルとしてダウンロードしたりすることができます。
              </StepDescription>
            </StepContent>
          </StepItem>
        </StepsContainer>
      </HowItWorksSection>
    </HomeContainer>
  );
}

export default HomePage;