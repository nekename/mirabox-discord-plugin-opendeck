const path = require('path');
const fs = require('fs-extra');

console.log('Starting automated build...');

const currentDir = __dirname;

// Get parent folder path
const parentDir = path.join(currentDir, '..');
// Get parent folder name
const PluginName = path.basename(parentDir);

const PluginPath = path.join(process.env.APPDATA, 'HotSpot/StreamDock/plugins', PluginName);

try {
  // Delete old plugin directory
  fs.removeSync(path.join(PluginPath, 'propertyInspector'));

  // Ensure target directory exists
  fs.ensureDirSync(path.dirname(PluginPath));

  // Copy current directory to target path, excluding node_modules
  fs.copySync(path.join(path.resolve(__dirname, '..'), 'propertyInspector'), path.join(PluginPath, 'propertyInspector'));

  console.log(`Plugin "${PluginName}" successfully copied to "${PluginPath}"`);
  console.log('Build successful-------------');
} catch (err) {
  console.error(`Copy error "${PluginName}":`, err);
}
