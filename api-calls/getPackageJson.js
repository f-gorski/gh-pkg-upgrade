const fetch = require("node-fetch")

const getPackageJson = (owner, repo, token, commitHash) => {
  return fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/package.json?ref=${commitHash}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    }
  ).then((res) => {
    if (!res.ok) {
      return res.json().then((response) => {
        throw new Error("getting package.json:\n" + response.message)
      })
    }
    return res.json()
  })
}

module.exports = getPackageJson
