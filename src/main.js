import './style.css'
import * as THREE from 'three'

const app = document.querySelector('#app')

app.innerHTML = `
  <header>
    <h1>CITY RECKONING</h1>
    <span>ALPHA 0.1</span>
  </header>
  <div id="hud">
    <span>HEALTH: 100</span>
    <span>MONEY: ₹500</span>
  </div>
  <div id="game"></div>
  <div id="controls">
    <button id="forward">▲</button>
    <div>
      <button id="left">◀</button>
      <button id="backward">▼</button>
      <button id="right">▶</button>
    </div>
  </div>
  <p id="mission">MISSION: EXPLORE THE CITY</p>
`

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87a0aa)
scene.fog = new THREE.Fog(0x87a0aa, 30, 150)

const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 300)
camera.position.set(0, 7, 12)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
document.querySelector('#game').appendChild(renderer.domElement)

scene.add(new THREE.HemisphereLight(0xffffff, 0x39434a, 2))

const sun = new THREE.DirectionalLight(0xffffff, 2)
sun.position.set(20, 30, 10)
sun.castShadow = true
scene.add(sun)

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: 0x41494b })
)
ground.rotation.x = -Math.PI / 2
ground.receiveShadow = true
scene.add(ground)

const road = new THREE.Mesh(
  new THREE.PlaneGeometry(14, 200),
  new THREE.MeshStandardMaterial({ color: 0x24282c })
)
road.rotation.x = -Math.PI / 2
road.position.y = 0.02
scene.add(road)

for (let z = -90; z < 100; z += 12) {
  const line = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.04, 5),
    new THREE.MeshStandardMaterial({ color: 0xf2d48a })
  )
  line.position.set(0, 0.06, z)
  scene.add(line)
}

for (let x = -35; x <= 35; x += 14) {
  for (let z = -85; z <= 85; z += 18) {
    if (Math.abs(x) < 10) continue

    const height = 5 + Math.random() * 13

    const building = new THREE.Mesh(
      new THREE.BoxGeometry(9, height, 11),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(
          0.58,
          0.12,
          0.18 + Math.random() * 0.15
        )
      })
    )

    building.position.set(x, height / 2, z)
    building.castShadow = true
    building.receiveShadow = true
    scene.add(building)
  }
}

const player = new THREE.Group()

const body = new THREE.Mesh(
  new THREE.BoxGeometry(0.8, 1.4, 0.5),
  new THREE.MeshStandardMaterial({ color: 0x171c25 })
)
body.position.y = 1
player.add(body)

const head = new THREE.Mesh(
  new THREE.SphereGeometry(0.32, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0xb88768 })
)
head.position.y = 1.95
player.add(head)

player.position.set(0, 0, 0)
scene.add(player)

const keys = {}

function bindButton(id, key) {
  const button = document.getElementById(id)

  button.addEventListener('pointerdown', e => {
    e.preventDefault()
    keys[key] = true
  })

  for (const event of ['pointerup', 'pointerleave', 'pointercancel']) {
    button.addEventListener(event, () => {
      keys[key] = false
    })
  }
}

bindButton('forward', 'forward')
bindButton('backward', 'backward')
bindButton('left', 'left')
bindButton('right', 'right')

window.addEventListener('keydown', e => {
  keys[e.key] = true
})

window.addEventListener('keyup', e => {
  keys[e.key] = false
})

function resize() {
  const container = document.querySelector('#game')
  const width = container.clientWidth
  const height = container.clientHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

window.addEventListener('resize', resize)
resize()

function animate() {
  requestAnimationFrame(animate)

  if (keys.forward || keys.ArrowUp) player.position.z -= 0.12
  if (keys.backward || keys.ArrowDown) player.position.z += 0.12
  if (keys.left || keys.ArrowLeft) player.position.x -= 0.12
  if (keys.right || keys.ArrowRight) player.position.x += 0.12

  camera.position.x = player.position.x
  camera.position.z = player.position.z + 12
  camera.lookAt(player.position.x, 1, player.position.z)

  renderer.render(scene, camera)
}

animate()
