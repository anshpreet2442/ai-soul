import { AnalysisResult } from "../types";

export const generateHtmlReport = (result: AnalysisResult): string => {
  const { attachmentStyleName, twoLetterCode, summary, scores, song, tarot, generatedImageBase64 } = result;

  const chartBars = Object.entries(scores).map(([key, value]) => `
    <div class="stat-row">
      <span class="stat-label">${key}</span>
      <div class="bar-container">
        <div class="bar-fill" style="width: ${value}%"></div>
      </div>
      <span class="stat-val">${value}%</span>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SoulSync Report - ${attachmentStyleName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=Inter:wght@300;400;600&display=swap');
    
    :root {
      --primary: #8b5cf6;
      --secondary: #ec4899;
      --bg: #09090b;
      --card-bg: #18181b;
      --text: #ffffff;
    }

    body {
      margin: 0;
      font-family: 'Inter', sans-serif;
      background-color: var(--bg);
      color: var(--text);
      overflow-x: hidden;
      perspective: 1000px;
    }

    .bg-animate {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(45deg, #1e1b4b, #312e81, #4c1d95, #831843);
      background-size: 400% 400%;
      animation: gradientBG 15s ease infinite;
      z-index: -1;
    }

    @keyframes gradientBG {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    header {
      text-align: center;
      margin-bottom: 60px;
      animation: fadeInDown 1s ease-out;
    }

    h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 3.5rem;
      margin: 0;
      background: linear-gradient(to right, #fff, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-transform: uppercase;
      letter-spacing: -2px;
    }

    .card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 30px;
      margin-bottom: 40px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      transform-style: preserve-3d;
      box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
    }

    .card:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 20px 40px -10px rgba(139, 92, 246, 0.3);
      border-color: rgba(139, 92, 246, 0.5);
    }

    .shimmer {
      position: relative;
      overflow: hidden;
    }
    .shimmer::after {
      content: '';
      position: absolute;
      top: 0; right: 0; bottom: 0; left: 0;
      transform: translateX(-100%);
      background-image: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0,
        rgba(255, 255, 255, 0.05) 20%,
        rgba(255, 255, 255, 0.1) 60%,
        rgba(255, 255, 255, 0)
      );
      animation: shimmer 3s infinite;
    }

    @keyframes shimmer {
      100% { transform: translateX(100%); }
    }

    .image-container {
      text-align: center;
      margin: 40px 0;
    }

    .generated-img {
      max-width: 100%;
      border-radius: 12px;
      border: 4px solid #000;
      box-shadow: 10px 10px 0px #8b5cf6;
      transform: rotate(-2deg);
      transition: transform 0.3s;
    }
    .generated-img:hover {
      transform: rotate(0deg);
    }

    .code-badge {
      display: inline-block;
      background: #000;
      color: #fff;
      padding: 10px 20px;
      font-family: monospace;
      font-size: 2rem;
      border: 2px solid #fff;
      margin-top: 20px;
      box-shadow: 4px 4px 0 rgba(255,255,255,0.5);
    }

    .stat-row {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
    }
    .stat-label {
      width: 140px;
      font-size: 0.9rem;
      color: #d4d4d8;
    }
    .bar-container {
      flex: 1;
      height: 8px;
      background: #27272a;
      border-radius: 4px;
      overflow: hidden;
      margin: 0 15px;
    }
    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #8b5cf6, #ec4899);
      border-radius: 4px;
    }
    .stat-val {
      width: 40px;
      text-align: right;
      font-family: monospace;
    }

    .tarot-section, .song-section {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .icon-box {
      width: 60px;
      height: 60px;
      background: #27272a;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    footer {
      text-align: center;
      padding: 40px 0;
      font-size: 0.8rem;
      opacity: 0.6;
    }

    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>
  <div class="bg-animate"></div>
  
  <div class="container">
    <header>
      <p style="text-transform: uppercase; letter-spacing: 4px; margin-bottom: 10px;">SoulSync Analysis</p>
      <h1>${attachmentStyleName}</h1>
      <div class="code-badge">${twoLetterCode}</div>
    </header>

    <div class="card shimmer">
      <h2 style="margin-top:0">Executive Summary</h2>
      <p style="font-size: 1.1rem; line-height: 1.6;">${summary}</p>
    </div>

    ${generatedImageBase64 ? `
    <div class="image-container">
      <img src="${generatedImageBase64}" alt="Soul Comic" class="generated-img" width="400">
    </div>
    ` : ''}

    <div class="card">
      <h2 style="margin-bottom: 20px;">Dimensions</h2>
      ${chartBars}
    </div>

    <div class="card">
      <div class="tarot-section">
        <div class="icon-box">🎴</div>
        <div>
          <h3 style="margin:0 0 5px 0;">The ${tarot.cardName}</h3>
          <p style="margin:0; opacity: 0.8;">${tarot.meaning}</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="song-section">
        <div class="icon-box">🎵</div>
        <div>
          <h3 style="margin:0 0 5px 0;">${song.title} - ${song.artist}</h3>
          <p style="margin:0; opacity: 0.8;">${song.reason}</p>
        </div>
      </div>
    </div>

    <footer>
      Created by ATDB • SoulSync AI
    </footer>
  </div>
  
  <script>
    // Simple tilt effect script
    document.addEventListener('mousemove', (e) => {
      const cards = document.querySelectorAll('.card');
      const x = (window.innerWidth / 2 - e.pageX) / 25;
      const y = (window.innerHeight / 2 - e.pageY) / 25;
      
      cards.forEach(card => {
        card.style.transform = \`rotateY(\${x}deg) rotateX(\${y}deg) translateZ(10px)\`;
      });
    });
  </script>
</body>
</html>
  `;
};
