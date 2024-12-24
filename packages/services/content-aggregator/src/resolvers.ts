import axios from 'axios';
import path from 'path';

const GITHUB_API_BASE = 'https://api.github.com';

const isTextFile = (fileName: string): boolean => {
  const allowedExtensions = ['.txt', '.md', '.json', '.yml', '.yaml', '.html'];
  const extension = path.extname(fileName).toLowerCase();
  return allowedExtensions.includes(extension);
};

const getGitHubFiles = async (
  owner: string,
  repo: string,
  rootDir: string,
  pattern?: string
): Promise<any[]> => {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents${rootDir}`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer YOUR_PERSONAL_ACCESS_TOKEN` },
    });

    return response.data.filter((file: any) => {
      if (file.type === 'file') {
        return pattern ? file.name.match(pattern) : true;
      }
      return false;
    });
  } catch (err: any) {
    throw new Error(`Failed to fetch files from the GitHub API: ${err.message}`);
  }
};

const createMarkdownFile = (files: any[]): string => {
  return files
    .map((file) => {
      return `# ${file.name}\n\n${file.content || ''}`;
    })
    .join('\n\n');
};

export const resolvers = {
  Query: {
    contentAggregator: async (
      _: any,
      { pattern, repoName, owner, rootDir = '/', preset }: any
    ) => {
      try {
        const files = await getGitHubFiles(owner, repoName, rootDir, pattern);

        const invalidFile = files.find((file) => !isTextFile(file.name));
        if (invalidFile) {
          return {
            success: false,
            markdownFile: null,
            error: `Non-textual file detected: ${invalidFile.name}`,
          };
        }

        const markdownFile = createMarkdownFile(files);

        return {
          success: true,
          markdownFile,
          error: null,
        };
      } catch (err: any) {
        return {
          success: false,
          markdownFile: null,
          error: err.message,
        };
      }
    },

    folderStructure: async (_: any, { repoName, owner, rootDir = '/' }: any) => {
      const url = `${GITHUB_API_BASE}/repos/${owner}/${repoName}/contents${rootDir}`;

      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer YOUR_PERSONAL_ACCESS_TOKEN` },
        });

        return {
          root: rootDir,
          structure: response.data.map((entry: any) => ({
            fullPath: entry.path,
            type: entry.type.toUpperCase(),
            name: entry.name,
          })),
        };
      } catch (err: any) {
        throw new Error(`Failed to fetch folder structure from GitHub: ${err.message}`);
      }
    },
  },
};