/**
 * README Generator Core
 * AI-powered README generation using OpenAI/Anthropic API
 */

const { TEMPLATES, generateFromTemplate } = require('./templates');

class ReadmeGenerator {
  constructor(options = {}) {
    this.options = {
      template: 'professional',
      aiProvider: options.aiProvider || 'openai',
      aiApiKey: options.aiApiKey || process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY,
      ...options,
    };
  }

  /**
   * 交互式收集项目信息
   */
  async promptProjectInfo(inquirer) {
    const questions = [
      {
        type: 'input',
        name: 'name',
        message: '📛 Project name:',
        default: require('child_process').execSync('git config --get user.name', {encoding: 'utf8'}).trim() || 'my-project',
      },
      {
        type: 'input',
        name: 'description',
        message: '📝 Project description:',
        default: 'A fantastic project that does something amazing.',
      },
      {
        type: 'input',
        name: 'author',
        message: '👤 Author name:',
        default: require('child_process').execSync('git config --get user.name', {encoding: 'utf8'}).trim() || '',
      },
      {
        type: 'input',
        name: 'email',
        message: '📧 Author email:',
        default: require('child_process').execSync('git config --get user.email', {encoding: 'utf8'}).trim() || '',
      },
      {
        type: 'list',
        name: 'template',
        message: '📋 Choose a template:',
        choices: Object.entries(TEMPLATES).map(([key, t]) => ({
          name: `${t.name} - ${t.description}`,
          value: key,
        })),
        default: 'professional',
      },
      {
        type: 'input',
        name: 'features',
        message: '✨ Features (comma separated):',
        default: 'Easy to use, Fast, Customizable',
      },
      {
        type: 'list',
        name: 'license',
        message: '📄 License:',
        choices: ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'ISC', 'Unlicense'],
        default: 'MIT',
      },
      {
        type: 'input',
        name: 'githubRepo',
        message: '🔗 GitHub repository (owner/repo):',
        default: '',
      },
      {
        type: 'confirm',
        name: 'useAI',
        message: '🤖 Use AI to enhance README?',
        default: false,
      },
    ];

    const answers = await inquirer.prompt(questions);
    
    // Parse features
    if (answers.features) {
      answers.features = answers.features.split(',').map(f => f.trim()).filter(Boolean);
    }

    return answers;
  }

  /**
   * 基于模板生成 README
   */
  generateFromTemplate(projectData) {
    return generateFromTemplate(projectData.template || this.options.template, projectData);
  }

  /**
   * 使用 AI 增强 README
   */
  async enhanceWithAI(readmeContent, projectData) {
    if (!this.options.aiApiKey) {
      console.warn('⚠️ No AI API key found, skipping AI enhancement');
      return readmeContent;
    }

    try {
      const response = await this.callAIAPI({
        model: this.options.aiProvider === 'anthropic' ? 'claude-3-sonnet-20240229' : 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are a professional technical writer. Enhance the README markdown content to be more compelling, well-structured, and professional. Keep all existing sections but improve the writing quality, add more detail where appropriate, and ensure consistent tone. Return only the improved markdown, no explanations.`
          },
          {
            role: 'user',
            content: `Current README:\n\n${readmeContent}\n\nProject Info:\n- Name: ${projectData.name}\n- Description: ${projectData.description}\n- Features: ${projectData.features?.join(', ') || 'N/A'}`
          }
        ],
        max_tokens: 4000,
      });

      return response;
    } catch (error) {
      console.error('⚠️ AI enhancement failed:', error.message);
      return readmeContent;
    }
  }

  /**
   * 调用 AI API
   */
  async callAIAPI(payload) {
    if (this.options.aiProvider === 'anthropic') {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.options.aiApiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: payload.model,
          messages: payload.messages,
          max_tokens: payload.max_tokens || 1024,
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } else {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.options.aiApiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    }
  }

  /**
   * 主生成方法
   */
  async generate(projectData, options = {}) {
    const {
      useAI = false,
      outputPath = './README.md',
      print = true,
    } = options;

    let readme = this.generateFromTemplate(projectData);

    if (useAI || (projectData.useAI && this.options.aiApiKey)) {
      readme = await this.enhanceWithAI(readme, projectData);
    }

    if (outputPath) {
      const fs = require('fs');
      fs.writeFileSync(outputPath, readme, 'utf8');
      console.log(`✅ README generated: ${outputPath}`);
    }

    if (print) {
      console.log('\n' + '═'.repeat(60));
      console.log(readme);
      console.log('═'.repeat(60));
    }

    return readme;
  }

  /**
   * 获取可用模板列表
   */
  listTemplates() {
    return Object.entries(TEMPLATES).map(([key, t]) => ({
      id: key,
      name: t.name,
      description: t.description,
      sections: t.sections,
    }));
  }
}

module.exports = ReadmeGenerator;
