'use client'

import { useEffect, useRef } from 'react'

/**
 * トップのヒーロー右側で漂う粒子。Claude Design 側は esm.sh から three を
 * 読んでいたが、静的エクスポート後に外部CDNへ依存したくないので npm の three を
 * 動的 import している（初期バンドルには乗らない）。
 *
 * ポインタに対する追従は極端に鈍い（lerp 0.004）。水中で少し遅れて動く感じを出すため
 * デザイン側で意図的にこの値になっているので、速くしない。
 */

const TINT = 0xdcebff

export function ParticleField({ count = 1900 }: { count?: number }) {
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
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 7.2
        pos[i * 3 + 1] = (Math.random() - 0.5) * 9.5
        pos[i * 3 + 2] = (Math.random() - 0.5) * 5.5
        seed[i] = Math.random() * 6.283
        scale[i] = 0.35 + Math.random() * Math.random() * 1.5
      }

      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
      geo.setAttribute('aScale', new THREE.BufferAttribute(scale, 1))

      const uniforms = {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uTint: { value: new THREE.Color(TINT) },
        uPix: { value: renderer.getPixelRatio() },
      }

      const mat = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: `
          uniform float uTime; uniform vec2 uMouse; uniform float uPix;
          attribute float aSeed; attribute float aScale;
          varying float vFade;
          void main(){
            vec3 p = position;
            float t = uTime * 0.16 + aSeed;
            p.y = mod(p.y + uTime * (0.055 + aScale * 0.03) + 4.75, 9.5) - 4.75;
            p.x += sin(t * 1.3) * 0.32 + uMouse.x * (0.22 + aScale * 0.16);
            p.z += cos(t * 1.1) * 0.28;
            p.y += uMouse.y * (0.14 + aScale * 0.1);
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            float d = -mv.z;
            vFade = smoothstep(14.0, 1.5, d) * smoothstep(0.0, 1.0, 4.75 - abs(p.y));
            gl_PointSize = aScale * 15.0 * uPix / max(d, 0.6);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `
          uniform vec3 uTint;
          varying float vFade;
          void main(){
            vec2 c = gl_PointCoord - 0.5;
            float r = length(c);
            if (r > 0.5) discard;
            float a = pow(1.0 - r * 2.0, 1.7) * vFade;
            gl_FragColor = vec4(uTint, clamp(a * 1.45, 0.0, 1.0));
          }`,
      })

      const points = new THREE.Points(geo, mat)
      scene.add(points)

      const target = { x: 0, y: 0 }
      const cur = { x: 0, y: 0 }
      const onMove = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect()
        target.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1))
        target.y = Math.max(-1, Math.min(1, -(((e.clientY - r.top) / r.height) * 2 - 1)))
      }

      const resize = () => {
        const nw = canvas.clientWidth
        const nh = canvas.clientHeight
        if (!nw || !nh) return
        camera.aspect = nw / nh
        camera.updateProjectionMatrix()
        renderer.setSize(nw, nh, false)
      }
      const ro = new ResizeObserver(resize)
      ro.observe(canvas)

      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      let raf = 0
      const frame = () => {
        const now = performance.now() / 1000
        cur.x += (target.x - cur.x) * 0.004
        cur.y += (target.y - cur.y) * 0.004
        uniforms.uTime.value = now
        uniforms.uMouse.value.set(cur.x, cur.y)
        points.rotation.y = cur.x * 0.12
        camera.position.x = cur.x * 0.35
        camera.position.y = cur.y * 0.28
        camera.lookAt(0, 0, 0)
        renderer.render(scene, camera)
        if (!still) raf = requestAnimationFrame(frame)
      }

      if (!still) window.addEventListener('pointermove', onMove)
      frame()

      cleanup = () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        window.removeEventListener('pointermove', onMove)
        geo.dispose()
        mat.dispose()
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
