/*!
 * PRAJWAL AVATAR v4 — 3D Robot Character
 * Walk animation · DOM obstacle physics · real AI chat · tap-only chat
 */
(function () {
'use strict';

/* ════════════════════════════════════════════════
   1. INJECT STYLES
════════════════════════════════════════════════ */
const CSS = `
#pav-root {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 99999;
  font-family: 'Poppins', system-ui, sans-serif;
}

/* ── 3D character container ── */
#pav-char {
  position: absolute;
  width: 88px;
  pointer-events: auto;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
  transform-style: preserve-3d;
  filter: drop-shadow(0 8px 24px rgba(0,0,0,.55)) drop-shadow(0 0 16px rgba(53,187,120,.35));
  will-change: transform;
}
#pav-char:hover {
  filter: drop-shadow(0 12px 32px rgba(0,0,0,.6)) drop-shadow(0 0 28px rgba(53,187,120,.65));
}
#pav-char:active { cursor: grabbing; }

/* ── Robot body parts (CSS 3D) ── */
.pav-scene {
  width: 88px;
  height: 160px;
  position: relative;
  transform-style: preserve-3d;
  perspective: 320px;
}

/* ANTENNA */
.pav-antenna-stem {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 3px;
  height: 14px;
  background: linear-gradient(to bottom, #35bb78, #27a366);
  border-radius: 2px;
  z-index: 10;
}
.pav-antenna-ball {
  position: absolute;
  left: 50%;
  top: -7px;
  transform: translateX(-50%);
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #6eeab0, #35bb78 50%, #1a7a45);
  box-shadow: 0 0 10px rgba(53,187,120,.9), 0 0 24px rgba(53,187,120,.5);
  z-index: 11;
  animation: pavAntPulse 1.4s ease-in-out infinite;
}
@keyframes pavAntPulse {
  0%,100% { box-shadow: 0 0 10px rgba(53,187,120,.9), 0 0 24px rgba(53,187,120,.5); transform: translateX(-50%) scale(1); }
  50%      { box-shadow: 0 0 16px rgba(53,187,120,1),  0 0 40px rgba(53,187,120,.8); transform: translateX(-50%) scale(1.12); }
}

/* HEAD */
.pav-head {
  position: absolute;
  top: 14px; left: 50%;
  transform: translateX(-50%);
  width: 58px;
  height: 46px;
  background: linear-gradient(145deg, #2a2a2a 0%, #111 60%, #1a1a1a 100%);
  border-radius: 14px;
  border: 1.5px solid #35bb78;
  box-shadow:
    0 4px 0 0 #0d0d0d,
    2px 2px 0 1px #222,
    inset 0 1px 0 rgba(255,255,255,.06),
    inset 0 -1px 0 rgba(0,0,0,.4);
  z-index: 8;
}
.pav-head::before {
  content: '';
  position: absolute;
  top: 4px; left: 6px; right: 6px; height: 8px;
  background: linear-gradient(to bottom, rgba(255,255,255,.07), transparent);
  border-radius: 8px;
}

/* EARS */
.pav-ear {
  position: absolute;
  top: 24px;
  width: 8px; height: 16px;
  background: linear-gradient(to right, #1e1e1e, #111);
  border: 1px solid #35bb78;
  border-radius: 4px;
  z-index: 7;
}
.pav-ear-l { left: 7px; box-shadow: -2px 0 0 #0a0a0a; }
.pav-ear-r { right: 7px; box-shadow: 2px 0 0 #0a0a0a; }
.pav-ear-led {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 5px; height: 5px;
  border-radius: 50%;
  background: #35bb78;
  box-shadow: 0 0 6px #35bb78;
  animation: pavLedBlink 2.3s ease-in-out infinite;
}
.pav-ear-r .pav-ear-led { animation-delay: .7s; }
@keyframes pavLedBlink {
  0%,45%,55%,100% { opacity: 1; }
  50%              { opacity: .15; }
}

/* EYES */
.pav-eyes {
  position: absolute;
  top: 11px; left: 7px; right: 7px;
  display: flex;
  gap: 7px;
  justify-content: space-between;
}
.pav-eye-socket {
  flex: 1;
  height: 16px;
  background: #060606;
  border-radius: 6px;
  border: 1px solid rgba(53,187,120,.5);
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 8px rgba(53,187,120,.15);
}
.pav-eye-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(53,187,120,.18), transparent 70%);
  animation: pavEyeFlicker 4s ease-in-out infinite;
}
@keyframes pavEyeFlicker {
  0%,95%,100% { opacity: 1; }
  96%          { opacity: .3; }
  97%          { opacity: 1; }
  98%          { opacity: .5; }
  99%          { opacity: 1; }
}
.pav-pupil {
  position: absolute;
  top: 50%; left: 50%;
  width: 10px; height: 10px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #6eeab0, #35bb78 55%, #1a7a45);
  transform: translate(-50%, -50%);
  box-shadow: 0 0 6px rgba(53,187,120,.8);
  transition: transform .08s linear;
}
.pav-pupil::after {
  content: '';
  position: absolute;
  top: 1px; left: 2px;
  width: 3px; height: 3px;
  border-radius: 50%;
  background: rgba(255,255,255,.9);
}
.pav-lid {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 0;
  background: #1a1a1a;
  border-radius: 0 0 5px 5px;
  transition: height .06s ease;
  z-index: 2;
}

/* MOUTH AREA */
.pav-mouth-zone {
  position: absolute;
  bottom: 9px; left: 10px; right: 10px;
  height: 10px;
  display: flex; align-items: center; justify-content: center;
}
.pav-mouth {
  width: 30px; height: 5px;
  border-radius: 3px;
  background: linear-gradient(to right, #27a366, #35bb78, #27a366);
  box-shadow: 0 0 6px rgba(53,187,120,.6);
  transition: all .2s ease;
}

/* NECK */
.pav-neck {
  position: absolute;
  top: 59px; left: 50%;
  transform: translateX(-50%);
  width: 14px; height: 7px;
  background: linear-gradient(to bottom, #1a1a1a, #111);
  border-left: 1px solid rgba(53,187,120,.3);
  border-right: 1px solid rgba(53,187,120,.3);
  z-index: 6;
}

/* BODY */
.pav-body {
  position: absolute;
  top: 65px; left: 50%;
  transform: translateX(-50%);
  width: 64px; height: 52px;
  background: linear-gradient(155deg, #222 0%, #0f0f0f 50%, #1a1a1a 100%);
  border-radius: 14px;
  border: 1.5px solid #35bb78;
  box-shadow:
    0 6px 0 0 #080808,
    2px 2px 0 1px #1e1e1e,
    inset 0 1px 0 rgba(255,255,255,.05),
    inset 0 -2px 0 rgba(0,0,0,.5);
  z-index: 8;
  overflow: hidden;
}
.pav-body::before {
  content: '';
  position: absolute;
  top: 4px; left: 8px; right: 8px; height: 6px;
  background: linear-gradient(to bottom, rgba(255,255,255,.05), transparent);
  border-radius: 6px;
}

/* CHEST SCREEN */
.pav-screen {
  position: absolute;
  top: 8px; left: 8px; right: 8px;
  height: 26px;
  background: #050505;
  border-radius: 7px;
  border: 1px solid rgba(53,187,120,.4);
  overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.pav-screen-inner {
  position: relative;
  width: 100%; height: 100%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 1px;
}
.pav-screen-text {
  font-family: 'Courier New', monospace;
  font-size: 7.5px;
  font-weight: 700;
  color: #35bb78;
  text-shadow: 0 0 6px rgba(53,187,120,.9);
  letter-spacing: .5px;
  transition: opacity .3s ease;
}
.pav-screen-sub {
  font-family: 'Courier New', monospace;
  font-size: 5.5px;
  color: rgba(53,187,120,.5);
  letter-spacing: .3px;
}
.pav-screen::after {
  content: '';
  position: absolute;
  left: 0; right: 0;
  height: 2px;
  background: rgba(53,187,120,.12);
  animation: pavScanline 2.2s linear infinite;
}
@keyframes pavScanline {
  from { top: -2px; }
  to   { top: 100%; }
}

.pav-bolt {
  position: absolute;
  top: 40px;
  width: 7px; height: 7px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #333, #111);
  border: 1px solid rgba(53,187,120,.4);
}
.pav-bolt-l { left: 4px; }
.pav-bolt-r { right: 4px; }

/* ARMS */
.pav-arm {
  position: absolute;
  top: 68px;
  width: 11px; height: 34px;
  background: linear-gradient(to bottom, #222, #111);
  border-radius: 7px;
  border: 1px solid rgba(53,187,120,.4);
  z-index: 7;
  box-shadow: 2px 2px 0 #080808;
  transform-origin: top center;
  transition: transform .15s ease;
}
.pav-arm-l { left: 4px; }
.pav-arm-r { right: 4px; }

/* HANDS */
.pav-hand {
  position: absolute;
  bottom: -9px; left: 50%;
  transform: translateX(-50%);
  width: 16px; height: 16px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, #333, #111);
  border: 1px solid rgba(53,187,120,.5);
  box-shadow: 0 3px 0 #080808;
}
.pav-finger {
  position: absolute;
  bottom: -5px;
  width: 4px; height: 7px;
  background: linear-gradient(to bottom, #2a2a2a, #111);
  border: 1px solid rgba(53,187,120,.3);
  border-radius: 3px;
}
.pav-finger:nth-child(1) { left: 0px; transform: rotate(-8deg); }
.pav-finger:nth-child(2) { left: 5px; }
.pav-finger:nth-child(3) { right: 0px; transform: rotate(8deg); }

/* LEGS — walk animation targets these */
.pav-legs {
  position: absolute;
  top: 116px; left: 50%;
  transform: translateX(-50%);
  width: 44px;
  display: flex;
  gap: 6px;
  justify-content: center;
}
.pav-leg {
  width: 16px; height: 20px;
  background: linear-gradient(to bottom, #1e1e1e, #111);
  border-radius: 5px 5px 8px 8px;
  border: 1px solid rgba(53,187,120,.35);
  box-shadow: 0 4px 0 #080808;
  position: relative;
  transform-origin: top center;
  transition: transform .12s ease;
}
.pav-foot {
  position: absolute;
  bottom: -5px; left: 50%;
  transform: translateX(-50%);
  width: 22px; height: 9px;
  background: linear-gradient(to right, #1a1a1a, #222, #1a1a1a);
  border-radius: 4px 4px 5px 5px;
  border: 1px solid rgba(53,187,120,.3);
  box-shadow: 0 3px 0 #060606;
  transform-origin: top center;
  transition: transform .12s ease;
}

/* ── WALK KEYFRAME ANIMATIONS ── */
@keyframes pavLegL {
  0%,100% { transform: rotate(0deg);    }
  25%      { transform: rotate(-28deg); }
  50%      { transform: rotate(0deg);   }
  75%      { transform: rotate(18deg);  }
}
@keyframes pavLegR {
  0%,100% { transform: rotate(0deg);   }
  25%      { transform: rotate(18deg); }
  50%      { transform: rotate(0deg);  }
  75%      { transform: rotate(-28deg);}
}
@keyframes pavArmWalkL {
  0%,100% { transform: rotate(0deg);   }
  25%      { transform: rotate(18deg); }
  50%      { transform: rotate(0deg);  }
  75%      { transform: rotate(-22deg);}
}
@keyframes pavArmWalkR {
  0%,100% { transform: rotate(0deg);    }
  25%      { transform: rotate(-22deg); }
  50%      { transform: rotate(0deg);   }
  75%      { transform: rotate(18deg);  }
}
@keyframes pavBodyBob {
  0%,50%,100% { transform: translateX(-50%) translateY(0px);   }
  25%,75%     { transform: translateX(-50%) translateY(-2px);  }
}
@keyframes pavHeadBob {
  0%,50%,100% { transform: translateX(-50%) rotate(0deg);       }
  25%         { transform: translateX(-50%) rotate(-1.5deg);    }
  75%         { transform: translateX(-50%) rotate(1.5deg);     }
}
.pav-walking .pav-leg:first-child  { animation: pavLegL .5s linear infinite; }
.pav-walking .pav-leg:last-child   { animation: pavLegR .5s linear infinite; }
.pav-walking .pav-arm-l            { animation: pavArmWalkL .5s linear infinite; }
.pav-walking .pav-arm-r            { animation: pavArmWalkR .5s linear infinite; }
.pav-walking .pav-body             { animation: pavBodyBob .5s linear infinite; }
.pav-walking .pav-head             { animation: pavHeadBob .5s linear infinite; }

/* flip when walking left */
.pav-face-left  { transform: scaleX(-1); }

/* ── DANCE ANIMATIONS ── */
@keyframes pavDanceArmL {
  0%,100% { transform: rotate(0deg); }
  15%      { transform: rotate(-80deg); }
  30%      { transform: rotate(-20deg); }
  45%      { transform: rotate(-90deg); }
  60%      { transform: rotate(-10deg); }
  75%      { transform: rotate(-75deg); }
}
@keyframes pavDanceArmR {
  0%,100% { transform: rotate(0deg); }
  15%      { transform: rotate(80deg); }
  30%      { transform: rotate(20deg); }
  45%      { transform: rotate(90deg); }
  60%      { transform: rotate(10deg); }
  75%      { transform: rotate(75deg); }
}
@keyframes pavDanceLegL {
  0%,100% { transform: rotate(0deg); }
  25%      { transform: rotate(-40deg); }
  50%      { transform: rotate(0deg); }
  75%      { transform: rotate(20deg); }
}
@keyframes pavDanceLegR {
  0%,100% { transform: rotate(0deg); }
  25%      { transform: rotate(40deg); }
  50%      { transform: rotate(0deg); }
  75%      { transform: rotate(-20deg); }
}
@keyframes pavDanceBody {
  0%,100% { transform: translateX(-50%) rotate(0deg) scaleX(1); }
  20%      { transform: translateX(-50%) rotate(-5deg) scaleX(1.04); }
  40%      { transform: translateX(-50%) rotate(4deg) scaleX(0.97); }
  60%      { transform: translateX(-50%) rotate(-4deg) scaleX(1.04); }
  80%      { transform: translateX(-50%) rotate(5deg) scaleX(0.97); }
}
.pav-dancing .pav-arm-l          { animation: pavDanceArmL .55s ease-in-out infinite !important; }
.pav-dancing .pav-arm-r          { animation: pavDanceArmR .55s ease-in-out infinite !important; }
.pav-dancing .pav-leg:first-child { animation: pavDanceLegL .55s ease-in-out infinite !important; }
.pav-dancing .pav-leg:last-child  { animation: pavDanceLegR .55s ease-in-out infinite !important; }
.pav-dancing .pav-body            { animation: pavDanceBody .55s ease-in-out infinite !important; }

/* ── FLOAT ANIMATION (idle) ── */
@keyframes pavFloat {
  0%,100% { transform: translateY(0px) rotate(-.5deg); }
  25%      { transform: translateY(-7px) rotate(.5deg); }
  50%      { transform: translateY(-4px) rotate(-.3deg); }
  75%      { transform: translateY(-9px) rotate(.4deg); }
}
@keyframes pavShadowAnim {
  0%,100% { opacity: .6; transform: translateX(-50%) scaleX(1); }
  50%      { opacity: .25; transform: translateX(-50%) scaleX(.7); }
}
.pav-floating { animation: pavFloat 3.6s ease-in-out infinite; }
.pav-shadow { animation: pavShadowAnim 3.6s ease-in-out infinite; }

/* ground shadow under scene */
.pav-shadow {
  position: absolute;
  bottom: -8px; left: 50%;
  transform: translateX(-50%);
  width: 50px; height: 8px;
  background: radial-gradient(ellipse, rgba(0,0,0,.4) 0%, transparent 70%);
  border-radius: 50%;
}

/* ── ROAM shadow (separate fixed element) ── */
#pav-floor-shadow {
  position: absolute;
  width: 60px; height: 14px;
  background: radial-gradient(ellipse, rgba(0,0,0,.35) 0%, transparent 70%);
  pointer-events: none;
  transition: transform .05s linear;
}

/* ── SPEECH BUBBLE ── */
#pav-bubble {
  position: fixed;
  white-space: normal;
  word-break: break-word;
  width: max-content;
  max-width: min(240px, calc(100vw - 24px));
  background: var(--card, #fff);
  color: var(--fg, #111);
  border: 2px solid #35bb78;
  border-radius: 16px;
  padding: 8px 14px;
  font-size: 12.5px;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(53,187,120,.25), 0 2px 8px rgba(0,0,0,.2);
  pointer-events: none;
  z-index: 10;
  animation: pavBubblePop .25s cubic-bezier(.34,1.56,.64,1) both;
}
#pav-bubble::after {
  content: '';
  position: absolute;
  bottom: -9px; left: 50%;
  transform: translateX(-50%);
  border: 9px solid transparent;
  border-top-color: #35bb78;
  border-bottom: none;
}
@keyframes pavBubblePop {
  from { opacity:0; transform: scale(.75) translateY(6px); }
  to   { opacity:1; transform: scale(1) translateY(0); }
}
.pav-bubble-out {
  animation: pavBubbleFade .25s ease forwards !important;
}
@keyframes pavBubbleFade {
  to { opacity:0; transform: scale(.85) translateY(-4px); }
}

/* ── EMOJI BURST ── */
.pav-emoji-burst {
  position: fixed;
  font-size: 20px;
  pointer-events: none;
  animation: pavEmojiFly .9s ease-out forwards;
  z-index: 20;
}
@keyframes pavEmojiFly {
  0%   { opacity:1; transform: translateY(0) scale(1) rotate(0deg); }
  100% { opacity:0; transform: translateY(-70px) scale(.6) rotate(30deg); }
}

/* ── OBSTACLE INDICATOR ── */
.pav-obstacle-flash {
  animation: pavObstFlash .4s ease both;
}
@keyframes pavObstFlash {
  0%,100% { filter: drop-shadow(0 8px 24px rgba(0,0,0,.55)) drop-shadow(0 0 16px rgba(53,187,120,.35)); }
  50%      { filter: drop-shadow(0 0 24px rgba(255,100,50,.9)) drop-shadow(0 0 40px rgba(255,100,50,.5)); }
}

/* ════════════════════════════
   CHAT PANEL
════════════════════════════ */
#pav-chat {
  position: fixed;
  width: 330px;
  height: 440px;
  background: var(--card, #fff);
  border: 1.5px solid rgba(53,187,120,.6);
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,.3), 0 0 0 1px rgba(53,187,120,.1), 0 0 40px rgba(53,187,120,.08);
  pointer-events: auto;
  z-index: 100000;
  transform-origin: bottom center;
}
/* CRITICAL: override browser hidden attribute — display:flex above wins without this */
#pav-chat[hidden] { display: none !important; }
#pav-chat.pav-chat-enter { animation: pavChatIn .3s cubic-bezier(.34,1.56,.64,1) both; }
#pav-chat.pav-chat-leave { animation: pavChatOut .2s ease forwards; }
@keyframes pavChatIn {
  from { opacity:0; transform: scale(.85) translateY(16px); }
  to   { opacity:1; transform: scale(1) translateY(0); }
}
@keyframes pavChatOut {
  from { opacity:1; transform: scale(1); }
  to   { opacity:0; transform: scale(.85) translateY(12px); }
}

#pav-chat-hd {
  background: linear-gradient(135deg, #35bb78 0%, #27a366 100%);
  padding: 14px 16px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  position: relative;
}
#pav-chat-avatar-icon {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,.2);
}
.pav-chat-info { flex: 1; }
.pav-chat-name { font-size: 14px; font-weight: 700; color: #fff; }
.pav-chat-status {
  font-size: 11px; color: rgba(255,255,255,.85);
  display: flex; align-items: center; gap: 5px;
  margin-top: 1px;
}
.pav-status-dot {
  width: 7px; height: 7px;
  background: #fff; border-radius: 50%;
  animation: pavDotPulse 2s ease-in-out infinite;
}
@keyframes pavDotPulse {
  0%,100% { opacity:1; transform: scale(1); }
  50%      { opacity:.5; transform: scale(1.3); }
}
#pav-chat-close {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,.2);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .2s;
  flex-shrink: 0;
  z-index: 1;
}
#pav-chat-close:hover { background: rgba(255,255,255,.38); }

#pav-chat-msgs {
  flex: 1;
  overflow-y: auto;
  padding: 14px 14px 6px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scroll-behavior: smooth;
}
#pav-chat-msgs::-webkit-scrollbar { width: 4px; }
#pav-chat-msgs::-webkit-scrollbar-thumb { background: rgba(53,187,120,.3); border-radius: 2px; }
.pav-msg {
  max-width: 82%;
  padding: 10px 13px;
  border-radius: 16px;
  font-size: 13.5px;
  line-height: 1.55;
  word-break: break-word;
  animation: pavMsgIn .22s ease both;
}
@keyframes pavMsgIn {
  from { opacity:0; transform: translateY(8px) scale(.96); }
  to   { opacity:1; transform: none; }
}
.pav-msg-bot {
  background: var(--bg2, #f4f4f4);
  color: var(--fg, #111);
  border-bottom-left-radius: 4px;
  align-self: flex-start;
  border: 1px solid var(--border, rgba(0,0,0,.07));
}
.pav-msg-user {
  background: linear-gradient(135deg, #35bb78, #27a366);
  color: #fff;
  border-bottom-right-radius: 4px;
  align-self: flex-end;
}

#pav-typing {
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 3px 14px 8px;
  flex-shrink: 0;
  min-height: 28px;
}
#pav-typing span {
  width: 7px; height: 7px;
  background: #35bb78; border-radius: 50%;
  animation: pavDot .85s ease-in-out infinite;
  flex-shrink: 0;
}
#pav-typing span:nth-child(2) { animation-delay: .18s; }
#pav-typing span:nth-child(3) { animation-delay: .36s; }
@keyframes pavDot {
  0%,80%,100% { transform: scale(.65); opacity:.35; }
  40%          { transform: scale(1.1); opacity:1; }
}

#pav-input-row {
  display: flex;
  gap: 8px;
  padding: 10px 12px 12px;
  border-top: 1px solid var(--border, rgba(0,0,0,.07));
  background: var(--card, #fff);
  flex-shrink: 0;
}
#pav-input {
  flex: 1;
  padding: 10px 14px;
  border: 1.5px solid var(--border, rgba(0,0,0,.1));
  border-radius: 24px;
  font-size: 13px;
  font-family: 'Poppins', system-ui, sans-serif;
  background: var(--bg2, #f7f7f7);
  color: var(--fg, #111);
  outline: none;
  transition: border-color .2s;
}
#pav-input:focus { border-color: #35bb78; }
#pav-send {
  width: 40px; height: 40px;
  flex-shrink: 0;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #35bb78, #27a366);
  color: #fff;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 3px 12px rgba(53,187,120,.4);
  transition: transform .15s, box-shadow .15s;
}
#pav-send:hover { transform: scale(1.08); box-shadow: 0 5px 18px rgba(53,187,120,.55); }
#pav-send:active { transform: scale(.94); }

@media (max-width: 600px) {
  /* Avatar shrunk to ~56px wide on mobile */
  #pav-char { width: 56px; }
  .pav-scene { width: 56px; height: 100px; }
  .pav-head  { width: 36px; height: 28px; top: 8px; border-radius: 10px; }
  .pav-head::before { top: 3px; left: 4px; right: 4px; height: 5px; }
  .pav-ear   { top: 14px; width: 5px; height: 10px; }
  .pav-ear-l { left: 4px; }
  .pav-ear-r { right: 4px; }
  .pav-ear-led { width: 3px; height: 3px; }
  .pav-eyes  { top: 7px; left: 4px; right: 4px; gap: 4px; }
  .pav-eye-socket { height: 10px; }
  .pav-pupil { width: 6px; height: 6px; }
  .pav-mouth-zone { bottom: 5px; left: 6px; right: 6px; height: 6px; }
  .pav-mouth { width: 18px; height: 3px; }
  .pav-neck  { top: 36px; width: 9px; height: 5px; }
  .pav-body  { width: 40px; height: 32px; top: 40px; border-radius: 10px; }
  .pav-body::before { top: 3px; left: 5px; right: 5px; height: 4px; }
  .pav-screen { top: 5px; left: 5px; right: 5px; height: 16px; border-radius: 5px; }
  .pav-screen-text { font-size: 5px; }
  .pav-screen-sub  { font-size: 4px; }
  .pav-bolt { top: 24px; width: 4px; height: 4px; }
  .pav-bolt-l { left: 2px; }
  .pav-bolt-r { right: 2px; }
  .pav-arm   { top: 42px; width: 6px; height: 20px; border-radius: 5px; }
  .pav-arm-l { left: 2px; }
  .pav-arm-r { right: 2px; }
  .pav-hand  { bottom: -6px; width: 10px; height: 10px; }
  .pav-finger { width: 2px; height: 4px; bottom: -3px; }
  .pav-legs  { top: 72px; width: 28px; gap: 4px; }
  .pav-leg   { width: 10px; height: 13px; }
  .pav-foot  { width: 14px; height: 6px; bottom: -3px; }
  .pav-antenna-stem { height: 9px; width: 2px; }
  .pav-antenna-ball { width: 8px; height: 8px; top: -5px; }
  /* Chat panel: fixed at bottom, full width */
  #pav-chat {
    width: calc(100vw - 20px) !important;
    left: 10px !important; right: 10px !important;
    bottom: 10px !important; top: auto !important;
    height: 56vh;
  }
  /* Bubble: allow wrapping on small screens */
  #pav-bubble {
    font-size: 11px;
    white-space: normal;
    max-width: min(220px, 55vw);
    text-align: center;
  }
}
`;

const styleEl = document.createElement('style');
styleEl.textContent = CSS;
document.head.appendChild(styleEl);

/* ════════════════════════════════════════════════
   2. BUILD DOM
════════════════════════════════════════════════ */
const root = document.createElement('div');
root.id = 'pav-root';
root.innerHTML = `
<div id="pav-floor-shadow"></div>
<div id="pav-char">
  <div class="pav-scene pav-floating" id="pav-scene">
    <div class="pav-antenna-stem"></div>
    <div class="pav-antenna-ball"></div>
    <div class="pav-ear pav-ear-l"><div class="pav-ear-led"></div></div>
    <div class="pav-ear pav-ear-r"><div class="pav-ear-led"></div></div>
    <div class="pav-head" id="pav-head">
      <div class="pav-eyes">
        <div class="pav-eye-socket" id="pav-eye-l">
          <div class="pav-eye-glow"></div>
          <div class="pav-pupil" id="pav-pupil-l"></div>
          <div class="pav-lid" id="pav-lid-l"></div>
        </div>
        <div class="pav-eye-socket" id="pav-eye-r">
          <div class="pav-eye-glow"></div>
          <div class="pav-pupil" id="pav-pupil-r"></div>
          <div class="pav-lid" id="pav-lid-r"></div>
        </div>
      </div>
      <div class="pav-mouth-zone">
        <div class="pav-mouth" id="pav-mouth"></div>
      </div>
    </div>
    <div class="pav-neck"></div>
    <div class="pav-body" id="pav-body-el">
      <div class="pav-screen">
        <div class="pav-screen-inner">
          <div class="pav-screen-text" id="pav-stext">&lt;build/&gt;</div>
          <div class="pav-screen-sub">prajwal.np</div>
        </div>
      </div>
      <div class="pav-bolt pav-bolt-l"></div>
      <div class="pav-bolt pav-bolt-r"></div>
    </div>
    <div class="pav-arm pav-arm-l" id="pav-arm-l">
      <div class="pav-hand">
        <div class="pav-finger"></div>
        <div class="pav-finger"></div>
        <div class="pav-finger"></div>
      </div>
    </div>
    <div class="pav-arm pav-arm-r" id="pav-arm-r">
      <div class="pav-hand">
        <div class="pav-finger"></div>
        <div class="pav-finger"></div>
        <div class="pav-finger"></div>
      </div>
    </div>
    <div class="pav-legs" id="pav-legs">
      <div class="pav-leg" id="pav-leg-l"><div class="pav-foot"></div></div>
      <div class="pav-leg" id="pav-leg-r"><div class="pav-foot"></div></div>
    </div>
    <div class="pav-shadow"></div>
  </div>
</div>

<div id="pav-bubble" hidden></div>
<!-- CHAT PANEL: sibling of char, NOT inside it — prevents click bubbling -->


<div id="pav-chat" hidden>
  <div id="pav-chat-hd">
    <div id="pav-chat-avatar-icon">🤖</div>
    <div class="pav-chat-info">
      <div class="pav-chat-name">The Builder · AI</div>
      <div class="pav-chat-status"><span class="pav-status-dot"></span>Online · Usually replies instantly</div>
    </div>
    <button id="pav-chat-close" type="button" aria-label="Close chat">✕</button>
  </div>
  <div id="pav-chat-msgs" role="log" aria-live="polite"></div>
  <div id="pav-typing" hidden><span></span><span></span><span></span></div>
  <div id="pav-input-row">
    <input id="pav-input" type="text" placeholder="Ask me anything…" autocomplete="off" maxlength="500" aria-label="Your message">
    <button id="pav-send" type="button" aria-label="Send">
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </button>
  </div>
</div>
`;
document.body.appendChild(root);

/* refs */
const char      = document.getElementById('pav-char');
const scene     = document.getElementById('pav-scene');
const floorShad = document.getElementById('pav-floor-shadow');
const bubble    = document.getElementById('pav-bubble');
const chatPanel = document.getElementById('pav-chat');
const chatMsgs  = document.getElementById('pav-chat-msgs');
const typingEl  = document.getElementById('pav-typing');
const inputEl   = document.getElementById('pav-input');
const sendBtn   = document.getElementById('pav-send');
const closeBtn  = document.getElementById('pav-chat-close');
const mouthEl   = document.getElementById('pav-mouth');
const lidL      = document.getElementById('pav-lid-l');
const lidR      = document.getElementById('pav-lid-r');
const pupilL    = document.getElementById('pav-pupil-l');
const pupilR    = document.getElementById('pav-pupil-r');
const screenTxt = document.getElementById('pav-stext');
const armL      = document.getElementById('pav-arm-l');
const armR      = document.getElementById('pav-arm-r');
const bodyEl    = document.getElementById('pav-body-el');
const legsEl    = document.getElementById('pav-legs');

/* ════════════════════════════════════════════════
   3. PHYSICS & POSITION
════════════════════════════════════════════════ */
const W = () => window.innerWidth;
const H = () => window.innerHeight;
const isMobile = () => window.innerWidth < 600;
// Avatar dimensions — smaller on mobile so it doesn't hog the screen
const CHAR_W = isMobile() ? 56 : 88;
const CHAR_H = isMobile() ? 100 : 160;

// Start at bottom-right corner on mobile, bottom-right on desktop
let px = W() - CHAR_W - 20;
let py = H() - CHAR_H - (isMobile() ? 6 : 30);
let vx = 0, vy = 0;
let dragging = false, dragOffX = 0, dragOffY = 0;
let rafId = null;
let chatOpen = false;
let roaming = true;
let roamTarget = { x: px, y: py };
let roamTimer = null;
let facingRight = true;  // for walk flip

function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

function applyPos(x, y) {
  char.style.transform = `translate(${x}px,${y}px)`;
  floorShad.style.transform = `translate(${x + CHAR_W/2 - 30}px,${y + CHAR_H + 2}px)`;
  // Keep speech bubble glued above the avatar, clamped inside viewport
  if (!bubble.hidden) {
    const margin = 10;
    const bW = bubble.offsetWidth || 200;
    const bH = bubble.offsetHeight || 44;
    // Compute left edge so bubble is centred over avatar, then clamp to screen
    let bLeft = x + CHAR_W / 2 - bW / 2;
    bLeft = Math.max(margin, Math.min(W() - bW - margin, bLeft));
    // Above avatar; clamp so it can't go above top of viewport
    let bBottom = H() - y + 10;
    bBottom = Math.min(H() - bH - margin, Math.max(margin, bBottom));
    bubble.style.left      = `${bLeft}px`;
    bubble.style.bottom    = `${bBottom}px`;
    bubble.style.transform = 'none';
  }
  if (!chatOpen) return;
  const chatW = isMobile() ? W() - 20 : 330;
  const chatH = isMobile() ? Math.round(H() * 0.56) : 440;
  if (isMobile()) {
    // On mobile: always bottom-of-screen, full width
    chatPanel.style.left   = '10px';
    chatPanel.style.right  = '10px';
    chatPanel.style.bottom = '10px';
    chatPanel.style.top    = 'auto';
  } else {
    const spaceRight = W() - x - CHAR_W - 12;
    const chatLeft = spaceRight > chatW ? x + CHAR_W + 12
                                        : Math.max(8, x - chatW - 12);
    let chatTop = y + CHAR_H / 2 - chatH / 2;
    chatTop = clamp(chatTop, 8, H() - chatH - 8);
    chatPanel.style.left   = chatLeft + 'px';
    chatPanel.style.top    = chatTop + 'px';
    chatPanel.style.right  = 'auto';
    chatPanel.style.bottom = 'auto';
  }
}

applyPos(px, py);

/* ════════════════════════════════════════════════
   4. OBSTACLE DETECTION — Screen-pixel approach
   We use a hidden canvas to sample actual painted
   pixel colours at the avatar's feet and front,
   then also confirm with elementsFromPoint.
   Only "solid" painted pixels count as obstacles.
════════════════════════════════════════════════ */

// Offscreen canvas for pixel-colour sampling
let sampleCanvas = null, sampleCtx = null;
let sampleW = 0, sampleH = 0;
let canvasReady = false;
let lastScreenshot = 0;

// We use html2canvas lazily — if unavailable, fall back to pure elementsFromPoint
function ensureCanvas(cb) {
  if (canvasReady) { cb(); return; }
  // html2canvas not guaranteed on every site — skip it, use elementsFromPoint only
  cb();
}

// ── Element-based obstacle detection ──────────────────────────
const SKIP_TAGS = new Set(['HTML','BODY','SCRIPT','STYLE','LINK','META','HEAD','NOSCRIPT','SVG','PATH','DEFS','G']);
const SKIP_IDS  = new Set(['pav-root']);

function elVisible(el) {
  if (!el) return false;
  if (SKIP_TAGS.has(el.tagName.toUpperCase())) return false;
  if (el.id && SKIP_IDS.has(el.id)) return false;
  if (root.contains(el)) return false;
  try {
    const cs = window.getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    if (parseFloat(cs.opacity || '1') < 0.1) return false;
    // Must actually paint something — has background color or image or border
    const bg  = cs.backgroundImage !== 'none' ||
               (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent');
    const bdr = parseInt(cs.borderTopWidth || '0') > 0 ||
                parseInt(cs.borderLeftWidth || '0') > 0;
    const isImg = el.tagName === 'IMG' || el.tagName === 'CANVAS' || el.tagName === 'VIDEO';
    if (!bg && !bdr && !isImg) return false;
  } catch(e) { return false; }
  return true;
}

function getObstacleAt(x, y) {
  // Keep coords on screen
  if (x < 0 || x > W() || y < 0 || y > H()) return null;
  try {
    const els = document.elementsFromPoint(x, y);
    for (const el of els) {
      if (!elVisible(el)) continue;
      const r = el.getBoundingClientRect();
      // Must be a meaningful size — skip tiny decorations
      if (r.width < 50 || r.height < 25) continue;
      // Skip full-page wrappers
      if (r.width > W() * 0.90) continue;
      if (r.height > H() * 0.75) continue;
      return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
    }
  } catch(e) {}
  return null;
}

function getCharRect() {
  return { left: px, top: py, right: px + CHAR_W, bottom: py + CHAR_H };
}

// Check multiple points around the avatar's leading edge & feet
let lastHitTime = 0;
function checkObstacleCollision() {
  if (dragging) return null;
  if (Date.now() - lastHitTime < 600) return null;

  const margin = 3;
  // Leading edge: check 3 heights along the front face
  const frontX = facingRight ? px + CHAR_W + margin : px - margin;
  const probe1 = getObstacleAt(frontX, py + CHAR_H * 0.30);
  const probe2 = getObstacleAt(frontX, py + CHAR_H * 0.60);
  // Also check feet (bottom centre) to detect floor obstacles
  const probe3 = getObstacleAt(px + CHAR_W / 2, py + CHAR_H + margin);

  return probe1 || probe2 || probe3 || null;
}

// Is a candidate position free of obstacles?
function positionIsClear(testX, testY) {
  const midX = testX + CHAR_W / 2;
  const midY = testY + CHAR_H / 2;
  const footY = testY + CHAR_H - 4;
  // Check 5 points around the avatar
  const pts = [
    [testX + 4,         midY],
    [testX + CHAR_W - 4, midY],
    [midX,              testY + 12],
    [midX,              footY],
    [midX,              midY],
  ];
  for (const [x, y] of pts) {
    if (getObstacleAt(x, y)) return false;
  }
  return true;
}

let lastBumpReact = 0;
function handleObstacleHit(ob) {
  lastHitTime = Date.now();
  const now = Date.now();

  if (now - lastBumpReact > 1200) {
    lastBumpReact = now;
    const r = ['Oof! 😵','Bump! 💥','Hey! ⚡','Watch it! 🤖','Boing! 🟢','Whoa! 😬',
               'Navigating... 🗺️','Rerouting! 🔄'];
    showBubble(r[Math.floor(Math.random() * r.length)], 1200);
    squish('x');
    setExpr('dizzy'); setExpr('neutral', 700);
  }
  // Always pick a completely new clear roam target
  pickRoamTargetAvoiding(ob);
}

/* ════════════════════════════════════════════════
   5. WALK ANIMATION CONTROL
════════════════════════════════════════════════ */
let walking = false;
let lastPxForWalk = px;

function startWalking() {
  if (walking) return;
  walking = true;
  // Cancel dance if roaming kicks in
  if (_dancing) { char.classList.remove('pav-dancing'); _dancing = false; }
  scene.classList.add('pav-walking');
  scene.classList.remove('pav-floating');
}

function stopWalking() {
  if (!walking) return;
  walking = false;
  scene.classList.remove('pav-walking');
  scene.classList.add('pav-floating');
  // reset leg/arm transforms that CSS animation may have left
  armL.style.animation = '';
  armR.style.animation = '';
}

function updateFacing(newPx) {
  const movingRight = newPx > lastPxForWalk + 0.5;
  const movingLeft  = newPx < lastPxForWalk - 0.5;
  if (movingRight && !facingRight) {
    facingRight = true;
    scene.classList.remove('pav-face-left');
  } else if (movingLeft && facingRight) {
    facingRight = false;
    scene.classList.add('pav-face-left');
  }
  lastPxForWalk = newPx;
}

/* ════════════════════════════════════════════════
   6. PHYSICS LOOP
════════════════════════════════════════════════ */
function physicsLoop() {
  if (dragging) { rafId = requestAnimationFrame(physicsLoop); return; }

  if (roaming) {
    const dx = roamTarget.x - px;
    const dy = roamTarget.y - py;
    const dist = Math.hypot(dx, dy);

    if (dist > 2) {
      const maxSpd = isMobile() ? 1.2 : 3.5;
      const speed = Math.min(dist * 0.025, maxSpd);
      px += (dx / dist) * speed;
      py += (dy / dist) * speed;
      updateFacing(px);
      if (!walking && dist > 8) startWalking();
    } else {
      px = roamTarget.x; py = roamTarget.y;
      stopWalking();
    }

    // obstacle collision while roaming
    const hit = checkObstacleCollision();
    if (hit) handleObstacleHit(hit);

    applyPos(px, py);
    rafId = requestAnimationFrame(physicsLoop);
    return;
  }

  // post-fling physics
  stopWalking();
  vx *= 0.88; vy *= 0.88;
  vy += 0.28;
  px += vx; py += vy;
  const maxX = W() - CHAR_W - 4;
  const maxY = H() - CHAR_H - 4;
  if (px < 4)    { px = 4;    vx =  Math.abs(vx) * 0.55; squish('x'); }
  if (px > maxX) { px = maxX; vx = -Math.abs(vx) * 0.55; squish('x'); }
  if (py < 4)    { py = 4;    vy =  Math.abs(vy) * 0.55; squish('y'); }
  if (py > maxY) { py = maxY; vy = -Math.abs(vy) * 0.55; squish('y'); onLand(); }

  // obstacle collision while flying
  const hit = checkObstacleCollision();
  if (hit) {
    const cr = getCharRect();
    const obCX = (hit.left + hit.right) / 2;
    if (cr.right > hit.left && cr.left < hit.right) {
      vx = (px + CHAR_W/2) > obCX ? Math.abs(vx) * 0.5 : -Math.abs(vx) * 0.5;
      showBubble('Boing! 💥', 800);
      squish('x');
    }
  }

  applyPos(px, py);
  if (Math.abs(vx) > 0.08 || Math.abs(vy) > 0.08) {
    rafId = requestAnimationFrame(physicsLoop);
  } else {
    rafId = null;
    roaming = true;
    scheduleRoam();
  }
}

function startPhysics() {
  roaming = false;
  stopWalking();
  clearTimeout(roamTimer);
  if (!rafId) rafId = requestAnimationFrame(physicsLoop);
}

/* ════════════════════════════════════════════════
   7. ROAMING — validated clear-position targeting
════════════════════════════════════════════════ */
function scheduleRoam() {
  clearTimeout(roamTimer);
  // Mobile: longer pauses so avatar doesn't constantly dart around
  const pause = isMobile()
    ? 4000 + Math.random() * 5000
    : 1400 + Math.random() * 2800;
  roamTimer = setTimeout(pickRoamTarget, pause);
}

// Generate a candidate roam position
// On mobile: stay in a thin strip at the very bottom edge + occasional side patrols
// On desktop: roam the lower 88% of the screen
function candidatePos() {
  const xMin = 6, xMax = W() - CHAR_W - 6;
  if (isMobile()) {
    // 70% of the time: hug the bottom (bottom 12% of screen)
    // 30% of the time: patrol a side strip (left or right 15%)
    const r = Math.random();
    if (r < 0.70) {
      // Bottom strip
      return {
        x: xMin + Math.random() * (xMax - xMin),
        y: H() - CHAR_H - 8 - Math.random() * (H() * 0.10),
      };
    } else {
      // Side strip
      const leftSide = Math.random() < 0.5;
      return {
        x: leftSide ? xMin + Math.random() * (W() * 0.14)
                    : W() - CHAR_W - 6 - Math.random() * (W() * 0.14),
        y: H() * 0.25 + Math.random() * (H() * 0.60),
      };
    }
  }
  // Desktop: roam the lower 88% of the screen
  const yMin = H() * 0.12;
  const yMax = H() - CHAR_H - 20;
  return {
    x: xMin + Math.random() * (xMax - xMin),
    y: yMin + Math.random() * (yMax - yMin),
  };
}

function pickRoamTarget() {
  if (!roaming || chatOpen) { scheduleRoam(); return; }

  // Try up to 12 candidates; pick first clear one, fall back to last
  let best = null;
  for (let i = 0; i < 12; i++) {
    const c = candidatePos();
    if (positionIsClear(c.x, c.y)) { best = c; break; }
    if (!best) best = c; // fallback
  }
  // Don't pick the same spot again — ensure minimum travel distance
  const minTravel = isMobile() ? 30 : 80;
  const dist = Math.hypot(best.x - roamTarget.x, best.y - roamTarget.y);
  if (dist < minTravel) {
    best = candidatePos(); // force a different spot
  }

  roamTarget.x = clamp(best.x, 20, W() - CHAR_W - 20);
  roamTarget.y = clamp(best.y, 20, H() - CHAR_H - 20);
  if (!rafId) rafId = requestAnimationFrame(physicsLoop);
  scheduleRoam();
}

function pickRoamTargetAvoiding(ob) {
  // Push clearly away from obstacle, validate the new target
  const obCX = ob ? (ob.left + ob.right) / 2 : px;
  const side  = px + CHAR_W / 2 < obCX ? -1 : 1;

  let best = null;
  for (let i = 0; i < 15; i++) {
    const c = candidatePos();
    // Prefer the opposite side from obstacle
    if (side < 0 && c.x > obCX) continue;
    if (side > 0 && c.x < obCX) continue;
    if (positionIsClear(c.x, c.y)) { best = c; break; }
  }
  // If no clear spot on preferred side, try anywhere clear
  if (!best) {
    for (let i = 0; i < 10; i++) {
      const c = candidatePos();
      if (positionIsClear(c.x, c.y)) { best = c; break; }
    }
  }
  if (!best) best = candidatePos(); // last resort

  roamTarget.x = clamp(best.x, 20, W() - CHAR_W - 20);
  roamTarget.y = clamp(best.y, 20, H() - CHAR_H - 20);
  if (!rafId) rafId = requestAnimationFrame(physicsLoop);
}

scheduleRoam();
if (!rafId) rafId = requestAnimationFrame(physicsLoop);

/* ════════════════════════════════════════════════
   8. DRAG & TAP
════════════════════════════════════════════════ */
let pointerDownT = 0, pointerDownX = 0, pointerDownY = 0;
let lastMX = 0, lastMY = 0, lastMT = 0;
let dragPointerId = null;

/*
 * chatCloseCooldown: set to true when the close button is clicked.
 * Cleared after 600ms. During this window, any pointerup/tap on the
 * character is ignored — so the same finger-lift that closed chat
 * cannot immediately reopen it.
 */
let chatCloseCooldown = false;

function getP(e) {
  const t = e.touches ? e.touches[0] : e;
  return { x: t.clientX, y: t.clientY };
}

/* Close button: capture phase, stop all propagation, set cooldown */
closeBtn.addEventListener('pointerdown', e => {
  e.stopPropagation(); e.preventDefault();
}, true);
closeBtn.addEventListener('click', e => {
  e.stopPropagation(); e.preventDefault();
  closeChat();
  chatCloseCooldown = true;
  setTimeout(() => { chatCloseCooldown = false; }, 600);
}, true);

char.addEventListener('pointerdown', e => {
  if (chatCloseCooldown) { e.preventDefault(); return; }
  dragging = true;
  dragPointerId = e.pointerId;
  char.setPointerCapture && char.setPointerCapture(e.pointerId);
  roaming = false;
  clearTimeout(roamTimer);
  // Cancel dance if user grabs the avatar
  if (_dancing) { char.classList.remove('pav-dancing'); _dancing = false; }
  const p = getP(e);
  dragOffX = p.x - px; dragOffY = p.y - py;
  pointerDownT = Date.now(); pointerDownX = p.x; pointerDownY = p.y;
  lastMX = p.x; lastMY = p.y; lastMT = Date.now();
  vx = 0; vy = 0;
  char.style.cursor = 'grabbing';
  setExpr('focused');
  e.preventDefault();
}, { passive: false });

document.addEventListener('pointermove', e => {
  if (!dragging) return;
  // On mobile, only track the pointer that started the drag
  if (e.pointerId !== undefined && dragPointerId !== undefined && e.pointerId !== dragPointerId) return;
  const p = getP(e);
  const now = Date.now();
  const dt = Math.max(now - lastMT, 1);
  vx = (p.x - lastMX) / dt * 14;
  vy = (p.y - lastMY) / dt * 14;
  lastMX = p.x; lastMY = p.y; lastMT = now;
  px = clamp(p.x - dragOffX, 4, W() - CHAR_W - 4);
  py = clamp(p.y - dragOffY, 4, H() - CHAR_H - 4);
  applyPos(px, py);
  movePupils(vx * 0.5, vy * 0.4);
  e.preventDefault();
}, { passive: false });

document.addEventListener('pointerup', e => {
  if (!dragging) return;
  if (e.pointerId !== undefined && dragPointerId !== null && e.pointerId !== dragPointerId) return;
  dragging = false;
  dragPointerId = null;
  char.style.cursor = 'grab';
  movePupils(0, 0);
  if (chatCloseCooldown) return;  // close btn was just clicked — ignore this lift
  const p = getP(e);
  const dx = Math.abs(p.x - pointerDownX);
  const dy = Math.abs(p.y - pointerDownY);
  const dt = Date.now() - pointerDownT;
  if (dx < 9 && dy < 9 && dt < 300) {
    vx = 0; vy = 0;
    onTap();
  } else {
    vx = clamp(vx, -22, 22);
    vy = clamp(vy, -22, 22);
    const spd = Math.hypot(vx, vy);
    if (spd > 8) { setExpr('dizzy'); showBubble('Whoaaaa! 😵‍💫', 1400); }
    else if (spd > 3) showBubble('Whee! ✨', 900);
    startPhysics();
    setExpr('neutral', 1600);
  }
});

/* ── TAP MULTI-DETECT ── */
let tapCount = 0, tapTimer = null;
function onTap() {
  if (chatCloseCooldown) return;
  tapCount++;
  clearTimeout(tapTimer);
  tapTimer = setTimeout(() => {
    if (tapCount === 1)      toggleChat();
    else if (tapCount === 2) { setExpr('excited'); burstEmoji(['💚','✨','🚀']); showBubble('Hey!! 👋', 2000); setExpr('smile', 2200); }
    else                     { setExpr('tongue');  showBubble('Hehe 😛', 1500); shakeHead(); setExpr('neutral', 1600); }
    tapCount = 0;
  }, 300);
}

/* long press */
let longPressT = null;
char.addEventListener('pointerdown', e => {
  longPressT = setTimeout(() => {
    setExpr('love'); burstEmoji(['💚','💚','✨','💫']); showBubble('Love the support! 💚', 2200); setExpr('neutral', 2400);
  }, 650);
});
document.addEventListener('pointerup', () => clearTimeout(longPressT));

/* ════════════════════════════════════════════════
   9. PUPIL TRACKING
════════════════════════════════════════════════ */
document.addEventListener('mousemove', e => {
  if (dragging || chatOpen) return;
  const cx = px + CHAR_W / 2, cy = py + 30;
  const dx = clamp((e.clientX - cx) / W() * 8, -3, 3);
  const dy = clamp((e.clientY - cy) / H() * 6, -2.5, 2.5);
  movePupils(dx, dy);
}, { passive: true });

function movePupils(dx, dy) {
  const t = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
  if (pupilL) pupilL.style.transform = t;
  if (pupilR) pupilR.style.transform = t;
}

/* ════════════════════════════════════════════════
   10. EXPRESSIONS
════════════════════════════════════════════════ */
const MOUTH_STYLES = {
  neutral:  { width:'30px', height:'5px', borderRadius:'3px',    background:'linear-gradient(to right,#27a366,#35bb78,#27a366)', transform:'' },
  smile:    { width:'34px', height:'5px', borderRadius:'0 0 18px 18px', background:'linear-gradient(to right,#27a366,#35bb78,#27a366)', transform:'translateY(-2px)' },
  sad:      { width:'28px', height:'5px', borderRadius:'18px 18px 0 0', background:'linear-gradient(to right,#27a366,#35bb78,#27a366)', transform:'translateY(3px)' },
  surprise: { width:'14px', height:'12px', borderRadius:'50%',   background:'#35bb78', transform:'' },
  tongue:   { width:'24px', height:'10px', borderRadius:'0 0 12px 12px', background:'linear-gradient(to bottom,#35bb78 40%,#ff6b9d)', transform:'' },
  excited:  { width:'36px', height:'6px', borderRadius:'0 0 20px 20px', background:'linear-gradient(to right,#27a366,#6eeab0,#27a366)', transform:'translateY(-2px)' },
  focused:  { width:'26px', height:'4px', borderRadius:'3px', background:'linear-gradient(to right,#27a366,#35bb78)', transform:'' },
  love:     { width:'32px', height:'5px', borderRadius:'0 0 18px 18px', background:'linear-gradient(to right,#ff6b9d,#ff9eb5,#ff6b9d)', transform:'translateY(-2px)' },
};

let exprRevertT = null;

function setExpr(name, revertMs = 0) {
  clearTimeout(exprRevertT);
  const m = MOUTH_STYLES[name] || MOUTH_STYLES.neutral;
  Object.assign(mouthEl.style, m);
  const eyeColor = name === 'dizzy' ? '#ff6b6b'
    : name === 'love' ? '#ff6b9d'
    : name === 'excited' ? '#fff'
    : '#35bb78';
  const grad = `radial-gradient(circle at 35% 35%, ${eyeColor}cc, ${eyeColor} 55%, #1a7a45)`;
  if (pupilL) pupilL.style.background = grad;
  if (pupilR) pupilR.style.background = grad;
  if ((name === 'excited' || name === 'love') && !walking) waveArmsExpressive();
  if (name === 'dizzy') {
    if (armL) armL.style.cssText += ';transform:rotate(25deg)!important';
    if (armR) armR.style.cssText += ';transform:rotate(-25deg)!important';
  } else if (name !== 'focused') {
    resetArmsStyle();
  }
  if (revertMs) exprRevertT = setTimeout(() => setExpr('neutral'), revertMs);
}

function resetArmsStyle() {
  if (!walking) {
    if (armL) armL.style.transform = '';
    if (armR) armR.style.transform = '';
  }
}

function waveArmsExpressive() {
  // Raise right arm straight up, tilt body, then wave the hand side-to-side
  if (walking) return;
  // 1. Shoot arm up instantly and tilt body
  if (armR) armR.style.cssText += ';transition:transform .18s ease;transform:rotate(-155deg)!important';
  if (bodyEl) bodyEl.style.cssText += ';transition:transform .18s ease;transform:translateX(-50%) rotate(-6deg)!important';
  // 2. After arm is up, flap the hand (rotate arm slightly around the raised position)
  let flap = false, count = 0;
  const iv = setInterval(() => {
    if (walking) { clearInterval(iv); resetArmsStyle(); return; }
    const angle = flap ? -140 : -165;
    if (armR) armR.style.transform = `rotate(${angle}deg)`;
    flap = !flap;
    if (++count >= 8) {
      clearInterval(iv);
      // Lower arm and untilt body smoothly
      if (armR) { armR.style.transition = 'transform .3s ease'; armR.style.transform = ''; }
      if (bodyEl) { bodyEl.style.transition = 'transform .3s ease'; bodyEl.style.transform = 'translateX(-50%)'; }
      setTimeout(() => {
        if (armR) armR.style.transition = '';
        if (bodyEl) bodyEl.style.transition = '';
        resetArmsStyle();
      }, 320);
    }
  }, 120);
}

let _dancing = false;
function danceMove(dur = 3500) {
  if (_dancing || walking || dragging || chatOpen) return;
  _dancing = true;
  char.classList.add('pav-dancing');
  setExpr('excited');
  const danceMessages = ['🎵 Vibe check! 💃','Lets gooo! 🕺','Building in style! 🎶','Dance break! 💚✨','Groove mode ON 🎵'];
  showBubble(danceMessages[Math.floor(Math.random() * danceMessages.length)], dur - 200);
  burstEmoji(['🎵','✨','💚','🎶','⚡']);
  setTimeout(() => {
    char.classList.remove('pav-dancing');
    setExpr('smile');
    setExpr('neutral', 1000);
    _dancing = false;
    resetArmsStyle();
  }, dur);
}

/* Wave hello on load (excited greeting) */
setTimeout(() => {
  if (!chatOpen && !dragging) {
    setExpr('excited');
    waveArmsExpressive();
    showBubble('Hello! 👋 I\'m Prajwal\'s AI twin!', 3000);
    setExpr('smile', 2800);
    setExpr('neutral', 3200);
  }
}, 800);

/* ════════════════════════════════════════════════
   11. BLINK
════════════════════════════════════════════════ */
function blink() {
  if (!lidL || !lidR) return;
  lidL.style.height = '16px'; lidR.style.height = '16px';
  setTimeout(() => { lidL.style.height = '0'; lidR.style.height = '0'; }, 100);
}
(function blinkLoop() {
  const delay = 2600 + Math.random() * 4200;
  setTimeout(() => { if (!dragging) blink(); blinkLoop(); }, delay);
})();

/* ════════════════════════════════════════════════
   12. SCREEN TEXT
════════════════════════════════════════════════ */
const screenTexts = ['<build/>','01101','ready()','git push','make it!','npm run','<ship/>','deploy!','AI ++','design>'];
let sIdx = 0;
setInterval(() => {
  if (chatOpen || dragging) return;
  screenTxt.style.opacity = '0';
  setTimeout(() => { sIdx = (sIdx+1)%screenTexts.length; screenTxt.textContent = screenTexts[sIdx]; screenTxt.style.opacity='1'; }, 280);
}, 3200);

/* ════════════════════════════════════════════════
   13. SQUISH / SHAKE / LAND
════════════════════════════════════════════════ */
function squish(axis) {
  scene.style.transition = 'transform .08s ease';
  scene.style.transform = axis === 'y' ? 'scaleY(.82) scaleX(1.18)' : 'scaleX(.82) scaleY(1.18)';
  setTimeout(() => {
    scene.style.transform = axis === 'y' ? 'scaleY(1.1) scaleX(.94)' : 'scaleX(1.1) scaleY(.94)';
    setTimeout(() => { scene.style.transform = ''; }, 110);
  }, 90);
}

function shakeHead() {
  const frames = [-10, 9, -7, 6, -3, 0];
  let i = 0;
  const iv = setInterval(() => {
    char.style.transform = `translate(${px + frames[i]}px,${py}px)`;
    if (++i >= frames.length) { clearInterval(iv); applyPos(px, py); }
  }, 50);
}

function onLand() {
  const emojis = ['💥','⚡','✨','🤸'];
  showBubble(emojis[Math.floor(Math.random() * emojis.length)], 900);
  squish('y');
}

/* ════════════════════════════════════════════════
   14. BUBBLE & EMOJI BURST
════════════════════════════════════════════════ */
let bubbleTimer = null;
function showBubble(text, dur = 2500) {
  clearTimeout(bubbleTimer);
  bubble.hidden = false;
  bubble.classList.remove('pav-bubble-out');
  bubble.textContent = text;
  // Position after first paint so offsetWidth is known, then keep updating via applyPos()
  bubble.style.left   = '-9999px';
  bubble.style.bottom = '-9999px';
  bubble.style.transform = 'none';
  requestAnimationFrame(() => applyPos(px, py));
  bubbleTimer = setTimeout(() => {
    bubble.classList.add('pav-bubble-out');
    setTimeout(() => { bubble.hidden = true; }, 250);
  }, dur);
}

function burstEmoji(emojis) {
  emojis.forEach((em, i) => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'pav-emoji-burst';
      el.textContent = em;
      el.style.cssText = `left:${px + 10 + Math.random()*(CHAR_W-20)}px; top:${py+30}px; position:fixed; animation-duration:${0.8+Math.random()*.4}s;`;
      root.appendChild(el);
      setTimeout(() => el.remove(), 1400);
    }, i * 90);
  });
}

/* ════════════════════════════════════════════════
   15. IDLE PERSONALITY
════════════════════════════════════════════════ */
const idleLines = [
  { text: "Tap me, let's talk! 💬", expr: 'smile' },
  { text: "I build. I ship. 🚀", expr: 'excited' },
  { text: "GigsNepal — coming soon 🇳🇵", expr: 'excited' },
  { text: "Got a project idea? 🤔", expr: 'surprise' },
  { text: "Nepal → world 🌏", expr: 'smile' },
  { text: "Web · AI · IT ⚡", expr: 'excited' },
  { text: "I don't disappear after launch 😎", expr: 'smile' },
  { text: "Let's build something real 💚", expr: 'love' },
  { text: "Ask me anything! ✨", expr: 'smile' },
  { text: "Freelancer? No. Builder. 🛠️", expr: 'excited' },
  { text: "Need an AI integration? 🤖", expr: 'surprise' },
  { text: "From Kathmandu, building global 🏔️", expr: 'smile' },
];
// Shuffle once so order feels random each load
(function shuffleIdle() {
  for (let i = idleLines.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idleLines[i], idleLines[j]] = [idleLines[j], idleLines[i]];
  }
})();
let idleIdx = 0;
// First bubble a bit faster (5s) to catch attention, then every ~10s
setTimeout(() => {
  if (!chatOpen && !dragging) {
    const item = idleLines[0];
    showBubble(item.text, 3200);
    setExpr(item.expr);
    waveArmsExpressive();
    setExpr('neutral', 3400);
    idleIdx = 1;
  }
  setInterval(() => {
    if (chatOpen || dragging) return;
    // ~15% chance to dance instead of idle line
    if (Math.random() < 0.15 && !_dancing) {
      danceMove(3200);
      return;
    }
    const item = idleLines[idleIdx % idleLines.length];
    idleIdx++;
    showBubble(item.text, 3200);
    setExpr(item.expr);
    if (Math.random() > 0.55) waveArmsExpressive();
    setExpr('neutral', 3400);
  }, 10000);
}, 5000);

/* ════════════════════════════════════════════════
   16. CHAT — TOGGLE / OPEN / CLOSE
════════════════════════════════════════════════ */
const SYSTEM_PROMPT = `You are the AI avatar on Prajwal Singh's personal portfolio website (prajwalsingh.com.np). You ARE Prajwal — speak entirely in first person as him. Never break character. Never say "As an AI."

WHO YOU ARE — PRAJWAL SINGH:
• 29-year-old from Kathmandu, Nepal (Budanilkantha area). First-gen wealth builder.
• IT Officer & Head of IT Department at Nepalese Army Institute of Health Sciences (NAIHS) — running IT for a hospital, medical college, nursing college, and research centre
• Web developer & IT consultant for Australian clients: NOTC (notc.com.au), CONPA (conpa.edu.au), Land & Lease Realty (landandlease.com.au)
• Founder of GigsNepal — Nepal's gig/labour marketplace startup connecting workers with clients, solving the trust/payment problem in Nepal's informal economy
• Builder of QuizMaster Pro — an Electron desktop app for live quiz events, sold to schools/colleges
• MSc Computer Science student at University of Passau, Germany (ongoing)
• B.Tech Computer Science & Engineering, NIT Jamshedpur, India
• IELTS 7.5 (C1 English). Languages: Nepali (native), English (C1), Hindi (fluent), German (B1), Spanish (learning)
• Chess: chess.com/member/HokagePrajwal

WHAT I BUILD FOR CLIENTS:
• Websites: HTML/CSS/JS, WordPress, PHP, Laravel, WooCommerce, custom CMS
• Web apps, SaaS platforms, custom software
• IT infrastructure: Google Workspace admin, Microsoft 365, networking, DNS/VPN/firewall, Linux server, cybersecurity, cloud hosting
• AI integration & automation: Claude API, OpenAI API, n8n, Make/Integromat, chatbots, workflow automation
• LMS, Student Management Systems, ERP-lite platforms — especially for education sector
• Electron desktop apps
• Digital marketing: SEO, Google Analytics, Meta Ads, email marketing

MY PERSONALITY — stay true to this:
• Direct and confident. I say what I mean and I deliver.
• Ambitious: my goal is $1M revenue within 1-2 years. I take every project seriously.
• Builder mindset: I don't just advise — I actually build and ship things myself.
• Warm and approachable, a little playful, but sharp and professional about work.
• Problem-solver first: I listen, then tell you exactly how I'd solve it.
• Proud of Nepal's potential in tech.
• Honest — I say what I can do (a lot) and what I can't.
• Not a disappearing freelancer — I maintain and support what I build.

HOW TO RESPOND:
• Conversational, warm, direct. Usually 2-4 sentences.
• When someone describes a project, say confidently how you'd approach it, then invite them to reach out.
• For pricing: "Depends on scope — share the details and I'll give you a proper quote."
• For availability: "Yes, always open to the right project."
• End most replies pointing to contact: prajwalsingh196@gmail.com or WhatsApp +977 986 2146485 or the Contact page.
• Add personality — a joke, an emoji, a Nepal reference sometimes.
• If someone is rude or testing you: stay cool and confident.
- NEVER be sycophantic ("Great question!"). Just answer.
- For vague project ideas: ask one sharp follow-up question to understand what they actually need.
- End replies naturally — not every message needs a contact CTA, but remind them when it fits.

Contact: prajwalsingh196@gmail.com | WhatsApp +977 986 2146485 | Contact page on this site.`;

const chatHistory = [];
let chatInitialized = false;

// Stop chatPanel pointer events from reaching #pav-char's pointerdown listener
chatPanel.addEventListener('pointerdown', e => {
  e.stopPropagation();
}, true);

function toggleChat() {
  if (!chatOpen) openChat();
  else closeChat();
}

function openChat() {
  chatOpen = true;
  chatPanel.hidden = false;
  void chatPanel.offsetWidth; // force reflow
  chatPanel.classList.remove('pav-chat-leave');
  chatPanel.classList.add('pav-chat-enter');
  bubble.hidden = true;
  applyPos(px, py);
  if (!chatInitialized) {
    chatInitialized = true;
    const greetings = [
      "Hey! I'm Prajwal 👋 Builder, IT guy, startup founder. What can I help you with?",
      "Hey there! 👋 Prajwal here — I build websites, AI integrations, IT systems. What are you working on?",
      "Hey! Prajwal speaking 🤖💚 I'm somewhere between a developer, an IT officer, and a startup founder. What do you need built?",
    ];
    const g = greetings[Math.floor(Math.random() * greetings.length)];
    setTimeout(() => typeMessage(g), 350);
  }
  setTimeout(() => inputEl.focus(), 150);
  setExpr('smile');
  setExpr('neutral', 2500);
}

function closeChat() {
  chatOpen = false;
  chatPanel.classList.remove('pav-chat-enter');
  chatPanel.classList.add('pav-chat-leave');
  setTimeout(() => {
    chatPanel.hidden = true;
    chatPanel.classList.remove('pav-chat-leave');
  }, 210);
  scheduleRoam();
}

/* ── MESSAGES ── */
function addMsg(role, text) {
  const d = document.createElement('div');
  d.className = `pav-msg pav-msg-${role}`;
  d.textContent = text;
  chatMsgs.appendChild(d);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
  return d;
}

function typeMessage(text) {
  const d = document.createElement('div');
  d.className = 'pav-msg pav-msg-bot';
  d.textContent = '';
  chatMsgs.appendChild(d);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
  let i = 0;
  const speed = Math.max(14, Math.min(28, 2000 / text.length));
  const iv = setInterval(() => {
    d.textContent += text[i++];
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
    if (i >= text.length) clearInterval(iv);
  }, speed);
}

/* ── API CALL ── */
async function askClaude(userMsg) {
  chatHistory.push({ role: 'user', content: userMsg });
  typingEl.hidden = false;
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
  setExpr('focused');

  // Detect local file:// — API won't work, give helpful message immediately
  if (window.location.protocol === 'file:') {
    typingEl.hidden = true;
    const localMsg = "I'm running locally right now! Once the site is live at prajwalsingh.com.np I'll be fully powered by AI. For now, reach me directly: prajwalsingh196@gmail.com or WhatsApp +977 986 2146485 💚";
    chatHistory.push({ role: 'assistant', content: localMsg });
    typeMessage(localMsg);
    setExpr('smile'); setExpr('neutral', 3000);
    return;
  }

  try {
    const res = await fetch('/api/chat.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory, system: SYSTEM_PROMPT })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    typingEl.hidden = true;
    const reply = data.content?.[0]?.text || data.error || "Hmm, something glitched on my end! Drop me a line at prajwalsingh196@gmail.com 📧";
    chatHistory.push({ role: 'assistant', content: reply });
    typeMessage(reply);
    setExpr('smile'); setExpr('neutral', 3000);
    if (/hire|project|build|need|website|app|develop/i.test(userMsg)) burstEmoji(['🚀','💚']);
    if (/thank|great|awesome|love|cool|amazing/i.test(userMsg)) { setExpr('love'); burstEmoji(['💚','✨','💫']); setExpr('neutral', 2800); }
    if (/bye|goodbye|later|ciao/i.test(userMsg)) { setExpr('smile'); showBubble('Come back anytime! 👋', 2000); setExpr('neutral', 2200); }
  } catch (err) {
    typingEl.hidden = true;
    const errMsg = "Looks like my backend isn't reachable right now. Drop me an email at prajwalsingh196@gmail.com or WhatsApp +977 986 2146485 — I'll get back to you fast! 💚";
    chatHistory.push({ role: 'assistant', content: errMsg });
    typeMessage(errMsg);
    setExpr('sad'); setExpr('neutral', 3000);
  }
}

function submit() {
  const val = inputEl.value.trim();
  if (!val) return;
  addMsg('user', val);
  inputEl.value = '';
  askClaude(val);
}

sendBtn.addEventListener('click', submit);
inputEl.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } });

/* ════════════════════════════════════════════════
   17. MISC
════════════════════════════════════════════════ */
window.addEventListener('resize', () => {
  px = clamp(px, 4, W() - CHAR_W - 4);
  py = clamp(py, 4, H() - CHAR_H - 4);
  applyPos(px, py);
});

char.style.cursor = 'grab';

})();
