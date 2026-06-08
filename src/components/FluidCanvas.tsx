import { useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   PIANO WAVE CANVAS — ALTERNATING CONVERGE / DIVERGE

   Every viewport-height of scroll = one half-cycle of the piano:
     scroll ×1 H → converged (pianos meet at center)
     scroll ×2 H → diverged  (pianos back at edges)
     scroll ×3 H → converged … repeats to end of page

   Formula:  s = (1 − cos(scrollY / H × π)) / 2
   This produces a smooth 0→1→0→1→0 cosine easing that feels
   musical — it "breathes" in and out like a bass beat.

   Drawing order (back → front)
   ─────────────────────────────
   1. Black fill + Figma dot grid
   2. CENTER STAGE (clipped between keyboard edges):
        • Sine frequency waves
        • Spectrum-analyser bars
        • Floating music notes
   3. LEFT + RIGHT piano keyboards
   4. Leading-edge glow curves
   5. Center convergence burst  (s > 0.80)
   6. Edge-burst flash          (s < 0.06)
═══════════════════════════════════════════════════════════════════ */

const KEY_PATTERN = [
  true, false, true, false, true,
  true, false, true, false, true, false, true,
];
const KEY_COUNT = 56;
const SYMBOLS   = ['♩', '♪', '♫', '♬', '𝄞', '♭', '♯', '♮', '𝄢'];
const GRID_STEP = 28;

const WAVES = [
  { baseY: 0.18, freq: 0.0070, amp: 52, phase: 0.00, speed:  0.013, hue: 192, alpha: 0.42, width: 1.6 },
  { baseY: 0.50, freq: 0.0048, amp: 78, phase: 0.80, speed:  0.009, hue:  44, alpha: 0.32, width: 2.2 },
  { baseY: 0.82, freq: 0.0058, amp: 30, phase: 0.50, speed:  0.022, hue: 215, alpha: 0.26, width: 1.1 },
];

interface Note {
  x: number; y: number;
  sym: string; opacity: number; size: number;
  vx: number; vy: number;
  life: number; maxLife: number;
}

// ── helpers ───────────────────────────────────────────────────────

function isBlack(i: number) { return !KEY_PATTERN[i % KEY_PATTERN.length]; }

function buildGrid(w: number, h: number): HTMLCanvasElement {
  const gc = document.createElement('canvas');
  gc.width = w; gc.height = h;
  const gx = gc.getContext('2d')!;
  gx.fillStyle = 'rgba(255,255,255,0.048)';
  for (let x = 0; x <= w; x += GRID_STEP)
    for (let y = 0; y <= h; y += GRID_STEP) {
      gx.beginPath(); gx.arc(x, y, 0.85, 0, Math.PI * 2); gx.fill();
    }
  return gc;
}

/**
 * Horizontal length of key i at scroll progress s, animation time t.
 * Wave amplitude is scaled by a "motion factor" (mf) so keys ripple
 * more dramatically during the 0.25–0.75 mid-range of each cycle.
 */
function keyLength(i: number, s: number, t: number, W: number, mf: number): number {
  const black = isBlack(i);
  const restLen = black ? 26 : 44;
  const maxLen  = W * 0.49;
  const base    = restLen + (maxLen - restLen) * s;
  const waveAmp = (12 + mf * 22) * (black ? 0.7 : 1.0);
  const wave    = Math.sin(i * 0.23 + t * 0.55) * waveAmp
                + Math.cos(i * 0.09 + t * 0.32) * waveAmp * 0.5;
  return Math.max(4, base + wave);
}

export default function FluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -2000, y: -2000 });
  const rafRef    = useRef<number>(0);
  const sRef      = useRef(0);   // smoothed piano progress (0–1)
  const sTgt      = useRef(0);   // target (from scroll formula)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = (canvas.width  = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let grid = buildGrid(W, H);

    const notes: Note[] = [];
    const wavePhases = WAVES.map(w => w.phase);
    let frame = 0;

    // ── scroll formula ─────────────────────────────────────────
    // Each H px of scroll = one half-cycle (converge OR diverge).
    // cos easing makes the motion start/end softly at both extremes.
    const onScroll = () => {
      const radians = (window.scrollY / H) * Math.PI;
      sTgt.current  = (1 - Math.cos(radians)) / 2;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── piano drawing ──────────────────────────────────────────
    function drawPiano(side: 'left' | 'right', s: number, t: number, mf: number) {
      const kh = H / KEY_COUNT;

      for (let i = 0; i < KEY_COUNT; i++) {
        const black = isBlack(i);
        const y     = i * kh;
        const kLen  = keyLength(i, s, t, W, mf);
        const gap   = black ? 1.5 : 1;

        const x = side === 'left' ? 0 : W - kLen;
        const w = kLen;

        // Fill gradient
        if (!black) {
          const gd = ctx.createLinearGradient(
            side === 'left' ? x : x + w, 0,
            side === 'left' ? x + w : x, 0,
          );
          gd.addColorStop(0,    'rgba(215,225,240,0.95)');
          gd.addColorStop(0.65, 'rgba(195,210,232,0.80)');
          gd.addColorStop(1,    'rgba(170,190,220,0.08)');
          ctx.fillStyle = gd;
        } else {
          const gd = ctx.createLinearGradient(
            side === 'left' ? x : x + w, 0,
            side === 'left' ? x + w : x, 0,
          );
          gd.addColorStop(0,    'rgba(10,10,20,0.97)');
          gd.addColorStop(0.75, 'rgba(18,18,32,0.88)');
          gd.addColorStop(1,    'rgba(28,28,50,0.06)');
          ctx.fillStyle = gd;
        }
        ctx.fillRect(x, y + gap, w, kh - gap * 2);

        // White-key divider
        if (!black) {
          ctx.strokeStyle = 'rgba(255,255,255,0.09)';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x, y + gap, w, kh - gap * 2);
        }

        // Per-key leading-edge glow
        const glowW  = 10 + s * 20 + mf * 8;
        const glowA  = (black ? 0.06 : 0.13) + s * 0.20;
        const gd2    = side === 'left'
          ? ctx.createLinearGradient(x + w - glowW, 0, x + w, 0)
          : ctx.createLinearGradient(x + glowW, 0, x, 0);
        gd2.addColorStop(0, 'rgba(140,195,255,0)');
        gd2.addColorStop(1, `rgba(140,195,255,${glowA})`);
        ctx.fillStyle = gd2;
        ctx.fillRect(
          side === 'left' ? x + w - glowW : x,
          y + gap, glowW, kh - gap * 2,
        );
      }
    }

    // ── leading-edge glow curve ────────────────────────────────
    function drawEdgeCurve(side: 'left' | 'right', s: number, t: number, mf: number) {
      const kh = H / KEY_COUNT;
      ctx.beginPath();
      for (let i = 0; i <= KEY_COUNT; i++) {
        const idx  = Math.min(i, KEY_COUNT - 1);
        const kLen = keyLength(idx, s, t, W, mf);
        const ex   = side === 'left' ? kLen : W - kLen;
        const y    = i * kh;
        i === 0 ? ctx.moveTo(ex, y) : ctx.lineTo(ex, y);
      }
      const alpha = 0.22 + s * 0.50 + mf * 0.15;
      ctx.strokeStyle = `rgba(160,215,255,${Math.min(alpha, 0.85)})`;
      ctx.lineWidth = 0.8 + s * 1.4;
      ctx.stroke();
    }

    // ── center content (clipped) ───────────────────────────────
    function drawCenterContent(lx: number, rx: number, t: number) {
      const cw = Math.max(0, rx - lx);
      if (cw < 2) return;

      ctx.save();
      ctx.beginPath();
      ctx.rect(lx, 0, cw, H);
      ctx.clip();

      // Sine waves
      for (let wi = 0; wi < WAVES.length; wi++) {
        const w = WAVES[wi];
        wavePhases[wi] += w.speed;
        const ph = wavePhases[wi];

        // Glow pass
        ctx.beginPath();
        for (let x = lx; x <= rx; x += 4) {
          const y = w.baseY * H + Math.sin(x * w.freq + ph) * w.amp;
          x === lx ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `hsla(${w.hue},100%,70%,${w.alpha * 0.32})`;
        ctx.lineWidth = w.width * 4;
        ctx.stroke();

        // Core with edge fade
        ctx.beginPath();
        for (let x = lx; x <= rx; x += 3) {
          const y = w.baseY * H + Math.sin(x * w.freq + ph) * w.amp;
          x === lx ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const lg = ctx.createLinearGradient(lx, 0, rx, 0);
        lg.addColorStop(0,    `hsla(${w.hue},100%,75%,0)`);
        lg.addColorStop(0.06, `hsla(${w.hue},100%,75%,${w.alpha})`);
        lg.addColorStop(0.94, `hsla(${w.hue},100%,75%,${w.alpha})`);
        lg.addColorStop(1,    `hsla(${w.hue},100%,75%,0)`);
        ctx.strokeStyle = lg;
        ctx.lineWidth = w.width;
        ctx.stroke();

        // Riding particles
        for (let x = lx + 18; x < rx - 18; x += 50 + (frame * 0.2 % 16)) {
          const y = w.baseY * H + Math.sin(x * w.freq + ph) * w.amp;
          const sz = 1.1 + Math.sin(x * 0.06 + frame * 0.04) * 0.65;
          ctx.beginPath(); ctx.arc(x, y, sz, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${w.hue},100%,82%,${w.alpha * 0.8})`;
          ctx.fill();
        }
      }

      // Spectrum bars
      const BAR_N = 44;
      const bw    = cw / BAR_N;
      const maxH  = H * 0.13;
      for (let i = 0; i < BAR_N; i++) {
        const bx = lx + i * bw;
        const n  = i / BAR_N;
        const bh = (
          Math.abs(Math.sin(n * 9  + t * 1.15)) * 0.42 +
          Math.abs(Math.sin(n * 15 + t * 0.73)) * 0.32 +
          Math.abs(Math.sin(n * 4  + t * 1.90)) * 0.26
        ) * maxH;
        const hue = 168 + n * 160;
        const bg = ctx.createLinearGradient(bx, H, bx, H - bh);
        bg.addColorStop(0,   `hsla(${hue},100%,60%,0.40)`);
        bg.addColorStop(0.5, `hsla(${hue},100%,70%,0.18)`);
        bg.addColorStop(1,   `hsla(${hue},100%,85%,0)`);
        ctx.fillStyle = bg;
        ctx.fillRect(bx + 1, H - bh, bw - 2, bh);
        ctx.beginPath(); ctx.arc(bx + bw / 2, H - bh, 1.3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue},100%,85%,0.50)`;
        ctx.fill();
      }

      // Floating music notes
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (let i = notes.length - 1; i >= 0; i--) {
        const n = notes[i];
        n.life++; n.x += n.vx; n.y += n.vy;
        if (n.life < 40)
          n.opacity = n.life / 40;
        else if (n.life > n.maxLife - 50)
          n.opacity = Math.max(0, (n.maxLife - n.life) / 50);
        if (n.life >= n.maxLife) { notes.splice(i, 1); continue; }
        ctx.globalAlpha = n.opacity * 0.26;
        ctx.fillStyle = '#fff';
        ctx.font = `${n.size}px serif`;
        ctx.fillText(n.sym, n.x, n.y);
      }
      ctx.globalAlpha = 1;

      ctx.restore();
    }

    // ── convergence burst (s → 1) ──────────────────────────────
    function drawConvergenceBurst(s: number) {
      if (s < 0.78) return;
      const k  = (s - 0.78) / 0.22;
      const cx = W / 2;

      // Soft vertical slab
      const gd = ctx.createLinearGradient(cx - 80, 0, cx + 80, 0);
      gd.addColorStop(0,   'rgba(140,200,255,0)');
      gd.addColorStop(0.5, `rgba(140,200,255,${k * 0.20})`);
      gd.addColorStop(1,   'rgba(140,200,255,0)');
      ctx.fillStyle = gd;
      ctx.fillRect(cx - 80, 0, 160, H);

      // Center seam
      ctx.strokeStyle = `rgba(210,240,255,${k * 0.65})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
    }

    // ── divergence edge flash (s → 0) ─────────────────────────
    function drawDivergenceFlash(s: number) {
      if (s > 0.12) return;
      const k = 1 - s / 0.12;

      for (const side of ['left', 'right'] as const) {
        const gd = side === 'left'
          ? ctx.createLinearGradient(0, 0, 60, 0)
          : ctx.createLinearGradient(W, 0, W - 60, 0);
        gd.addColorStop(0,   `rgba(140,200,255,${k * 0.18})`);
        gd.addColorStop(1,   'rgba(140,200,255,0)');
        ctx.fillStyle = gd;
        ctx.fillRect(side === 'left' ? 0 : W - 60, 0, 60, H);
      }
    }

    // ── note spawner ───────────────────────────────────────────
    function spawnNote(lx: number, rx: number) {
      if (notes.length >= 14 || rx - lx < 40) return;
      notes.push({
        x: lx + Math.random() * (rx - lx),
        y: H + 20,
        sym: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        opacity: 0, size: 14 + Math.random() * 20,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(0.25 + Math.random() * 0.5),
        life: 0, maxLife: 220 + Math.random() * 260,
      });
    }

    // ── main render loop ───────────────────────────────────────
    function draw() {
      frame++;

      // Smooth lerp: slightly faster so keys feel "coupled" to scroll
      sRef.current += (sTgt.current - sRef.current) * 0.09;
      const s = sRef.current;
      const t = frame * 0.018;

      // "Motion factor": peaks at mid-cycle (0.3–0.7), drives wave drama
      const mf = Math.max(0, Math.sin(s * Math.PI));

      // Clear
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);

      // Dot grid
      ctx.globalAlpha = 1;
      ctx.drawImage(grid, 0, 0);

      // Smooth clip edges (no wave jitter on clip boundary)
      const avgRest = 36;
      const lEdge   = avgRest + (W * 0.49 - avgRest) * s + 4;
      const rEdge   = W - lEdge;

      // 1. Center musical content (behind piano keys)
      drawCenterContent(lEdge, rEdge, t);

      // 2. Piano keyboards (on top of center content)
      drawPiano('left',  s, t, mf);
      drawPiano('right', s, t, mf);

      // 3. Glowing leading-edge curves
      drawEdgeCurve('left',  s, t, mf);
      drawEdgeCurve('right', s, t, mf);

      // 4. Overlay effects
      drawConvergenceBurst(s);
      drawDivergenceFlash(s);

      // 5. Spawn notes at 25-frame intervals
      if (frame % 25 === 0) spawnNote(lEdge, rEdge);

      rafRef.current = requestAnimationFrame(draw);
    }

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    draw();

    // ── event listeners ────────────────────────────────────────
    const onMove    = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onResize  = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      grid = buildGrid(W, H);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize',    onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll',    onScroll);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize',    onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0, background: '#000', opacity: 0.6 }}
    />
  );
}
