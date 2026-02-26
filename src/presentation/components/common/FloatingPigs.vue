<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

interface PigState {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  rotV: number
  size: number
  exploding: boolean
  dead: boolean
  el: HTMLElement | null
}

interface Particle {
  id: number
  x: number
  y: number
  angle: number
  distance: number
  emoji: string
}

const containerRef = ref<HTMLElement | null>(null)
const pigStates: PigState[] = []
const pigVueList = ref<{ id: number; size: number; initX: number; initY: number }[]>([])
const particles = ref<Particle[]>([])

let nextId = 0
let particleId = 0
let rafId: number | null = null
let lastTime = 0

const BURST_EMOJIS = ['✨', '💥', '⭐', '🌟', '💫']

function rnd(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function rndVel() {
  const speed = rnd(0.07, 0.22)
  const angle = Math.random() * Math.PI * 2
  return { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed }
}

function spawnParticles(x: number, y: number) {
  const count = 8
  const newOnes: Particle[] = []
  for (let i = 0; i < count; i++) {
    newOnes.push({
      id: particleId++,
      x,
      y,
      angle: (i / count) * 360,
      distance: rnd(40, 100),
      emoji: BURST_EMOJIS[Math.floor(Math.random() * BURST_EMOJIS.length)]!,
    })
  }
  particles.value.push(...newOnes)
  const ids = new Set(newOnes.map(p => p.id))
  setTimeout(() => {
    particles.value = particles.value.filter(p => !ids.has(p.id))
  }, 700)
}

function addPig(): PigState {
  const { vx, vy } = rndVel()
  const pig: PigState = {
    id: nextId++,
    x: rnd(5, 90),
    y: rnd(5, 90),
    vx,
    vy,
    rot: Math.random() * 360,
    rotV: rnd(-2.5, 2.5),
    size: rnd(28, 50),
    exploding: false,
    dead: false,
    el: null,
  }
  pigStates.push(pig)
  pigVueList.value.push({ id: pig.id, size: pig.size, initX: pig.x, initY: pig.y })
  return pig
}

function clickPig(id: number) {
  const pig = pigStates.find(p => p.id === id)
  if (!pig || pig.exploding || pig.dead) return
  pig.exploding = true
  spawnParticles(pig.x, pig.y)
  if (pig.el) {
    pig.el.style.removeProperty('transform')
    pig.el.classList.add('pig--exploding')
  }

  setTimeout(() => {
    pig.dead = true
    pigVueList.value = pigVueList.value.filter(p => p.id !== id)
    const idx = pigStates.findIndex(p => p.id === id)
    if (idx !== -1) pigStates.splice(idx, 1)

    setTimeout(async () => {
      const newPig = addPig()
      await nextTick()
      const el = containerRef.value?.querySelector(`[data-pig-id="${newPig.id}"]`) as HTMLElement | null
      if (el) newPig.el = el
    }, rnd(1500, 3000))
  }, 500)
}

function tick(timestamp: number) {
  const dt = Math.min((timestamp - lastTime) / 16, 3)
  lastTime = timestamp

  for (const pig of pigStates) {
    if (pig.dead || pig.exploding || !pig.el) continue

    // Randomly change direction for chaotic movement
    if (Math.random() < 0.018) {
      const v = rndVel()
      pig.vx = v.vx
      pig.vy = v.vy
      pig.rotV = rnd(-4, 4)
    }

    pig.x += pig.vx * dt
    pig.y += pig.vy * dt
    pig.rot += pig.rotV * dt

    // Bounce off edges
    if (pig.x < 2)  { pig.x = 2;  pig.vx =  Math.abs(pig.vx) }
    if (pig.x > 93) { pig.x = 93; pig.vx = -Math.abs(pig.vx) }
    if (pig.y < 2)  { pig.y = 2;  pig.vy =  Math.abs(pig.vy) }
    if (pig.y > 93) { pig.y = 93; pig.vy = -Math.abs(pig.vy) }

    pig.el.style.left      = pig.x + '%'
    pig.el.style.top       = pig.y + '%'
    pig.el.style.transform = `rotate(${pig.rot}deg)`
  }

  rafId = requestAnimationFrame(tick)
}

onMounted(async () => {
  for (let i = 0; i < 15; i++) addPig()
  await nextTick()
  for (const pig of pigStates) {
    const el = containerRef.value?.querySelector(`[data-pig-id="${pig.id}"]`) as HTMLElement | null
    if (el) pig.el = el
  }
  lastTime = performance.now()
  rafId = requestAnimationFrame(tick)
})

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div ref="containerRef" class="pigs-layer" aria-hidden="true">
    <span
      v-for="pig in pigVueList"
      :key="pig.id"
      :data-pig-id="pig.id"
      class="pig"
      :style="{
        fontSize: pig.size + 'px',
        left: pig.initX + '%',
        top: pig.initY + '%',
      }"
      @click="clickPig(pig.id)"
    >🐷</span>

    <span
      v-for="p in particles"
      :key="p.id"
      class="particle"
      :style="{
        left: p.x + '%',
        top: p.y + '%',
        '--angle': p.angle + 'deg',
        '--dist': p.distance + 'px',
      }"
    >{{ p.emoji }}</span>
  </div>
</template>

<style scoped>
.pigs-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

.pig {
  position: absolute;
  cursor: pointer;
  pointer-events: all;
  user-select: none;
  line-height: 1;
  transform-origin: center;
  will-change: transform, left, top;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.12));
  transition: filter 0.15s;
}

.pig:hover {
  filter: drop-shadow(0 0 14px rgba(255, 80, 140, 0.75)) brightness(1.25);
}

.pig--exploding {
  animation: pigExplode 0.5s ease-out forwards !important;
  pointer-events: none;
}

.particle {
  position: absolute;
  font-size: 18px;
  pointer-events: none;
  animation: particleBurst 0.65s ease-out forwards;
  transform-origin: center;
}

@keyframes pigExplode {
  0%   { transform: scale(1)   rotate(0deg);   opacity: 1;   }
  20%  { transform: scale(2.2) rotate(-40deg); opacity: 1;   }
  65%  { transform: scale(0.2) rotate(200deg); opacity: 0.3; }
  100% { transform: scale(0)   rotate(400deg); opacity: 0;   }
}

@keyframes particleBurst {
  0% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--dist)) scale(0.2);
    opacity: 0;
  }
}
</style>
