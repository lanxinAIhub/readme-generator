/**
 * README Generator Web App
 */

const API_BASE = window.location.origin + '/api';

// State
let currentReadme = '';
let templates = [];

// Load templates on page load
document.addEventListener('DOMContentLoaded', () => {
  loadTemplates();
  setupEventListeners();
});

async function loadTemplates() {
  try {
    const res = await fetch(`${API_BASE}/templates`);
    templates = await res.json();
    renderTemplates();
  } catch (e) {
    // Fallback templates
    templates = [
      { id: 'simple', name: 'Simple', description: 'Clean and minimal' },
      { id: 'professional', name: 'Professional', description: 'Full-featured for open source' },
      { id: 'detailed', name: 'Detailed', description: 'Comprehensive documentation' },
      { id: 'minimal', name: 'Minimal', description: 'Ultra-lightweight' },
      { id: 'api', name: 'API Project', description: 'For APIs and SDKs' },
      { id: 'cli', name: 'CLI Tool', description: 'For command-line tools' },
    ];
    renderTemplates();
  }
}

function renderTemplates() {
  const grid = document.getElementById('templatesGrid');
  if (!grid) return;

  grid.innerHTML = templates.map(t => `
    <div class="template-card" data-template="${t.id}">
      <h3>${t.name}</h3>
      <p>${t.description}</p>
      <div class="template-sections">
        ${(t.sections || []).slice(0, 4).map(s => `<span class="template-tag">${s}</span>`).join('')}
      </div>
    </div>
  `).join('');

  // Template selection
  grid.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', () => {
      grid.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      document.getElementById('template').value = card.dataset.template;
      // Regenerate preview
      if (currentReadme) generateReadme();
    });
  });
}

function setupEventListeners() {
  const form = document.getElementById('readmeForm');
  if (form) {
    form.addEventListener('submit', handleGenerate);
  }

  const copyBtn = document.getElementById('copyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', copyToClipboard);
  }

  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', downloadReadme);
  }
}

async function handleGenerate(e) {
  e.preventDefault();
  
  const btn = document.getElementById('generateBtnText');
  btn.textContent = 'Generating...';
  
  const formData = new FormData(e.target);
  const data = {
    name: formData.get('name'),
    description: formData.get('description'),
    author: formData.get('author'),
    license: formData.get('license'),
    template: formData.get('template'),
    features: formData.get('features')?.split(',').map(f => f.trim()).filter(Boolean) || [],
    useAI: formData.get('useAI') === 'on',
  };

  try {
    const res = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    
    if (result.success) {
      currentReadme = result.readme;
      document.getElementById('previewContent').textContent = currentReadme;
    } else {
      alert('Error: ' + result.error);
    }
  } catch (e) {
    // Fallback to client-side generation
    const readme = generateClientSide(data);
    currentReadme = readme;
    document.getElementById('previewContent').textContent = readme;
  }

  btn.textContent = 'Generate README';
}

function generateClientSide(data) {
  const sections = {
    title: `# ${data.name || 'Project Name'}\n`,
    badge: `![License](https://img.shields.io/badge/license-${data.license || 'MIT'}-green)\n`,
    description: `## 📖 Description\n\n${data.description || 'A fantastic project.'}\n`,
    toc: `## 📋 Table of Contents\n\n- [Installation](#installation)\n- [Usage](#usage)\n- [Features](#features)\n- [License](#license)\n`,
    installation: `## 🚀 Installation\n\n\`\`\`bash\nnpm install ${(data.name || 'your-package').toLowerCase().replace(/\s+/g, '-')}\n\`\`\`\n`,
    usage: `## 📖 Usage\n\n\`\`\`javascript\nconst project = require('${(data.name || 'your-package').toLowerCase().replace(/\s+/g, '-')}');\n// Start using it!\n\`\`\`\n`,
    features: `## ✨ Features\n\n${(data.features || ['Feature 1', 'Feature 2']).map(f => `- ${f}`).join('\n')}\n`,
    license: `## 📄 License\n\nThis project is licensed under the ${data.license || 'MIT'} License.\n`,
  };

  const templates = {
    simple: ['title', 'description', 'installation', 'usage', 'license'],
    professional: ['title', 'badge', 'description', 'toc', 'installation', 'usage', 'features', 'license'],
    detailed: ['title', 'badge', 'description', 'toc', 'installation', 'usage', 'features', 'license'],
    minimal: ['title', 'description', 'usage'],
    api: ['title', 'badge', 'description', 'toc', 'installation', 'usage', 'features', 'license'],
    cli: ['title', 'badge', 'description', 'toc', 'installation', 'usage', 'features', 'license'],
  };

  const sections_order = templates[data.template] || templates.professional;
  
  return sections_order.map(s => sections[s]).filter(Boolean).join('\n');
}

async function copyToClipboard() {
  if (!currentReadme) {
    alert('Generate a README first!');
    return;
  }
  
  try {
    await navigator.clipboard.writeText(currentReadme);
    const btn = document.getElementById('copyBtn');
    btn.innerHTML = '✓ Copied!';
    setTimeout(() => {
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy`;
    }, 2000);
  } catch (e) {
    alert('Failed to copy');
  }
}

function downloadReadme() {
  if (!currentReadme) {
    alert('Generate a README first!');
    return;
  }
  
  const blob = new Blob([currentReadme], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'README.md';
  a.click();
  URL.revokeObjectURL(url);
}
