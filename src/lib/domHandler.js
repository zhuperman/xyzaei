class DomHandler {
  constructor(window) {
    this.window = window;
    this.window.mainElement = document.querySelector('main');
    this.window.sliderElement = document.querySelector('.slider');
    this.window.sliderInnerElement = document.querySelector('.slider-inner');
    this.window.itemElements = [];
  }

  async reloadDOM() {
    await this.initMain();
    await this.initItems();
    await this.initSlider();

    this.window.scrollHandler.init();
    this.window.highlightHandler.init();
    this.window.highlightHandler.switchHighlightedItem((Math.floor(this.window.itemsPerPage / 2)).toString());
  }

  async initMain() {
    this.window.mainAspectRatio = 16 / 9;
    this.window.mainBufferRatio = 0.05;
    this.window.mainHeight = (1 - this.window.mainBufferRatio) * this.window.innerHeight;
    this.window.mainWidth = this.window.mainHeight * this.window.mainAspectRatio;
    this.window.mainTop = (this.window.innerHeight - this.window.mainHeight) / 2;
    this.window.mainLeft = (this.window.innerWidth - this.window.mainWidth) / 2;

    this.window.itemsPerPage = 3;
    this.window.itemBufferWidth = 20;
    this.window.itemWidth = this.window.mainWidth / this.window.itemsPerPage;

    this.window.mainElement.style.height = `${this.window.mainHeight}px`;
    this.window.mainElement.style.width = `${this.window.mainWidth - this.window.itemBufferWidth}px`;
    this.window.mainElement.style.top = `${this.window.mainTop}px`;
    this.window.mainElement.style.left = `${this.window.mainLeft + this.window.itemBufferWidth / 2}px`;
  }

  async initItems() {
    let items = await this.window.itemHandler.loadItems();

    this.window.itemElements = [];
    items.forEach((item, idx) => {
      item.id = idx;
      let itemElement = this.createItemElement(item);

      this.window.itemElements.push(itemElement);
    });
  }

  async initSlider() {
    let sliderDocumentFragment = document.createDocumentFragment();
    this.window.itemElements.forEach((itemElement) => {
      sliderDocumentFragment.appendChild(itemElement);
    });

    this.window.sliderInnerElement.innerHTML = '';
    this.window.sliderInnerElement.appendChild(sliderDocumentFragment);

    this.window.sliderElement.style.width = `${this.window.itemWidth * this.window.itemElements.length}px`;
  }

  createItemElement(item) {
    let itemElement = document.createElement('div');
    itemElement.classList.add('item');
    itemElement.id = item.id;
    itemElement.style.width = `${this.window.itemWidth - this.window.itemBufferWidth}px`;

    itemElement.backgroundElement = this.createBackgroundElement(item);
    itemElement.backgroundElement.itemElement = itemElement;
    itemElement.appendChild(itemElement.backgroundElement);

    itemElement.logoElement = this.createLogoElement(item);
    itemElement.logoElement.itemElement = itemElement;
    itemElement.appendChild(itemElement.logoElement);

    itemElement.addEventListener('mouseover', (event) => {
      this.window.highlightHandler.switchHighlightedItem(event.currentTarget.id);
    });
    // itemElement.addEventListener('mouseout', (event) => {
    //   this.window.highlightHandler.switchHighlightedItem(null);
    // });
    itemElement.addEventListener('click', (event) => {
      this.window.itemHandler.launchItem(event.currentTarget.item);
    });

    itemElement.item = item;
    return itemElement;
  }

  createBackgroundElement(item) {
    let backgroundElement = document.createElement('div');
    backgroundElement.classList.add('background');
    backgroundElement.style.backgroundImage = this.getBackgroundImageUrlForPath(item.background);
    backgroundElement.style.opacity = this.window.highlightHandler.backgroundHighlightOpacity / 2;
    backgroundElement.style.width = `${this.window.mainWidth}px`;
    let leftBuffer = (parseInt(item.id) / this.window.mainAspectRatio) + (this.window.itemBufferWidth / 2);
    if (item.id === 0 && this.window.itemsPerPage > 1) {
      leftBuffer += this.window.itemWidth;
    }
    backgroundElement.style.left = `-${this.window.itemWidth * item.id + leftBuffer}px`;

    return backgroundElement;
  }

  createLogoElement(item) {
    let logoElement = document.createElement('div');
    logoElement.classList.add('logo');
    logoElement.style.backgroundImage = this.getBackgroundImageUrlForPath(item.logo);
    logoElement.style.opacity = this.window.highlightHandler.logoHighlightOpacity / 2;

    return logoElement;
  }

  getBackgroundImageUrlForPath(path) {
    return `url("${path.replace(/\\/g, "/")}")`;
  }
}

export default DomHandler;