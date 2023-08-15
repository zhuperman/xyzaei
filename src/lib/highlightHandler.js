class HighlightHandler {
  constructor(window) {
    this.window = window;
    this.highlightedItemId = null;
    this.backgroundHighlightOpacity = 0.8;
    this.logoHighlightOpacity = 0.9;
  }

  switchHighlightedItem(itemId) {
    if (this.highlightedItemId === itemId) { return; }

    if (this.highlightedItemId) {
      this.unhighlightItem(this.highlightedItemId);
      this.highlightedItemId = null;
    }

    if (itemId) {
      this.highlightItem(itemId);
      this.highlightedItemId = itemId;
    }
  }

  highlightItem(itemId) {
    if (this.window.itemElements[itemId].backgroundElement) {
      this.window.itemElements[itemId].backgroundElement.style.opacity = this.backgroundHighlightOpacity;
    }
    if (this.window.itemElements[itemId].logoElement) {
      this.window.itemElements[itemId].logoElement.style.opacity = this.logoHighlightOpacity;
    }
  }

  unhighlightItem(itemId) {
    if (this.window.itemElements[itemId].backgroundElement) {
      this.window.itemElements[itemId].backgroundElement.style.opacity = this.logoHighlightOpacity / 2;
    }
    if (this.window.itemElements[itemId].logoElement) {
      this.window.itemElements[itemId].logoElement.style.opacity = this.logoHighlightOpacity / 2;
    }
  }

  highlightItemFromCursor() {
    const cursorItem = this.getCursorItem();
    if (cursorItem) {
      this.switchHighlightedItem(cursorItem.id);
    }
  }

  getCursorItem() {
    if (!this.window.cursorHandler) { return false; }

    const cursorElement = this.window.cursorHandler.getCursorElement();
    if (!cursorElement) { return false; }

    return cursorElement.itemElement;
  }
}

export default HighlightHandler;