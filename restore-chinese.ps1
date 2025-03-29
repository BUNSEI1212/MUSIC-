# 恢复中文内容的脚本
Write-Host "开始恢复中文内容..."

# 恢复导航栏
$navbarContent = @"
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

const NavLink = styled(Link)<{ \$isActive?: boolean }>`
  font-size: 1rem;
  font-weight: 500;
  color: \${props => props.\$isActive ? '#ba68c8' : '#ffffff'};
  padding: 0.5rem 0;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    width: \${props => props.\$isActive ? '100%' : '0'};
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
          <NavLink to="/" \$isActive={isActive('/')}>
            首页
          </NavLink>
          <NavLink to="/visualizer" \$isActive={isActive('/visualizer')}>
            可视化
          </NavLink>
          <NavLink to="/gallery" \$isActive={isActive('/gallery')}>
            作品库
          </NavLink>
          <NavLink to="/profile" \$isActive={isActive('/profile')}>
            个人中心
          </NavLink>
        </NavLinks>
      </NavContent>
    </NavContainer>
  );
}

export default Navbar;
"@

Set-Content -Path "src/components/Navbar.tsx" -Value $navbarContent

# 恢复页脚
$footerContent = @"
import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #1a1a1a;
  padding: 1.5rem 2rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Copyright = styled.p`
  color: #999;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 1rem;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
`;

const FooterLink = styled.a`
  color: #ddd;
  font-size: 0.9rem;
  
  &:hover {
    color: #ba68c8;
    text-decoration: underline;
  }
`;

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterLinks>
          <FooterLink href="#">关于我们</FooterLink>
          <FooterLink href="#">使用条款</FooterLink>
          <FooterLink href="#">隐私政策</FooterLink>
          <FooterLink href="#">帮助中心</FooterLink>
        </FooterLinks>
        <Copyright>
          © {currentYear} 音乐可视化平台 | 保留所有权利
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer;
"@

Set-Content -Path "src/components/Footer.tsx" -Value $footerContent

# 恢复HTML文件
$htmlContent = @"
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="音乐可视化平台 - 实时展示音频视觉效果" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>音乐可视化平台</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <noscript>您需要启用JavaScript来运行此应用。</noscript>
    <div id="root"></div>
  </body>
</html>
"@

Set-Content -Path "public/index.html" -Value $htmlContent

Write-Host "恢复完成！请检查以下文件是否已恢复原始中文内容："
Write-Host "1. src/components/Navbar.tsx"
Write-Host "2. src/components/Footer.tsx"
Write-Host "3. public/index.html"

Write-Host "注意：还有其他页面需要手动编辑恢复，包括："
Write-Host "- src/pages/HomePage.tsx"
Write-Host "- src/pages/VisualizerPage.tsx"
Write-Host "- src/pages/GalleryPage.tsx"
Write-Host "- src/pages/ProfilePage.tsx"
Write-Host "- README.md" 