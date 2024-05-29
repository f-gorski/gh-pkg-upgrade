# gh-pkg-upgrade

## GitHub Dependency Upgrader

A Node.js script that allows you to remotely upgrade specified dependencies in a GitHub project to a specified version. This tool is useful for maintaining project dependencies across multiple repositories and can be integrated into Continuous Integration (CI) environments for automated dependency management.

<img src="./example.png" alt="example script usage" width="600"/>

## Features

- Upgrade a specified dependency to a desired version in a GitHub repository.
- Authenticate using a fine-grained GitHub token.

## Prerequisites

- Node.js installed on your machine
- A fine-grained GitHub token with the necessary permissions to read and write to the repository

## Installation

1. Clone the repository and navigate to the project directory:
2. Install the necessary dependencies:

```sh
npm install
```

## Usage

To upgrade a dependency, run the script with the following options:

```sh
node gh-pkg-upgrade.js --pkg-name <package-name> --pkg-version <version> --owner <owner> --repo <repository> --token <github-token>
```

### Available options

- -n, --pkg-name <package-name>: Name of the package to upgrade (required)
- -v, --pkg-version <version>: Version to upgrade the package to (required)
- -o, --owner <owner>: Owner of the GitHub repository (required)
- -r, --repo <repository>: Name of the GitHub repository (required)
- -t, --token <github-token>: Fine-grained GitHub token (required)

Example

```sh
node gh-pkg-upgrade.js --pkg-name lodash --pkg-version 4.17.21 --owner my-github-username --repo my-repository --token ghp_abcdefghijklmnopqrstuvwxyz123456
```

### Important Note

This project is done as a leisure project and it's not recommended for production use in its current form. While it demonstrates useful concepts and provides basic functionality, it may lack the robustness and security required for production environments.
