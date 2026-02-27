import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Math helpers ──────────────────────────────────────────────
function nrm(v) {
  const l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  return l < 1e-12 ? [0, 1, 0] : [v[0] / l, v[1] / l, v[2] / l];
}
function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function scl(v, s) { return [v[0] * s, v[1] * s, v[2] * s]; }
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
function lerp(a, b, t) { return a + (b - a) * t; }

// ─── Soccer-ball patch geometry ────────────────────────────────
const PHI = (1 + Math.sqrt(5)) / 2;
const CENTERS = [
  [0, 1, PHI], [0, -1, PHI], [0, 1, -PHI], [0, -1, -PHI],
  [1, PHI, 0], [-1, PHI, 0], [1, -PHI, 0], [-1, -PHI, 0],
  [PHI, 0, 1], [-PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, -1],
].map(nrm);

const N_SIDES = 7, PATCH_ANG = 0.455, ROT_OFF = Math.PI / N_SIDES;

function capCorners(center, angR, n, rot) {
  let up = [0, 1, 0];
  if (Math.abs(dot(center, up)) > 0.85) up = [1, 0, 0];
  const t1 = nrm(cross(center, up)), t2 = nrm(cross(center, t1));
  const sR = Math.sin(angR), cR = Math.cos(angR);
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + rot;
    return nrm([
      cR * center[0] + sR * (Math.cos(a) * t1[0] + Math.sin(a) * t2[0]),
      cR * center[1] + sR * (Math.cos(a) * t1[1] + Math.sin(a) * t2[1]),
      cR * center[2] + sR * (Math.cos(a) * t1[2] + Math.sin(a) * t2[2]),
    ]);
  });
}

const PATCH_NORMALS = CENTERS.map(center => {
  const corners = capCorners(center, PATCH_ANG, N_SIDES, ROT_OFF);
  return corners.map((c, i) => {
    const next = corners[(i + 1) % N_SIDES];
    const n = nrm(cross(c, next));
    return dot(n, center) < 0 ? scl(n, -1) : n;
  });
});

function inSept(dir, pi) {
  const norms = PATCH_NORMALS[pi]; let m = Infinity;
  for (let i = 0; i < norms.length; i++) { const d = dot(dir, norms[i]); if (d < m) m = d; }
  return { inside: m > 0, minEdge: m };
}

// ─── Procedural texture builder ────────────────────────────────
function buildTexCanvas(SIZE, mode) {
  const W = SIZE * 2, H = SIZE;
  const tc = document.createElement("canvas");
  tc.width = W; tc.height = H;
  const ctx = tc.getContext("2d"), img = ctx.createImageData(W, H), px = img.data;
  const SEAM = 0.035;

  for (let py = 0; py < H; py++) {
    for (let xi = 0; xi < W; xi++) {
      let bS = 0, sS = 0;
      for (let sy = 0; sy < 2; sy++) for (let sx = 0; sx < 2; sx++) {
        const u = (xi + (sx + .5) * .5) / W, v = (py + (sy + .5) * .5) / H;
        const lon = (u - .5) * Math.PI * 2, lat = (.5 - v) * Math.PI, cl = Math.cos(lat);
        const dir = nrm([cl * Math.cos(lon), Math.sin(lat), cl * Math.sin(lon)]);
        let any = false, best = -Infinity;
        for (let pi = 0; pi < CENTERS.length; pi++) {
          const { inside, minEdge } = inSept(dir, pi);
          if (inside) { any = true; if (minEdge > best) best = minEdge; }
          else { if (minEdge > best) best = minEdge; }
        }
        if (any) bS += 1; else sS += clamp(1 - (-best) / SEAM, 0, 1);
      }
      const bT = clamp(bS / 4, 0, 1), sT = clamp(sS / 4, 0, 1), idx = (py * W + xi) * 4;
      if (mode === "color") {
        let r = 238, g = 238, b = 238;
        r = lerp(r, 70, sT); g = lerp(g, 70, sT); b = lerp(b, 70, sT);
        r = lerp(r, 12, bT); g = lerp(g, 12, bT); b = lerp(b, 12, bT);
        px[idx] = r; px[idx + 1] = g; px[idx + 2] = b; px[idx + 3] = 255;
      } else if (mode === "rough") {
        const rv = bT > .5 ? 80 : sT > .2 ? Math.round(lerp(30, 180, sT)) : 28;
        px[idx] = px[idx + 1] = px[idx + 2] = rv; px[idx + 3] = 255;
      } else {
        const bv = bT > .5 ? 110 : Math.round(128 + sT * 95);
        px[idx] = px[idx + 1] = px[idx + 2] = bv; px[idx + 3] = 255;
      }
    }
  }
  ctx.putImageData(img, 0, 0);

  // Subtle seam shimmer for color map
  if (mode === "color") {
    const id2 = ctx.getImageData(0, 0, W, H), d2 = id2.data; let sc = 0;
    for (let py = 1; py < H - 1; py++) for (let xi = 1; xi < W - 1; xi++) {
      const i = (py * W + xi) * 4, val = d2[i];
      if (val > 50 && val < 120) { sc++; if (sc % 12 < 5) { d2[i] = 200; d2[i + 1] = 200; d2[i + 2] = 200; } }
    }
    ctx.putImageData(id2, 0, 0);
  }
  return tc;
}

// ═══════════════════════════════════════════════════════════════
// SoccerBallBackground — fixed, full-viewport 3D background.
// Place this as the FIRST child in your page/layout so all
// content renders above it (zIndex: 1+).
// Scroll drives rotation via GSAP ScrollTrigger scrub.
// ═══════════════════════════════════════════════════════════════
export function SoccerBallBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Scene & Camera ─────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      38, window.innerWidth / window.innerHeight, 0.1, 100
    );
    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);

    // ── Lighting ──────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    const key = new THREE.DirectionalLight(0xffffff, 3.2);
    key.position.set(-3, 7, 5);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xc8e0ff, 0.6);
    fill.position.set(5, 1, 4);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffffff, 0.3);
    rim.position.set(0, -4, -3);
    scene.add(rim);

    // ── Textures (built on CPU, cached in canvas) ─────────────
    const mkTex = (tc) => {
      const t = new THREE.CanvasTexture(tc);
      t.wrapS = THREE.RepeatWrapping;
      return t;
    };
    const colorTex = mkTex(buildTexCanvas(600, "color"));
    const roughTex = mkTex(buildTexCanvas(200, "rough"));
    const bumpTex = mkTex(buildTexCanvas(200, "bump"));

    // ── Soccer Ball Mesh ───────────────────────────────────────
    const geo = new THREE.SphereGeometry(1.6, 64, 64);
    const mat = new THREE.MeshStandardMaterial({
      map: colorTex,
      roughnessMap: roughTex,
      bumpMap: bumpTex,
      bumpScale: 0.03,
      roughness: 0.22,
      metalness: 0.0,
    });
    const ball = new THREE.Mesh(geo, mat);
    // Start with a slight tilt so marks are visible immediately
    ball.rotation.z = 0.25;
    scene.add(ball);

    // Heptagon shadow blob underneath
    const blobMat = new THREE.MeshBasicMaterial({
      color: 0x000000, transparent: true, opacity: 0.28, depthWrite: false,
    });
    const blob = new THREE.Mesh(new THREE.CircleGeometry(1.1, 7), blobMat);
    blob.rotation.x = -Math.PI / 2;
    blob.position.set(0, -1.9, 0);
    scene.add(blob);

    // ── Resize handler ─────────────────────────────────────────
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // ── RAF render loop (Three.js needs continuous rendering) ──
    let rafId, tick = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      tick += 0.008;

      // Gentle floating bob — independent of scroll
      ball.position.y = Math.sin(tick) * 0.07;
      blob.position.y = -1.93 - Math.sin(tick) * 0.05;
      blobMat.opacity = 0.18 + Math.sin(tick + Math.PI) * 0.07;
      blob.scale.setScalar(0.88 + Math.sin(tick + Math.PI) * 0.1);

      renderer.render(scene, camera);
    };
    animate();

    // ── GSAP ScrollTrigger — scroll-linked spin ────────────────
    // scrub: 1.5 → silky smooth, 1.5s lag behind finger/wheel
    const spinTween = gsap.to(ball.rotation, {
      y: Math.PI * 10,   // 5 full Y-axis spins across the full page
      x: Math.PI * 4,    // 2 full X-axis spins (forward tumble)
      ease: "none",      // linear scrub — GSAP handles easing via scroll velocity
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,          // smoothing lag in seconds
      },
    });

    // ── Cleanup ────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      spinTween.kill();
      // Only kill triggers owned by this component
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars?.trigger === document.documentElement) t.kill();
      });
      window.removeEventListener("resize", onResize);
      geo.dispose();
      mat.dispose();
      colorTex.dispose();
      roughTex.dispose();
      bumpTex.dispose();
      blobMat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,          // behind all page content
        pointerEvents: "none",     // scroll events pass through to the page
        overflow: "hidden",
        filter: "blur(3px)", // subtle depth-of-field background feel
      }}
    />
  );
}

export default SoccerBallBackground;
