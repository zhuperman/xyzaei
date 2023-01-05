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
const CUSTOM = "custom";
let sortAttribute = RELEASE_DATE;
let sortDirection = -1;

document.addEventListener('keydown', async function(event){
  // Exit
  if (event.keyCode == 27) {
    window.launcher.exit();
  }

  // Arrow Key Scrolling
  if (event.keyCode == 37) {
    if (currentItemId > 0) {
      let prevItemId = currentItemId;
      currentItemId -= 1;
      if (itemsPerPage > 1) { highlightCurrentItem(prevItemId); }
    }
    if (currentItemId < items.length - 1) { window.dispatchEvent(new WheelEvent('wheel', {'deltaY': -1})); }
  } else if (event.keyCode == 39) {
    if (currentItemId < items.length - 1) {
      let prevItemId = currentItemId;
      currentItemId += 1;
      if (itemsPerPage > 1) { highlightCurrentItem(prevItemId); }
    }
    if (currentItemId > 0) { window.dispatchEvent(new WheelEvent('wheel', {'deltaY': 1})); }
  } else if (event.keyCode == 13) {
    launchItem();
  }

  // Item Type
  if (event.keyCode == 112) {
    itemType = (itemType == GAME ? MOVIE : GAME);
    parallaxScrolling = !parallaxScrolling;
    await init();
  }
  // Sort Type
  if (event.keyCode == 113) {
    sortAttribute = sortAttribute == RELEASE_DATE ? CUSTOM : RELEASE_DATE;
    sortDirection = sortAttribute == RELEASE_DATE ? -1 : 1;
    await init();
  }
});

let itemWidth;
let itemBufferWidth;
let itemsPerPage;

let backgroundWidth;

let current;
let target;
let ease;

let items;
let backgrounds;
let logos;

let parallaxScrolling = true;
let ultrawide = false;
let ultrawideBuffer = 60;

const BACKGROUND_OPACITY = 0.8;
const LOGO_OPACITY = 0.9;
let currentItemId;

async function loadItems() {
  let jsonData = await window.items.fetch(itemType);
  if (sortAttribute == RELEASE_DATE) { jsonData = jsonData.sort((a, b) => { return sortDirection * a[sortAttribute].localeCompare(b[sortAttribute]); }); }
  items = jsonData.map((itemData, index) => {
    let item = document.createElement("div");
    item.className = `item ${itemType}`;
    item.id = index;
    item.style.width = `${itemWidth}px`;
    item.dataset.target = itemData.target;

    let background = document.createElement("div");
    background.className = `background ${itemType}`;
    background.style.backgroundImage = `url("${(parallaxScrolling ? itemData.background : itemData.cover).replace(/\\/g, "/")}")`;
    background.style.opacity = BACKGROUND_OPACITY / 2;
    item.appendChild(background);

    if (parallaxScrolling && itemData.logo) {
      let logo = document.createElement("div");
      logo.className = `logo ${itemType}`;
      logo.style.backgroundImage = `url("${itemData.logo.replace(/\\/g, "/")}")`;
      logo.style.opacity = LOGO_OPACITY / 2;
      item.appendChild(logo);
    }

    if (itemsPerPage > 1) item.addEventListener('mouseover', updateCurrentItem);
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

  if (parallaxScrolling) {
    itemsPerPage = ultrawide ? 5 : 3;
    itemBufferWidth = 20;
    mainAspectRatio = 16/9;
    itemWidth = (window.outerHeight * mainAspectRatio) / itemsPerPage - itemsPerPage * itemBufferWidth;
    backgroundWidth = '100vw';
    mainWidth = (itemWidth + itemBufferWidth) * itemsPerPage;
  } else {
    itemsPerPage = ultrawide ? 4 : 3;
    itemBufferWidth = 20;
    mainAspectRatio = 16/9;
    itemWidth = window.outerHeight * 0.95 * 2 / 3;
    backgroundWidth = `${itemWidth}px`;
    mainWidth = (itemWidth + itemBufferWidth) * itemsPerPage;
  }

  await loadItems();
  backgrounds = [...document.querySelectorAll('.background')];
  logos = [...document.querySelectorAll('.logo')];

  sliderWidth = (itemWidth + itemBufferWidth) * items.length;
  slider.style.width = `${sliderWidth}px`;

  if (ultrawide) { mainWidth = window.innerWidth; }
  main.style.width = `${mainWidth - itemBufferWidth / 2}px`;

  remainingWidth = window.outerWidth - mainWidth;
  if (ultrawide) { remainingWidth = ultrawideBuffer; }
  main.style.left = `${(remainingWidth) / 2}px`;

  backgrounds.forEach((background, idx) => {
    background.style.width = backgroundWidth;
    if (parallaxScrolling) {
      background.style.left = `-${(itemWidth + itemBufferWidth) * (idx + (idx == 0 && !ultrawide ? 1 : 0)) + (window.outerHeight * 16 / 9 - window.outerHeight * mainAspectRatio) / 2 + (ultrawide ? ultrawideBuffer / 2 : 0)}px`;
    }
    if (itemsPerPage == 1) { background.style.opacity = BACKGROUND_OPACITY; }
    background.style.backgroundSize = ultrawide ? 'background' : 'contain';
  });

  logos.forEach(logo => {
    logo.style.left = `${itemWidth * 0.125}px`;
  });

  currentItemId = Math.floor(itemsPerPage / 2);
  highlightCurrentItem(currentItemId);

  document.body.style.height = `${sliderWidth - (window.innerWidth - window.innerHeight) + remainingWidth}px`;
}

function updateCurrentItem(event) {
  let prevItemId = currentItemId;
  currentItemId = parseInt(event.target.parentElement.id);
  highlightCurrentItem(prevItemId);
}

function highlightCurrentItem(prevItemId) {
  let prevItem = document.getElementById(prevItemId.toString());
  for (let child of prevItem.children) {
    if (child.classList.contains('background')) { child.style.opacity = BACKGROUND_OPACITY / 2; }
    if (child.classList.contains('logo')) { child.style.opacity = LOGO_OPACITY / 2; }
  }
  let currentItem = document.getElementById(currentItemId.toString());
  for (let child of currentItem.children) {
    if (child.classList.contains('background')) { child.style.opacity = BACKGROUND_OPACITY; }
    if (child.classList.contains('logo')) { child.style.opacity = LOGO_OPACITY; }
  }
}

function launchItem(event) {
  let path;
  if (event) {
    path = event.target.parentElement.dataset.target;
  } else {
    let currentItem = document.getElementById(currentItemId.toString());
    path = currentItem.dataset.target;
  }

  window.launcher.run(itemType, path);
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
  if (parallaxScrolling) animatebackgrounds(current);
  requestAnimationFrame(animate);
}

function animatebackgrounds(current) {
  backgrounds.forEach(background => {
    setTransform(background, `translateX(${current}px)`);
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
window.addEventListener("gamepadconnected", (e) => {
  let prevButtonValues = {};

  async function gamepadListener() {
    const gp = navigator.getGamepads()[0];
  
    if (prevButtonValues[0] < 1 && gp.buttons[0].value == 1) {
      // console.log("A");
      launchItem();
    } else if (prevButtonValues[1] < 1 && gp.buttons[1].value == 1) {
      // console.log("B");
      window.launcher.exit();
    } else if (prevButtonValues[2] < 1 && gp.buttons[2].value == 1) {
      // console.log("X");
      sortAttribute = sortAttribute == RELEASE_DATE ? CUSTOM : RELEASE_DATE;
      sortDirection = sortAttribute == RELEASE_DATE ? -1 : 1;
      await init();
    } else if (prevButtonValues[3] < 1 && gp.buttons[3].value == 1) {
      // console.log("Y");
      itemType = (itemType == GAME ? MOVIE : GAME);
      parallaxScrolling = !parallaxScrolling;
      await init();
    }

    if (prevButtonValues[4] < 1 && gp.buttons[4].value == 1) {
      // console.log("LB");
    } else if (prevButtonValues[5] < 1 && gp.buttons[5].value == 1) {
      // console.log("RB");
    } else if (prevButtonValues[6] < 1 && gp.buttons[6].value == 1) {
      // console.log("LT");
    } else if (prevButtonValues[7] < 1 && gp.buttons[7].value == 1) {
      // console.log("RT");
    }

    if (prevButtonValues[8] < 1 && gp.buttons[8].value == 1) {
      // console.log("View");
    } else if (prevButtonValues[9] < 1 && gp.buttons[9].value == 1) {
      // console.log("Menu");
    }

    if (prevButtonValues[10] < 1 && gp.buttons[10].value == 1) {
      // console.log("LS");
    } else if (prevButtonValues[11] < 1 && gp.buttons[11].value == 1) {
      // console.log("RS");
    }

    if (prevButtonValues[12] < 1 && gp.buttons[12].value == 1) {
      // console.log("Up");
    } else if (prevButtonValues[13] < 1 && gp.buttons[13].value == 1) {
      // console.log("Down");
    } else if (prevButtonValues[14] < 1 && gp.buttons[14].value == 1) {
      // console.log("Left");
      if (currentItemId > 0) {
        let prevItemId = currentItemId;
        currentItemId -= 1;
        if (itemsPerPage > 1) { highlightCurrentItem(prevItemId); }
      }
      if (currentItemId < items.length - 1) { window.dispatchEvent(new WheelEvent('wheel', {'deltaY': -1})); }
    } else if (prevButtonValues[15] < 1 && gp.buttons[15].value == 1) {
      // console.log("Right");
      if (currentItemId < items.length - 1) {
        let prevItemId = currentItemId;
        currentItemId += 1;
        if (itemsPerPage > 1) { highlightCurrentItem(prevItemId); }
      }
      if (currentItemId > 0) { window.dispatchEvent(new WheelEvent('wheel', {'deltaY': 1})); }
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
  }
  
  gamepadListener();
});

