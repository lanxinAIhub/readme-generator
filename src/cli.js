#!/usr/bin/env node

/**
 * README Generator CLI
 * 命令行工具入口
 */

const { Command } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');
const ReadmeGenerator = require('./generator');
const fs = require('fs');
const path = require('path');

const program = new Command();

console.log(chalk.cyan(figlet.textSync('README Gen', { horizontalLayout: 'full' })));
console.log(chalk.gray('━'.repeat(60)));
console.log(chalk.gray('AI-powered README generator\n'));

program
  .name('readme-gen')
  .description('Generate beautiful README files with AI assistance')
  .version('1.0.0');

program
  .command('generate')
  .alias('gen')
  .description('Generate a new README file')
  .option('-t, --template <name>', 'Template to use', 'professional')
  .option('-o, --output <path>', 'Output file path', './README.md')
  .option('-i, --interactive', 'Use interactive mode', false)
  .option('--ai', 'Enable AI enhancement', false)
  .option('--no-print', 'Do not print to console', false)
  .action(async (options) => {
    const generator = new ReadmeGenerator();
    
    let projectData;
    
    if (options.interactive || !fs.existsSync('./package.json')) {
      projectData = await generator.promptProjectInfo(inquirer);
    } else {
      // Auto-detect from package.json
      try {
        const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
        projectData = {
          name: pkg.name || path.basename(process.cwd()),
          description: pkg.description || 'A fantastic project.',
          author: pkg.author || '',
          version: pkg.version || '1.0.0',
          license: pkg.license || 'MIT',
          features: pkg.keywords || [],
          template: options.template,
          useAI: options.ai,
        };
        console.log(chalk.green('✅ Detected package.json, using auto-detected values'));
        console.log(chalk.gray(`   Name: ${projectData.name}`));
        console.log(chalk.gray(`   Description: ${projectData.description}`));
      } catch (e) {
        console.log(chalk.yellow('⚠️ Could not read package.json, entering interactive mode...'));
        projectData = await generator.promptProjectInfo(inquirer);
      }
    }

    projectData.template = options.template;
    
    await generator.generate(projectData, {
      useAI: options.ai,
      outputPath: options.output,
      print: options.print !== false,
    });
  });

program
  .command('list')
  .alias('ls')
  .description('List available templates')
  .action(() => {
    const generator = new ReadmeGenerator();
    const templates = generator.listTemplates();
    
    console.log(chalk.bold('\n📋 Available Templates:\n'));
    templates.forEach(t => {
      console.log(chalk.cyan(`  ${t.id}`) + chalk.white(' - ') + chalk.bold(t.name));
      console.log(chalk.gray(`    ${t.description}`));
      console.log(chalk.gray(`    Sections: ${t.sections.join(', ')}`));
      console.log('');
    });
  });

program
  .command('preview <template>')
  .description('Preview a template')
  .action((templateName) => {
    const generator = new ReadmeGenerator();
    const templates = generator.listTemplates();
    const template = templates.find(t => t.id === templateName);
    
    if (!template) {
      console.error(chalk.red(`Template "${templateName}" not found`));
      process.exit(1);
    }

    const previewData = {
      name: 'Example Project',
      description: 'This is an example project for preview purposes.',
      author: 'Your Name',
      version: '1.0.0',
      license: 'MIT',
      features: ['Feature A', 'Feature B', 'Feature C'],
      template: templateName,
    };

    const readme = generator.generateFromTemplate(previewData);
    console.log(readme);
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
