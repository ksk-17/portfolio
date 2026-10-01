import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";

function Shape({ position, kind, color, scale = 1 }) {
  return (
    <Float speed={1.2} rotationIntensity={1.2} floatIntensity={1.6}>
      <mesh position={position} scale={scale}>
        {kind === "knot" && <torusKnotGeometry args={[0.6, 0.2, 128, 16]} />}
        {kind === "icosa" && <icosahedronGeometry args={[0.8, 1]} />}
        {kind === "sphere" && <sphereGeometry args={[0.6, 48, 48]} />}
        <meshPhysicalMaterial color={color} roughness={0.15} metalness={0.1} clearcoat={1} />
      </mesh>
    </Float>
  );
}

export default function Backdrop3D() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="backdrop3d" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 6], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[4, 5, 3]} intensity={2} />
        <Shape position={[-4.2, 1.8, -1]} kind="knot" color="#8ab4ff" />
        <Shape position={[4.4, -1.6, -2]} kind="icosa" color="#ffb3c7" scale={1.2} />
        <Shape position={[3.2, 2.2, -3]} kind="sphere" color="#b8f0d0" />
      </Canvas>
    </div>
  );
}
