<script setup lang="ts">
const title = 'Welcome to Nuxt Obsidian'

interface ScrambleItem {
  from: string
  to: string
  start: number
  end: number
  char?: string
}

function useTextScramble(chars = '!<>-_\\/[]{}—=+*^?#________') {
  const displayText = ref('')
  let frame = 0
  let frameRequest = 0
  const queue: ScrambleItem[] = [] // Явно типизируем массив

  const update = (resolve: () => void) => {
    let output = ''
    let complete = 0

    // Используем for...of вместо обычного for, чтобы избежать проблем с индексами
    for (const item of queue) {
      const { from, to, start, end } = item
      let char = item.char

      if (frame >= end) {
        complete++
        output += to
      }
      else if (frame >= start) {
        // Если символ еще не выбран или выпал шанс на смену (0.28)
        if (!char || Math.random() < 0.28) {
          char = chars[Math.floor(Math.random() * chars.length)]
          item.char = char // Сохраняем обратно в объект
        }
        output += `<span class="scramble-char">${char}</span>`
      }
      else {
        output += from
      }
    }

    displayText.value = output

    if (complete === queue.length) {
      resolve()
    }
    else {
      frameRequest = requestAnimationFrame(() => update(resolve))
      frame++
    }
  }

  const scramble = (newText: string) => {
    // Очищаем предыдущий текст от HTML-тегов перед расчетом
    const oldText = displayText.value.replace(/<[^>]*>?/g, '')
    const length = Math.max(oldText.length, newText.length)

    queue.length = 0 // Очистка очереди

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      queue.push({ from, to, start, end })
    }

    cancelAnimationFrame(frameRequest)
    frame = 0

    return new Promise<void>(resolve => update(resolve))
  }

  onUnmounted(() => cancelAnimationFrame(frameRequest))

  return {
    displayText,
    scramble,
  }
}

const { displayText, scramble } = useTextScramble()

onMounted(() => {
  scramble(title)
})
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Используем v-html, так как символы оборачиваются в span для стилизации -->
      <h1
        class="scramble-text"
        v-html="displayText || title"
      />

      <div class="actions">
        <a
          href="/auth/github"
          class="btn-github"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="currentColor"
          ><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
          Login with GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: $bg-main;
  color: $text-bright;
}

.login-container {
  text-align: center;
}

.scramble-text {
  font-family: 'JetBrains Mono', 'Fira Code', monospace; // Моноширинный шрифт важен
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 2rem;
  min-height: 3.5rem; // Предотвращаем прыжки контента
  letter-spacing: -1px;
}

// Стили для "глючных" символов
:deep(.scramble-char) {
  color: $accent-primary;
  opacity: 0.7;
}

.btn-github {
  @include reset-button;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: white;
  color: black;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all $transition-base;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-2px);
    background: #f0f0f0;
    box-shadow: 0 8px 25px rgba($accent-primary, 0.3);
  }
}
</style>
