'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MaterialFinish } from '@/types';
import { RotateCw, Sun, Eye, Zap, Layers, Sparkles } from 'lucide-react';

interface StatueViewerProps {
  initialMaterial?: MaterialFinish;
  modelImageFallback?: string;
  height?: string;
  className?: string;
}

export default function StatueViewer({
  initialMaterial = '24K Gilded Gold Leaf',
  height = '500px',
  className = '',
}: StatueViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeMaterial, setActiveMaterial] = useState<MaterialFinish>(initialMaterial);
  const [lightingMode, setLightingMode] = useState<'gold' | 'cyber' | 'noir'>('gold');
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [showLaserScan, setShowLaserScan] = useState<boolean>(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);
  const materialsMapRef = useRef<Record<string, THREE.Material>>({});

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const heightPx = mount.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 100);
    camera.position.set(0, 0.5, 4.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    // Master Group
    const masterGroup = new THREE.Group();
    meshGroupRef.current = masterGroup;
    scene.add(masterGroup);

    // Lights
    const lightsGroup = new THREE.Group();
    lightsGroupRef.current = lightsGroup;
    scene.add(lightsGroup);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    lightsGroup.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffe8b4, 2.5);
    keyLight.position.set(3, 4, 3);
    lightsGroup.add(keyLight);

    const rimLight = new THREE.PointLight(0xd4af37, 4, 10);
    rimLight.position.set(-3, 2, -2);
    lightsGroup.add(rimLight);

    const blueFill = new THREE.DirectionalLight(0x00f0ff, 1.2);
    blueFill.position.set(0, -3, 2);
    lightsGroup.add(blueFill);

    // Generate Materials
    const materials: Record<string, THREE.MeshStandardMaterial> = {
      'Obsidian Onyx': new THREE.MeshStandardMaterial({
        color: 0x121217,
        roughness: 0.25,
        metalness: 0.85,
      }),
      'Antique Bronze Patina': new THREE.MeshStandardMaterial({
        color: 0x6e563b,
        roughness: 0.45,
        metalness: 0.75,
      }),
      'Iridescent Cyber Chrome': new THREE.MeshStandardMaterial({
        color: 0x90e0ef,
        roughness: 0.1,
        metalness: 0.95,
      }),
      'Alabaster White SLA': new THREE.MeshStandardMaterial({
        color: 0xf5f5f7,
        roughness: 0.35,
        metalness: 0.1,
      }),
      '24K Gilded Gold Leaf': new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.2,
        metalness: 0.9,
      }),
      'Raw Translucent Resin': new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        roughness: 0.15,
        metalness: 0.3,
        transparent: true,
        opacity: 0.85,
      }),
    };
    materialsMapRef.current = materials;

    const activeMat = materials[activeMaterial] || materials['24K Gilded Gold Leaf'];

    // Construct Masterpiece 3D Geometry
    // 1. Central Core Torus / Heraldic Crest
    const coreGeo = new THREE.TorusKnotGeometry(0.7, 0.22, 128, 32, 2, 3);
    const coreMesh = new THREE.Mesh(coreGeo, activeMat);
    masterGroup.add(coreMesh);

    // 2. Halo Rings
    const ringGeo = new THREE.TorusGeometry(1.25, 0.02, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.1,
    });
    const ringMesh1 = new THREE.Mesh(ringGeo, ringMat);
    ringMesh1.rotation.x = Math.PI / 3;
    masterGroup.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(ringGeo, ringMat);
    ringMesh2.rotation.y = Math.PI / 3;
    masterGroup.add(ringMesh2);

    // 3. Ornate Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(0.9, 1.1, 0.35, 8);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x18181f,
      roughness: 0.4,
      metalness: 0.6,
    });
    const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestalMesh.position.y = -1.2;
    masterGroup.add(pedestalMesh);

    // 4. Floating Wing Shards
    const shardGeo = new THREE.ConeGeometry(0.12, 0.8, 4);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const shard = new THREE.Mesh(shardGeo, activeMat);
      shard.position.set(Math.cos(angle) * 1.2, Math.sin(angle) * 0.4, Math.sin(angle) * 0.5);
      shard.rotation.z = angle + Math.PI / 2;
      shard.rotation.x = 0.3;
      masterGroup.add(shard);
    }

    // 5. Laser Scan Ring Visualizer
    const scanRingGeo = new THREE.RingGeometry(1.4, 1.45, 64);
    const scanRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const scanRing = new THREE.Mesh(scanRingGeo, scanRingMat);
    scanRing.rotation.x = Math.PI / 2;
    scene.add(scanRing);

    // Floating Dust Particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 6;
      posArray[i + 1] = (Math.random() - 0.5) * 6;
      posArray[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.025,
      color: 0xd4af37,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particleMesh = new THREE.Points(particleGeo, particleMat);
    scene.add(particleMesh);

    // Mouse Interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      masterGroup.rotation.y += deltaX * 0.008;
      masterGroup.rotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch events for mobile
    let prevTouchX = 0;
    let prevTouchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        prevTouchX = e.touches[0].clientX;
        prevTouchY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevTouchX;
        const deltaY = e.touches[0].clientY - prevTouchY;
        masterGroup.rotation.y += deltaX * 0.01;
        masterGroup.rotation.x += deltaY * 0.01;
        prevTouchX = e.touches[0].clientX;
        prevTouchY = e.touches[0].clientY;
      }
    };
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    dom.addEventListener('touchmove', onTouchMove, { passive: true });

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isAutoRotate && !isDragging) {
        masterGroup.rotation.y += 0.007;
      }

      // Gentle floating levitation
      masterGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;

      // Rotate decorative rings in opposite directions
      ringMesh1.rotation.z = elapsedTime * 0.3;
      ringMesh2.rotation.z = -elapsedTime * 0.25;

      // Laser scan ring vertical oscillation
      if (showLaserScan) {
        scanRing.position.y = Math.sin(elapsedTime * 2.2) * 1.4;
        scanRing.visible = true;
      } else {
        scanRing.visible = false;
      }

      // Rotate particle cloud
      particleMesh.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mount) return;
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight || 500;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Material dynamically
  useEffect(() => {
    const materials = materialsMapRef.current;
    const group = meshGroupRef.current;
    if (!materials || !group) return;

    const selected = materials[activeMaterial];
    if (!selected) return;

    group.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry instanceof THREE.TorusKnotGeometry) {
        child.material = selected;
        child.material.wireframe = isWireframe;
        child.material.needsUpdate = true;
      }
    });
  }, [activeMaterial, isWireframe]);

  // Update Lighting dynamically
  useEffect(() => {
    const lights = lightsGroupRef.current;
    if (!lights) return;

    const key = lights.children[1] as THREE.DirectionalLight;
    const rim = lights.children[2] as THREE.PointLight;
    const fill = lights.children[3] as THREE.DirectionalLight;

    if (lightingMode === 'gold') {
      key?.color.setHex(0xffe8b4);
      rim?.color.setHex(0xd4af37);
      fill?.color.setHex(0xff9900);
    } else if (lightingMode === 'cyber') {
      key?.color.setHex(0x00f0ff);
      rim?.color.setHex(0xff007f);
      fill?.color.setHex(0x9d4edd);
    } else if (lightingMode === 'noir') {
      key?.color.setHex(0xffffff);
      rim?.color.setHex(0x555555);
      fill?.color.setHex(0x222222);
    }
  }, [lightingMode]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-obsidian-850 to-obsidian-950 border border-obsidian-700 shadow-2xl ${className}`}>
      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        style={{ height }}
        className="w-full cursor-grab active:cursor-grabbing relative z-10"
      />

      {/* Top Overlay Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-obsidian-900/80 backdrop-blur-md border border-gold-500/30 text-xs font-mono text-gold-400">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>16K SLA RESIN REAL-TIME TURNTABLE</span>
      </div>

      {/* Control Bar Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-obsidian-900/85 backdrop-blur-xl border border-obsidian-700">
        {/* Material Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {(
            [
              '24K Gilded Gold Leaf',
              'Obsidian Onyx',
              'Antique Bronze Patina',
              'Iridescent Cyber Chrome',
              'Alabaster White SLA',
              'Raw Translucent Resin',
            ] as MaterialFinish[]
          ).map((mat) => (
            <button
              key={mat}
              onClick={() => setActiveMaterial(mat)}
              className={`px-2.5 py-1 text-xs rounded-lg transition-all duration-200 whitespace-nowrap font-medium ${
                activeMaterial === mat
                  ? 'bg-gold-500 text-obsidian-950 shadow-gold-glow font-semibold scale-105'
                  : 'bg-obsidian-800/80 text-titanium-300 hover:text-white hover:bg-obsidian-700 border border-obsidian-700'
              }`}
            >
              {mat}
            </button>
          ))}
        </div>

        {/* Studio Lighting & Mode Controls */}
        <div className="flex items-center gap-2">
          {/* Lighting Mode Selector */}
          <div className="flex items-center gap-1 bg-obsidian-800 p-1 rounded-lg border border-obsidian-700">
            <button
              onClick={() => setLightingMode('gold')}
              title="Warm Gold Studio Light"
              className={`p-1.5 rounded text-xs transition-colors ${
                lightingMode === 'gold' ? 'bg-gold-500 text-obsidian-950 font-bold' : 'text-gold-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingMode('cyber')}
              title="Cyberpunk Neon Light"
              className={`p-1.5 rounded text-xs transition-colors ${
                lightingMode === 'cyber' ? 'bg-cyan-500 text-obsidian-950 font-bold' : 'text-cyan-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingMode('noir')}
              title="Museum Chiaroscuro Noir"
              className={`p-1.5 rounded text-xs transition-colors ${
                lightingMode === 'noir' ? 'bg-white text-obsidian-950 font-bold' : 'text-titanium-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Wireframe Toggle */}
          <button
            onClick={() => setIsWireframe(!isWireframe)}
            title="Toggle 16K Mesh Wireframe"
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              isWireframe
                ? 'bg-gold-500/20 border-gold-400 text-gold-300'
                : 'bg-obsidian-800 border-obsidian-700 text-titanium-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {/* Laser Scan Toggle */}
          <button
            onClick={() => setShowLaserScan(!showLaserScan)}
            title="Toggle SLA Laser Layer Scan"
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              showLaserScan
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : 'bg-obsidian-800 border-obsidian-700 text-titanium-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          {/* Auto-Rotate Toggle */}
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            title="Toggle Auto Rotation"
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              isAutoRotate
                ? 'bg-gold-500/20 border-gold-400 text-gold-300'
                : 'bg-obsidian-800 border-obsidian-700 text-titanium-400 hover:text-white'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? 'animate-spin-slow' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
