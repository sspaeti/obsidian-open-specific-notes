# Open Specific Notes in Obsidian

A simple Obsidian plugin to quickly open specific notes with custom commands. Perfect for frequently accessed notes like todos, journals, or project files.

## Features

- Instantly open predefined notes with keyboard shortcuts
- Works with vim mode support (via `.vimrc`)
- Accessible via Obsidian's command palette
- Configurable file paths in plugin settings

## Configuration

1. Go to **Settings → Open Specific Notes**
2. Add your specific notes with:
   - **Command ID**: Unique identifier (e.g., `open-todos`)
   - **Command Name**: Display name in command palette (e.g., "Open My Todos")
   - **File Path**: Path to your note relative to vault root (e.g., `🌿 Projects/My Todos.md`)

## Installation

### Manual Installation

1. Download the latest release files (`main.js`, `manifest.json`)
2. Create a folder `open-specific-notes` in your vault's `.obsidian/plugins/` directory
3. Copy `main.js` and `manifest.json` into the folder
4. Restart Obsidian
5. Go to **Settings → Community plugins**
6. Make sure "Restricted mode" is **OFF**
7. Enable **"Open Specific Notes in Obsidian"**


### Example Configuration

```
Command ID: open-todos
Command Name: Open My Todos
File Path: Projects/My Todos.md
```

## Usage

### Via Command Palette

1. Press `Ctrl/Cmd + P` to open command palette
2. Type "Open My Todos" (or your custom command name)
3. Press Enter

### Via Hotkey

1. Go to **Settings → Hotkeys**
2. Search for "Open My Todos" (or your command name)
3. Set your preferred keyboard shortcut

### Via Vim Mode (`.vimrc`)

Add to your `.obsidian/.vimrc`:

```vim
" Open My Todos with <Space><Space>
exmap open_todos obcommand obsidian-open-specific-notes:open-todos
nmap <Space><Space> :open_todos<CR>
```

**Note**: The command format is `open-specific-notes:<command-id>` where `<command-id>` matches what you configured in settings. You can also check with opening Developer mode and press command `:obcommand` to show all commands in console log (only works if vim plugin is on).

## Example Use Cases

- **Todo List**: Quick access with `<Space><Space>`
- **Daily Journal**: Open today's journal with `<Space>d`
- **Project Notes**: Jump to current project with `<Space>p`
- **Meeting Notes**: Access meeting template with `<Space>m`


### Building from Source

```bash
# Clone the repository
git clone https://github.com/sspaeti/obsidian-open-specific-notes.git
cd obsidian-open-specific-notes

# Copy to your vault's plugin folder
cp main.js manifest.json /path/to/vault/.obsidian/plugins/open-specific-notes/
```

## More
- More info on my note on [Vimrc for Obsidian](https://www.ssp.sh/brain/vimrc-for-obsidian/)
