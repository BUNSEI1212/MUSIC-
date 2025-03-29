import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

// 页面组件
import HomePage from './pages/HomePage';
import VisualizerPage from './pages/VisualizerPage';
import GalleryPage from './pages/GalleryPage';
import ProfilePage from './pages/ProfilePage';

// 组件
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
`;

function App() {
  return (
    <AppContainer>
      <Navbar />
      <MainContent>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/visualizer" element={<VisualizerPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </MainContent>
      <Footer />
    </AppContainer>
  );
}

export default App; 