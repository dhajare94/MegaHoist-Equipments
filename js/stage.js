import * as THREE from 'three';

const STEEL = 0xd7dbe0;
const DARK = 0x3c4652;
const ORANGE = 0xff8200;
const DECK = 0xf7f8fa;
const WALL = 0xb7c3ce;

function mat(color, metal = 0.45, rough = 0.42) {
  return new THREE.MeshStandardMaterial({ color, metalness: metal, roughness: rough });
}

function box(w, h, d, material, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = false;
  return mesh;
}

function rspModel() {
  const root = new THREE.Group();
  const steel = mat(STEEL, 0.55, 0.38);
  const dark = mat(DARK, 0.62, 0.4);
  const orange = mat(ORANGE, 0.28, 0.46);
  const deck = mat(DECK, 0.15, 0.62);
  const wall = mat(WALL, 0.05, 0.85);

  root.add(box(1.15, 0.1, 1.15, steel, 0, 0.05, 0));
  root.add(box(0.9, 0.06, 0.16, dark, -0.55, 0.08, 0.28));
  root.add(box(0.9, 0.06, 0.16, dark, -0.55, 0.08, -0.28));
  root.add(box(0.32, 4.35, 0.36, steel, 0, 2.22, 0));
  for (let i = 0; i < 11; i++) root.add(box(0.07, 0.055, 0.2, dark, 0.2, 0.45 + i * 0.36, 0));

  const carriage = new THREE.Group();
  carriage.add(box(0.58, 0.66, 0.5, orange, 0.02, 0, 0));
  carriage.add(box(2.35, 0.08, 1.08, deck, 1.32, -0.22, 0));
  carriage.add(box(2.28, 0.06, 0.04, steel, 1.32, -0.12, 0.52));
  carriage.add(box(2.28, 0.06, 0.04, steel, 1.32, -0.12, -0.52));
  carriage.add(box(0.04, 0.92, 0.04, steel, 0.28, 0.28, 0.5));
  carriage.add(box(0.04, 0.92, 0.04, steel, 0.28, 0.28, -0.5));
  carriage.add(box(0.04, 0.92, 0.04, steel, 2.42, 0.28, 0.5));
  carriage.add(box(0.04, 0.92, 0.04, steel, 2.42, 0.28, -0.5));
  carriage.add(box(2.14, 0.04, 0.04, steel, 1.35, 0.72, 0.5));
  carriage.add(box(2.14, 0.04, 0.04, steel, 1.35, 0.72, -0.5));
  carriage.add(box(2.14, 0.035, 0.035, steel, 1.35, 0.28, 0.5));
  carriage.add(box(2.14, 0.035, 0.035, steel, 1.35, 0.28, -0.5));
  carriage.add(box(0.04, 0.04, 1.0, steel, 2.42, 0.72, 0));
  carriage.position.y = 1.35;
  root.add(carriage);

  const slab = box(0.18, 3.4, 2.4, wall, -0.7, 1.8, 0);
  root.add(slab);
  root.userData.carriage = carriage;
  return root;
}

function scaffoldModel() {
  const root = new THREE.Group();
  const steel = mat(STEEL, 0.5, 0.4);
  const orange = mat(ORANGE, 0.25, 0.5);
  const levels = [];
  const bays = 3;
  const lifts = 4;
  for (let y = 0; y < lifts; y++) {
    const level = new THREE.Group();
    for (let x = 0; x <= bays; x++) {
      level.add(box(0.07, 1.05, 0.07, steel, x * 0.95, 0.52, 0));
      level.add(box(0.07, 1.05, 0.07, steel, x * 0.95, 0.52, 0.85));
    }
    for (let x = 0; x < bays; x++) {
      level.add(box(0.9, 0.05, 0.05, steel, x * 0.95 + 0.47, 0.95, 0));
      level.add(box(0.9, 0.05, 0.05, steel, x * 0.95 + 0.47, 0.95, 0.85));
      level.add(box(0.9, 0.04, 0.55, mat(DECK, 0.1, 0.7), x * 0.95 + 0.47, 0.12, 0.42));
      level.add(box(0.08, 0.08, 0.08, orange, x * 0.95, 0.95, 0));
    }
    level.position.y = y * 1.02;
    level.scale.y = 0.02;
    root.add(level);
    levels.push(level);
  }
  root.position.set(-1.4, 0, -0.4);
  root.userData.levels = levels;
  return root;
}

function fit(renderer, camera, host) {
  const w = Math.max(2, host.clientWidth);
  const h = Math.max(2, host.clientHeight);
  if (renderer.domElement.width !== Math.floor(w * renderer.getPixelRatio()) || host.dataset.sized !== `${w}x${h}`) {
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    host.dataset.sized = `${w}x${h}`;
  }
}

function seen(host, rect) {
  return rect.bottom > 40 && rect.top < window.innerHeight - 20 && rect.width > 8;
}

function progress(el) {
  const r = el.getBoundingClientRect();
  const span = r.height + window.innerHeight * 0.65;
  return Math.min(1, Math.max(0, (window.innerHeight * 0.72 - r.top) / span));
}

function mount(host) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  } catch (e) {
    canvas.remove();
    return null;
  }
  if (!renderer.getContext()) {
    canvas.remove();
    return null;
  }
  renderer.setClearColor(0xf6f9fc, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
  camera.position.set(4.2, 2.4, 6.2);
  scene.add(new THREE.AmbientLight(0xf4f7fb, 0.72));
  const sun = new THREE.DirectionalLight(0xfff6ea, 1.35);
  sun.position.set(4, 8, 5);
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xc5d4e4, 0.45);
  fill.position.set(-4, 2, -3);
  scene.add(fill);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(3.2, 40), mat(0xd5dee6, 0.02, 0.9));
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const kind = host.dataset.stage;
  const model = kind === 'scaffold' ? scaffoldModel() : rspModel();
  scene.add(model);
  const pivot = new THREE.Group();
  scene.remove(model);
  pivot.add(model);
  scene.add(pivot);

  let yaw = kind === 'scaffold' ? -0.4 : 0.55;
  let dragging = false;
  let lastX = 0;
  if (kind === 'orbit') {
    canvas.style.touchAction = 'none';
    canvas.addEventListener('pointerdown', (e) => {
      dragging = true;
      lastX = e.clientX;
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      yaw += (e.clientX - lastX) * 0.008;
      lastX = e.clientX;
    });
    const up = () => { dragging = false; };
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
  }

  let ready = false;
  let failed = false;
  renderer.debug.onShaderError = () => { failed = true; };
  const varied = () => {
    const gl = renderer.getContext();
    const w = gl.drawingBufferWidth;
    const h = gl.drawingBufferHeight;
    if (w < 2 || h < 2) return false;
    const pix = new Uint8Array(4);
    const seen = new Set();
    for (const [x, y] of [[0.35, 0.45], [0.5, 0.5], [0.62, 0.58], [0.48, 0.72], [0.7, 0.4], [0.42, 0.33]]) {
      gl.readPixels((x * (w - 1)) | 0, (y * (h - 1)) | 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pix);
      seen.add((pix[0] >> 4) + ',' + (pix[1] >> 4) + ',' + (pix[2] >> 4));
    }
    return seen.size >= 2;
  };
  return {
    draw(t) {
      if (failed) return;
      const rect = host.getBoundingClientRect();
      if (ready && !seen(host, rect)) return;
      fit(renderer, camera, host);
      if (kind === 'orbit') {
        if (!dragging) yaw += 0.0035;
        pivot.rotation.y = yaw;
        model.userData.carriage.position.y = 1.15 + Math.sin(t * 0.6) * 0.18;
      } else if (kind === 'climb') {
        const p = progress(host.closest('section') || host);
        pivot.rotation.y = 0.5 + p * 0.35;
        model.userData.carriage.position.y = 0.7 + p * 2.5;
      } else {
        const section = host.closest('section') || host;
        const on = section.querySelector('.mo-pc__step.is-on');
        const steps = [...section.querySelectorAll('.mo-pc__step')];
        const idx = Math.max(0, steps.indexOf(on));
        const p = Math.max(progress(section), (idx + 1) / Math.max(1, steps.length));
        pivot.rotation.y = -0.35 + p * 0.5;
        model.userData.levels.forEach((level, i) => {
          const reveal = i === 0 ? 1 : Math.min(1, Math.max(0, (p * (model.userData.levels.length - 1)) - (i - 1)));
          level.scale.y = 0.04 + reveal * 0.96;
          level.position.y = i * 1.02 * (i === 0 ? 1 : reveal);
        });
      }
      camera.lookAt(0, 1.5, 0);
      renderer.render(scene, camera);
      if (!ready) {
        if (failed || !varied()) {
          failed = true;
          renderer.dispose();
          canvas.remove();
          return;
        }
        ready = true;
        host.classList.add('is-live');
      }
    },
  };
}

export function mountAll() {
  const jobs = [];
  document.querySelectorAll('[data-stage]').forEach((host) => {
    const job = mount(host);
    if (job) jobs.push(job);
  });
  if (!jobs.length) return;
  const loop = (now) => {
    const t = now * 0.001;
    for (const job of jobs) job.draw(t);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
