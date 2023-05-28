const fetch = require("node-fetch")

const createPullRequest = (
  packageName,
  packageVersion,
  branchName,
  owner,
  repo,
  token
) => {
  const pullRequestBody = {
    title: `Upgrade ${packageName} to version ${packageVersion}`,
    head: branchName,
    base: "main",
  }

  return fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/vnd.github+json",
    },
    body: JSON.stringify(pullRequestBody),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((response) => {
        throw new Error("creating pull request:\n" + response.message)
      })
    }
    return res.json()
  })
}

module.exports = createPullRequest
