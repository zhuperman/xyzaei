class InputHandler {
  constructor(window) {
    this.window = window;
    this.window.addEventListener('keydown', this.keyboardEventMapper.bind(this));
    this.window.addEventListener('gamepadconnected', this.gamepadEventMapper.bind(this));
  }

  async keyboardEventMapper(event) {
    switch (event.keyCode) {
      case 13: // Enter
        this.launchItem();
        break;
      case 27: // Escape
        this.exit();
        break;
      case 37: // Left Arrow
        this.moveLeft();
        break;
      case 39: // Right Arrow
        this.moveRight();
        break;
      case 112: // F1
        await this.toggleItemType();
        break;
      case 113: // F2
        await this.toggleSortAttribute();
        break;
      case 114: // F3
        await this.toggleSortDirection();
        break;
      default:
        break;
    }
  }

  async gamepadEventMapper(event) {
    let prevButtonValues = {};

    const gamepadListener = async () => {
      const gp = navigator.getGamepads()[0];
    
      if (prevButtonValues[0] < 1 && gp.buttons[0].value == 1) { // A
        this.launchItem();
      } else if (prevButtonValues[1] < 1 && gp.buttons[1].value == 1) { // B
        this.exit();
      } else if (prevButtonValues[2] < 1 && gp.buttons[2].value == 1) { // X
      } else if (prevButtonValues[3] < 1 && gp.buttons[3].value == 1) { // Y
        await this.toggleItemType();
      }

      if (prevButtonValues[4] < 1 && gp.buttons[4].value == 1) { // Y
      } else if (prevButtonValues[5] < 1 && gp.buttons[5].value == 1) { // LB
      } else if (prevButtonValues[6] < 1 && gp.buttons[6].value == 1) { // LT
      } else if (prevButtonValues[7] < 1 && gp.buttons[7].value == 1) { // RT
      }

      if (prevButtonValues[8] < 1 && gp.buttons[8].value == 1) { // View
      } else if (prevButtonValues[9] < 1 && gp.buttons[9].value == 1) { // Menu
      }

      if (prevButtonValues[10] < 1 && gp.buttons[10].value == 1) { // LS
        await this.toggleSortAttribute();
      } else if (prevButtonValues[11] < 1 && gp.buttons[11].value == 1) { // RS
        await this.toggleSortDirection();
      }

      if (prevButtonValues[12] < 1 && gp.buttons[12].value == 1) { // D-Pad Up
      } else if (prevButtonValues[13] < 1 && gp.buttons[13].value == 1) { // D-Pad Down
      } else if (prevButtonValues[14] < 1 && gp.buttons[14].value == 1) { // D-Pad Left
        this.moveLeft();
      } else if (prevButtonValues[15] < 1 && gp.buttons[15].value == 1) { // D-Pad Right
        this.moveRight();
      }

      prevButtonValues[0] = gp.buttons[0].value;
      prevButtonValues[1] = gp.buttons[1].value;
      prevButtonValues[2] = gp.buttons[2].value;
      prevButtonValues[3] = gp.buttons[3].value;
      prevButtonValues[4] = gp.buttons[4].value;
      prevButtonValues[5] = gp.buttons[5].value;
      prevButtonValues[6] = gp.buttons[6].value;
      prevButtonValues[7] = gp.buttons[7].value;
      prevButtonValues[8] = gp.buttons[8].value;
      prevButtonValues[9] = gp.buttons[9].value;
      prevButtonValues[10] = gp.buttons[10].value;
      prevButtonValues[11] = gp.buttons[11].value;
      prevButtonValues[12] = gp.buttons[12].value;
      prevButtonValues[13] = gp.buttons[13].value;
      prevButtonValues[14] = gp.buttons[14].value;
      prevButtonValues[15] = gp.buttons[15].value;

      requestAnimationFrame(gamepadListener);
    };
    
    gamepadListener();
  }

  launchItem() {
    let highlightedItemId = this.window.highlightHandler.highlightedItemId;
    if (highlightedItemId) {
      let highlightedItem = this.window.itemElements[highlightedItemId];
      this.window.itemHandler.launchItem(highlightedItem.item);
    }
  }

  exit() {
    this.window.launcher.exit();
  }

  moveLeft() {
    let highlightedItemId = this.window.highlightHandler.highlightedItemId;
    if (highlightedItemId) {
      let previousItemId = parseInt(highlightedItemId) - 1;
      if (previousItemId >= 0) {
        if (previousItemId !== this.window.itemElements.length - 2) {
          this.window.scrollHandler.scrollUp();
        }
        this.window.highlightHandler.switchHighlightedItem(previousItemId.toString());
      }
    }
  }

  moveRight() {
    let highlightedItemId = this.window.highlightHandler.highlightedItemId;
    if (highlightedItemId) {
      let nextItemId = parseInt(highlightedItemId) + 1;
      if (nextItemId < this.window.itemElements.length) {
        if (nextItemId !== 1) {
          this.window.scrollHandler.scrollDown();
        }
        this.window.highlightHandler.switchHighlightedItem(nextItemId.toString());
      }
    }
  }

  getNextSettingValue(settingName) {
    let settingValue = this.window.settingHandler[settingName];
    let settingValues = this.window.settingHandler[`${settingName}s`];
    let settingValueIndex = settingValues.indexOf(settingValue);
    let nextSettingValueIndex = settingValueIndex + 1;
    if (nextSettingValueIndex >= settingValues.length) {
      nextSettingValueIndex = 0;
    }

    return settingValues[nextSettingValueIndex];
  }

  async toggleItemType() {
    await this.window.settingHandler.updateSettings({
      itemType: this.getNextSettingValue('itemType')
    });
  }

  async toggleSortAttribute() {
    await this.window.settingHandler.updateSettings({
      sortAttribute: this.getNextSettingValue('sortAttribute')
    });
  }

  async toggleSortDirection() {
    await this.window.settingHandler.updateSettings({
      sortDirection: this.getNextSettingValue('sortDirection')
    });
  }
}

export default InputHandler;