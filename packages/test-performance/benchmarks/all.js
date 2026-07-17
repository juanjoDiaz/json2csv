import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);

async function run(scriptUrl) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [fileURLToPath(scriptUrl), ...args], {
      stdio: 'inherit',
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else
        reject(
          new Error(`${fileURLToPath(scriptUrl)} exited with code ${code}`),
        );
    });
  });
}

await run(new URL('./index.js', import.meta.url));
await run(new URL('./browser.js', import.meta.url));
