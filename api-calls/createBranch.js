const fetch = require("node-fetch")

const createBranch = (owner, repo, token, branchName, commitHash) => {
  return fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/vnd.github+json",
    },
    body: JSON.stringify({
      ref: `refs/heads/${branchName}`,
      sha: commitHash,
    }),
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((response) => {
        throw new Error("creating git branch:\n" + response.message)
      })
    }
    return res.json()
  })
}

module.exports = createBranch
