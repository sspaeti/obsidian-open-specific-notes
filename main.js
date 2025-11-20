const { Plugin } = require('obsidian');

module.exports = class OpenSpecificNotesPlugin extends Plugin {
    async onload() {
        console.log('Loading Open Specific Notes plugin');

        // Define your specific notes here
        const specificNotes = [
            {
                id: 'open-todos',
                name: 'Open My Todos',
                filePath: '🌿 Projects/My Todos.md'
            }
            // You can add more notes here in the future:
            // {
            //     id: 'open-journal',
            //     name: 'Open Daily Journal',
            //     filePath: '📔 Journal/Daily.md'
            // }
        ];

        // Register a command for each specific note
        specificNotes.forEach(note => {
            this.addCommand({
                id: note.id,
                name: note.name,
                callback: () => this.openSpecificNote(note.filePath)
            });
        });
    }

    async openSpecificNote(filePath) {
        const file = this.app.vault.getAbstractFileByPath(filePath);

        if (!file) {
            new Notice(`File not found: ${filePath}`);
            console.error(`Could not find file: ${filePath}`);
            return;
        }

        // Open the file in a new leaf (tab)
        const leaf = this.app.workspace.getLeaf(false);
        await leaf.openFile(file);
    }

    onunload() {
        console.log('Unloading Open Specific Notes plugin');
    }
};
