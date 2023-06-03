const getDependencyType = (packageJson, packageName) => {
  if (packageJson?.dependencies?.hasOwnProperty(packageName)) {
    return "dependencies"
  } else if (packageJson?.devDependencies?.hasOwnProperty(packageName)) {
    return "devDependencies"
  } else {
    throw new Error(
      `Package with name ${packageName} not found in dependencies \nnor in devDependencies`
    )
  }
}

module.exports = getDependencyType
