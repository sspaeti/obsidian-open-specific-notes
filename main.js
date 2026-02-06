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

        containerEl.createEl('p', {
            text: 'Configure which notes you want to quickly access. After making changes, reload Obsidian to apply.',
            cls: 'setting-item-description'
        });

        const warningEl = containerEl.createDiv({ cls: 'osn-callout' });
        warningEl.createSpan({ text: 'Note:', cls: 'osn-callout-title' });
        warningEl.createSpan({ text: ' Restart Obsidian after adding/removing notes to see them in the command palette.' });

        // Display existing notes
        this.plugin.settings.specificNotes.forEach((note, index) => {
            const noteContainer = containerEl.createDiv({ cls: 'osn-note-item' });

            new Setting(noteContainer)
                .setName(`Note ${index + 1}`)
                .setHeading();

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
                .setName('Command name')
                .setDesc('Name shown in command palette')
                .addText(text => text
                    .setPlaceholder('Open My Todos')
                    .setValue(note.name)
                    .onChange(async (value) => {
                        this.plugin.settings.specificNotes[index].name = value;
                        await this.plugin.saveSettings();
                    }));

            new Setting(noteContainer)
                .setName('File path')
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
            .setName('Add new note')
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
        new Setting(containerEl)
            .setName('Vim mode usage')
            .setHeading();

        const vimInfo = containerEl.createDiv({ cls: 'osn-vim-info' });
        vimInfo.createSpan({ text: 'Add to your ' });
        vimInfo.createEl('code', { text: '.vimrc' });
        vimInfo.createSpan({ text: ':' });
        vimInfo.createEl('br');
        vimInfo.createEl('br');
        vimInfo.createEl('code', { text: 'exmap open_todos obcommand open-specific-notes:open-todos' });
        vimInfo.createEl('br');
        vimInfo.createEl('code', { text: 'nmap <Space><Space> :open_todos' });
        vimInfo.createEl('br');
        vimInfo.createEl('br');
        vimInfo.createSpan({ text: 'Replace ' });
        vimInfo.createEl('code', { text: 'open-todos' });
        vimInfo.createSpan({ text: ' with your Command ID.' });
    }
}
