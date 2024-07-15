import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
// Adjust these paths as necessary
const buildCommand = "yarn workspace @thatrundown/extension build";
const packageCommand = "yarn workspace @thatrundown/extension package";
const sourceZipPath = "./apps/extension/build/chrome-mv3-prod.zip"; // Adjust based on your actual output path
// Common Chrome extension directory on Windows. Adjust for macOS or Linux, and specific Chrome profile

const homeDir = os.homedir();

const windowsPath = path.join(
  homeDir,
  "AppData",
  "Local",
  "Google",
  "Chrome",
  "User Data",
  "Default",
  "Extensions"
);

const macPath = path.join(
  homeDir,
  "Library",
  "Application Support",
  "Google",
  "Chrome",
  "Default",
  "Extensions"
);

const linuxPath = path.join(
  homeDir,
  ".config",
  "google-chrome",
  "Default",
  "Extensions"
);

const chromeExtensionDir =
  os.platform() === "win32"
    ? windowsPath
    : os.platform() === "darwin"
      ? macPath
      : linuxPath;

function runCommand(command: string) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return reject(error);
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      resolve(0);
    });
  });
}

async function main() {
  try {
    // Run build and package commands
    await runCommand(buildCommand);
    await runCommand(packageCommand);

    // Copy ZIP file to Chrome extension directory
    const targetPath = path.join(
      chromeExtensionDir,
      path.basename(sourceZipPath)
    );
    // extract the zip file in to a folder named after the extension id
    const extensionId = path.basename(sourceZipPath, ".zip");
    const extensionDir = path.join(chromeExtensionDir, extensionId);
    fs.mkdirSync(extensionDir, { recursive: true });
    // Copy the zip file to the extension directory
    fs.copyFileSync(sourceZipPath, targetPath);
    // unzip the file
    await runCommand(`unzip -o ${targetPath} -d ${extensionDir}`);

    console.log(`Extension packaged and copied to ${targetPath}`);
  } catch (error) {
    console.error("Failed to build, package, or copy extension:", error);
  }
}

main();
