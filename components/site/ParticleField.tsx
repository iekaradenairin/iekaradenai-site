'use client'

import { useEffect, useRef } from 'react'

/**
 * トップのヒーロー右側。最新作バーのあたりから、淡い光の帯が夜のほうへ浮かんでいく。
 * Claude Design 側は esm.sh から three を読んでいたが、静的エクスポート後に
 * 外部CDNへ依存したくないので npm の three を動的 import している（初期バンドルには乗らない）。
 *
 * 重ねているものは奥から順に3つ:
 * - 霞と差し込む光: ゆっくり流れる霞と、右上から差す淡い光
 * - 光の帯: 最新作バーの帯と同じ描き方（細い線・にじみ・消えていく面）。見える区間が昇っては消える
 * - 粒: 数は控えめ。ピント面（カメラから uFocus の距離）から外れた粒ほど、大きく淡いボケ玉になる
 * 帯も粒も、差し込む光を横切る所は明るく、外れた所は沈む（同じ式 shafts() を使う）。
 *
 * ポインタに対する追従は極端に鈍い（lerp 0.004）。水中で少し遅れて動く感じを出すため
 * デザイン側で意図的にこの値になっているので、速くしない。
 */

const TINT = 0xdcebff
const ACCENT = 0x8fb4ff
const WARM = 0xffead2
const HAZE = 0x2c55c4

/** 粒が上へ抜けて下から戻るまでの高さの半分 */
const HALF_HEIGHT = 4.75

/** デザイン上の基準の縦横比（660×920）。これより細い画面では粒を横に寄せて密度を保つ */
const BASE_ASPECT = 0.72

/** 光の帯1本を縦に何分割するか */
const VEIL_SEGMENTS = 180

// 光の帯。根元の横位置・昇るにつれて流れていく向き・奥行き・位相・幅
const VEILS = [
  { x: 0.2, fan: -1.5, z: 0.3, phase: 0, width: 0.9 },
  { x: 0.4, fan: 0.9, z: -1.2, phase: 2.3, width: 1.1 },
  { x: 0.3, fan: -0.5, z: 1.2, phase: 4.1, width: 0.7 },
  { x: 0.5, fan: 1.6, z: -2.6, phase: 5.6, width: 1.3 },
]

// 画面右上の外から差し込む光。uv はキャンバス内の 0〜1（左下が原点）
const SHAFTS_GLSL = `
  uniform float uTime; uniform float uAspect;
  float hash1(float n){ return fract(sin(n) * 43758.5453); }
  float noise1(float x){
    float i = floor(x); float f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(hash1(i), hash1(i + 1.0), f);
  }
  float shafts(vec2 uv){
    vec2 v = vec2(uv.x * uAspect, uv.y) - vec2(uAspect * 0.92, 1.38);
    float ang = atan(v.x, -v.y);
    float t = uTime * 0.035;
    float r = noise1(ang * 7.0 + t) * 0.72 + noise1(ang * 17.0 - t * 1.7) * 0.28;
    return smoothstep(0.4, 0.85, r) * exp(-length(v) * 1.15);
  }`

export function ParticleField({ count = 1100 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    let disposed = false
    let cleanup = () => {}

    void (async () => {
      const THREE = await import('three')
      if (disposed || !canvas.clientWidth || !canvas.clientHeight) return

      const w = canvas.clientWidth
      const h = canvas.clientHeight

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setSize(w, h, false)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 60)
      camera.position.set(0, 0, 7)

      const pos = new Float32Array(count * 3)
      const seed = new Float32Array(count)
      const scale = new Float32Array(count)
      const hue = new Float32Array(count)
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 7.2
        pos[i * 3 + 1] = (Math.random() - 0.5) * HALF_HEIGHT * 2
        // 半分はピント面の近くに集めて、くっきりした光点を残す。残りは手前から奥まで散らす
        pos[i * 3 + 2] = (Math.random() - 0.5) * (i % 2 ? 2.4 : 9)
        seed[i] = Math.random() * 6.283
        scale[i] = 0.35 + Math.random() * Math.random() * 1.5
        hue[i] = Math.random()
      }

      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
      geo.setAttribute('aScale', new THREE.BufferAttribute(scale, 1))
      geo.setAttribute('aHue', new THREE.BufferAttribute(hue, 1))

      // 霞と粒子で同じ uniform を共有する
      const uniforms = {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uAspect: { value: w / h },
        uSpread: { value: 1 },
        uFloor: { value: 0.12 },
        uFocus: { value: 7 },
        uTint: { value: new THREE.Color(TINT) },
        uAccent: { value: new THREE.Color(ACCENT) },
        uWarm: { value: new THREE.Color(WARM) },
        uHaze: { value: new THREE.Color(HAZE) },
        uPix: { value: renderer.getPixelRatio() },
      }

      const haze = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({
          uniforms,
          transparent: true,
          depthTest: false,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          vertexShader: `
            varying vec2 vUv;
            void main(){
              vUv = uv;
              gl_Position = vec4(position.xy, 0.0, 1.0);
            }`,
          fragmentShader: `
            ${SHAFTS_GLSL}
            uniform vec2 uMouse; uniform vec3 uTint; uniform vec3 uHaze;
            varying vec2 vUv;
            float hash(vec2 p){
              p = fract(p * vec2(123.34, 456.21));
              p += dot(p, p + 45.32);
              return fract(p.x * p.y);
            }
            float vnoise(vec2 p){
              vec2 i = floor(p); vec2 f = fract(p);
              f = f * f * (3.0 - 2.0 * f);
              return mix(
                mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
                f.y);
            }
            float fbm(vec2 p){
              float a = 0.5; float s = 0.0;
              for (int i = 0; i < 4; i++) {
                s += a * vnoise(p);
                p = p * 2.03 + vec2(17.1, 9.2);
                a *= 0.5;
              }
              return s;
            }
            void main(){
              vec2 p = vec2(vUv.x * uAspect, vUv.y) + uMouse * 0.03;
              float t = uTime * 0.018;
              vec2 q = p * 1.35 + vec2(t * 0.5, -t);
              // 霞そのものを別のノイズで歪ませて、煙のような流れにする
              float warp = fbm(q * 1.6 + vec2(-t * 0.7, t * 0.4));
              float mist = smoothstep(0.36, 0.86, fbm(q + warp * 0.9));
              float sh = shafts(vUv);
              // 左は見出しに被るので消す。下は最新作バーへ向けて沈める
              float edge = smoothstep(0.0, 0.55, vUv.x) * smoothstep(0.0, 0.24, vUv.y);
              float a = (mist * 0.11 + sh * (0.1 + mist * 0.16)) * edge;
              vec3 col = mix(uHaze, uTint, clamp(sh * 1.5 + mist * 0.18, 0.0, 1.0));
              // 暗い面の淡いグラデーションは縞になりやすいので、1階調ぶん散らす
              a += (hash(gl_FragCoord.xy) - 0.5) * 0.008 * edge;
              gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
            }`,
        }),
      )
      haze.frustumCulled = false
      haze.renderOrder = -1
      scene.add(haze)

      const mat = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: `
          ${SHAFTS_GLSL}
          uniform vec2 uMouse; uniform float uPix; uniform float uSpread; uniform float uFocus;
          uniform vec3 uTint; uniform vec3 uAccent; uniform vec3 uWarm;
          attribute float aSeed; attribute float aScale; attribute float aHue;
          varying float vAlpha; varying float vDisc; varying vec3 vCol;
          void main(){
            vec3 p = position;
            p.x *= uSpread;
            float t = uTime * 0.11;
            p.y = mod(p.y + uTime * (0.03 + aScale * 0.022) + ${HALF_HEIGHT.toFixed(2)}, ${(HALF_HEIGHT * 2).toFixed(2)}) - ${HALF_HEIGHT.toFixed(2)};
            float wrap = smoothstep(0.0, 1.0, ${HALF_HEIGHT.toFixed(2)} - abs(p.y));
            // 昇りながら横へ蛇行する。近くの粒は似た向きに流れるので、水の流れに見える
            vec3 f = vec3(
              sin(p.y * 0.52 + t * 0.9 + position.z * 0.6) + 0.45 * sin(p.y * 1.37 - t * 0.63 + aSeed),
              0.4 * sin(position.x * 0.8 + t * 0.5 + aSeed),
              cos(p.y * 0.44 + t * 0.7 + position.x * 0.5) + 0.4 * cos(t * 0.9 + aSeed * 1.7));
            p += f * vec3(0.34, 0.2, 0.3);
            p.x += uMouse.x * (0.22 + aScale * 0.16);
            p.y += uMouse.y * (0.14 + aScale * 0.1);
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;

            // 被写界深度。ピント面から外れるほど大きくし、そのぶん薄くする
            float d = max(-mv.z, 0.6);
            float size = max(aScale * 15.0 / d, 1.0);
            float blur = max(abs(d - uFocus) / d - 0.06, 0.0) * 24.0;
            float s = min(size + blur, 96.0);
            float soft = clamp(blur / (size + blur), 0.0, 1.0);
            // 手前で大きくぼけた粒だけ、縁のあるボケ玉として描く
            vDisc = smoothstep(9.0, 26.0, s);
            gl_PointSize = s * uPix;

            vec2 uv = gl_Position.xy / gl_Position.w * 0.5 + 0.5;
            float twinkle = 0.74 + 0.26 * sin(uTime * (0.35 + fract(aSeed * 7.13) * 0.9) + aSeed * 31.0);
            vAlpha = 2.1 * pow(size / s, 1.2)
              * mix(twinkle, 1.0, soft)
              * (0.78 + shafts(uv) * 2.2)
              * smoothstep(13.0, 3.0, d) * smoothstep(0.8, 2.4, d)
              * smoothstep(0.0, 0.3, uv.x)
              * (1.0 - 0.35 * vDisc)
              * wrap;

            vec3 c = mix(uTint, uAccent, smoothstep(0.55, 0.9, aHue));
            c = mix(c, uWarm, step(0.965, aHue));
            vCol = mix(c, uAccent, max(soft * 0.25, vDisc * 0.6));
          }`,
        fragmentShader: `
          varying float vAlpha; varying float vDisc; varying vec3 vCol;
          void main(){
            float r = length(gl_PointCoord - 0.5) * 2.0;
            if (r > 1.0) discard;
            // 小さな粒は芯のある光点、大きくぼけた粒は縁がわずかに明るいボケ玉
            float core = pow(1.0 - r, 1.7);
            float disc = smoothstep(1.0, 0.7, r) * (0.72 + 0.28 * r * r);
            gl_FragColor = vec4(vCol, clamp(mix(core, disc, vDisc) * vAlpha, 0.0, 1.0));
          }`,
      })

      const points = new THREE.Points(geo, mat)

      // 光の帯。最新作バーの帯と同じ描き方（細い線・にじみ・消えていく面）で、
      // バーのすぐ上から夜のほうへ浮かんでいく。位置はすべて頂点シェーダで作るので、
      // ここでは「帯のどこか（長さ方向 s・幅方向 v）」と帯ごとの値だけを持たせる
      const sv: number[] = []
      const ribbon: number[] = []
      const width: number[] = []
      const index: number[] = []
      VEILS.forEach((r, k) => {
        const base = k * (VEIL_SEGMENTS + 1) * 2
        for (let i = 0; i <= VEIL_SEGMENTS; i++) {
          for (let v = 0; v < 2; v++) {
            sv.push(i / VEIL_SEGMENTS, v)
            ribbon.push(r.x, r.fan, r.z, r.phase)
            width.push(r.width)
          }
          if (i < VEIL_SEGMENTS) {
            const a = base + i * 2
            index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
          }
        }
      })
      const veilGeo = new THREE.BufferGeometry()
      // position は使わないが、three が頂点数を数えるのに要る
      veilGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array((sv.length / 2) * 3), 3))
      veilGeo.setAttribute('aSv', new THREE.BufferAttribute(new Float32Array(sv), 2))
      veilGeo.setAttribute('aRibbon', new THREE.BufferAttribute(new Float32Array(ribbon), 4))
      veilGeo.setAttribute('aWidth', new THREE.BufferAttribute(new Float32Array(width), 1))
      veilGeo.setIndex(index)

      const veilMat = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        extensions: { derivatives: true },
        vertexShader: `
          ${SHAFTS_GLSL}
          uniform vec2 uMouse; uniform float uSpread; uniform float uFocus; uniform float uFloor;
          attribute vec2 aSv; attribute vec4 aRibbon; attribute float aWidth;
          varying float vV; varying float vFade; varying float vSoft;
          void main(){
            float s = aSv.x;
            float ph = aRibbon.w;
            // 根元はまとまり、昇るほど揺れが大きくなってほどけていく。
            // 揺れの山は上へ送られるので、帯そのものが昇っていくように見える
            float amp = 0.08 + 0.62 * s;
            vec3 c = vec3(
              aRibbon.x + aRibbon.y * pow(s, 1.3)
                + amp * (0.6 * sin(s * 4.2 - uTime * 0.07 + ph) + 0.4 * sin(s * 7.9 - uTime * 0.1 + ph * 1.9)),
              mix(-3.7, 3.7, s),
              aRibbon.z + amp * 0.9 * cos(s * 3.4 - uTime * 0.06 + ph * 1.3));
            c.x *= uSpread;
            // 幅の向きを長さに沿ってねじる。こちらを向いた所は面が見え、横を向いた所は線だけになる
            float th = ph * 2.0 + s * 2.6 + 0.9 * sin(s * 3.1 - uTime * 0.05 + ph);
            vec3 p = c + vec3(cos(th), 0.12 * sin(th * 1.7), sin(th)) * (aSv.y * aWidth * (0.3 + 0.7 * s));
            p.x += uMouse.x * 0.3;
            p.y += uMouse.y * 0.18;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;

            float d = max(-mv.z, 0.6);
            vSoft = clamp(abs(d - uFocus) / d * 2.4, 0.0, 1.0);
            vec2 uv = gl_Position.xy / gl_Position.w * 0.5 + 0.5;
            // 帯は全長が見えているのではなく、見える区間がゆっくり昇っては消える
            float pulse = 0.06 + 0.94 * smoothstep(0.15, 0.95, 0.5 + 0.5 * sin(s * 5.5 - uTime * 0.09 + ph * 3.0));
            // 細い画面ではキャンバスが見出しや本文に重なるので、右端だけに残す
            float narrow = 1.0 - clamp((uAspect - 0.25) / 0.4, 0.0, 1.0);
            vFade = smoothstep(0.1, 0.4, s) * smoothstep(0.98, 0.6, s)
              * pulse
              * (0.7 + shafts(uv) * 1.6)
              * smoothstep(0.0, mix(0.3, 0.8, narrow), uv.x)
              // 最新作バーの上端から立ちのぼるように、バーの高さに合わせて下を消す
              * smoothstep(uFloor, uFloor + 0.24, uv.y);
            vV = aSv.y;
          }`,
        fragmentShader: `
          uniform vec3 uTint; uniform vec3 uAccent;
          varying float vV; varying float vFade; varying float vSoft;
          void main(){
            // 縁のすぐ内側に細い線を1本。ピントから外れた帯は線を太く淡くしてぼかす
            float e = vV - 0.05;
            float px = fwidth(vV);
            float line = 1.0 - smoothstep(px * 0.4, px * mix(1.4, 5.0, vSoft), abs(e));
            float glow = exp(-abs(e) * 10.0) * 0.1;
            // 線から離れるほど消えていく面
            float veil = step(0.0, e) * pow(1.0 - vV, 2.4) * 0.07;
            float a = (line * mix(0.19, 0.07, vSoft) + glow + veil) * smoothstep(0.0, 0.04, vV) * vFade;
            gl_FragColor = vec4(mix(uAccent, uTint, line * 0.55), clamp(a, 0.0, 1.0));
          }`,
      })
      const veils = new THREE.Mesh(veilGeo, veilMat)
      veils.frustumCulled = false

      // 帯の上に粒を重ねる
      const drift = new THREE.Group()
      drift.add(veils, points)
      scene.add(drift)

      const target = { x: 0, y: 0 }
      const cur = { x: 0, y: 0 }
      const onMove = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect()
        target.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1))
        target.y = Math.max(-1, Math.min(1, -(((e.clientY - r.top) / r.height) * 2 - 1)))
      }

      // ヒーロー下端の最新作バー。キャンバスはバーの裏まで続いているので、高さを測って帯の根元を合わせる
      const floorEl = canvas.closest('[data-hero]')?.querySelector<HTMLElement>('[data-hero-floor]') ?? null

      const fit = (nw: number, nh: number) => {
        uniforms.uAspect.value = nw / nh
        uniforms.uSpread.value = Math.max(0.6, Math.min(1.3, nw / nh / BASE_ASPECT))
        if (floorEl) uniforms.uFloor.value = Math.min(0.6, floorEl.offsetHeight / nh)
      }
      fit(w, h)

      const resize = () => {
        const nw = canvas.clientWidth
        const nh = canvas.clientHeight
        if (!nw || !nh) return
        camera.aspect = nw / nh
        camera.updateProjectionMatrix()
        renderer.setSize(nw, nh, false)
        fit(nw, nh)
      }
      const ro = new ResizeObserver(resize)
      ro.observe(canvas)
      if (floorEl) ro.observe(floorEl)

      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      let raf = 0
      let visible = true
      const frame = () => {
        raf = 0
        const now = performance.now() / 1000
        cur.x += (target.x - cur.x) * 0.004
        cur.y += (target.y - cur.y) * 0.004
        uniforms.uTime.value = now
        uniforms.uMouse.value.set(cur.x, cur.y)
        // ポインタが止まっていても視点をわずかに揺らし、手前と奥のずれで奥行きを見せる
        const swayX = Math.sin(now * 0.07) * 0.2
        const swayY = Math.sin(now * 0.05 + 1.3) * 0.12
        drift.rotation.y = cur.x * 0.12 + swayX * 0.2
        camera.position.x = cur.x * 0.35 + swayX
        camera.position.y = cur.y * 0.28 + swayY
        camera.lookAt(0, 0, 0)
        renderer.render(scene, camera)
        if (!still && visible) raf = requestAnimationFrame(frame)
      }

      // ヒーローが画面外へ出ている間は描かない
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        if (visible && !still && !raf) raf = requestAnimationFrame(frame)
      })
      io.observe(canvas)

      if (!still) window.addEventListener('pointermove', onMove)
      frame()

      cleanup = () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        io.disconnect()
        window.removeEventListener('pointermove', onMove)
        geo.dispose()
        mat.dispose()
        veilGeo.dispose()
        veilMat.dispose()
        haze.geometry.dispose()
        haze.material.dispose()
        renderer.dispose()
      }
    })()

    return () => {
      disposed = true
      cleanup()
    }
  }, [count])

  return <canvas ref={ref} className="block h-full w-full" aria-hidden="true" />
}

export default ParticleField
