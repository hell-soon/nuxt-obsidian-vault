export interface FileNode {
  id: string
  name: string
  type: 'file' | 'dir'
  children?: FileNode[]
  loading?: boolean
  isLoaded?: boolean
}

export async function useFileTree() {
  const treeData = ref<FileNode[]>([])
  const expandedNodes = ref<string[]>([])
  const { session } = useUserSession()

  const { data, status } = await useFetch<FileNode[]>('/api/notes/tree', {
    key: computed(() => `notes-tree-${session.value?.repo}`),
    immediate: !!session.value?.repo,
  })

  function findNode(nodes: FileNode[], id: string): FileNode | undefined {
    for (const node of nodes) {
      if (node.id === id)
        return node
      if (node.children) {
        const found = findNode(node.children, id)
        if (found)
          return found
      }
    }
  }

  watch(() => session.value?.repo, (newRepo) => {
    if (!newRepo) {
      treeData.value = []
      expandedNodes.value = []
    }
  }, { immediate: true })

  watch(data, (newVal) => {
    if (newVal) {
      treeData.value = newVal.map(node => ({
        ...node,
        children: node.type === 'dir' ? [] : undefined,
        isLoaded: false,
      }))
    }
    else {
      treeData.value = []
    }
  }, { immediate: true })

  async function handleExpandedChange(newExpandedState: string[]) {
    expandedNodes.value = newExpandedState

    for (const id of newExpandedState) {
      const node = findNode(treeData.value, id)

      if (node && node.type === 'dir' && !node.isLoaded && !node.loading) {
        node.loading = true

        try {
          const res = await $fetch<FileNode[]>('/api/notes/tree', {
            query: { path: id },
          })

          node.children = res.map(n => ({
            ...n,
            children: n.type === 'dir' ? [] : undefined,
            isLoaded: false,
          }))

          node.isLoaded = true
          node.loading = false

          treeData.value = [...treeData.value]
        }
        catch (e) {
          console.error(e)
          node.loading = false
        }
      }
    }
  }

  return {
    treeData: treeData as Ref<FileNode[]>,
    expandedNodes: expandedNodes as Ref<string[]>,
    status,
    handleExpandedChange,
  }
}
