<script setup lang="ts">
import { ChevronRight, FileText, Folder, FolderOpen, Loader2 } from 'lucide-vue-next'
import { TreeItem, TreeRoot } from 'reka-ui'
import { useFileTree } from './model/use-file-tree'

const { treeData, expandedNodes, status, handleExpandedChange } = await useFileTree()
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
        :style="{ paddingLeft: `${item.level + 0.5}rem` }"
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

<style lang="scss" scoped src="./styles.scss" />
