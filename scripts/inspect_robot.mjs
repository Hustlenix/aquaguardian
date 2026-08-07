// One-time inspection script: loads the robot GLB and prints per-node world
// bounding boxes so Robot.tsx anchors glow discs / ping ring / core light
// without any visual guesswork. Run: node scripts/inspect_robot.mjs
import * as THREE from 'three'
import { GLTFLoader, MeshoptDecoder } from 'three-stdlib'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const loader = new GLTFLoader()
loader.setMeshoptDecoder(MeshoptDecoder())
const { readFile } = await import('fs/promises')
const data = await readFile(join(root, 'public', 'models', 'animated-robot.glb'))
const gltf = await new Promise((resolve, reject) => loader.parse(data.buffer, '', resolve, reject))
const scene = gltf.scene
scene.updateMatrixWorld(true)

const out = []
scene.traverse((obj) => {
  if (obj.isMesh) {
    const box = new THREE.Box3().setFromObject(obj)
    out.push({
      name: obj.name,
      isSkinned: obj.isSkinnedMesh,
      min: [box.min.x, box.min.y, box.min.z].map((v) => +v.toFixed(3)),
      max: [box.max.x, box.max.y, box.max.z].map((v) => +v.toFixed(3)),
    })
  }
})
const whole = new THREE.Box3().setFromObject(scene)
console.log('WHOLE', JSON.stringify({ min: whole.min.toArray(), max: whole.max.toArray() }))
console.log(JSON.stringify(out, null, 1))
