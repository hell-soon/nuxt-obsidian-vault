import type { ModelRef } from 'vue'
import { Crepe } from '@milkdown/crepe'
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener'
import { replaceAll } from '@milkdown/kit/utils'
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
      defaultValue: model.value || '',
    })

    instance.editor
      .config((ctx) => {
        ctx.get(listenerCtx).markdownUpdated((_, markdown) => {
          if (model.value !== markdown) {
            model.value = markdown
          }
        })
      })
      .use(listener)

    await instance.create()
    crepe.value = instance
  })

  watch(model, (newVal) => {
    const instance = crepe.value
    if (instance && newVal !== undefined && newVal !== instance.getMarkdown()) {
      instance.editor.action(replaceAll(newVal))
    }
  })

  onBeforeUnmount(() => {
    crepe.value?.destroy()
  })
}
