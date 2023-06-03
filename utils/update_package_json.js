const updatePackageJson = (
  packageJson,
  packageName,
  packageVersion,
  dependencyType
) => {
  return {
    ...packageJson,
    [dependencyType]: {
      ...packageJson.dependencies,
      [packageName]: `^${packageVersion}`,
    },
  }
}

module.exports = updatePackageJson
