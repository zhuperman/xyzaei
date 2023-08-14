class DomHandler {
  constructor(window) {
    this.window = window;
  }

  async reloadDOM() {
    await this.initMain();
    await this.initItems();
    await this.initSlider();

    this.window.scrollY = 0;
    this.window.highlightHandler.switchHighlightedItem((Math.floor(this.window.itemsPerPage / 2)).toString());

    document.body.style.height = `${this.window.itemWidth * this.window.itemElements.length}px`;
  }

  async initMain() {
    this.window.mainAspectRatio = 16 / 9;
    this.window.mainBufferRatio = 0.05;
    this.window.mainHeight = (1 - this.window.mainBufferRatio) * this.window.innerHeight;
    this.window.mainWidth = this.window.mainHeight * this.window.mainAspectRatio;
    this.window.mainTop = (this.window.innerHeight - this.window.mainHeight) / 2;
    this.window.mainLeft = (this.window.innerWidth - this.window.mainWidth) / 2;

    let mainElement = document.querySelector('main');
    mainElement.style.height = `${this.window.mainHeight}px`;
    mainElement.style.width = `${this.window.mainWidth}px`;
    mainElement.style.top = `${this.window.mainTop}px`;
    mainElement.style.left = `${this.window.mainLeft}px`;

    this.window.mainElement = mainElement;
  }

  async initItems() {
    let items = await this.window.itemHandler.loadItems();

    this.window.itemsPerPage = 3;
    this.window.itemBufferWidth = 20;
    this.window.itemWidth = this.window.mainWidth / this.window.itemsPerPage;
  
    let itemElements = [];
    items.forEach((item, idx) => {
      item.id = idx;
      let itemElement = this.createItemElement(item);

      itemElements.push(itemElement);
    });

    this.window.itemElements = itemElements;
  }

  async initSlider() {
    let sliderDocumentFragment = document.createDocumentFragment();
    this.window.itemElements.forEach((itemElement) => {
      sliderDocumentFragment.appendChild(itemElement);
    });

    let sliderInnerElement = document.querySelector('.slider-inner');
    sliderInnerElement.innerHTML = '';
    sliderInnerElement.appendChild(sliderDocumentFragment);

    let sliderElement = document.querySelector('.slider');
    sliderElement.style.width = `${this.window.itemWidth * this.window.itemElements.length}px`;

    this.window.sliderElement = sliderElement;
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
    backgroundElement.style.left = `-${this.window.itemWidth * item.id}px`;
    const requiresAdditionalLeftBuffer = item.id === 0 && this.window.itemsPerPage > 1;
    if (requiresAdditionalLeftBuffer) {
      backgroundElement.style.left = `-${this.window.itemWidth * item.id + this.window.itemWidth}px`;
    }

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