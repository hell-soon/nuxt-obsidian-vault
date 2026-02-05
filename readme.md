# 🚀 Nuxt Obsidian Vault (Git-Native Note Editor)

**Платформа:** Nuxt 4 (Vue 3, Nitro)
**Стек:** TypeScript, Reka UI, SCSS, GitHub API, Nuxt Auth Utils
**Цель:** Создание self-hosted веб-приложения для просмотра, редактирования и коммита Markdown-заметок (Obsidian Vault) напрямую в GitHub-репозиторий пользователя.

---

## 🏗 Архитектура проекта

Проект построен по принципам **модифицированного FSD (Feature-Sliced Design)**, с акцентом на четкое разделение между клиентской и серверной логикой, что критически важно для Serverless-развертывания (Vercel).

- **Frontend (Nuxt App):**
  - Использует **Reka UI** (Headless components) для доступности и гибкости.
  - **Ленивая загрузка** дерева файлов (FileTree) для масштабируемости.
  - Использует **`useFetch` / `useAsyncData`** для эффективной гидратации и кеширования данных.
- **Backend (Nitro Serverless Functions):**
  - Слой **`server/utils/git.ts`** инкапсулирует всю логику работы с GitHub API (Octokit/Fetch).
  - Использует **`nuxt-auth-utils`** для OAuth-авторизации и защищенного хранения `GitHub Access Token` в зашифрованной куки-сессии.
  - Эндпоинты: `GET /api/notes/tree`, `GET /api/notes/content`, `PUT /api/notes/commit`.

---

## 🤝 Вклад

Если вы хотите предложить улучшения, найдите ошибки или оптимизировать код (например, добавить VueUse или улучшить логику рекурсивного патчинга Reka UI), пожалуйста, создавайте Pull Requests.
