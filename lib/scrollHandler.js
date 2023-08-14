class ScrollHandler {
  constructor(window) {
    this.window = window;
    this.window.addEventListener('wheel', this.scaleAndBoundScrolling.bind(this));
    this.lerpRatio = 0.05;
    this.currScrollY = 0;
    this.targetScrollY = 0;
    this.isScrolling = false;
    this.animateSliderScrolling();
  }

  scaleAndBoundScrolling(event) {
    let scrollDirection = (event.deltaY) < 0 ? -1 : 1;
    let scaledScrollY = window.scrollY + (this.window.itemWidth) * scrollDirection;

    let minScrollY = 0;
    let maxScrollY = (this.window.itemWidth * this.window.itemElements.length - this.window.mainWidth);
    if (scaledScrollY < minScrollY) {
      scaledScrollY = minScrollY;
    } else if (scaledScrollY > maxScrollY) {
      scaledScrollY = maxScrollY;
    }

    window.scrollY = scaledScrollY;
  }

  animateSliderScrolling() {
    this.refreshScrollProperties();

    if (this.isScrolling) {
      this.updateSliderTransformStyle();
      if (this.window.highlightHandler) {
        this.window.highlightHandler.highlightItemFromCursor();
      }
    }

    requestAnimationFrame(this.animateSliderScrolling.bind(this));
  }

  refreshScrollProperties() {
    this.currScrollY = this.lerp().toFixed(2);
    this.targetScrollY = this.window.scrollY;
    this.isScrolling = Math.abs(this.targetScrollY - this.currScrollY) > 1;
  }

  lerp() {
    return (this.currScrollY * (1 - this.lerpRatio)) + (this.targetScrollY * this.lerpRatio);
  }

  updateSliderTransformStyle() {
    this.setTranslateX(this.window.sliderElement, -this.currScrollY);

    this.window.itemElements.forEach((itemElement) => {
      this.setTranslateX(itemElement.backgroundElement, this.currScrollY);
    });
  }

  setTranslateX(element, translateAmount) {
    element.style.transform = `translateX(${translateAmount}px)`;
  }

  scrollUp() {
    this.window.dispatchEvent(new WheelEvent('wheel', {'deltaY': -1}));
  }

  scrollDown() {
    this.window.dispatchEvent(new WheelEvent('wheel', {'deltaY': 1}));
  }
}

export default ScrollHandler;