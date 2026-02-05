<script setup lang="ts">
import { LogOut, User } from 'lucide-vue-next'

const { user, clear } = useUserSession()

async function handleLogout() {
  await clear()
  await navigateTo('/login')
}
</script>

<template>
  <div
    v-if="user"
    class="user-menu"
  >
    <div class="user-info">
      <img
        v-if="user.avatar"
        :src="user.avatar"
        class="user-avatar"
        alt="Avatar"
      >
      <span class="user-name">{{ user.login }}</span>
    </div>

    <button
      class="logout-btn"
      title="Logout"
      @click="handleLogout"
    >
      <log-out class="icon-logout" />
    </button>
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
  margin-top: auto; // Прижмет меню к низу сайдбара
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
