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
          <FooterLink href="#">私たちについて</FooterLink>
          <FooterLink href="#">利用規約</FooterLink>
          <FooterLink href="#">プライバシーポリシー</FooterLink>
          <FooterLink href="#">ヘルプセンター</FooterLink>
        </FooterLinks>
        <Copyright>
          © {currentYear} 音楽可視化プラットフォーム | 全ての権利を留保
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer; 