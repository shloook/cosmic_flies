// createSparkTexture: radial glow sprite for stronger particle glow
function createSparkTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();
  const cx = size / 2;
  const grad = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx);
  grad.addColorStop(0.0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.15, 'rgba(200,245,255,0.95)');
  grad.addColorStop(0.35, 'rgba(135,206,235,0.7)'); // sky-blue core
  grad.addColorStop(1.0, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.Texture(canvas);
  tex.needsUpdate = true;
  return tex;
}

let scene, camera, renderer, leftWing, rightWing;
// add globals for cursor interaction
const raycaster = new THREE.Raycaster();
const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const mouse = new THREE.Vector2(9999, 9999);
const mouseWorld = new THREE.Vector3();
let mouseActive = false;

const img = new Image();
img.src = "dd.webp"; // white-on-black silhouette
img.onload = () => init(img);

function init(image) {
  scene = new THREE.Scene();
  // mouse / touch listeners (update normalized device coords)
  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    mouseActive = true;
  }, { passive: true });
  window.addEventListener('mouseleave', () => { mouseActive = false; }, { passive: true });
  window.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    mouse.x = (t.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (t.clientY / window.innerHeight) * 2 + 1;
    mouseActive = true;
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    mouse.x = (t.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (t.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });
  window.addEventListener('touchend', () => { mouseActive = false; }, { passive: true });

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5.8; // slightly closer to make butterfly appear bigger

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const hiddenCanvas = document.createElement("canvas");
  const ctx = hiddenCanvas.getContext("2d");
  hiddenCanvas.width = 200;
  hiddenCanvas.height = 200;
  ctx.drawImage(image, 0, 0, hiddenCanvas.width, hiddenCanvas.height);

  const imgData = ctx.getImageData(0, 0, hiddenCanvas.width, hiddenCanvas.height);

  const leftPositions = [];
  const rightPositions = [];
  const threshold = 200;
  // Increase density: keep all bright pixels and duplicate each point to create a denser field.
  // duplicates = 8 (was 4) — ~2x more particles than before
  const duplicates = 8;
  const jitter = 0.12; // positional jitter per duplicate (tweak to taste)

  for (let y = 0; y < hiddenCanvas.height; y++) {
    for (let x = 0; x < hiddenCanvas.width; x++) {
      const i = (y * hiddenCanvas.width + x) * 4;
      const brightness = imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2];
      if (brightness > threshold) {
        // duplicate the pixel several times with slight jitter so particles don't perfectly overlap
        const baseX = (x / hiddenCanvas.width - 0.5) * 6;
        const baseY = -(y / hiddenCanvas.height - 0.5) * 6;
        for (let d = 0; d < duplicates; d++) {
          const px = baseX + (Math.random() - 0.5) * jitter;
          const py = baseY + (Math.random() - 0.5) * (jitter * 0.6);
          const pz = (Math.random() - 0.5) * 0.35;
          if (px < 0) leftPositions.push(px, py, pz);
          else rightPositions.push(px, py, pz);
        }
      }
    }
  }

  // create sprite texture for glow
  const sprite = createSparkTexture();

  // Left wing - create typed arrays and store original positions + per-particle phase
  const leftArr = new Float32Array(leftPositions);
  const leftGeom = new THREE.BufferGeometry();
  leftGeom.setAttribute('position', new THREE.BufferAttribute(leftArr, 3));
  leftGeom.setAttribute('origPos', new THREE.BufferAttribute(new Float32Array(leftArr), 3));
  const leftCount = leftArr.length / 3;
  const leftPhase = new Float32Array(leftCount);
  for (let i = 0; i < leftCount; i++) leftPhase[i] = Math.random() * Math.PI * 2;
  leftGeom.setAttribute('phase', new THREE.BufferAttribute(leftPhase, 1));

  const material = new THREE.PointsMaterial({
    color: 0x87CEEB,        // sky blue
    map: sprite,            // glow sprite
    size: 0.02,             // a bit larger so glow is visible
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  leftWing = new THREE.Points(leftGeom, material);
  leftWing.scale.setScalar(1.6); // make wings bigger
  scene.add(leftWing);

  // Right wing - mirror of left with its own arrays
  const rightArr = new Float32Array(rightPositions);
  const rightGeom = new THREE.BufferGeometry();
  rightGeom.setAttribute('position', new THREE.BufferAttribute(rightArr, 3));
  rightGeom.setAttribute('origPos', new THREE.BufferAttribute(new Float32Array(rightArr), 3));
  const rightCount = rightArr.length / 3;
  const rightPhase = new Float32Array(rightCount);
  for (let i = 0; i < rightCount; i++) rightPhase[i] = Math.random() * Math.PI * 2;
  rightGeom.setAttribute('phase', new THREE.BufferAttribute(rightPhase, 1));

  rightWing = new THREE.Points(rightGeom, material.clone());
  rightWing.scale.setScalar(1.6);
  scene.add(rightWing);

  window.addEventListener("resize", onWindowResize, false);
  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now() * 0.0015;
  const flap = Math.sin(time * 1.2) * 0.55; // flap amplitude
  const danceSpeed = 3.5;

  // update mouse world position (intersect ray with z=0 plane)
  let haveMouseWorld = false;
  if (mouseActive) {
    raycaster.setFromCamera(mouse, camera);
    const hit = raycaster.ray.intersectPlane(planeZ, mouseWorld);
    if (hit) haveMouseWorld = true;
  }

  if (leftWing && rightWing) {
    // wing rotation
    leftWing.rotation.y = flap * 0.9;
    rightWing.rotation.y = -flap * 0.9;

    // animate left wing particle positions (dance)
    const lPos = leftWing.geometry.attributes.position.array;
    const lOrig = leftWing.geometry.attributes.origPos.array;
    const lPhase = leftWing.geometry.attributes.phase.array;
    for (let v = 0, vi = 0; v < lPhase.length; v++, vi += 3) {
      const ox = lOrig[vi], oy = lOrig[vi + 1], oz = lOrig[vi + 2];
      const p = lPhase[v];
      const edge = Math.min(Math.abs(ox) / 3.0, 1.0);
      const flapOffset = Math.sin(time * 5.0 + p) * 0.035 * (0.6 + edge);
      const jitter = Math.cos(time * danceSpeed + p * 1.7) * (0.015 + edge * 0.02);

      // cursor influence (repel with falloff, animated pulse)
      let cursorDX = 0, cursorDY = 0, cursorDZ = 0;
      if (haveMouseWorld) {
        const dx = ox - mouseWorld.x;
        const dy = oy - mouseWorld.y;
        const dz = oz - mouseWorld.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 1e-6;
        const radius = 1.1 + 1.5 * edge; // influence radius
        const baseStrength = 0.45; // overall strength
        const fall = Math.exp(- (dist * dist) / (radius * radius)); // gaussian falloff
        // pulse the influence with time and per-particle phase
        const pulse = 0.6 + 0.4 * Math.sin(time * 12.0 + p * 1.3);
        const influence = baseStrength * fall * pulse;
        // repel direction (normalized vector from mouse to particle)
        cursorDX = (dx / dist) * influence;
        cursorDY = (dy / dist) * influence;
        cursorDZ = (dz / dist) * influence;
      }

      lPos[vi]   = ox + flapOffset + cursorDX;
      lPos[vi + 1] = oy + Math.sin(time * 2.2 + p) * 0.01 + cursorDY; // vertical breathing
      lPos[vi + 2] = oz + jitter - edge * 0.02 + cursorDZ;
    }
    leftWing.geometry.attributes.position.needsUpdate = true;

    // animate right wing particle positions (mirror-ish dance)
    const rPos = rightWing.geometry.attributes.position.array;
    const rOrig = rightWing.geometry.attributes.origPos.array;
    const rPhase = rightWing.geometry.attributes.phase.array;
    for (let v = 0, vi = 0; v < rPhase.length; v++, vi += 3) {
      const ox = rOrig[vi], oy = rOrig[vi + 1], oz = rOrig[vi + 2];
      const p = rPhase[v];
      const edge = Math.min(Math.abs(ox) / 3.0, 1.0);
      const flapOffset = Math.sin(time * 5.0 + p) * 0.035 * (0.6 + edge);
      const jitter = Math.cos(time * danceSpeed + p * 1.7) * (0.015 + edge * 0.02);

      // cursor influence (mirror repel)
      let cursorDX = 0, cursorDY = 0, cursorDZ = 0;
      if (haveMouseWorld) {
        const dx = ox - mouseWorld.x;
        const dy = oy - mouseWorld.y;
        const dz = oz - mouseWorld.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 1e-6;
        const radius = 1.1 + 1.5 * edge;
        const baseStrength = 0.45;
        const fall = Math.exp(- (dist * dist) / (radius * radius));
        const pulse = 0.6 + 0.4 * Math.sin(time * 12.0 + p * 1.1);
        const influence = baseStrength * fall * pulse;
        cursorDX = (dx / dist) * influence;
        cursorDY = (dy / dist) * influence;
        cursorDZ = (dz / dist) * influence;
      }

      rPos[vi]   = ox - flapOffset + cursorDX;
      rPos[vi + 1] = oy + Math.sin(time * 2.2 + p) * 0.01 + cursorDY;
      rPos[vi + 2] = oz + jitter + edge * 0.02 + cursorDZ;
    }
    rightWing.geometry.attributes.position.needsUpdate = true;
  }

  renderer.render(scene, camera);
}

