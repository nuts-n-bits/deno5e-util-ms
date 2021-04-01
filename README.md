# Building Installable NPM Tarball for node
## Step1: To build tsc-complaiant ts files
`./build.sh`: from ./typescript to ./typescript-node, transforming each .ts file's import into that which tsc will accept
## To build out cjs js files
`tsc`: from ./typescript-node to ./ecmascript
## To create distributable tarball
`npm pack`

# Building for deno
There is no building, import directly.
