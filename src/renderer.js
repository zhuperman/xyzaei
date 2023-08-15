import SettingHandler from './lib/settingHandler.js';
import ItemHandler from './lib/itemHandler.js';
import DomHandler from './lib/domHandler.js';
import CursorHandler from './lib/cursorHandler.js';
import HighlightHandler from './lib/highlightHandler.js';
import ScrollHandler from './lib/scrollHandler.js';
import InputHandler from './lib/inputHandler.js';

window.settingHandler = new SettingHandler(window);
window.itemHandler = new ItemHandler(window);
window.domHandler = new DomHandler(window);
window.cursorHandler = new CursorHandler(window);
window.highlightHandler = new HighlightHandler(window);
window.scrollHandler = new ScrollHandler(window);
window.inputHandler = new InputHandler(window);

await window.settingHandler.updateSettings({
  itemType: 'games',
  sortAttribute: 'date',
  sortDirection: 'desc'
});