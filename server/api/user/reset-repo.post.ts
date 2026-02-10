export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  await setUserSession(event, {
    ...session,
    repo: null,
  })

  return { success: true }
})
