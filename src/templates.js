/**
 * README Templates
 * 预设的 README 模板集合
 */

const TEMPLATES = {
  simple: {
    name: 'Simple',
    description: '简洁风格，适合小型项目',
    sections: ['title', 'description', 'installation', 'usage', 'license'],
  },

  professional: {
    name: 'Professional',
    description: '专业风格，适合开源项目',
    sections: ['title', 'badge', 'description', 'table-of-contents', 'installation', 'usage', 'features', 'contributing', 'license', 'contact'],
  },

  detailed: {
    name: 'Detailed',
    description: '详细风格，适合大型项目',
    sections: ['title', 'banner', 'badge', 'description', 'table-of-contents', 'installation', 'usage', 'examples', 'features', 'architecture', 'api', 'contributing', 'changelog', 'license', 'contact', 'acknowledgments'],
  },

  minimal: {
    name: 'Minimal',
    description: '极简风格',
    sections: ['title', 'description', 'usage'],
  },

  api: {
    name: 'API Project',
    description: '适合 API/SDK 项目',
    sections: ['title', 'badge', 'description', 'table-of-contents', 'installation', 'quick-start', 'authentication', 'endpoints', 'examples', 'sdk', 'rate-limit', 'license', 'contact'],
  },

  cli: {
    name: 'CLI Tool',
    description: '适合命令行工具',
    sections: ['title', 'badge', 'description', 'table-of-contents', 'installation', 'quick-start', 'commands', 'configuration', 'examples', 'faq', 'license', 'contact'],
  },
};

/**
 * 生成模板对应的 Markdown 内容
 */
function generateFromTemplate(templateName, projectData) {
  const template = TEMPLATES[templateName];
  if (!template) throw new Error(`Template "${templateName}" not found`);

  let md = '';

  for (const section of template.sections) {
    md += renderSection(section, projectData);
    md += '\n\n';
  }

  return md.trim();
}

function renderSection(section, data) {
  const { name, description, author, version, license, repo, homepage } = data;

  switch (section) {
    case 'title':
      return `# ${name || 'Project Name'}\n`;
    
    case 'banner':
      return `![${name} Banner](${data.bannerUrl || 'https://via.placeholder.com/1200x400?text=Project+Banner'})\n`;
    
    case 'badge':
      return [
        `![Version](https://img.shields.io/badge/version-${encodeURIComponent(version || '1.0.0')}-blue)`,
        `![License](https://img.shields.io/badge/license-${encodeURIComponent(license || 'MIT')}-green)`,
        `![Build](https://img.shields.io/badge/build-passing-brightgreen)`,
        repo ? `![Stars](https://img.shields.io/github/stars/${repo}?style=social)` : '',
      ].filter(Boolean).join(' ') + '\n';
    
    case 'description':
      return `## 📖 Description\n\n${description || 'A fantastic project that does something amazing.'}\n`;
    
    case 'table-of-contents':
      return `## 📋 Table of Contents\n\n- [Installation](#installation)\n- [Usage](#usage)\n- [Features](#features)\n- [Contributing](#contributing)\n- [License](#license)\n- [Contact](#contact)\n`;
    
    case 'installation':
      return `## 🚀 Installation\n\n\`\`\`bash\nnpm install ${data.packageName || name?.toLowerCase().replace(/\s+/g, '-') || 'your-package'}\n\`\`\`\n`;
    
    case 'usage':
      return `## 📖 Usage\n\n\`\`\`javascript\nconst ${name?.replace(/[^a-zA-Z0-9]/g, '') || 'project'} = require('${data.packageName || 'your-package'}');\n\n// Quick start\n${data.usageCode || '// Your code here'}\n\`\`\`\n`;
    
    case 'examples':
      return `## 💡 Examples\n\n### Basic Example\n\n\`\`\`javascript\n${data.exampleCode || '// See documentation for more examples'}\n\`\`\`\n`;
    
    case 'features':
      return `## ✨ Features\n\n${(data.features || ['Feature 1', 'Feature 2', 'Feature 3']).map(f => `- ${f}`).join('\n')}\n`;
    
    case 'architecture':
      return `## 🏗 Architecture\n\n${data.architecture || 'See the architecture diagram below...'}\n`;
    
    case 'api':
      return `## 🔌 API Reference\n\n### Methods\n\n| Method | Description |\n|--------|-------------|\n${(data.apiMethods || [{name: 'methodName', desc: 'Description'}]).map(m => `| \`${m.name}\` | ${m.desc} |`).join('\n')}\n`;
    
    case 'contributing':
      return `## 🤝 Contributing\n\nContributions are welcome! Please feel free to submit a Pull Request.\n\n1. Fork the repository\n2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)\n3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)\n4. Push to the branch (\`git push origin feature/AmazingFeature\`)\n5. Open a Pull Request\n`;
    
    case 'changelog':
      return `## 📝 Changelog\n\n### [1.0.0] - ${new Date().toISOString().split('T')[0]}\n\n- Initial release\n`;
    
    case 'license':
      return `## 📄 License\n\nThis project is licensed under the ${license || 'MIT'} License - see the [LICENSE](LICENSE) file for details.\n`;
    
    case 'contact':
      return `## 📧 Contact\n\n${author ? `**Author:** ${author}` : ''}\n\n${homepage ? `[Project Homepage](${homepage})` : ''}\n`;
    
    case 'acknowledgments':
      return `## 🙏 Acknowledgments\n\n- Thanks to all contributors\n- Inspired by ${data.inspiredBy || 'awesome projects'}\n`;
    
    case 'quick-start':
      return `## ⚡ Quick Start\n\n\`\`\`bash\n# Install\nnpm install ${data.packageName || name?.toLowerCase().replace(/\s+/g, '-') || 'your-package'}\n\n# Run\n${data.quickStartCommand || 'npm start'}\n\`\`\`\n`;
    
    case 'authentication':
      return `## 🔐 Authentication\n\n${data.authDescription || 'API key authentication is required. Get your API key from the dashboard.'}\n\n\`\`\`bash\ncurl -H "Authorization: Bearer YOUR_API_KEY" ${homepage || 'https://api.example.com'}/endpoint\n\`\`\`\n`;
    
    case 'endpoints':
      return `## 📡 Endpoints\n\n### GET /resource\n\nReturns a list of resources.\n\n**Parameters:**\n- \`limit\` (optional): Max results\n- \`offset\` (optional): Pagination offset\n`;
    
    case 'sdk':
      return `## 🛠 SDKs\n\nAvailable for:\n- [Node.js](${data.nodeSdkUrl || '#'})\n- [Python](${data.pythonSdkUrl || '#'})\n- [Go](${data.goSdkUrl || '#'})\n`;
    
    case 'rate-limit':
      return `## ⚙ Rate Limit\n\nDefault rate limit: ${data.rateLimit || '100'} requests per minute.\n`;
    
    case 'commands':
      return `## 📦 Commands\n\n| Command | Description |\n|---------|-------------|\n${(data.commands || [{cmd: 'start', desc: 'Start the CLI'}]).map(c => `| \`${c.cmd}\` | ${c.desc} |`).join('\n')}\n`;
    
    case 'configuration':
      return `## ⚙ Configuration\n\nCreate a \`.clirc\` or \`${name?.toLowerCase().replace(/\s+/g, '')}rc.js\` file:\n\n\`\`\`javascript\nmodule.exports = {\n  apiKey: 'your-api-key',\n  output: './dist'\n};\n\`\`\`\n`;
    
    case 'faq':
      return `## ❓ FAQ\n\n**Q: How to get an API key?**\nA: Sign up at ${homepage || 'our website'} to get your API key.\n`;
    
    default:
      return '';
  }
}

module.exports = { TEMPLATES, generateFromTemplate };
