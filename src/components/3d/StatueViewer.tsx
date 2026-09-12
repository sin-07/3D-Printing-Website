'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MaterialFinish } from '@/types';
import { RotateCw, Layers, Sparkles, Sliders, Cpu, Eye } from 'lucide-react';

interface StatueViewerProps {
  initialMaterial?: MaterialFinish;
  modelImageFallback?: string;
  height?: string;
  className?: string;
}

export default function StatueViewer({
  initialMaterial = 'Carbon Fiber PA-CF',
  height = '500px',
  className = '',
}: StatueViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeMaterial, setActiveMaterial] = useState<MaterialFinish>(initialMaterial);
  const [viewMode, setViewMode] = useState<'solid' | 'toolpath' | 'infill' | 'wireframe'>('solid');
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [showLaserScan, setShowLaserScan] = useState<boolean>(true);
  const [sliceHeightPercent, setSliceHeightPercent] = useState<number>(100);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const masterGroupRef = useRef<THREE.Group | null>(null);
  const sunGearRef = useRef<THREE.Mesh | null>(null);
  const planetGearsRef = useRef<THREE.Group[]>([]);
  const toolpathGroupRef = useRef<THREE.Group | null>(null);
  const infillGroupRef = useRef<THREE.Group | null>(null);
  const clipPlaneRef = useRef<THREE.Plane | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    while (mount.firstChild) {
      mount.removeChild(mount.firstChild);
    }

    const width = mount.clientWidth || 800;
    const heightPx = mount.clientHeight || 500;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 100);
    camera.position.set(0, 1.8, 4.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.localClippingEnabled = true;
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    // Master Group for rotation
    const masterGroup = new THREE.Group();
    masterGroupRef.current = masterGroup;
    scene.add(masterGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x60a5fa, 1.0);
    fillLight.position.set(-4, 3, -3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xf59e0b, 2.5, 8);
    rimLight.position.set(0, -2, 3);
    scene.add(rimLight);

    // 1. Textured Magnetic PEI Build Plate
    const bedGeo = new THREE.BoxGeometry(3.2, 0.04, 3.2);
    const bedMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.85,
      metalness: 0.3,
    });
    const bedMesh = new THREE.Mesh(bedGeo, bedMat);
    bedMesh.position.y = -0.9;
    masterGroup.add(bedMesh);

    // Bed Grid Lines
    const gridHelper = new THREE.GridHelper(3.0, 20, 0x52525b, 0x27272a);
    gridHelper.position.y = -0.87;
    masterGroup.add(gridHelper);

    // Clipping plane for Slicer Layer Simulation
    const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1.5);
    clipPlaneRef.current = clipPlane;

    // Helper: Gear Mesh Generator with teeth
    const createGearGeometry = (radius: number, teeth: number, depth: number) => {
      const shape = new THREE.Shape();
      const toothDepth = 0.12;
      for (let i = 0; i < teeth; i++) {
        const angle1 = (i / teeth) * Math.PI * 2;
        const angle2 = ((i + 0.3) / teeth) * Math.PI * 2;
        const angle3 = ((i + 0.6) / teeth) * Math.PI * 2;
        const angle4 = ((i + 0.9) / teeth) * Math.PI * 2;

        const rInner = radius - toothDepth;
        const rOuter = radius + toothDepth;

        if (i === 0) {
          shape.moveTo(Math.cos(angle1) * rInner, Math.sin(angle1) * rInner);
        } else {
          shape.lineTo(Math.cos(angle1) * rInner, Math.sin(angle1) * rInner);
        }
        shape.lineTo(Math.cos(angle2) * rOuter, Math.sin(angle2) * rOuter);
        shape.lineTo(Math.cos(angle3) * rOuter, Math.sin(angle3) * rOuter);
        shape.lineTo(Math.cos(angle4) * rInner, Math.sin(angle4) * rInner);
      }
      shape.closePath();

      // Center Bore hole
      const holePath = new THREE.Path();
      holePath.absarc(0, 0, radius * 0.35, 0, Math.PI * 2, true);
      shape.holes.push(holePath);

      const extrudeSettings = {
        depth: depth,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.02,
        bevelThickness: 0.02,
      };

      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geo.center();
      return geo;
    };

    // Material Map
    const getMaterial = (finish: MaterialFinish) => {
      const isSolid = viewMode === 'solid';
      switch (finish) {
        case 'Carbon Fiber PA-CF':
          return new THREE.MeshStandardMaterial({
            color: 0x18181b,
            roughness: 0.45,
            metalness: 0.65,
            clippingPlanes: [clipPlane],
            clipShadows: true,
          });
        case 'PLA+ Biopolymer':
          return new THREE.MeshStandardMaterial({
            color: 0x2563eb,
            roughness: 0.3,
            metalness: 0.2,
            clippingPlanes: [clipPlane],
          });
        case 'Industrial PETG':
          return new THREE.MeshStandardMaterial({
            color: 0x059669,
            roughness: 0.25,
            metalness: 0.4,
            clippingPlanes: [clipPlane],
          });
        case 'ABS-ESD Heat Resistant':
          return new THREE.MeshStandardMaterial({
            color: 0x4f46e5,
            roughness: 0.35,
            metalness: 0.5,
            clippingPlanes: [clipPlane],
          });
        case 'TPU 95A Flexible':
          return new THREE.MeshStandardMaterial({
            color: 0xd97706,
            roughness: 0.6,
            metalness: 0.1,
            clippingPlanes: [clipPlane],
          });
        case '16K Tough Resin':
          return new THREE.MeshStandardMaterial({
            color: 0xec4899,
            roughness: 0.15,
            metalness: 0.25,
            clippingPlanes: [clipPlane],
          });
        default:
          return new THREE.MeshStandardMaterial({
            color: 0x27272a,
            roughness: 0.4,
            metalness: 0.5,
            clippingPlanes: [clipPlane],
          });
      }
    };

    const currentPartMat = getMaterial(activeMaterial);

    // 2. Center Sun Gear
    const sunGearGeo = createGearGeometry(0.48, 12, 0.4);
    const sunGearMesh = new THREE.Mesh(sunGearGeo, currentPartMat);
    sunGearMesh.rotation.x = Math.PI / 2;
    sunGearMesh.position.y = 0;
    masterGroup.add(sunGearMesh);
    sunGearRef.current = sunGearMesh;

    // 3. 3 Orbiting Planet Gears
    const planetGears: THREE.Group[] = [];
    const orbitRadius = 0.95;
    for (let i = 0; i < 3; i++) {
      const planetGroup = new THREE.Group();
      const angle = (i / 3) * Math.PI * 2;
      planetGroup.position.set(Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius);

      const planetGeo = createGearGeometry(0.42, 10, 0.4);
      const planetMesh = new THREE.Mesh(planetGeo, currentPartMat);
      planetMesh.rotation.x = Math.PI / 2;
      planetGroup.add(planetMesh);

      // Center Pin
      const pinGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.46, 16);
      const pinMat = new THREE.MeshStandardMaterial({ color: 0x71717a, metalness: 0.9, roughness: 0.2 });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      planetGroup.add(pinMesh);

      masterGroup.add(planetGroup);
      planetGears.push(planetGroup);
    }
    planetGearsRef.current = planetGears;

    // 4. Outer Ring Gear Housing
    const ringGeo = new THREE.CylinderGeometry(1.55, 1.55, 0.45, 48, 1, true);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.4,
      metalness: 0.6,
      side: THREE.DoubleSide,
      clippingPlanes: [clipPlane],
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.y = 0;
    masterGroup.add(ringMesh);

    // 5. Toolpath Layer Overlay (Simulated G-Code Extrusion Lines)
    const toolpathGroup = new THREE.Group();
    toolpathGroup.visible = false;
    toolpathGroupRef.current = toolpathGroup;

    // Outer Perimeter (Green)
    const outerPathGeo = new THREE.TorusGeometry(1.5, 0.015, 8, 48);
    const outerPathMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const outerPath = new THREE.Mesh(outerPathGeo, outerPathMat);
    outerPath.rotation.x = Math.PI / 2;
    toolpathGroup.add(outerPath);

    // Inner Perimeter (Yellow)
    const innerPathGeo = new THREE.TorusGeometry(1.46, 0.015, 8, 48);
    const innerPathMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const innerPath = new THREE.Mesh(innerPathGeo, innerPathMat);
    innerPath.rotation.x = Math.PI / 2;
    toolpathGroup.add(innerPath);

    // Sun gear perimeter
    const sunPath = new THREE.Mesh(
      new THREE.TorusGeometry(0.48, 0.015, 8, 32),
      new THREE.MeshBasicMaterial({ color: 0x10b981 })
    );
    sunPath.rotation.x = Math.PI / 2;
    toolpathGroup.add(sunPath);

    masterGroup.add(toolpathGroup);

    // 6. Laser Slicing Beam Indicator
    const laserGeo = new THREE.RingGeometry(1.65, 1.7, 64);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    const laserRing = new THREE.Mesh(laserGeo, laserMat);
    laserRing.rotation.x = Math.PI / 2;
    scene.add(laserRing);

    // Mouse Drag Controls
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMousePos.x;
      const dy = e.clientY - prevMousePos.y;
      masterGroup.rotation.y += dx * 0.008;
      masterGroup.rotation.x += dy * 0.005;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Kinematic Planetary Motion
      if (sunGearRef.current) {
        sunGearRef.current.rotation.z = t * 1.5;
      }
      planetGearsRef.current.forEach((pg, idx) => {
        const orbitAngle = t * 0.5 + (idx / 3) * Math.PI * 2;
        pg.position.x = Math.cos(orbitAngle) * orbitRadius;
        pg.position.z = Math.sin(orbitAngle) * orbitRadius;
        if (pg.children[0]) {
          pg.children[0].rotation.z = -t * 1.8;
        }
      });

      if (isAutoRotate && !isDragging) {
        masterGroup.rotation.y += 0.005;
      }

      // Laser Scanner Animation
      if (showLaserScan) {
        laserRing.position.y = Math.sin(t * 1.8) * 0.6 + 0.1;
        laserRing.visible = true;
      } else {
        laserRing.visible = false;
      }

      renderer.render(scene, camera);
    };

    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: nw, height: nh } = entry.contentRect;
        if (nw > 0 && nh > 0) {
          camera.aspect = nw / nh;
          camera.updateProjectionMatrix();
          renderer.setSize(nw, nh);
        }
      }
    });
    resizeObserver.observe(mount);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Slice Height Clipping Plane
  useEffect(() => {
    if (clipPlaneRef.current) {
      // Range: -0.6 to 0.6
      const planeConstant = -0.6 + (sliceHeightPercent / 100) * 1.2;
      clipPlaneRef.current.constant = planeConstant;
    }
  }, [sliceHeightPercent]);

  // Update View Mode & Toolpaths
  useEffect(() => {
    if (toolpathGroupRef.current) {
      toolpathGroupRef.current.visible = viewMode === 'toolpath';
    }

    if (masterGroupRef.current) {
      masterGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          if (viewMode === 'wireframe') {
            mat.wireframe = true;
          } else {
            mat.wireframe = false;
          }
        }
      });
    }
  }, [viewMode]);

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800 select-none shadow-2xl ${className}`}
    >
      {/* 3D Canvas */}
      <div
        ref={mountRef}
        style={{ height, minHeight: '480px' }}
        className="w-full cursor-grab active:cursor-grabbing relative z-10"
      />

      {/* Top Telemetry Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-xs font-mono text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="lowercase">kinematic assembly · planetary reducer (5:1)</span>
        </div>

        <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-xs font-mono text-neutral-400">
          <span>nozzle: 0.40mm</span>
          <span>•</span>
          <span>slice: {sliceHeightPercent}%</span>
        </div>
      </div>

      {/* Layer Slicing Plane Slider */}
      <div className="absolute top-16 left-4 z-20 bg-black/75 backdrop-blur-md border border-white/10 p-2.5 rounded-2xl flex flex-col items-center gap-1.5 text-white">
        <span className="text-[10px] font-mono text-neutral-400">layer z</span>
        <input
          type="range"
          min={5}
          max={100}
          value={sliceHeightPercent}
          onChange={(e) => setSliceHeightPercent(Number(e.target.value))}
          className="h-24 -rotate-90 w-24 my-6 accent-emerald-400 cursor-pointer"
        />
        <span className="text-[10px] font-mono text-emerald-400 font-bold">
          {sliceHeightPercent}%
        </span>
      </div>

      {/* Bottom Control Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10">
        {/* Material Selection Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {(
            [
              'Carbon Fiber PA-CF',
              'PLA+ Biopolymer',
              'Industrial PETG',
              'TPU 95A Flexible',
              'ABS-ESD Heat Resistant',
              '16K Tough Resin',
            ] as MaterialFinish[]
          ).map((mat) => (
            <button
              key={mat}
              onClick={() => setActiveMaterial(mat)}
              className={`px-3 py-1.5 text-xs rounded-full transition-all whitespace-nowrap lowercase font-medium ${
                activeMaterial === mat
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              {mat}
            </button>
          ))}
        </div>

        {/* View Mode & Slicer Toggles */}
        <div className="flex items-center gap-2">
          {/* Solid vs Toolpath vs Wireframe */}
          {(
            [
              { id: 'solid', label: 'solid' },
              { id: 'toolpath', label: 'toolpath' },
              { id: 'wireframe', label: 'wireframe' },
            ] as const
          ).map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono lowercase transition-colors ${
                viewMode === mode.id
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {mode.label}
            </button>
          ))}

          {/* Laser Scan Toggle */}
          <button
            onClick={() => setShowLaserScan(!showLaserScan)}
            title="Toggle Laser Scan Ring"
            className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              showLaserScan
                ? 'bg-white text-black border-white'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          {/* Auto-Rotate Toggle */}
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            title="Toggle Auto Rotation"
            className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              isAutoRotate
                ? 'bg-white text-black border-white'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? 'animate-spin-slow' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
