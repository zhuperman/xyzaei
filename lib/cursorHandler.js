class CursorHandler {
  constructor(window) {
    this.window = window;
    this.window.addEventListener('mousemove', this.setCursorCoordinates.bind(this));
    this.cursorX = 0;
    this.cursorY = 0;
  }

  setCursorCoordinates(event) {
    this.cursorX = event.clientX;
    this.cursorY = event.clientY;
  }

  getCursorElement() {
    return document.elementFromPoint(this.cursorX, this.cursorY);
  }
}

export default CursorHandler;