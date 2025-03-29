# 音楽可視化プラットフォーム

これはReactとWeb Audio APIに基づいた音楽可視化プラットフォームで、音声をリアルタイムで豊かな視覚効果に変換することができます。このプロジェクトはTypeScriptで開発され、多様な視覚効果とインタラクティブ機能を提供しています。

## 機能特徴

- **リアルタイム音声分析**：Web Audio APIを使用して音声スペクトル、波形、音量をリアルタイムで分析
- **多様な視覚効果**：スペクトラムバー、波形図、円形スペクトラム、パーティクルシステムなど、様々な可視化表示方法をサポート
- **カスタマイズオプション**：ユーザーは色、サイズ、その他のパラメータを調整して視覚効果をパーソナライズ可能
- **音声コントロール**：再生、一時停止、音量、進行状況コントロールを含む完全な音声再生コントロール機能を内蔵
- **作品展示**：様々なスタイルの音楽可視化作品を展示するギャラリー機能を提供
- **レスポンシブデザイン**：異なる画面サイズに適応し、モバイル端末でも優れた体験を提供

## 技術スタック

- **フロントエンドフレームワーク**：React 18 + TypeScript
- **ルーティング管理**：React Router v6
- **スタイリングソリューション**：Styled Components
- **音声処理**：Web Audio API + Tone.js
- **3Dレンダリング**：Three.js（一部の高度な視覚効果用）

## プロジェクト構造

```
/src
  /components         # 共通UIコンポーネント
    /Navbar.tsx       # ナビゲーションバーコンポーネント
    /Footer.tsx       # フッターコンポーネント
  /pages              # ページコンポーネント
    /HomePage.tsx     # ホームページ
    /VisualizerPage.tsx  # 可視化ページ
    /GalleryPage.tsx  # ギャラリーページ
    /ProfilePage.tsx  # プロフィールページ
  /hooks              # カスタムフック
    /useAudioAnalyzer.ts  # 音声分析フック
  /utils              # ユーティリティ関数
    /visualEffects.ts # 視覚効果ユーティリティ関数
  /assets             # 静的リソース
  App.tsx             # アプリメインコンポーネント
  index.tsx           # エントリーポイント
  index.css           # グローバルスタイル
/public
  index.html          # HTMLテンプレート
  manifest.json       # アプリマニフェスト
  favicon.ico         # ウェブサイトアイコン
  logo192.png         # アプリアイコン（小）
  logo512.png         # アプリアイコン（大）
```

## 環境要件

- Node.js (v14+)
- npm (v6+) または yarn (v1.22+)

## 詳細インストール手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/yourusername/music-visualizer.git
cd music-visualizer
```

### 2. 依存関係のインストール

npmを使用してすべての依存関係をインストール：

```bash
npm install --legacy-peer-deps
```

> 注意：依存関係の競合問題を避けるために `--legacy-peer-deps` フラグを使用しています。

依存関係に関連するエラーが発生した場合は、以下の主要な依存関係を個別にインストールしてみてください：

```bash
# 主要なReact依存関係
npm install react react-dom react-scripts --legacy-peer-deps

# ルーティングとスタイリング
npm install react-router-dom styled-components --legacy-peer-deps

# 音声処理
npm install tone --legacy-peer-deps

# 3Dレンダリングライブラリ
npm install three --legacy-peer-deps

# TypeScript型定義
npm install @types/react @types/react-dom @types/styled-components @types/three typescript --save-dev --legacy-peer-deps
```

### 3. 一般的な依存関係の問題の解決

インストールまたは起動時に依存関係のエラーが発生した場合は、以下の解決策を試してください：

```bash
# npmキャッシュのクリア
npm cache clean --force

# node_modulesを削除して再インストール
rm -rf node_modules
npm install --legacy-peer-deps
```

### 4. 開発サーバーの起動

```bash
npm start
```

起動に成功すると、以下のような出力が表示されます：

```
Compiled successfully!
You can now view music-visualizer in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

その後、ブラウザで http://localhost:3000 にアクセスしてアプリケーションを表示できます。

### 5. 本番バージョンのビルド

本番環境にデプロイする準備ができたら、最適化されたビルドを作成できます：

```bash
npm run build
```

これにより `build` ディレクトリに本番用のファイルが生成され、任意の静的ファイルホスティングサービスにデプロイできます。

## 使用ガイド

### ホームページ

ホームページはプラットフォームの主な特徴と紹介を表示します：
1. プラットフォームの機能紹介を確認
2. 「創作を始める」ボタンをクリックして可視化ページに入る
3. 「ギャラリーを閲覧」をクリックして他のユーザーの作品を見る

### 可視化ページ

![image](https://github.com/user-attachments/assets/9b906bc4-f564-492b-8f36-55ca119e374c)


可視化ページはこのアプリケーションの核心機能エリアです：

1. **音楽の選択**：
   - 「ファイルを選択」をクリックしてローカルの音楽ファイルをアップロード（MP3、WAV、OGGなどの形式をサポート）
   - サンプル音楽ドロップダウンメニューからプリセットのサンプル音楽を選択

2. **再生コントロール**：
   - 再生、一時停止、停止ボタンを使用して音声再生を制御
   - プログレスバーをドラッグして再生位置を変更
   - 音量スライダーを使用して音量を調整

3. **視覚効果の選択**：
   - ドロップダウンメニューから異なる可視化効果を選択：
     - スペクトラムバー：音声周波数分布を表示
     - 波形図：音声波形を表示
     - 円形スペクトラム：音声周波数をリング状に表示
     - パーティクルシステム：音楽に合わせて動的にパーティクルを生成

4. **効果のカスタマイズ**：
   - カラーピッカーを使用して開始色と終了色を選択し、視覚効果の色のグラデーションをカスタマイズ

### ギャラリー

ギャラリーはユーザーが作成した視覚作品を展示します：
1. 様々な音楽タイプの可視化作品を閲覧
2. 作品の詳細、作者情報、評価データを確認
3. 「表示」ボタンをクリックしてその作品を体験

### プロフィールセンター

プロフィールセンターはユーザーの個人情報と作品を含みます：
1. 個人プロフィールと統計データを確認
2. 異なるタブ間で切り替え：
   - マイ作品：あなたが作成した作品を表示
   - お気に入り：あなたがお気に入りに追加した作品を表示
   - アカウント設定：個人情報設定を管理

## よくある質問

### Q: アプリケーションを開いてもページが表示されない、またはスタイルが異常
A: すべての依存関係、特に `styled-components` と `react-router-dom` が正しくインストールされていることを確認してください。これらの依存関係を再インストールしてみてください。

### Q: アプリケーションの起動時にエラーが発生する
A: 依存関係に関連するエラーが表示される場合は、`--legacy-peer-deps` フラグを使用してすべての依存関係を再インストールしてみてください。

## ブラウザ互換性

アプリケーションは以下のブラウザでテストされ、互換性が確認されています：
- Google Chrome (最新版)
- Firefox (最新版)
- Edge (最新版)
- Safari (最新版)

## 今後の開発計画

- より多くの視覚効果の追加
- 視覚効果を画像または動画として保存・エクスポートする機能のサポート
- ユーザー認証システムの実装
- コミュニティ機能の追加、ユーザーが作品を共有・コメントできるようにする
