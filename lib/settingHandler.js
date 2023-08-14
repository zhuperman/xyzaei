class SettingHandler {
  constructor(window) {
    this.window = window;
    this.itemTypes = ['games', 'movies'];
    this.sortAttributes = ['rank', 'date'];
    this.sortDirections = ['asc', 'desc'];
  }

  async updateSettings(settings) {
    this.itemType = settings.itemType || this.itemType;
    this.sortAttribute = settings.sortAttribute || this.sortAttribute;
    this.sortDirection = settings.sortDirection || this.sortDirection;

    await this.window.domHandler.reloadDOM();
  }
}

export default SettingHandler;