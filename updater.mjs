import fs from 'fs';
import { exec } from 'child_process';
import fetch from 'node-fetch';

// The URL of your repository's API endpoint
const REPO_API_URL = 'https://api.github.com/repos/zbayle/AFSystem';

// The paths to the directories where your Node.js server and React app live
// Use path.resolve to construct absolute paths
const AFSystem_DIR = path.resolve(__dirname, 'AFSystem');
const af_scanner_DIR = path.resolve(__dirname, 'af-scanner');

// The path to a file where the latest commit hash will be stored
const COMMIT_HASH_FILE = path.resolve(__dirname, 'commit_hash.txt');

const installDependencies = (dir) => {
  return new Promise((resolve, reject) => {
    // Check if the directory exists
    if (fs.existsSync(dir)) {
      exec(`cd ${dir} && npm install`, (err, stdout, stderr) => {
        if (err) {
          console.error(`Failed to install dependencies in ${dir}:`, err);
          reject(err);
        } else {
          console.log(`Dependencies installed successfully in ${dir}`);
          resolve();
        }
      });
    } else {
      console.error(`Directory ${dir} does not exist.`);
      reject(new Error(`Directory ${dir} does not exist.`));
    }
  });
};

const ensureNodeFetchInstalled = () => {
  exec('npm list node-fetch', (err, stdout, stderr) => {
    if (err || !stdout.includes('node-fetch')) {
      console.log('node-fetch not found, installing...');
      exec('npm install node-fetch', (err, stdout, stderr) => {
        if (err) {
          console.error('Failed to install node-fetch:', err);
        } else {
          console.log('node-fetch installed successfully');
        }
      });
    }
  });
};

const checkForUpdates = async () => {
  ensureNodeFetchInstalled();

  try {
    // Correct endpoint to fetch the latest commit hash
    const res = await fetch(`${REPO_API_URL}/commits?per_page=1`);
    const commits = await res.json();
    if (commits.length === 0) {
      console.error('No commits found in the repository.');
      return;
    }
    const latestCommitHash = commits[0].sha;

    fs.readFile(COMMIT_HASH_FILE, 'utf8', (err, currentCommitHash) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log('Commit hash file not found, creating it...');
          // Ensure latestCommitHash is defined before writing
          if (latestCommitHash) {
            fs.writeFile(COMMIT_HASH_FILE, latestCommitHash, err => {
              if (err) {
                console.error('Failed to create commit hash file:', err);
              } else {
                console.log('Commit hash file created successfully.');
              }
            });
          }
        } else {
          console.error('Failed to read commit hash file:', err);
        }
        return;
      }

      if (latestCommitHash !== currentCommitHash) {
        console.log('Update found, pulling changes...');

        exec('git pull', (err, stdout, stderr) => {
          if (err) {
            console.error('Failed to pull changes:', err);
            return;
          }

          console.log('Changes pulled successfully');

          // Ensure latestCommitHash is defined before writing
          if (latestCommitHash) {
            fs.writeFile(COMMIT_HASH_FILE, latestCommitHash, err => {
              if (err) {
                console.error('Failed to write commit hash file:', err);
              } else {
                console.log('Commit hash file updated successfully.');
              }
            });
          }

          // Install dependencies after pulling changes
          Promise.all([
            installDependencies(AFSystem_DIR),
            installDependencies(af_scanner_DIR)
          ]).then(() => {
            exec(`cd ${AFSystem_DIR} && npm start`, (err, stdout, stderr) => {
              if (err) {
                console.error(`Failed to start server in ${AFSystem_DIR}:`, err);
              } else {
                console.log(`Server started successfully in ${AFSystem_DIR}`);
              }
            });

            exec(`cd ${af_scanner_DIR} && npm start`, (err, stdout, stderr) => {
              if (err) {
                console.error(`Failed to start server in ${af_scanner_DIR}:`, err);
              } else {
                console.log(`Server started successfully in ${af_scanner_DIR}`);
              }
            });
          });
        });
      } else {
        console.log('No updates found.');
      }
    });
  } catch (err) {
    console.error('Failed to fetch latest commit:', err);
  }
};

checkForUpdates();