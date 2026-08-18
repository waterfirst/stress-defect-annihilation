import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { generateField, viaCenters } from "../physics/model";
import type { SimulationParameters } from "../types";

interface Props {
  params: SimulationParameters;
  time: number;
}

function colorForStress(value: number, temperatureRatio: number, target: THREE.Color): THREE.Color {
  const intensity = Math.min(1, Math.abs(value));
  if (value >= 0) target.setRGB(1.0, 0.18 + 0.35 * temperatureRatio, 0.05);
  else target.setRGB(0.02, 0.55 + 0.32 * temperatureRatio, 1.0);
  return target.multiplyScalar(0.08 + intensity * 1.25);
}

export default function ThreeScene({ params, time }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef(time);
  const paramsRef = useRef(params);

  useEffect(() => { timeRef.current = time; }, [time]);
  useEffect(() => { paramsRef.current = params; }, [params]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050b14);
    scene.fog = new THREE.FogExp2(0x050b14, 0.075);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 100);
    camera.position.set(5.5, 4.2, 6.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    host.appendChild(renderer.domElement);
    renderer.domElement.dataset.simulationCanvas = "true";

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minDistance = 3.5;
    controls.maxDistance = 14;
    controls.target.set(0, 0, 0);

    scene.add(new THREE.HemisphereLight(0xa7d8ff, 0x07101d, 1.6));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);
    const laserLight = new THREE.PointLight(0xff6040, 35, 8, 2);
    laserLight.position.set(0, 2.7, 0);
    scene.add(laserLight);

    const worldScale = 4 / params.fieldWidthUm;
    const slabHeight = Math.max(params.thicknessUm * worldScale, 0.45);
    const slabGeometry = new THREE.BoxGeometry(4, slabHeight, 4);
    const slabMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x7da9c8,
      transparent: true,
      opacity: 0.11,
      roughness: 0.16,
      metalness: 0.04,
      transmission: 0.62,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const slab = new THREE.Mesh(slabGeometry, slabMaterial);
    scene.add(slab);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(slabGeometry),
      new THREE.LineBasicMaterial({ color: 0x79a9cc, transparent: true, opacity: 0.34 }),
    );
    scene.add(edges);

    const viaGroup = new THREE.Group();
    const viaMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x07101d,
      transparent: true,
      opacity: 0.72,
      roughness: 0.12,
      metalness: 0.45,
      emissive: 0x08121e,
    });
    for (const center of viaCenters(params)) {
      const via = new THREE.Mesh(
        new THREE.CylinderGeometry(params.viaRadiusUm * worldScale, params.viaRadiusUm * worldScale, slabHeight * 1.22, 32, 1, true),
        viaMaterial,
      );
      via.position.set(center.x * worldScale, 0, center.y * worldScale);
      viaGroup.add(via);

      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(params.viaRadiusUm * worldScale, 0.012, 8, 48),
        new THREE.MeshBasicMaterial({ color: center.sign > 0 ? 0xff7356 : 0x39c7ff, transparent: true, opacity: 0.8 }),
      );
      rim.rotation.x = Math.PI / 2;
      rim.position.set(center.x * worldScale, slabHeight / 2 + 0.012, center.y * worldScale);
      viaGroup.add(rim);
    }
    scene.add(viaGroup);

    const field = generateField(params, 0);
    const positions = new Float32Array(field.length * 3);
    const colors = new Float32Array(field.length * 3);
    const color = new THREE.Color();
    for (let i = 0; i < field.length; i += 1) {
      const sample = field[i];
      positions[i * 3] = sample.x * worldScale;
      positions[i * 3 + 1] = sample.z * worldScale;
      positions[i * 3 + 2] = sample.y * worldScale;
      colorForStress(sample.value, sample.temperatureRatio, color);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    const fieldGeometry = new THREE.BufferGeometry();
    fieldGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    fieldGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const fieldMaterial = new THREE.PointsMaterial({
      size: params.gridResolution >= 32 ? 0.052 : 0.066,
      vertexColors: true,
      transparent: true,
      opacity: params.viewMode === "slice" ? 0.18 : 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const pointCloud = new THREE.Points(fieldGeometry, fieldMaterial);
    scene.add(pointCloud);

    const sliceCanvas = document.createElement("canvas");
    sliceCanvas.width = 160;
    sliceCanvas.height = 160;
    const sliceContext = sliceCanvas.getContext("2d")!;
    const sliceTexture = new THREE.CanvasTexture(sliceCanvas);
    sliceTexture.colorSpace = THREE.SRGBColorSpace;
    const sliceMaterial = new THREE.MeshBasicMaterial({
      map: sliceTexture,
      transparent: true,
      opacity: params.viewMode === "volume" ? 0 : 0.8,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const slicePlane = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), sliceMaterial);
    slicePlane.rotation.x = -Math.PI / 2;
    slicePlane.position.y = params.sliceZ * slabHeight * 0.5;
    scene.add(slicePlane);

    const vectorGroup = new THREE.Group();
    if (params.showVectors) {
      const count = 7;
      for (let j = 0; j < count; j += 1) {
        for (let i = 0; i < count; i += 1) {
          const px = -1.65 + (i / (count - 1)) * 3.3;
          const pz = -1.65 + (j / (count - 1)) * 3.3;
          const angle = Math.atan2(pz, px) + Math.PI / 2;
          const direction = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
          const arrow = new THREE.ArrowHelper(direction, new THREE.Vector3(px, slabHeight / 2 + 0.035, pz), 0.18, 0x9fdbff, 0.05, 0.025);
          const lineMaterial = arrow.line.material as THREE.LineBasicMaterial;
          lineMaterial.transparent = true;
          lineMaterial.opacity = 0.32;
          vectorGroup.add(arrow);
        }
      }
    }
    scene.add(vectorGroup);

    const laserBeam = new THREE.Mesh(
      new THREE.CylinderGeometry(params.beamRadiusUm * worldScale * 0.7, params.beamRadiusUm * worldScale * 0.35, 2.2, 48, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xff5a3c, transparent: true, opacity: 0.035, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }),
    );
    laserBeam.position.y = slabHeight / 2 + 1.1;
    scene.add(laserBeam);

    const particleCount = params.showPhonons ? 260 : 0;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocity = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const radius = Math.sqrt(Math.random()) * 1.9;
      const angle = Math.random() * Math.PI * 2;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * slabHeight;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
      particleVelocity[i * 3] = (Math.random() - 0.5) * 0.012;
      particleVelocity[i * 3 + 1] = (Math.random() - 0.5) * 0.006;
      particleVelocity[i * 3 + 2] = (Math.random() - 0.5) * 0.012;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({ color: 0xffd36a, size: 0.025, transparent: true, opacity: 0.72, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    scene.add(particles);

    const updateSlice = (samples: ReturnType<typeof generateField>) => {
      const image = sliceContext.createImageData(sliceCanvas.width, sliceCanvas.height);
      const n = paramsRef.current.gridResolution;
      const nz = Math.max(6, Math.round(n * paramsRef.current.thicknessUm / paramsRef.current.fieldWidthUm));
      const iz = Math.round(((paramsRef.current.sliceZ + 1) / 2) * (nz - 1));
      for (let py = 0; py < sliceCanvas.height; py += 1) {
        for (let px = 0; px < sliceCanvas.width; px += 1) {
          const ix = Math.round((px / (sliceCanvas.width - 1)) * (n - 1));
          const iy = Math.round((1 - py / (sliceCanvas.height - 1)) * (n - 1));
          const nearest = samples[iz * n * n + iy * n + ix] ?? samples[0];
          const magnitude = Math.min(1, Math.abs(nearest.value));
          const idx = (py * sliceCanvas.width + px) * 4;
          image.data[idx] = nearest.value >= 0 ? 255 * magnitude : 10;
          image.data[idx + 1] = 70 * magnitude + 12;
          image.data[idx + 2] = nearest.value < 0 ? 255 * magnitude : 12;
          image.data[idx + 3] = Math.round(220 * magnitude);
        }
      }
      sliceContext.putImageData(image, 0, 0);
      sliceTexture.needsUpdate = true;
    };

    let lastFieldTime = -1;
    let animationFrame = 0;
    const tempColor = new THREE.Color();
    const render = () => {
      animationFrame = requestAnimationFrame(render);
      controls.update();
      const simulationTime = timeRef.current;
      if (Math.abs(simulationTime - lastFieldTime) > 0.018 || lastFieldTime < 0) {
        const samples = generateField(paramsRef.current, simulationTime);
        const colorAttribute = fieldGeometry.getAttribute("color") as THREE.BufferAttribute;
        for (let i = 0; i < Math.min(samples.length, colorAttribute.count); i += 1) {
          colorForStress(samples[i].value, samples[i].temperatureRatio, tempColor);
          colorAttribute.setXYZ(i, tempColor.r, tempColor.g, tempColor.b);
        }
        colorAttribute.needsUpdate = true;
        updateSlice(samples);
        slicePlane.position.y = paramsRef.current.sliceZ * slabHeight * 0.5;
        lastFieldTime = simulationTime;
      }

      const particleAttribute = particleGeometry.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i += 1) {
        for (let axis = 0; axis < 3; axis += 1) {
          const idx = i * 3 + axis;
          particlePositions[idx] += particleVelocity[idx] * (0.6 + paramsRef.current.annealRatio);
          const bound = axis === 1 ? slabHeight / 2 : 1.95;
          if (Math.abs(particlePositions[idx]) > bound) {
            particlePositions[idx] = Math.sign(particlePositions[idx]) * bound;
            particleVelocity[idx] *= -1;
          }
        }
      }
      particleAttribute.needsUpdate = true;
      laserBeam.rotation.y += 0.002;
      renderer.render(scene, camera);
    };

    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      controls.dispose();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose?.();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((item) => item.dispose());
        else material?.dispose?.();
      });
      sliceTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [params.fieldWidthUm, params.gridResolution, params.showPhonons, params.showVectors, params.thicknessUm, params.topology, params.viaPitchUm, params.viaRadiusUm, params.viewMode]);

  return <div className="three-scene" ref={hostRef} aria-label="3D stress defect simulation viewport" />;
}
