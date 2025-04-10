import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [url, setUrl] = useState("");
  const [time, setTime] = useState("");
  const [result, setResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isUrlGenerated, setIsUrlGenerated] = useState(false);

  const generateUrl = () => {
    setIsGenerating(true);
    try {
      const videoUrl = new URL(url);
      const timeInSeconds = convertTimeToSeconds(time);
      let videoId;

      if (videoUrl.hostname === 'youtu.be') {
        // Handle shortened URLs
        videoId = videoUrl.pathname.slice(1);
      } else if (videoUrl.hostname === 'youtube.com' || videoUrl.hostname === 'www.youtube.com') {
        // Handle watch URLs directly
        if (videoUrl.searchParams.has('v')) {
          videoId = videoUrl.searchParams.get('v');
        } else {
          // Handle channel/user/custom/live URLs
          const pathParts = videoUrl.pathname.split('/');
          const watchIndex = pathParts.indexOf('watch');
          const liveIndex = pathParts.indexOf('live');

          if (watchIndex !== -1 && videoUrl.searchParams.has('v')) {
            videoId = videoUrl.searchParams.get('v');
          } else if (liveIndex !== -1 && pathParts[liveIndex + 1]) {
            videoId = pathParts[liveIndex + 1];
          }
        }
      }

      if (!videoId) throw new Error("Invalid YouTube URL");

      setResult(`https://youtube.com/watch?v=${videoId}&t=${timeInSeconds}s`);
      setIsGenerating(false);
      setIsUrlGenerated(true);
    } catch (error) {
      setResult("エラー: 正しいYouTube URLを入力してください");
      setIsGenerating(false);
      setIsUrlGenerated(false);
    }
  };

  const convertTimeToSeconds = (timeStr: string) => {
    const parts = timeStr.split(":").map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return parseInt(timeStr) || 0;
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>YouTube Time Link URL Generator</title>
        <meta name="description" content="YouTube URL with timestamp generator" />
        <link rel="icon" href="/favicon.ico" />
        <style>{`
          .alert {
            border-radius: 8px !important;
            padding: 10px 20px !important;
            background: #666666 !important;
            color: white !important;
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            z-index: 1000 !important;
          }
        `}</style>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <img 
            src="/youtube-logo.svg" 
            alt="YouTube" 
            className={styles.youtubeLogo} 
          />
          YouTube Time Link URL Generator
        </h1>

        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <label>YouTube URL:</label>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setIsUrlGenerated(false);
              }}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Start Time (00:00:00):</label>
            <input
              type="text"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                setIsUrlGenerated(false);
              }}
              placeholder="1:30 or 1:30:00"
            />
          </div>

          <button className={styles.button} onClick={generateUrl} disabled={isGenerating || isCopying || isUrlGenerated}>
            Generate URL
          </button>

          <div className={styles.result}>
            <label>Generated URL:</label>
            <div className={styles.copyGroup}>
              <input
                type="text"
                value={result}
                readOnly
                onClick={(e) => e.currentTarget.select()}
              />
              <button
                  className={styles.copyButton}
                  onClick={() => {
                    setIsCopying(true);
                    navigator.clipboard.writeText(result);
                    const alertDiv = document.createElement('div');
                    alertDiv.className = 'alert';
                    alertDiv.textContent = 'URL copied to clipboard!';
                    document.body.appendChild(alertDiv);
                    setTimeout(() => alertDiv.remove(), 1500);
                    setTimeout(() => setIsCopying(false), 500);
                  }}
                  disabled={isGenerating || isCopying || !result}
                >
                  Copy
                </button>
            </div>
            <button
              className={styles.button}
              onClick={() => {
                setUrl("");
                setTime("");
                setResult("");
                setIsUrlGenerated(false);
                setIsGenerating(false);
                setIsCopying(false);
              }}
            >
              Clear
            </button>
            </div>
        </div>
      </main>
      <div className={styles.credit}>@bypp</div>
    </div>
  );
};

export default Home;