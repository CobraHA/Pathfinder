const fs = require('fs');
let file = fs.readFileSync('src/services/QuestLogEngine.ts', 'utf8');

if (!file.includes('static async removeQuest')) {
  const insertIndex = file.indexOf('static async completeQuest');
  const codeToInsert = `
  static async removeQuest(questId: string): Promise<boolean> {
    const quests = await this.getQuests();
    const filtered = quests.filter(q => q.id !== questId);
    if (filtered.length !== quests.length) {
      await this.saveQuests(filtered);
      return true;
    }
    return false;
  }

  `;
  file = file.slice(0, insertIndex) + codeToInsert + file.slice(insertIndex);
  fs.writeFileSync('src/services/QuestLogEngine.ts', file);
  console.log("Added removeQuest to QuestLogEngine.ts");
} else {
  console.log("removeQuest already exists");
}
