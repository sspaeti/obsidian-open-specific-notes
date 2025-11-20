const { Plugin, PluginSettingTab, Setting, Notice } = require('obsidian');

// Default settings
const DEFAULT_SETTINGS = {
    specificNotes: [
        {
            id: 'open-todos',
            name: 'Open My Todos',
            filePath: '🌿 Projects/My Todos.md'
        }
    ]
};

module.exports = class OpenSpecificNotesPlugin extends Plugin {
    async onload() {
        console.log('Loading Open Specific Notes plugin');

        // Load settings
        await this.loadSettings();

        // Register commands
        this.registerCommands();

        // Add settings tab
        this.addSettingTab(new OpenSpecificNotesSettingTab(this.app, this));
    }

    registerCommands() {
        // Register a command for each specific note
        this.settings.specificNotes.forEach(note => {
            // Skip if id or filePath is empty
            if (!note.id || !note.filePath) return;

            this.addCommand({
                id: note.id,
                name: note.name,
                callback: () => this.openSpecificNote(note.filePath)
            });
        });
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async openSpecificNote(filePath) {
        const file = this.app.vault.getAbstractFileByPath(filePath);

        if (!file) {
            new Notice(`File not found: ${filePath}`);
            console.error(`Could not find file: ${filePath}`);
            return;
        }

        // Open the file in the current leaf
        const leaf = this.app.workspace.getLeaf(false);
        await leaf.openFile(file);
    }

    onunload() {
        console.log('Unloading Open Specific Notes plugin');
    }
};

class OpenSpecificNotesSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Open Specific Notes Settings' });

        containerEl.createEl('p', {
            text: 'Configure which notes you want to quickly access. After making changes, reload Obsidian to apply.',
            cls: 'setting-item-description'
        });

        const warningEl = containerEl.createDiv();
        warningEl.style.padding = '10px';
        warningEl.style.marginBottom = '15px';
        warningEl.style.backgroundColor = 'var(--background-secondary)';
        warningEl.style.borderRadius = '5px';
        warningEl.innerHTML = '⚠️ <strong>Note:</strong> Restart Obsidian after adding/removing notes to see them in the command palette.';

        // Display existing notes
        this.plugin.settings.specificNotes.forEach((note, index) => {
            const noteContainer = containerEl.createDiv('specific-note-item');
            noteContainer.style.border = '1px solid var(--background-modifier-border)';
            noteContainer.style.borderRadius = '5px';
            noteContainer.style.padding = '10px';
            noteContainer.style.marginBottom = '10px';

            noteContainer.createEl('h3', { text: `Note ${index + 1}` });

            new Setting(noteContainer)
                .setName('Command ID')
                .setDesc('Unique identifier (e.g., "open-todos")')
                .addText(text => text
                    .setPlaceholder('open-todos')
                    .setValue(note.id)
                    .onChange(async (value) => {
                        this.plugin.settings.specificNotes[index].id = value;
                        await this.plugin.saveSettings();
                    }));

            new Setting(noteContainer)
                .setName('Command Name')
                .setDesc('Name shown in command palette')
                .addText(text => text
                    .setPlaceholder('Open My Todos')
                    .setValue(note.name)
                    .onChange(async (value) => {
                        this.plugin.settings.specificNotes[index].name = value;
                        await this.plugin.saveSettings();
                    }));

            new Setting(noteContainer)
                .setName('File Path')
                .setDesc('Path relative to vault root')
                .addText(text => text
                    .setPlaceholder('Projects/My Todos.md')
                    .setValue(note.filePath)
                    .onChange(async (value) => {
                        this.plugin.settings.specificNotes[index].filePath = value;
                        await this.plugin.saveSettings();
                    }));

            new Setting(noteContainer)
                .setName('Remove')
                .setDesc('Remove this note')
                .addButton(button => button
                    .setButtonText('Remove')
                    .setWarning()
                    .onClick(async () => {
                        this.plugin.settings.specificNotes.splice(index, 1);
                        await this.plugin.saveSettings();
                        this.display();
                    }));
        });

        // Add new note button
        new Setting(containerEl)
            .setName('Add New Note')
            .setDesc('Add a new note configuration')
            .addButton(button => button
                .setButtonText('Add Note')
                .setCta()
                .onClick(async () => {
                    this.plugin.settings.specificNotes.push({
                        id: '',
                        name: '',
                        filePath: ''
                    });
                    await this.plugin.saveSettings();
                    this.display();
                }));

        // Vim mode usage info
        containerEl.createEl('h3', { text: 'Vim Mode Usage' });
        const vimInfo = containerEl.createEl('div');
        vimInfo.style.padding = '10px';
        vimInfo.style.backgroundColor = 'var(--background-secondary)';
        vimInfo.style.borderRadius = '5px';
        vimInfo.style.fontFamily = 'monospace';
        vimInfo.innerHTML =
            'Add to your <code>.vimrc</code>:<br><br>' +
            '<code>exmap open_todos obcommand obsidian-open-specific-notes:open-todos</code><br>' +
            '<code>nmap &lt;Space&gt;&lt;Space&gt; :open_todos&lt;CR&gt;</code><br><br>' +
            'Replace <code>open-todos</code> with your Command ID.';
    }
}
