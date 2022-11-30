let main = document.querySelector('main');
let mainAspectRatio;
let mainWidth;
let remainingWidth;

let slider = document.querySelector('.slider');
let sliderWidth;
let sliderInner = document.querySelector('.slider-inner');

const GAME = "games";
const MOVIE = "movies";
let itemType = GAME;

const RELEASE_DATE = "date";
const TITLE = "cover";
let sortAttribute = RELEASE_DATE;
let sortDirection = -1;

document.addEventListener('keydown', async function(event){
  if (event.keyCode == 27) {
    window.launcher.exit();
  }
  if (event.keyCode == 112) {
    itemType = (itemType == GAME ? MOVIE : GAME);
    await init();
  }
  if (event.keyCode == 113) {
    sortAttribute = sortAttribute == RELEASE_DATE ? TITLE : RELEASE_DATE;
    sortDirection = sortAttribute == RELEASE_DATE ? -1 : 1;
    console.log(sortAttribute, sortDirection);
    await init();
  }
});

let itemWidth;
let itemBufferWidth;
let itemsPerPage;

let coverWidth;

let current;
let target;
let ease;

let items;
let covers;
let logos;

let ultrawide = false;
let ultrawideBuffer = 60;

async function loadItems() {
  let jsonData = await window.items.fetch(itemType);

  return jsonData.sort((a, b) => { return sortDirection * a[sortAttribute].localeCompare(b[sortAttribute]); }).map(itemData => {
    let item = document.createElement("div");
    item.className = `item ${itemType}`;
    item.style.width = `${itemWidth}px`;
    item.dataset.target = itemData.target;
    let cover = document.createElement("div");
    cover.className = `cover ${itemType}`;
    cover.style.backgroundImage = `url("${itemData.cover.replace(/\\/g, "/")}")`;
    item.appendChild(cover);
    if (itemData.logo) {
      let logo = document.createElement("div");
      logo.className = `logo ${itemType}`;
      logo.style.backgroundImage = `url("${itemData.logo.replace(/\\/g, "/")}")`;
      item.appendChild(logo);
    }
    item.addEventListener('click', launchItem);
    sliderInner.appendChild(item);

    return item;
  });
}

async function init() {
  window.scrollY = 0;
  current = 0;
  target = 0;
  ease = 0.05;
  sliderInner.innerHTML = "";

  if (itemType == GAME) {
    itemsPerPage = ultrawide ? 5 : 3;
    itemBufferWidth = 20;
    mainAspectRatio = 16/9;
    itemWidth = (window.outerHeight * mainAspectRatio) / itemsPerPage - itemsPerPage * itemBufferWidth;
    coverWidth = '100vw';
    mainWidth = (itemWidth + itemBufferWidth) * itemsPerPage;
  } else if (itemType == MOVIE) {
    itemsPerPage = ultrawide ? 4 : 1;
    itemBufferWidth = 20;
    mainAspectRatio = 16/9;
    itemWidth = window.outerHeight * 0.95 * 2 / 3;
    coverWidth = `${itemWidth}px`;
    mainWidth = (itemWidth + itemBufferWidth) * itemsPerPage;
  }

  items = await loadItems();
  covers = [...document.querySelectorAll('.cover')];
  logos = [...document.querySelectorAll('.logo')];

  sliderWidth = (itemWidth + itemBufferWidth) * items.length;
  slider.style.width = `${sliderWidth}px`;

  if (ultrawide) { mainWidth = window.innerWidth; }
  main.style.width = `${mainWidth - itemBufferWidth / 2}px`;

  remainingWidth = window.outerWidth - mainWidth;
  if (ultrawide) { remainingWidth = ultrawideBuffer; }
  main.style.left = `${(remainingWidth) / 2}px`;

  covers.forEach((cover, idx) => {
    cover.style.width = coverWidth;
    if (itemType == GAME) {
      cover.style.left = `-${(itemWidth + itemBufferWidth) * (idx + (idx == 0 && !ultrawide ? 1 : 0)) + (window.outerHeight * 16 / 9 - window.outerHeight * mainAspectRatio) / 2 + (ultrawide ? ultrawideBuffer / 2 : 0)}px`;
    }
    if (itemType == MOVIE && itemsPerPage == 1) { cover.style.opacity = 0.8; }
    cover.style.backgroundSize = ultrawide ? 'cover' : 'contain';
  });

  logos.forEach(logo => {
    logo.style.left = `${itemWidth * 0.125}px`;
  });

  document.body.style.height = `${sliderWidth - (window.innerWidth - window.innerHeight) + remainingWidth}px`;
}

function launchItem(event) {
  window.launcher.run(itemType, event.target.parentElement.dataset.target);
}

function lerp(start, end, t) {
  return start * (1-t) + end * t;
}

function setTransform(element, transform) {
  element.style.transform = transform;
}

function animate() {
  current = parseFloat(lerp(current, target, ease)).toFixed(2);
  target = window.scrollY;
  setTransform(slider, `translateX(-${current}px)`);
  if (itemType == GAME) animateCovers(current);
  requestAnimationFrame(animate);
}

function animateCovers(current) {
  covers.forEach(cover => {
    setTransform(cover, `translateX(${current}px)`);
  });
}

function scaleScrolling(event) {
  let direction = (event.deltaY) < 0 ? -1 : 1;
  let scaledScrollY = window.scrollY + (itemWidth + itemBufferWidth) * direction;
  let minScrollY = 0;
  if (scaledScrollY < minScrollY) { scaledScrollY = minScrollY; }
  let maxScrollY = (sliderWidth - mainWidth + (ultrawide ? (ultrawideBuffer + itemBufferWidth) / 2 : 0));
  if (scaledScrollY > maxScrollY) { scaledScrollY = maxScrollY; }
  window.scrollY = scaledScrollY;
}

await init();
animate();
window.addEventListener('resize', init);
window.addEventListener('wheel', scaleScrolling);
