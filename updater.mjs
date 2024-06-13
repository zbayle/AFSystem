import fs from 'fs';
import { exec } from 'child_process';

// The URL of your repository's API endpoint
const REPO_API_URL = 'https://api.github.com/repos/zbayle/AFSystem/commits/test-auto-update';

// The paths to the directories where your Node.js server and React app live
const AFSystem_DIR = './AFSystem';
const af_scanner_DIR = './af-scanner';

// The path to a file where the latest commit hash will be stored
const COMMIT_HASH_FILE = './commit_hash.txt';

const installDependencies = (dir) => {
  return new Promise((resolve, reject) => {
    exec(`cd ${dir} && npm install`, (err, stdout, stderr) => {
      if (err) {
        console.error(`Failed to install dependencies in ${dir}:`, err);
        reject(err);
      } else {
        console.log(`Dependencies installed successfully in ${dir}`);
        resolve();
      }
    });
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

  const fetch = (await import('node-fetch')).default;
  try {
    const res = await fetch(REPO_API_URL);
    const data = await res.json();
    const latestCommitHash = data.sha;

    fs.readFile(COMMIT_HASH_FILE, 'utf8', (err, currentCommitHash) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log('Commit hash file not found, creating it...');
          fs.writeFile(COMMIT_HASH_FILE, latestCommitHash, err => {
            if (err) {
              console.error('Failed to create commit hash file:', err);
            }
          });
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

          fs.writeFile(COMMIT_HASH_FILE, latestCommitHash, err => {
            if (err) {
              console.error('Failed to write commit hash file:', err);
            }
          });

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
      }
    });
  } catch (err) {
    console.error('Failed to fetch latest commit:', err);
  }
};

checkForUpdates();