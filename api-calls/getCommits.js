const fetch = require("node-fetch")

const getCommits = (owner, repo, token) => {
  return fetch(`https://api.github.com/repos/${owner}/${repo}/commits`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((response) => {
        throw new Error("getting commits:\n" + response.message)
      })
    }
    return res.json()
  })
}

module.exports = getCommits
