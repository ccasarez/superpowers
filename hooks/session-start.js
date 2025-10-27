#!/usr/bin/env node
// SessionStart hook for superpowers plugin (cross-platform Node.js version)

const fs = require('fs');
const path = require('path');
const os = require('os');

try {
  // Determine plugin root directory
  const scriptDir = __dirname;
  const pluginRoot = path.resolve(scriptDir, '..');

  // Check if legacy skills directory exists and build warning
  let warningMessage = '';
  const legacySkillsDir = path.join(os.homedir(), '.config', 'superpowers', 'skills');

  if (fs.existsSync(legacySkillsDir)) {
    warningMessage = '\n\n<important-reminder>IN YOUR FIRST REPLY AFTER SEEING THIS MESSAGE YOU MUST TELL THE USER:⚠️ **WARNING:** Superpowers now uses Claude Code\'s skills system. Custom skills in ~/.config/superpowers/skills will not be read. Move custom skills to ~/.claude/skills instead. To make this message go away, remove ~/.config/superpowers/skills</important-reminder>';
  }

  // Read using-superpowers content
  let usingSuperpowersContent;
  try {
    const skillPath = path.join(pluginRoot, 'skills', 'using-superpowers', 'SKILL.md');
    usingSuperpowersContent = fs.readFileSync(skillPath, 'utf8');
  } catch (error) {
    usingSuperpowersContent = 'Error reading using-superpowers skill';
  }

  // Build the additional context
  const additionalContext = `<EXTREMELY_IMPORTANT>
You have superpowers.

**The content below is from skills/using-superpowers/SKILL.md - your introduction to using skills:**

${usingSuperpowersContent}

${warningMessage}
</EXTREMELY_IMPORTANT>`;

  // Output context injection as JSON
  const output = {
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: additionalContext
    }
  };

  console.log(JSON.stringify(output, null, 2));
  process.exit(0);

} catch (error) {
  console.error(`Error in session-start hook: ${error.message}`);
  process.exit(1);
}
