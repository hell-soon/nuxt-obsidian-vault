export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[] | null>(null)

  const remove = (id: number) => {
    if (!toasts.value)
      return

    toasts.value = toasts.value?.filter(toast => toast.id !== id)
  }

  const open = (
    message: string,
    type: Toast['type'] = 'info',
    timeout = 5000,
  ) => {
    const id = Math.random()
    const toast: Toast = {
      id,
      message,
      type,
    }
    if (!toasts.value)
      toasts.value = []
    toasts.value.push(toast)

    setTimeout(() => {
      remove(id)
    }, timeout)
  }

  return {
    toasts,
    open,
    remove,
  }
})
