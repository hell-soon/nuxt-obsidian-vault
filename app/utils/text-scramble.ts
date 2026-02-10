interface ScrambleItem {
  from: string
  to: string
  start: number
  end: number
  char?: string
}

export function useTextScramble(chars = '!<>-_\\/[]{}—=+*^?#________') {
  const displayText = ref('')
  let frame = 0
  let frameRequest = 0
  const queue: ScrambleItem[] = []

  const update = (resolve: () => void) => {
    let output = ''
    let complete = 0

    for (const item of queue) {
      const { from, to, start, end } = item
      let char = item.char

      if (frame >= end) {
        complete++
        output += to
      }
      else if (frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = chars[Math.floor(Math.random() * chars.length)]
          item.char = char
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
    const oldText = displayText.value.replace(/<[^>]*>?/g, '')
    const length = Math.max(oldText.length, newText.length)

    queue.length = 0

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
