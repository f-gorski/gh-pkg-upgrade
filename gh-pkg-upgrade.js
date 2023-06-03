const { Command } = require("commander")
const cliProgress = require("cli-progress")

const getCommits = require("./api-calls/getCommits")
const getPackageJson = require("./api-calls/getPackageJson")
const createBranch = require("./api-calls/createBranch")
const createCommit = require("./api-calls/createCommit")
const createPullRequest = require("./api-calls/createPullRequest")

const { base64ToJSON, JSONToBase64 } = require("./utils/base64")
const getDependencyType = require("./utils/get_dependency_type")
const updatePackageJson = require("./utils/update_package_json")

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

  const packageJson = base64ToJSON(packageJsonValue.content)
  const packageJsonHash = packageJsonValue.sha

  const dependencyType = getDependencyType(packageJson, packageName)
  const updatedPackageJson = updatePackageJson(
    packageJson,
    packageName,
    packageVersion,
    dependencyType
  )

  const encodedPackageJson = JSONToBase64(updatedPackageJson)

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
    packageJsonHash,
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
