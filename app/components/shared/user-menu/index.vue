<script setup lang="ts">
import { LogOut, Settings } from 'lucide-vue-next'

const { user, clear } = useUserSession()
// const userStore = useUserStore()

async function handleLogout() {
  // userStore.clearProfile()
  await clear()
  await navigateTo('/login')
}
</script>

<template>
  <div
    v-if="user"
    class="user-menu"
  >
    <div
      class="user-info"
    >
      <img
        v-if="user.avatar"
        :src="user.avatar"
        class="user-avatar"
      >
      <div class="user-details">
        <span class="user-name">{{ user.login }}</span>
        <!-- <span
          v-if="session?.repo"
          class="user-repo"
        >
          <user class="icon-mini" />
          {{ session.repo.split('/')[1] }}
        </span> -->
      </div>
    </div>

    <div class="user-actions">
      <nuxt-link
        to="/select-repo"
        class="action-btn"
        title="Change Vault"
      >
        <settings class="icon-sm" />
      </nuxt-link>
      <button
        class="action-btn logout"
        @click="handleLogout"
      >
        <log-out class="icon-sm" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.03);
  border-top: 1px solid $border-color;
  margin-top: auto;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-size: 0.95rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-repo {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.65rem;
  font-weight: 500;
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: $text-muted;
  padding: 4px;
  border-radius: 4px;
  transition: all $transition-base;
  display: flex;

  &:hover {
    background-color: rgba(255, 50, 50, 0.1);
    color: #ff4d4d;
  }
}

.icon-logout {
  width: 16px;
}
</style>
