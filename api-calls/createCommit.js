const fetch = require("node-fetch")

const createCommit = (
  owner,
  repo,
  token,
  updatedFile,
  packageName,
  packageVersion,
  sha,
  branchName
) => {
  return fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/package.json`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: `chore: Bump ${packageName} to version ${packageVersion}`,
        content: updatedFile,
        sha: sha,
        branch: branchName,
      }),
    }
  ).then((res) => {
    if (!res.ok) {
      return res.json().then((response) => {
        throw new Error("creating git commit:\n" + response.message)
      })
    }
    return res.json()
  })
}

module.exports = createCommit
