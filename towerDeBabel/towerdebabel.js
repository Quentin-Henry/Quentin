let parent = document.getElementById("parent");
let buildingContainer = document.getElementById("buildingCont");
let unitContainer = document.getElementById("unitContainer");
let facadeContainer = document.getElementById("FacadeDiv");
let lengthPlusButton = document.getElementById("plusLength");
let lengthMinusButton = document.getElementById("minusLength");
let heightPlusButton = document.getElementById("plusHeight");
let heightMinusButton = document.getElementById("minusHeight");
let WindowDiv = document.querySelectorAll("windowImageContainer");
let windowImgSelector = document.querySelectorAll(".windowImg");
let corniceDiv = document.getElementById("corniceDiv");
let newUnit = document.createElement("div");
let corniceDivCont = document.getElementById("corniceDivCont");
let ornamentDiv = document.getElementsByClassName("ornament");
let createdCorniceClone = document.querySelector(".corniceLength");
let unitContainerWidth = unitContainer.clientWidth;
let unitContainerheight = unitContainer.clientHeight;
let wrapperDiv = document.getElementById("center-wrapper");

let lengthMulitple = 1.1;
let length = Math.floor(lengthMulitple);
let heightMulitple = 1.1;
let height = Math.floor(heightMulitple);

let cloneCount = 0;

let buildingContainerWidth = unitContainerWidth * lengthMulitple;
buildingContainer.style.width = buildingContainerWidth + "px";
corniceDiv.style.width = buildingContainerWidth + "px";
corniceDivCont.style.width = buildingContainerWidth + "px";

parent.style.left = 40;
parent.style.scale = 1;
let scaleMultiple = 10;

function changeWindow(window) {
  let windowImgSelector = window.querySelector("img");
  let randWidnow = Math.floor(Math.random() * 36);
  windowImgSelector.src = "/towerDeBabel/img/window_" + randWidnow + ".png";
}

//let ornateChnageSelector=
//function  ornateChnageSelector(x){
// let ornateSelector=document.querySelectorAll("ornateImg")
// for(let ornate of ornateSelector)
// ornate.src=("architec window centerInner top ornamentB"+x)
//}

let changeOrnate = function changeOrnate(ornate) {
  let ornateSelector = ornate.querySelector("Img");
  let topOrnate = document.getElementById("topOrnateImg");
  let bottomOrnate = document.getElementById("bottomOrnateImg");
  let randOrnate = Math.floor(Math.random() * 2);
  ornateSelector.src = "/towerDeBabel/img/topOrnate_" + randOrnate + ".png";
  topOrnate.src = "/towerDeBabel/img/topOrnate_" + randOrnate + ".png";
  bottomOrnate.src = "/towerDeBabel/img/bottomOrnate_" + randOrnate + ".png";
  topOrnate.className =
    "architec window centerInner top ornamentT" + randOrnate;
  bottomOrnate.className =
    "architec window centerInner top ornamentB" + randOrnate;
};

let chnageOrnateAll = function chnageOrnateAll() {
  let randOrnate = Math.floor(Math.random() * 4);
  let ornateSelectorT = document.querySelectorAll(".OrnateImgT");
  let ornateSelectorB = document.querySelectorAll(".OrnateImgB");
  for (let ornateT of ornateSelectorT) {
    ornateT.src = "/towerdebabel/img/topOrnate_" + randOrnate + ".png";
    ornateT.className = "ornamentT" + randOrnate + " topOrnateImg OrnateImgT";
  }
  for (let ornateB of ornateSelectorB) {
    ornateB.src = "/towerDeBabel/img/bottomOrnate_" + randOrnate + ".png";
    ornateB.className =
      "ornamentB" + randOrnate + " bottomOrnateImg OrnateImgB";
  }
};

window.onresize = function windowResize() {
  let windowLength = window.length;
  let windowHeight = window.height;
};

function changeCornice() {
  let randCornice = Math.floor(Math.random() * 3);
  let corniceSelector = document.querySelectorAll(".corniceImg");
  for (let cornice of corniceSelector) {
    cornice.src = "/towerDeBabel/img/cornice_" + randCornice + ".png";
  }
}

function widthScale() {
  wrapperDiv.clientWidth;
  let wrapperMargin = wrapperDiv.clientWidth - wrapperDiv.clientWidth * 0.35;
  console.log(wrapperMargin, parent.clientWidth);
  console.log(wrapperMargin / parent.clientWidth);
  parent.style.scale = 1 * (wrapperMargin / parent.clientWidth);
  console.log("scale is " + parent.style.scale);
}
function heightScale() {
  wrapperDiv.clientHeight;
  let wrapperMargin = wrapperDiv.clientHeight - wrapperDiv.clientHeight * 0.1;
  console.log(wrapperMargin, parent.clientHeight);
  console.log(wrapperMargin / parent.clientHeight);
  parent.style.scale = 1 * (wrapperMargin / parent.clientHeight);
  console.log("scale is " + parent.style.scale);
}

ornamentDiv.onclick = changeOrnate;

let addLength = function addLength() {
  let cloneCornice = corniceDiv.cloneNode(true);
  cloneCornice.class = "corniceDiv corniceLength";

  lengthMulitple++;

  for (var i = 0; i < Math.round(heightMulitple); i++) {
    let randWidnow = Math.floor(Math.random() * 36);
    let windowImg = document.getElementById("windowImg");
    let cloneUnitContainer = unitContainer.cloneNode(true);
    let length = Math.floor(lengthMulitple);

    cloneCount++;

    let buildingContainerWidth = unitContainerWidth * lengthMulitple;
    buildingContainer.style.width = buildingContainerWidth + "px";
    const cloneClass = "unitContainer clone new length x";
    const cloneId = "clone-x-" + cloneCount;
    cloneUnitContainer.id = cloneId;
    cloneUnitContainer.className = cloneClass;
    buildingContainer.appendChild(cloneUnitContainer);
    corniceDivCont.style.width = buildingContainerWidth + "px";
    windowImg.src = "/towerDeBabel/img/window_" + randWidnow + ".png";

    console.log("building Length is " + length);
    console.log("building Length is " + buildingContainerWidth);
    console.log("number of clones is " + cloneCount);
  }

  corniceDivCont.appendChild(cloneCornice);
  let wrapperMargin = wrapperDiv.clientWidth - wrapperDiv.clientWidth * 0.35;
  if (
    lengthMulitple > 6.2 &&
    1 * (wrapperMargin / parent.clientWidth) <
      1 * (wrapperMargin / parent.clientHeight)
  ) {
    wrapperDiv.clientWidth;

    console.log(wrapperMargin, parent.clientWidth);
    console.log(wrapperMargin / parent.clientWidth);
    parent.style.scale = 1 * (wrapperMargin / parent.clientWidth);
    console.log("scale is " + parent.style.scale);
  }
};

let subLength = function subLength() {
  if (lengthMulitple > 1.3) {
    lengthMulitple--;

    const createdCorniceClone = document.querySelector(".corniceDiv");
    createdCorniceClone.remove();

    for (var i = 0; i < Math.round(heightMulitple); i++) {
      const createdClone = document.querySelector(".new");
      let buildingContainerWidth = unitContainerWidth * lengthMulitple;
      buildingContainer.style.width = buildingContainerWidth + "px";
      corniceDivCont.style.width = buildingContainerWidth + "px";
      createdClone.remove();

      cloneCount--;

      console.log("building Length is " + lengthMulitple);
      console.log("building Length is " + buildingContainerWidth);
      console.log("number of clones is " + cloneCount);
    }
  }

  let wrapperMargin = wrapperDiv.clientWidth - wrapperDiv.clientWidth * 0.35;
  if (
    lengthMulitple > 6.2 &&
    1 * (wrapperMargin / parent.clientWidth) <
      1 * (wrapperMargin / parent.clientHeight)
  ) {
    wrapperDiv.clientWidth;

    console.log(wrapperMargin, parent.clientWidth);
    console.log(wrapperMargin / parent.clientWidth);
    parent.style.scale = 1 * (wrapperMargin / parent.clientWidth);
    console.log("scale is " + parent.style.scale);
  }

  if (parent.style.scale > 1) {
    parent.style.scale = 1;
  }
};

lengthMinusButton.onClick = subLength;

let addHeight = function addHeight() {
  heightMulitple++;

  for (var i = 0; i < Math.round(lengthMulitple); i++) {
    let randWidnow = Math.floor(Math.random() * 36);
    let windowImg = document.getElementById("windowImg");
    let unitContainerheight = unitContainer.clientHeight * heightMulitple;
    let cloneFacadeContainer = unitContainer.cloneNode(true);
    buildingContainer.style.height = unitContainerheight + "px";
    let height = Math.floor(heightMulitple);

    cloneCount++;

    const cloneId = "clone-y-" + cloneCount;
    const cloneClass = "unitContainer clone new height y";
    cloneFacadeContainer.id = cloneId;
    cloneFacadeContainer.className = cloneClass;
    buildingContainer.appendChild(cloneFacadeContainer);
    windowImg.src = "/towerDeBabel/img/window_" + randWidnow + ".png";

    console.log("building Height is " + height);
    console.log("building height is " + unitContainerheight);
    console.log("number of clones is " + cloneCount);
  }
  let wrapperMargin = wrapperDiv.clientHeight - wrapperDiv.clientHeight * 0.1;
  if (
    heightMulitple > 3.2 &&
    1 * (wrapperMargin / parent.clientWidth) >
      1 * (wrapperMargin / parent.clientHeight)
  ) {
    wrapperDiv.clientHeight;
    let wrapperMargin = wrapperDiv.clientHeight - wrapperDiv.clientHeight * 0.1;
    console.log(wrapperMargin, parent.clientHeight);
    console.log(wrapperMargin / parent.clientHeight);
    parent.style.scale = 1 * (wrapperMargin / parent.clientHeight);
    console.log("scale is " + parent.style.scale);
  }
};

let subHeight = function subHeight() {
  if (heightMulitple > 1.3) {
    heightMulitple--;
    for (var i = 0; i < Math.round(lengthMulitple); i++) {
      const createdClone = document.querySelector(".new");
      let unitContainerheight = unitContainer.clientHeight * heightMulitple;
      buildingContainer.style.height = unitContainerheight + "px";
      createdClone.remove();
      cloneCount--;

      console.log("building height is " + height);
      console.log("number of clones is " + cloneCount);
    }
  }
  let wrapperMargin = wrapperDiv.clientHeight - wrapperDiv.clientHeight * 0.1;
  if (
    heightMulitple > 3.2 &&
    1 * (wrapperMargin / parent.clientWidth) >
      1 * (wrapperMargin / parent.clientHeight)
  ) {
    wrapperDiv.clientHeight;
    let wrapperMargin = wrapperDiv.clientHeight - wrapperDiv.clientHeight * 0.1;
    console.log(wrapperMargin, parent.clientHeight);
    console.log(wrapperMargin / parent.clientHeight);
    parent.style.scale = 1 * (wrapperMargin / parent.clientHeight);
    console.log("scale is " + parent.style.scale);
  }
  if (parent.style.scale > 1) {
    parent.style.scale = 1;
  }

  if (height > 20) {
    document.title = "tower of ਲبلил通բա";
  }
};
