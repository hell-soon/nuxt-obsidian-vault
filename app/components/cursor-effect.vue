<script setup lang="ts">
import { useMouse, useWindowSize } from '@vueuse/core'

const { x, y } = useMouse()
const { width, height } = useWindowSize()

const GRID_SIZE = 80

const cols = computed(() => Math.ceil(width.value / GRID_SIZE))
const rows = computed(() => Math.ceil(height.value / GRID_SIZE))

const dots = computed(() => {
  const result = []
  for (let r = 0; r < rows.value; r++) {
    for (let c = 0; c < cols.value; c++) {
      const cx = c * GRID_SIZE + GRID_SIZE / 2
      const cy = r * GRID_SIZE + GRID_SIZE / 2

      const dx = x.value - cx
      const dy = y.value - cy
      const distSq = dx * dx + dy * dy

      result.push({ cx, cy, distSq })
    }
  }
  return result
})

const MAX_DIST_SQ = 200 * 200

function getOpacity(distSq: number): number {
  if (distSq > MAX_DIST_SQ)
    return 0.05

  const factor = 1 - (distSq / MAX_DIST_SQ)
  return 0.05 + factor * 0.35
}
</script>

<template>
  <div class="cursor-effect">
    <div
      v-for="(dot, index) in dots"
      :key="index"
      class="dot"
      :style="{
        left: `${dot.cx}px`,
        top: `${dot.cy}px`,
        opacity: getOpacity(dot.distSq),
        transform: `scale(${1 + 0.5 * (1 - dot.distSq / MAX_DIST_SQ)})`,
      }"
    />
  </div>
</template>

<style lang="scss" scoped>
.cursor-effect {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; // КРИТИЧНО: не блокирует клики
  z-index: 1; // Под основным контентом, но над фоном
}

.dot {
  position: absolute;
  width: 4px;
  height: 4px;
  margin-left: -2px; // Центрируем точку
  margin-top: -2px;
  border-radius: 50%;
  background-color: $accent-primary; // Цвет свечения
  transition:
    opacity 0.5s ease-out,
    transform 0.5s ease-out;
  will-change: opacity, transform; // Намек браузеру для производительности
}
</style>
