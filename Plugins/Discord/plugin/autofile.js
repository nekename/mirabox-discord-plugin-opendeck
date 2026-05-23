const path = require('path');

const fs = require('fs-extra');
const currentDir = __dirname;

// Get parent folder path
const parentDir = path.join(currentDir, '..');
// Get parent folder name
const PluginName = path.basename(parentDir);

const PluginPath = path.join(process.env.APPDATA, 'HotSpot/StreamDock/plugins', PluginName);

try {
  // Delete old plugin directory
  fs.removeSync(PluginPath);

  // Ensure target directory exists
  fs.ensureDirSync(path.dirname(PluginPath));

  // Copy current directory to target path, excluding node_modules
  fs.copySync(path.resolve(__dirname, '..'), PluginPath, {
    filter: (src) => {
      const relativePath = path.relative(path.resolve(__dirname, '..'), src);
      // Exclude 'node_modules' and '.git' directories and their subfiles
      return (
        !relativePath.startsWith('plugin\\node_modules') &&
        !relativePath.startsWith('plugin\\index.js') &&
        !relativePath.startsWith('plugin\\package.json') &&
        !relativePath.startsWith('plugin\\package-lock.json') &&
        !relativePath.startsWith('plugin\\pnpm-lock.yaml') &&
        !relativePath.startsWith('plugin\\yarn.lock') &&
        !relativePath.startsWith('plugin\\build') &&
        !relativePath.startsWith('plugin\\log') &&
        !relativePath.startsWith('.git') &&
        !relativePath.startsWith('.vscode')
      );
    },
  });

  fs.copySync(path.join(__dirname, 'build'), path.join(PluginPath, 'plugin'));

  console.log(`Plugin "${PluginName}" successfully copied to "${PluginPath}"`);
  console.log('Build successful-------------');
} catch (err) {
  console.error(`Copy error "${PluginName}":`, err);
}
