import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.nav`
  background-color: #1a1a1a;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #9c27b0;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #ba68c8;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)<{ $isActive?: boolean }>`
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.$isActive ? '#ba68c8' : '#ffffff'};
  padding: 0.5rem 0;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    width: ${props => props.$isActive ? '100%' : '0'};
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #ba68c8;
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: #ba68c8;
    
    &:after {
      width: 100%;
    }
  }
`;

function Navbar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <NavContainer>
      <NavContent>
        <Logo to="/">
          <span>音乐可视化</span>
        </Logo>
        <NavLinks>
          <NavLink to="/" $isActive={isActive('/')}>
            首页
          </NavLink>
          <NavLink to="/visualizer" $isActive={isActive('/visualizer')}>
            可视化
          </NavLink>
          <NavLink to="/gallery" $isActive={isActive('/gallery')}>
            作品库
          </NavLink>
          <NavLink to="/profile" $isActive={isActive('/profile')}>
            个人中心
          </NavLink>
        </NavLinks>
      </NavContent>
    </NavContainer>
  );
}

export default Navbar; 