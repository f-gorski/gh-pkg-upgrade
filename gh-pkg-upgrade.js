const { Command } = require("commander")
const cliProgress = require("cli-progress")

const getCommits = require("./api-calls/getCommits")
const getPackageJson = require("./api-calls/getPackageJson")
const createBranch = require("./api-calls/createBranch")
const createCommit = require("./api-calls/createCommit")
const createPullRequest = require("./api-calls/createPullRequest")

const main = async () => {
  const program = new Command()

  program
    .version("1.0.0")
    .description(
      "A simple JS script to remotely upgrade specified Github project dependencies"
    )
    .usage(
      "node gh-pkg-upgrade.js -n <...> -v <...> -o <...> -r <...> -t <...>"
    )
    .option("-n, --pkg-name <char>", "Name of the package to upgrade")
    .option("-v, --pkg-version <char>", "Version to upgrade the package to")
    .option("-o, --owner <char>", "Owner of the Github repository")
    .option("-r, --repo <char>", "Name of the Github repository")
    .option("-t, --token <char>", "Github repository access token")

  if (process.argv.length === 2) {
    console.log(program.help())
    process.exit(0)
  } else {
    program.parse()
  }

  const input = program.opts()

  const {
    pkgName: packageName,
    pkgVersion: packageVersion,
    owner,
    repo,
    token,
  } = input

  console.log("")

  const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  )

  console.log("Upgrading...")
  progressBar.start(100, 0)
  console.log("")

  console.log("")
  console.log("Getting commits...")

  const commits = await getCommits(owner, repo, token)

  const latestCommitHash = commits[0].sha

  progressBar.update(20)
  console.log("")
  console.log("")
  console.log("Getting package.json...")

  const packageJsonValue = await getPackageJson(
    owner,
    repo,
    token,
    latestCommitHash
  )

  //todo- separate function
  let buffer = new Buffer.from(packageJsonValue.content, "base64")
  let jsonString = buffer.toString("ascii")
  const packageJson = JSON.parse(jsonString)
  const sha = packageJsonValue.sha

  let dependencyType = ""

  if (packageJson?.dependencies?.hasOwnProperty(packageName)) {
    dependencyType = "dependencies"
  } else if (packageJson?.devDependencies?.hasOwnProperty(packageName)) {
    dependencyType = "devDependencies"
  } else {
    throw new Error(
      `Package with name ${packageName} not found in dependencies nor in devDependencies`
    )
  }

  const updatedPackageJson = {
    ...packageJson,
    [dependencyType]: {
      ...packageJson.dependencies,
      [packageName]: `^${packageVersion}`,
    },
  }

  buffer = new Buffer.from(JSON.stringify(updatedPackageJson, null, 2))
  const encodedPackageJson = buffer.toString("base64")

  progressBar.update(40)
  console.log("")
  console.log("")

  const newBranchName = `upgrade/${packageName}-${packageVersion}`

  console.log(`Creating git branch with a reference of "${newBranchName}"...`)

  const createdBranch = await createBranch(
    owner,
    repo,
    token,
    newBranchName,
    latestCommitHash
  )

  const branchName = createdBranch.ref.split("/").slice(-2).join("/")

  progressBar.update(60)
  console.log("")
  console.log("")
  console.log("Creating new remote commit...")

  await createCommit(
    owner,
    repo,
    token,
    encodedPackageJson,
    packageName,
    packageVersion,
    sha,
    branchName
  )

  progressBar.update(80)
  console.log("")
  console.log("")
  console.log("Opening remote pull request...")

  await createPullRequest(
    packageName,
    packageVersion,
    branchName,
    owner,
    repo,
    token
  )

  progressBar.update(100)
  progressBar.stop()

  console.log("")
  console.log("")
  console.log("\x1b[37;42mScript completed\x1b[0m")
  console.log(
    `\x1b[32mPull request to upgrade ${packageName} to version ${packageVersion} opened successfully in "${repo}" repo.`
  )

  process.exit(0)
}

main().catch((error) => {
  console.log("\x1b[37;41mScript failed\x1b[0m")
  console.log(`\x1b[31m${error}`)
  return process.exit(1)
})
