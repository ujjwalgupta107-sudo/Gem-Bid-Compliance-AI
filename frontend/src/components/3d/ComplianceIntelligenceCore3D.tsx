"use client";
import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { SpatialCanvas } from "./SpatialCanvas";

interface NodeInfo {
  id: string;
  name: string;
  status: string;
  sync: string;
  color: number;
  position: THREE.Vector3;
}

export default function ComplianceIntelligenceCore3D() {
  const [hoveredNode, setHoveredNode] = useState<NodeInfo | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const nodesRef = useRef<THREE.Mesh[]>([]);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const nodeDataRef = useRef<NodeInfo[]>([
    { id: "udyam", name: "UDYAM", status: "Operational", sync: "Last Sync: 2 mins ago", color: 0x10b981, position: new THREE.Vector3(-4, 2, -2) },
    { id: "gstn", name: "GSTN", status: "Operational", sync: "Last Sync: 5 mins ago", color: 0x10b981, position: new THREE.Vector3(-5, -2, 1) },
    { id: "pan", name: "Income Tax PAN", status: "Operational", sync: "Last Sync: 10 mins ago", color: 0x10b981, position: new THREE.Vector3(4, 3, -1) },
    { id: "cppp", name: "CPPP API", status: "Degraded", sync: "Last Sync: 1 hour ago", color: 0xf59e0b, position: new THREE.Vector3(5, -2, 2) },
    { id: "incometax", name: "Income Tax (ITR)", status: "Operational", sync: "Last Sync: 15 mins ago", color: 0x10b981, position: new THREE.Vector3(0, -4, 3) },
  ]);

  const sceneObjects = useRef<{
    coreGroup: THREE.Group;
    particles: THREE.Points;
    flowParticles: THREE.Points;
    flowGeom: THREE.BufferGeometry;
    flowPos: Float32Array;
  } | null>(null);

  const handleSceneReady = (scene: THREE.Scene, camera: THREE.PerspectiveCamera, _renderer: THREE.WebGLRenderer) => {
    cameraRef.current = camera;
    
    // Core Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Central Core Sphere
    const coreGeom = new THREE.IcosahedronGeometry(1.5, 3);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x00F5FF,
      emissive: 0x0070F3,
      emissiveIntensity: 0.2,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      metalness: 0.8,
      ior: 1.5,
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    coreGroup.add(coreMesh);

    // Core Wireframe Ring
    const ringGeom = new THREE.TorusGeometry(2.2, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00F5FF, wireframe: true, transparent: true, opacity: 0.4 });
    const ring1 = new THREE.Mesh(ringGeom, ringMat);
    ring1.rotation.x = Math.PI / 2;
    coreGroup.add(ring1);
    
    const ring2 = new THREE.Mesh(ringGeom, ringMat);
    ring2.rotation.y = Math.PI / 2;
    coreGroup.add(ring2);

    // Create Nodes & Connections
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00F5FF, transparent: true, opacity: 0.2 });
    
    nodesRef.current = [];
    nodeDataRef.current.forEach((data, index) => {
      // Node Mesh
      const nodeGeom = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const nodeMat = new THREE.MeshPhysicalMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.5,
        transmission: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9,
      });
      const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);
      nodeMesh.position.copy(data.position);
      nodeMesh.userData = { index }; // map to nodeDataRef
      scene.add(nodeMesh);
      nodesRef.current.push(nodeMesh);

      // Connection Line
      const points = [new THREE.Vector3(0,0,0), data.position];
      const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeom, lineMat);
      scene.add(line);
    });

    // Flow Particles (Data transferring)
    const numFlowParticles = 100;
    const flowGeom = new THREE.BufferGeometry();
    const flowPos = new Float32Array(numFlowParticles * 3);
    const flowColors = new Float32Array(numFlowParticles * 3);
    const baseColor = new THREE.Color(0x00F5FF);

    for (let i = 0; i < numFlowParticles; i++) {
      flowPos[i*3] = 0; flowPos[i*3+1] = 0; flowPos[i*3+2] = 0;
      flowColors[i*3] = baseColor.r; flowColors[i*3+1] = baseColor.g; flowColors[i*3+2] = baseColor.b;
    }
    
    flowGeom.setAttribute("position", new THREE.BufferAttribute(flowPos, 3));
    flowGeom.setAttribute("color", new THREE.BufferAttribute(flowColors, 3));
    
    const flowMat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const flowParticles = new THREE.Points(flowGeom, flowMat);
    scene.add(flowParticles);

    // Save for animation
    sceneObjects.current = {
      coreGroup,
      particles: flowParticles, // Background particles handled by SpatialCanvas
      flowParticles,
      flowGeom,
      flowPos
    };
  };

  const onRenderFrame = (elapsedTime: number) => {
    if (!sceneObjects.current) return;
    const { coreGroup, flowPos, flowGeom } = sceneObjects.current;

    // Core Animation
    coreGroup.rotation.y = elapsedTime * 0.2;
    coreGroup.rotation.z = Math.sin(elapsedTime * 0.1) * 0.1;

    const scalePulse = 1 + Math.sin(elapsedTime * 2) * 0.05;
    coreGroup.scale.set(scalePulse, scalePulse, scalePulse);

    // Animate flow particles along lines
    const nodes = nodeDataRef.current;
    const numNodes = nodes.length;
    
    for (let i = 0; i < flowPos.length / 3; i++) {
      const nodeIndex = i % numNodes;
      const nodeTarget = nodes[nodeIndex].position;
      
      // Calculate position along line based on time and particle index
      const speed = 0.5;
      const offset = (i / flowPos.length) * 5;
      let progress = ((elapsedTime * speed) + offset) % 1.0;
      
      // Ease out
      progress = 1 - Math.pow(1 - progress, 3);
      
      flowPos[i*3] = nodeTarget.x * progress;
      flowPos[i*3+1] = nodeTarget.y * progress;
      flowPos[i*3+2] = nodeTarget.z * progress;
    }
    flowGeom.attributes.position.needsUpdate = true;
    
    // Rotate nodes slightly
    nodesRef.current.forEach((mesh, idx) => {
      mesh.rotation.x = elapsedTime * 0.5 + idx;
      mesh.rotation.y = elapsedTime * 0.3 + idx;
    });
  };

  // Mouse interaction for Raycasting
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !cameraRef.current || nodesRef.current.length === 0) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      // Ensure mouse is inside this container
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
        setHoveredNode(null);
        return;
      }
      
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      
      const mouse = new THREE.Vector2();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      
      const intersects = raycaster.intersectObjects(nodesRef.current, false);
      if (intersects.length > 0) {
        const obj = intersects[0].object;
        const idx = obj.userData.index;
        if (idx !== undefined) {
          setHoveredNode(nodeDataRef.current[idx]);
          document.body.style.cursor = 'pointer';
        }
      } else {
        setHoveredNode(null);
        document.body.style.cursor = 'default';
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.style.cursor = 'default';
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[500px] relative rounded-2xl overflow-hidden bg-[#0A0F1C]/80 border border-white/10 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-[#00F5FF] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#00F5FF] rounded-full animate-ping"></span>
          AI Verification Engine
        </h3>
        <p className="text-slate-400 text-[10px] mt-1 font-mono">LIVE GOVERNMENT DATA STREAM</p>
      </div>

      <SpatialCanvas onSceneReady={handleSceneReady} onRenderFrame={onRenderFrame} />
      
      {/* Tooltip Overlay */}
      {hoveredNode && (
        <div 
          className="absolute z-20 pointer-events-none transition-transform duration-75 ease-out"
          style={{ transform: `translate(${mousePos.x + 15}px, ${mousePos.y + 15}px)` }}
        >
          <div className="bg-[#0F172A]/90 backdrop-blur-md border border-white/20 p-3 rounded-lg shadow-2xl min-w-[150px]">
            <h4 className="text-white font-bold text-sm mb-1">{hoveredNode.name}</h4>
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${hoveredNode.status === 'Operational' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span className={`text-xs font-semibold ${hoveredNode.status === 'Operational' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {hoveredNode.status}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono border-t border-white/10 pt-2">{hoveredNode.sync}</p>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
          <span className="text-[9px] text-slate-400 uppercase tracking-widest">Operational</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
          <span className="text-[9px] text-slate-400 uppercase tracking-widest">Degraded</span>
        </div>
      </div>
    </div>
  );
}
