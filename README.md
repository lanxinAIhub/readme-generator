# 📝 README Generator

> AI-powered README generator - Automatically generate beautiful, professional README files for your projects

[![CI](https://github.com/lanxinAIhub/readme-generator/actions/workflows/ci.yml/badge.svg)](https://github.com/lanxinAIhub/readme-generator/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🤖 **AI Enhanced** - GPT-4 / Claude powered content generation
- 📋 **6 Templates** - From minimal to comprehensive
- 🎨 **Beautiful Output** - Auto badges, shields, professional formatting
- 📤 **Easy Export** - Markdown, GitHub, or publish site
- 🌐 **Documentation Site** - Transform README into beautiful docs
- ⚡ **Instant Preview** - See your README rendered in real-time

## 🚀 Quick Start

### CLI

```bash
# Install globally
npm install -g readme-generator

# Generate README
readme-gen generate

# List templates
readme-gen list
```

### Interactive Mode

```bash
# Auto-detect from package.json
readme-gen generate

# Or force interactive mode
readme-gen generate --interactive
```

### Use AI Enhancement

```bash
# Set your API key
export OPENAI_API_KEY=your-key-here

# Generate with AI enhancement
readme-gen generate --ai
```

## 📋 Templates

| Template | Description |
|----------|-------------|
| `simple` | Clean and minimal |
| `professional` | Full-featured for open source |
| `detailed` | Comprehensive documentation |
| `minimal` | Ultra-lightweight |
| `api` | For APIs and SDKs |
| `cli` | For command-line tools |

### Preview a Template

```bash
readme-gen preview professional
```

## 🌐 Web Version

Visit our website to generate READMEs visually:

1. Go to [readme-generator.example.com](https://readme-generator.example.com)
2. Fill in project details
3. Choose a template
4. Preview and export

## 🛠 API

### CLI Options

```bash
readme-gen generate [options]

Options:
  -t, --template <name>   Template to use (default: "professional")
  -o, --output <path>    Output file path (default: "./README.md")
  -i, --interactive      Use interactive mode
  --ai                   Enable AI enhancement
  --no-print             Do not print to console
```

### Programmatic Usage

```javascript
const ReadmeGenerator = require('readme-generator');

const generator = new ReadmeGenerator({
  template: 'professional',
  aiApiKey: process.env.OPENAI_API_KEY,
});

const readme = await generator.generate({
  name: 'my-project',
  description: 'An awesome project',
  author: 'Your Name',
  license: 'MIT',
  features: ['Fast', 'Easy', 'Powerful'],
});
```

## 💰 Pricing

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 10 generations/month, 6 templates |
| Pro | $9/mo | Unlimited, AI enhancement, custom templates |
| Team | $29/mo | Everything + team features, API access |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

- GitHub: [@lanxinAIhub](https://github.com/lanxinAIhub)
- Project: [readme-generator](https://github.com/lanxinAIhub/readme-generator)
