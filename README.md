
# 記事分析ツール（articles_analysis_API）

検索・ソート・ページネーション付きの記事一覧を表示し、記事データを検索・分析するための記事分析ツールです。
React（フロントエンド）+ Node.js / Express（バックエンド）+ MySQL（データベース）で構成されています。

---

## デモ動画

アプリの操作イメージはこちらからご覧いただけます。  
[デモ動画はこちら](https://drive.google.com/file/d/1sCDsG4Qr7LzlcuHs7_Uw00cE_aF-P0Ob/view?usp=sharing)  

---

## 技術スタック

- **バックエンド**
  - Node.js / Express
  - MySQL (mysql2)

- **フロントエンド**
  - React

---

## ディレクトリ構成
```bash
articles_analysis_API/
├── articles-client/        # フロントエンド（React）
│   ├── public/
│   └── src/
│       ├── components/     # UIコンポーネント
│       ├── pages/          # ページコンポーネント
│       ├── services/
│       │   └── api.js      # APIクライアント
│       ├── App.jsx         # ルートコンポーネント
│       └── index.js        # Reactエントリーポイント
│   ├── package.json
│   └── ...
│
├── backend/                # バックエンド（Express + MySQL）
│   ├── controllers/        # コントローラ層
│   ├── data/               # CSVなどのデータ置き場
│   ├── db/                 # DB接続やスキーマ
│   ├── helpers/            # クエリ構築・共通処理
│   ├── routes/             # ルーティング
│   ├── scripts/            # CSVインポート用スクリプト
│   ├── validators/         # バリデーション
│   ├── app.js              # エントリーポイント
│   ├── package.json
│   └── ...
│
└── README.md               # 本ファイル
```

---

## セットアップ方法

### 1. バックエンド
```bash
cd backend
npm install
npm run import:articles
npm run import:authors-genres
npm start          
```
バックエンドが http://localhost:3001 で起動します。

### 2. フロントエンド

```bash
cd articles-client
npm install
npm start       
```
フロントエンドが http://localhost:3000 で起動します。

---

## 機能一覧

* 記事一覧表示（タイトル・本文要約・公開日・PV）
* 検索フォームによる絞り込み

  * キーワード
  * 日付範囲
  * 著者 / ジャンル
* ソート（公開日 / PV）
* ページネーション
* CSV からのデータ一括インポート

---

## スクリーンショット

### 通常表示
![通常の記事一覧](https://raw.githubusercontent.com/kae1210/articles_analysis_API/main/articles-client/public/screenshots/default.png)

### 検索・ソート後
![検索結果](https://raw.githubusercontent.com/kae1210/articles_analysis_API/main/articles-client/public/screenshots/filtered.png)