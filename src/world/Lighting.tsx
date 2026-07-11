'use client'

export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} color="#B8D4E3" />
      <directionalLight
        position={[5, 10, -5]}
        intensity={1}
        color="#B8D4E3"
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#D4AF37" />
      <pointLight position={[-3, 0, 2]} intensity={0.3} color="#00E5FF" />
    </>
  )
}
