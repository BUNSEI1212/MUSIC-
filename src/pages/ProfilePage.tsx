import React, { useState } from 'react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  color: #ba68c8;
  margin-bottom: 40px;
  text-align: center;
`;

const ProfileCard = styled.div`
  background-color: #1e1e1e;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const ProfileHeader = styled.div`
  padding: 30px;
  background: linear-gradient(135deg, #9c27b0 0%, #3f51b5 100%);
  display: flex;
  align-items: center;
  gap: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #e1bee7;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.3);
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 5px;
  color: white;
`;

const ProfileBio = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 15px;
`;

const ProfileStats = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
  color: white;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
`;

const ProfileContent = styled.div`
  padding: 30px;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #333;
  margin-bottom: 30px;
  overflow-x: auto;
`;

const Tab = styled.button<{ $isActive: boolean }>`
  padding: 10px 20px;
  background: none;
  border: none;
  color: ${props => props.$isActive ? '#ba68c8' : '#999'};
  font-size: 1rem;
  font-weight: ${props => props.$isActive ? '600' : '400'};
  cursor: pointer;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 100%;
    height: 3px;
    background-color: ${props => props.$isActive ? '#ba68c8' : 'transparent'};
  }
  
  &:hover {
    color: ${props => props.$isActive ? '#ba68c8' : '#ccc'};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 50px 0;
  color: #777;
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
`;

const EmptyStateText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #9c27b0;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #ba68c8;
  }
`;

// 标签类型
enum TabType {
  CREATIONS = 'creations',
  FAVORITES = 'favorites',
  SETTINGS = 'settings'
}

function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.CREATIONS);
  
  // サンプルユーザーデータ
  const user = {
    name: "音楽可視化愛好家",
    bio: "音楽と視覚芸術の融合を愛するクリエイター、電子音楽の視覚表現を得意としています",
    avatar: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1631&q=80",
    creations: 4,
    favorites: 16,
    followers: 128
  };
  
  // 根据选中的标签显示不同内容
  const renderTabContent = () => {
    switch (activeTab) {
      case TabType.CREATIONS:
        return (
          <EmptyState>
            <EmptyStateIcon>🎵</EmptyStateIcon>
            <EmptyStateText>まだ可視化作品を作成していません</EmptyStateText>
            <Button>最初の作品を作成</Button>
          </EmptyState>
        );
        
      case TabType.FAVORITES:
        return (
          <EmptyState>
            <EmptyStateIcon>❤️</EmptyStateIcon>
            <EmptyStateText>まだお気に入りの作品はありません</EmptyStateText>
            <Button>ギャラリーを閲覧</Button>
          </EmptyState>
        );
        
      case TabType.SETTINGS:
        return (
          <form>
            {/* 実際のプロジェクトではここにさらに多くのフォーム要素があります */}
            <h3 style={{ marginBottom: '20px', color: '#ddd' }}>アカウント設定</h3>
            <p style={{ color: '#999', marginBottom: '30px' }}>
              このセクションは実際のプロジェクトでは個人情報設定、プライバシー設定、通知設定などの機能を含みます。
            </p>
          </form>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <ProfileContainer>
      <Title>プロフィール</Title>
      
      <ProfileCard>
        <ProfileHeader>
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
          </Avatar>
          
          <ProfileInfo>
            <ProfileName>{user.name}</ProfileName>
            <ProfileBio>{user.bio}</ProfileBio>
            
            <ProfileStats>
              <StatItem>
                <StatValue>{user.creations}</StatValue>
                <StatLabel>作品</StatLabel>
              </StatItem>
              
              <StatItem>
                <StatValue>{user.favorites}</StatValue>
                <StatLabel>お気に入り</StatLabel>
              </StatItem>
              
              <StatItem>
                <StatValue>{user.followers}</StatValue>
                <StatLabel>フォロワー</StatLabel>
              </StatItem>
            </ProfileStats>
          </ProfileInfo>
        </ProfileHeader>
        
        <ProfileContent>
          <TabContainer>
            <Tab 
              $isActive={activeTab === TabType.CREATIONS}
              onClick={() => setActiveTab(TabType.CREATIONS)}
            >
              マイ作品
            </Tab>
            
            <Tab 
              $isActive={activeTab === TabType.FAVORITES}
              onClick={() => setActiveTab(TabType.FAVORITES)}
            >
              お気に入り
            </Tab>
            
            <Tab 
              $isActive={activeTab === TabType.SETTINGS}
              onClick={() => setActiveTab(TabType.SETTINGS)}
            >
              アカウント設定
            </Tab>
          </TabContainer>
          
          {renderTabContent()}
        </ProfileContent>
      </ProfileCard>
    </ProfileContainer>
  );
}

export default ProfilePage; 