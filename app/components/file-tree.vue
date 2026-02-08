<script setup lang="ts">
import { ChevronRight, FileText, Folder, FolderOpen, Loader2 } from 'lucide-vue-next'
import { TreeItem, TreeRoot } from 'reka-ui'

interface FileNode {
  id: string
  name: string
  type: 'file' | 'dir'
  children?: FileNode[]
  loading?: boolean
  isLoaded?: boolean
}
const treeData = ref<FileNode[]>([])
const expandedNodes = ref<string[]>([])

const { data, status } = await useFetch<FileNode[]>('/api/notes/tree')

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

watch(data, (newVal) => {
  if (newVal) {
    treeData.value = newVal.map(node => ({
      ...node,
      children: node.type === 'dir' ? [] : undefined,
      isLoaded: false,
    }))
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
</script>

<template>
  <div class="sidebar-tree">
    <div
      v-if="status === 'pending' && !treeData.length"
      class="tree-loading"
    >
      <loader2 class="icon-spin" />
      <span>Connecting to Vault...</span>
    </div>

    <tree-root
      v-if="treeData.length"
      v-slot="{ flattenItems }"
      v-model:expanded="expandedNodes"
      :items="treeData"
      :get-key="(item) => item.id"
      class="tree-root"
      @update:expanded="handleExpandedChange"
    >
      <tree-item
        v-for="item in flattenItems"
        :key="item._id"
        v-slot="{ isExpanded }"
        v-bind="item.bind"
        class="tree-item"
        :style="{ paddingLeft: `${item.level * 16 + 8}px` }"
      >
        <template v-if="item.value.type === 'dir'">
          <div class="folder-row">
            <chevron-right
              class="icon-chevron"
              :class="{ 'icon-chevron--open': isExpanded }"
            />
            <component
              :is="isExpanded ? FolderOpen : Folder"
              class="icon-folder"
            />
            <span class="label">{{ item.value.name }}</span>
            <loader2
              v-if="item.value.loading"
              class="icon-spin-small"
            />
          </div>
        </template>

        <template v-else>
          <nuxt-link
            :to="`/notes/${item.value.id}`"
            class="file-link"
            active-class="active"
            @click.stop
          >
            <file-text class="icon-file" />
            <span class="label">{{ item.value.name }}</span>
          </nuxt-link>
        </template>
      </tree-item>
    </tree-root>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-tree {
  height: 100%;
  overflow-y: auto;
}

.tree-root {
  display: flex;
  flex-direction: column;
  padding: 4px 0;
}

.tree-item {
  display: flex;
  align-items: center;
  min-height: 32px;
  cursor: pointer;
  border-radius: $radius-sm;
  color: $text-muted;
  margin: 0 8px;
  transition: background 0.1s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  &[data-selected='true'] {
    background: rgba($accent-primary, 0.1);
  }
}

.folder-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  font-size: 13px;
}

.file-link {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: inherit;
  font-size: 13px;

  &.active {
    color: $accent-primary;
    font-weight: 600;
  }
}

.icon {
  &-chevron {
    width: 14px;
    transition: transform 0.2s;
    opacity: 0.5;
    &--open {
      transform: rotate(90deg);
      opacity: 1;
    }
  }
  &-folder {
    width: 16px;
    color: $accent-primary;
    flex-shrink: 0;
  }
  &-file {
    width: 16px;
    opacity: 0.6;
    flex-shrink: 0;
  }
  &-spin {
    animation: spin 1s linear infinite;
    &-small {
      @extend .icon-spin;
      width: 12px;
      margin-left: auto;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
