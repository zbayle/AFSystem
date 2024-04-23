import fs from 'fs';
import { exec } from 'child_process';

// The URL of your repository's API endpoint
const REPO_API_URL = 'https://api.github.com/repos/zbayle/AFSystem/commits/main';

// The path to a file where the latest commit hash will be stored
const COMMIT_HASH_FILE = './commit_hash.txt';

const checkForUpdates = async () => {
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
        });
      }
    });
  } catch (err) {
    console.error('Failed to fetch latest commit:', err);
  }
};

checkForUpdates();