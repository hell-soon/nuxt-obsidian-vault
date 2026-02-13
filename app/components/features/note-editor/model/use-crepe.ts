import type { ModelRef } from 'vue'
import { Crepe } from '@milkdown/crepe'
import '@milkdown/crepe/theme/common/style.css'
import '@milkdown/crepe/theme/nord-dark.css'

export function useCrepe(
  elRef: Ref<HTMLElement | null>,
  model: ModelRef<string | undefined>,
) {
  const crepe = shallowRef<Crepe | null>(null)

  onMounted(async () => {
    if (!elRef.value)
      return

    const instance = new Crepe({
      root: elRef.value,
      defaultValue: model.value,
    })

    await instance.create()
    crepe.value = instance
  })

  onBeforeUnmount(() => {
    crepe.value?.destroy()
  })
}
