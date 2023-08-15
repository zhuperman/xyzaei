class ItemHandler {
  constructor(window) {
    this.window = window;
    this.itemCollection = {};
  }

  async loadItems() {
    if (!this.itemCollection[this.window.settingHandler.itemType]) {
      this.itemCollection[this.window.settingHandler.itemType] = await this.window.items.fetch(this.window.settingHandler.itemType);
      this.itemCollection[this.window.settingHandler.itemType].forEach((item, idx) => {
        item.rank = idx;
      });
    }

    this.sortItems();

    return this.itemCollection[this.window.settingHandler.itemType];
  }

  sortItems() {
    this.itemCollection[this.window.settingHandler.itemType].sort((a, b) => {
      const attribute = this.window.settingHandler.sortAttribute;
      const aValue = a[attribute];
      const bValue = b[attribute];
  
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return this.window.settingHandler.sortDirection === 'desc' ? bValue - aValue : aValue - bValue;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        const compareValue = aValue.localeCompare(bValue, undefined, { sensitivity: 'base' });
        return this.window.settingHandler.sortDirection === 'desc' ? -compareValue : compareValue;
      } else {
        return 0;
      }
    });
  }
  
  launchItem(item) {
    if (item.target) {
      this.window.launcher.run(this.window.settingHandler.itemType, item.target);
    }
  }
}

export default ItemHandler;