<script setup lang="ts">
import { CheckCircle, CircleX, Info, TriangleAlert, X } from 'lucide-vue-next'

const store = useToastStore()

function iconType(type: Toast['type']) {
  switch (type) {
    case 'success':
      return CheckCircle
    case 'info':
      return Info
    case 'error':
      return CircleX
    default:
      return TriangleAlert
  }
}
</script>

<template>
  <teleport to="body">
    <div class="toast-provider">
      <transition-group name="toast-list">
        <div
          v-for="toast in store.toasts"
          :key="toast.id"
          class="toast-item"
          :class="`is-${toast.type}`"
        >
          <div class="toast-icon">
            <component :is="iconType(toast.type)" />
          </div>
          <div class="toast-content">
            {{ toast.message }}
          </div>
          <button
            class="toast-close"
            @click="store.remove(toast.id)"
          >
            <x :size="14" />
          </button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.toast-provider {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: var(--z-modal);
  width: 320px;
  pointer-events: none;
}

.toast-item {
  pointer-events: auto;
  background-color: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background-color: var(--accent-primary);
  }

  &.is-success::before {
    background-color: #43d043;
  }
  &.is-error::before {
    background-color: var(--accent-danger);
  }
  &.is-warning::before {
    background-color: #e7c000;
  }
}

.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}

.toast-list-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.toast-list-move {
  transition: transform 0.3s ease;
}
</style>
