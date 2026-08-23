'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroStatueCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    mount.appendChild(renderer.domElement);

    // Group
    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const goldPoint = new THREE.PointLight(0xd4af37, 5, 8);
    goldPoint.position.set(2, 3, 2);
    scene.add(goldPoint);

    const cyanPoint = new THREE.PointLight(0x00f0ff, 4, 8);
    cyanPoint.position.set(-2, -2, 2);
    scene.add(cyanPoint);

    const topDirectional = new THREE.DirectionalLight(0xfffae6, 2.5);
    topDirectional.position.set(0, 5, 3);
    scene.add(topDirectional);

    // Master Sculptural Geometry (Hyper-detailed intricate Icosahedron & Torus fusion)
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.15,
      wireframe: false,
    });

    const obsidianMat = new THREE.MeshStandardMaterial({
      color: 0x14141a,
      metalness: 0.85,
      roughness: 0.3,
    });

    // Central Artifact
    const coreMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.85, 3), goldMat);
    sculptureGroup.add(coreMesh);

    // Outer Gyro Rings
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.025, 16, 120), goldMat);
    sculptureGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.02, 16, 120), obsidianMat);
    ring2.rotation.x = Math.PI / 2.5;
    sculptureGroup.add(ring2);

    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.015, 16, 120), goldMat);
    ring3.rotation.y = Math.PI / 3;
    sculptureGroup.add(ring3);

    // Floating Stardust Particles
    const pCount = 350;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount * 3; i += 3) {
      pPositions[i] = (Math.random() - 0.5) * 8;
      pPositions[i + 1] = (Math.random() - 0.5) * 8;
      pPositions[i + 2] = (Math.random() - 0.5) * 6;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.03,
      color: 0xf4dc93,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / width - 0.5;
      const y = (e.clientY - rect.top) / height - 0.5;
      targetX = x * 1.5;
      targetY = y * 1.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      sculptureGroup.rotation.y = time * 0.2 + mouseX;
      sculptureGroup.rotation.x = Math.sin(time * 0.3) * 0.2 + mouseY;
      sculptureGroup.position.y = Math.sin(time * 1.2) * 0.1;

      ring1.rotation.z = time * 0.4;
      ring2.rotation.y = -time * 0.3;
      ring3.rotation.x = time * 0.25;

      particles.rotation.y = time * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full pointer-events-none" />;
}
