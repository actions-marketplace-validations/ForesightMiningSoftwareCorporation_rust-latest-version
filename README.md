<p align="center">
  <a href="https://github.com/ForesightMiningSoftwareCorporation/rust-latest-version/actions"><img alt="typescript-action status" src="https://github.com/ForesightMiningSoftwareCorporation/rust-latest-version/workflows/build-test/badge.svg"></a>
</p>

# rust-latest-version GitHub Action

**rust-latest-version** is a GitHub Action that allows you to get the latest version of a crate from a registry index.

## Inputs

### `registry` (required)

Path to a registry index (cloned on disk).

### `crate` (required)

Name of the crate.

## Outputs

### `version`

The crate version

## Usage

To use this action in your GitHub Actions workflow, you can add the following step:

```yaml
- name: Get crates.io registry
  shell: bash
  run: |
    git clone https://github.com/rust-lang/crates.io-index ${{ runner.temp }}/rust-index
- name: Get Latest Rust Crate Version
  uses: ForesightMiningSoftwareCorporation/rust-latest-version@main
  with:
    registry: ${{ runner.temp }}/rust-index
    crate: my_crate
```

Replace /path/to/registry with the actual path to your registry index, and my_crate with the name of the crate whose latest version you want to fetch.

## Author

This GitHub Action is developed and maintained by ForesightMiningSoftwareCorporation.
