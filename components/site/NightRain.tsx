'use client'

import { useEffect, useRef } from 'react'

/**
 * トップのヒーロー右側。夜の水面に、しとしと雨が降っている。
 * 斜め上から見下ろした水面に細い雨が落ち、落ちた所から水紋が広がって消える。
 * 奥は淡い霞に溶ける。水平線は置かない。
 *
 * 水紋の広がり方（二重の輪・減速しながら広がる・二乗で消える）は RippleCanvas と同じ式。
 * あちらは真上から見た平面、こちらは同じ水紋を斜めから見たもの。
 *
 * Claude Design 側は esm.sh から three を読んでいたが、静的エクスポート後に
 * 外部CDNへ依存したくないので npm の three を動的 import している（初期バンドルには乗らない）。
 *
 * ポインタに対する追従は極端に鈍い（lerp 0.004）。少し遅れて動く感じを出すため
 * デザイン側で意図的にこの値になっているので、速くしない。
 */

const RING = 0xcde6ff
const TINT = 0xdcebff
const HAZE = 0x2c55c4

/** 水面の高さ */
const SURFACE = -1.5

/** 同時に空中にある雨粒の数。しとしと降る程度に抑える */
const DROPS = 18

/** 同時に描ける水紋の数。古いものから上書きする */
const RIPPLES = 56

/** 雨粒が落ちる奥行きの範囲（カメラからの距離）。左右は、その距離で画面に入る幅に合わせる */
const FIELD = { near: 3.5, far: 17 }

/** カメラの位置（z）と画角。雨粒を画面に入る範囲へ落とすのにも使う */
const CAMERA_Z = 7
const FOV = 42

type Drop = { x: number; z: number; y: number; speed: number; len: number; alpha: number }

export function NightRain() {
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
      const camera = new THREE.PerspectiveCamera(FOV, w / h, 0.1, 60)

      const uniforms = {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uAspect: { value: w / h },
        uRes: { value: new THREE.Vector2(1, 1) },
        uFloor: { value: 0.12 },
        uRing: { value: new THREE.Color(RING) },
        uTint: { value: new THREE.Color(TINT) },
        uHaze: { value: new THREE.Color(HAZE) },
      }

      // キャンバス内の位置で薄める共通の式。uv は 0〜1（左下が原点）
      const EDGE_GLSL = `
        uniform float uAspect; uniform float uFloor;
        float edgeFade(vec2 uv){
          // 細い画面ではキャンバスが見出しや本文に重なるので、右端だけに残す
          float narrow = 1.0 - clamp((uAspect - 0.25) / 0.4, 0.0, 1.0);
          return smoothstep(0.0, mix(0.34, 0.8, narrow), uv.x)
            // 最新作バーの裏へは描かない
            * smoothstep(uFloor - 0.01, uFloor + 0.1, uv.y);
        }`

      // --- 霞。雨の夜の、どこから来ているのか分からない淡い明るさ ---
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
            uniform float uTime; uniform float uAspect;
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
              float t = uTime * 0.014;
              vec2 q = p * 1.35 + vec2(t * 0.5, -t * 0.3);
              // 霞そのものを別のノイズで歪ませて、煙のような流れにする
              float warp = fbm(q * 1.6 + vec2(-t * 0.7, t * 0.4));
              float mist = smoothstep(0.36, 0.86, fbm(q + warp * 0.9));
              // 奥（画面の上のほう）ほど明るい。光源の形は作らず、広くにじませる
              vec2 g = (p - vec2(uAspect * 0.66, 0.84)) * vec2(0.9, 1.25);
              float glow = exp(-dot(g, g) * 2.2);
              // 左は見出しに被るので消す。下は最新作バーへ向けて沈める
              float edge = smoothstep(0.0, 0.55, vUv.x) * smoothstep(0.0, 0.24, vUv.y);
              float a = (mist * 0.085 + glow * (0.05 + mist * 0.11)) * edge;
              vec3 col = mix(uHaze, uTint, clamp(glow * 0.3 + mist * 0.14, 0.0, 1.0));
              // 暗い面の淡いグラデーションは縞になりやすいので、1階調ぶん散らす
              a += (hash(gl_FragCoord.xy) - 0.5) * 0.008 * edge;
              gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
            }`,
        }),
      )
      haze.frustumCulled = false
      haze.renderOrder = -1
      scene.add(haze)

      // --- 水紋。水面に寝かせた四角を1つの水紋ごとに置き、その中に輪を描く ---
      const rippleGeo = new THREE.InstancedBufferGeometry()
      rippleGeo.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array([-1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1]), 3),
      )
      rippleGeo.setIndex([0, 2, 1, 0, 3, 2])
      // x, z, 落ちた時刻, 消えるまでの秒数。落ちた時刻を遠い過去にしておけば描かれない
      const rippleDrop = new THREE.InstancedBufferAttribute(new Float32Array(RIPPLES * 4), 4)
      // 広がりきったときの半径, 濃さ
      const rippleShape = new THREE.InstancedBufferAttribute(new Float32Array(RIPPLES * 2), 2)
      for (let i = 0; i < RIPPLES; i++) rippleDrop.setXYZW(i, 0, 0, -1000, 1)
      rippleDrop.setUsage(THREE.DynamicDrawUsage)
      rippleShape.setUsage(THREE.DynamicDrawUsage)
      rippleGeo.setAttribute('aDrop', rippleDrop)
      rippleGeo.setAttribute('aShape', rippleShape)
      rippleGeo.instanceCount = RIPPLES

      const rippleMat = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        extensions: { derivatives: true },
        vertexShader: `
          uniform float uTime;
          attribute vec4 aDrop; attribute vec2 aShape;
          varying vec2 vLocal; varying float vP; varying float vR; varying float vAmp;
          void main(){
            float p = (uTime - aDrop.z) / aDrop.w;
            // 消えた水紋は四角ごと潰して描かせない
            float live = step(0.0, p) * step(p, 1.0);
            float reach = aShape.x * 1.08;
            vLocal = position.xz * reach;
            vec4 mv = modelViewMatrix * vec4(
              aDrop.x + vLocal.x * live, ${SURFACE.toFixed(2)}, aDrop.y + vLocal.y * live, 1.0);
            gl_Position = projectionMatrix * mv;
            float d = -mv.z;
            vP = clamp(p, 0.0, 1.0);
            vR = aShape.x;
            // 奥は霞に溶かす。手前すぎるものも消す
            vAmp = aShape.y * live * smoothstep(20.0, 8.5, d) * smoothstep(2.5, 4.5, d);
          }`,
        fragmentShader: `
          ${EDGE_GLSL}
          uniform vec3 uRing; uniform vec2 uRes;
          varying vec2 vLocal; varying float vP; varying float vR; varying float vAmp;
          void main(){
            float dist = length(vLocal);
            // 画面上で1px前後の線になるよう、線の太さを1画素あたりの距離から決める
            float px = fwidth(dist);
            // RippleCanvas と同じ: 減速しながら広がり、二乗で消える。輪は二重で、内側が少し遅れる
            float ease = 1.0 - pow(1.0 - vP, 2.2);
            float fade = (1.0 - vP) * (1.0 - vP);
            float a = 0.0;
            for (int k = 0; k < 2; k++) {
              float rp = ease - float(k) * 0.14;
              if (rp <= 0.0) continue;
              float e = abs(dist - rp * (k == 0 ? 1.0 : 0.7) * vR);
              float line = 1.0 - smoothstep(px * 0.2, px * 1.1, e);
              float soft = exp(-pow(e / (px * 4.0), 2.0)) * 0.22;
              a += (k == 0 ? 1.0 : 0.6) * (line + soft);
            }
            // 輪が広がる前でも落ちた点が読めるように、内側にごく淡い光を置く
            a += 0.14 * exp(-dist * dist / (0.16 * vR * vR * ease * ease + 0.0004));
            vec2 uv = gl_FragCoord.xy / uRes;
            a *= fade * vAmp * edgeFade(uv) * 0.26;
            gl_FragColor = vec4(uRing, clamp(a, 0.0, 1.0));
          }`,
      })
      const ripples = new THREE.Mesh(rippleGeo, rippleMat)
      ripples.frustumCulled = false
      scene.add(ripples)

      // --- 雨。1粒は短い線分1本で、上端を透明にして尾を引かせる ---
      const rainPos = new THREE.BufferAttribute(new Float32Array(DROPS * 6), 3)
      const rainAlpha = new THREE.BufferAttribute(new Float32Array(DROPS * 2), 1)
      rainPos.setUsage(THREE.DynamicDrawUsage)
      rainAlpha.setUsage(THREE.DynamicDrawUsage)
      const rainGeo = new THREE.BufferGeometry()
      rainGeo.setAttribute('position', rainPos)
      rainGeo.setAttribute('aAlpha', rainAlpha)

      const rainMat = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: `
          ${EDGE_GLSL}
          attribute float aAlpha;
          varying float vAlpha;
          void main(){
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            float d = -mv.z;
            vec2 uv = gl_Position.xy / gl_Position.w * 0.5 + 0.5;
            vAlpha = aAlpha * smoothstep(20.0, 8.0, d) * smoothstep(2.0, 4.0, d) * edgeFade(uv);
          }`,
        fragmentShader: `
          uniform vec3 uRing;
          varying float vAlpha;
          void main(){
            gl_FragColor = vec4(uRing, clamp(vAlpha, 0.0, 1.0));
          }`,
      })
      const rain = new THREE.LineSegments(rainGeo, rainMat)
      rain.frustumCulled = false
      scene.add(rain)

      // --- 雨粒と水紋の進行 ---
      let time = 0
      let slot = 0
      const addRipple = (x: number, z: number) => {
        // 大きく広がる水紋は4つに1つ。残りは小さく、すぐ消える
        const big = Math.random() < 0.25
        const life = (big ? 3.4 : 1.4) * (0.72 + Math.random() * 0.56) // ±28% ゆらぎ
        rippleDrop.setXYZW(slot, x, z, time, life)
        rippleShape.setXY(
          slot,
          big ? 0.6 + Math.random() * 0.35 : 0.22 + Math.random() * 0.18,
          (big ? 1 : 0.6) * (0.8 + Math.random() * 0.4),
        )
        rippleDrop.needsUpdate = true
        rippleShape.needsUpdate = true
        slot = (slot + 1) % RIPPLES
      }

      const drops: Drop[] = []
      const place = (d: Drop, y: number) => {
        // 画面の外に落ちる雨は見えないので、その距離で画面に入る幅の中へ落とす
        const dist = FIELD.near + Math.random() * (FIELD.far - FIELD.near)
        const halfWidth = dist * Math.tan((FOV * Math.PI) / 360) * uniforms.uAspect.value * 1.1 + 0.3
        d.x = (Math.random() * 2 - 1) * halfWidth
        d.z = CAMERA_Z - dist
        d.y = y
        d.speed = 3.2 + Math.random() * 1.0
        d.len = 0.45 + Math.random() * 0.35
        d.alpha = 0.2 + Math.random() * 0.18
      }
      for (let i = 0; i < DROPS; i++) {
        const d = { x: 0, z: 0, y: 0, speed: 0, len: 0, alpha: 0 }
        // 最初から降り続いているように、高さをばらして置く
        place(d, SURFACE + Math.random() * 5)
        drops.push(d)
      }

      const step = (dt: number) => {
        time += dt
        for (let i = 0; i < DROPS; i++) {
          const d = drops[i]
          d.y -= d.speed * dt
          if (d.y <= SURFACE) {
            addRipple(d.x, d.z)
            place(d, SURFACE + 3.6 + Math.random() * 2)
          }
          rainPos.setXYZ(i * 2, d.x, d.y + d.len, d.z)
          rainPos.setXYZ(i * 2 + 1, d.x, d.y, d.z)
          rainAlpha.setX(i * 2, 0)
          rainAlpha.setX(i * 2 + 1, d.alpha)
        }
        rainPos.needsUpdate = true
        rainAlpha.needsUpdate = true
      }
      // 開いた瞬間から水紋が広がっているように、先に数秒ぶん進めておく
      for (let i = 0; i < 150; i++) step(1 / 30)

      const target = { x: 0, y: 0 }
      const cur = { x: 0, y: 0 }
      const onMove = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect()
        target.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1))
        target.y = Math.max(-1, Math.min(1, -(((e.clientY - r.top) / r.height) * 2 - 1)))
      }

      // ヒーロー下端の最新作バー。キャンバスはバーの裏まで続いているので、高さを測ってそこで消す
      const floorEl = canvas.closest('[data-hero]')?.querySelector<HTMLElement>('[data-hero-floor]') ?? null

      const fit = (nw: number, nh: number) => {
        uniforms.uAspect.value = nw / nh
        renderer.getDrawingBufferSize(uniforms.uRes.value)
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
      let prev = 0
      let visible = true
      const frame = (now: number) => {
        raf = 0
        const dt = Math.min(0.05, prev ? (now - prev) / 1000 : 0.016)
        prev = now
        if (!still) step(dt)
        cur.x += (target.x - cur.x) * 0.004
        cur.y += (target.y - cur.y) * 0.004
        uniforms.uTime.value = time
        uniforms.uMouse.value.set(cur.x, cur.y)
        // 水面を斜め上から見下ろす。ポインタが止まっていても視点をわずかに揺らす
        camera.position.set(
          cur.x * 0.35 + Math.sin(time * 0.07) * 0.18,
          2.6 + cur.y * 0.25 + Math.sin(time * 0.05 + 1.3) * 0.08,
          CAMERA_Z,
        )
        camera.lookAt(0, -1, 0)
        renderer.render(scene, camera)
        if (!still && visible) raf = requestAnimationFrame(frame)
      }

      // ヒーローが画面外へ出ている間は描かない
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        if (visible && !still && !raf) {
          prev = 0
          raf = requestAnimationFrame(frame)
        }
      })
      io.observe(canvas)

      if (!still) window.addEventListener('pointermove', onMove)
      frame(0)

      cleanup = () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        io.disconnect()
        window.removeEventListener('pointermove', onMove)
        rippleGeo.dispose()
        rippleMat.dispose()
        rainGeo.dispose()
        rainMat.dispose()
        haze.geometry.dispose()
        haze.material.dispose()
        renderer.dispose()
      }
    })()

    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  return <canvas ref={ref} className="block h-full w-full" aria-hidden="true" />
}

export default NightRain
