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
  bottom: var(--space-lg);
  right: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  z-index: var(--z-modal);
  width: 320px;
  pointer-events: none;
}

.toast-item {
  pointer-events: auto;
  background-color: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  /* Более глубокая и темная тень для темной темы Obsidian */
  box-shadow:
    0 8px 16px rgba(0, 0, 0, 0.4),
    0 2px 4px rgba(0, 0, 0, 0.3);
  padding: 12px var(--space-md);
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
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

  /* Привязка к цветам Obsidian */
  &.is-info {
    &::before {
      background-color: var(--accent-primary);
    }
    .toast-icon {
      color: var(--accent-primary);
    }
  }
  &.is-success {
    &::before {
      background-color: #36b37e;
    } /* Obsidian-like green */
    .toast-icon {
      color: #36b37e;
    }
  }
  &.is-warning {
    &::before {
      background-color: #e3b341;
    } /* Obsidian-like yellow */
    .toast-icon {
      color: #e3b341;
    }
  }
  &.is-error {
    &::before {
      background-color: var(--accent-danger);
    }
    .toast-icon {
      color: var(--accent-danger);
    }
  }
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;

  svg {
    width: 18px;
    height: 18px;
  }
}

.toast-content {
  flex: 1;
  /* Делаем шрифт чуть меньше основного (14px), как принято для уведомлений */
  font-size: calc(var(--font-size-base) - 2px);
  line-height: 1.4;
  color: var(--text-main);
  word-break: break-word;
}

.toast-close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: var(--space-xs);
  margin: calc(var(--space-xs) * -1) calc(var(--space-xs) * -1) 0 0;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-base);

  &:hover {
    background-color: var(--bg-item-hover);
    color: var(--text-bright);
  }

  &:focus-visible {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
  }
}

/* Анимации завязаны на var(--transition-base) */
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all var(--transition-base);
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

.toast-list-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.toast-list-move {
  transition: transform var(--transition-base);
}

.toast-list-leave-active {
  position: absolute;
  /* Ширина минус двойной отступ (left + right) */
  width: calc(100% - (var(--space-lg) * 2));
  z-index: -1;
}
</style>
