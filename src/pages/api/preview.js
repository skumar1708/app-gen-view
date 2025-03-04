// pages/api/preview.js
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { Base64 } from 'js-base64';
import { v4 as uuidv4 } from 'uuid';
import getPort from 'get-port';

const token = "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";

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { owner, repo, filePath } = JSON.parse(req.body);

  if (!owner || !repo || !filePath) {
    return res.status(400).json({ error: 'Missing repository details.' });
  }

  const tempDir = path.join(process.cwd(), '.temp-preview');
  const previewId = uuidv4();
  const previewDir = path.join(tempDir, previewId);
  const pagesDir = path.join(previewDir, 'pages');
  const publicDir = path.join(previewDir, 'public');

  try {
    // Fetch the directory contents from GitHub
    const githubResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    const githubData = await githubResponse.json();

    // Clean up the temp directory if it exists
    await fs.rm(tempDir, { recursive: true, force: true });

    // Create the preview directory and subdirectories
    await fs.mkdir(pagesDir, { recursive: true });
    await fs.mkdir(publicDir, { recursive: true });

    // Recursive function to create files and directories
    const processFiles = async (files, basePath) => {
      for (const file of files) {
        const fullPath = path.join(previewDir, basePath, file.name);

        if (file.type === 'dir') {
          await fs.mkdir(fullPath, { recursive: true });
          const subFilesResponse = await fetch(file.url);
          const subFilesData = await subFilesResponse.json();
          await processFiles(subFilesData, path.join(basePath, file.name));
        } else if (file.type === 'file') {
          const fileContentResponse = await fetch(file.download_url);
          const fileContent = await fileContentResponse.text();
          await fs.writeFile(fullPath, fileContent);
        }
      }
    };

    await processFiles(githubData, '');

    //Run npm install
    console.log("Installing dependencies...");
    await new Promise((resolve, reject) => {
      exec("npm install", { cwd: previewDir }, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

    // Build the Next.js app
    console.log("Building project...");
    await new Promise((resolve, reject) => {
      exec('npm run build', { cwd: previewDir }, (error, stdout, stderr) => {
        if (error) {
          console.error(stderr);
          reject(error);
        } else {
          resolve();
        }
      });
    });

    // Find an available port
    const port = await getPort();
    
      // Run npx serve on the available port
      console.log("Starting application on port: " + port);
      const serveProcess = exec(`npx serve -p ${port} build`, { cwd: previewDir });

     // Wait for the serve command to indicate server startup (adapt to your serve script's output)
    //  await new Promise((resolve, reject) => {
    //     serveProcess.stdout.on('data', (data) => {
    //       if (data.includes(`Serving! http://localhost:${port}`)) {
    //         resolve();
    //       }
    //     });
  
    //     serveProcess.stderr.on('data', (data) => {
    //       console.error('serve server stderr:', data);
    //     });
  
    //     serveProcess.on('error', (error) => {
    //       reject(error);
    //     });
    //   });

    // Return the preview URL
    res.status(200).json({ previewId, previewUrl: `http://localhost:${port}` });
  } catch (error) {
    console.error('Error building preview:', error);
    res.status(500).json({ error: error.message });
  }
}

export default handler;