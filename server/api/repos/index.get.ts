export default defineEventHandler(async (event) => {
  const git = await useGitProvider(event)

  const res = await git.getUserRepos()

  return res.map(repo => ({
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    desc: repo.description,
    url: repo.html_url,
    private: repo.private,
    owner: {
      name: repo.owner.login,
      avatar: repo.owner.avatar_url,
      url: repo.owner.html_url,
    },
  }))
})
