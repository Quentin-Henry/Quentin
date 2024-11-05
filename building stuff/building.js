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
//let nightTogButton = document.getElementById("nightTog");
//let isNightMode = false;

//let nightTogFunc = function nightTog() {
// if (!isNightMode) {
//  document.body.style.backgroundColor = "black";
//  document.body.style.filter = "invert(1)";
//  nightTogButton.innerHTML = "D";
// } else {
//   document.body.style.backgroundColor = "";
//   document.body.style.filter = "";
//  nightTogButton.innerHTML = "N";
// }
// isNightMode = !isNightMode; // Toggle the state
//};

//nightTogButton.onclick = nightTogFunc;
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
  windowImgSelector.src = "img/window_" + randWidnow + ".png";
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
  ornateSelector.src = "img/topOrnate_" + randOrnate + ".png";
  topOrnate.src = "img/topOrnate_" + randOrnate + ".png";
  bottomOrnate.src = "img/bottomOrnate_" + randOrnate + ".png";
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
    ornateT.src = "img/topOrnate_" + randOrnate + ".png";
    ornateT.className = "ornamentT" + randOrnate + " topOrnateImg OrnateImgT";
  }
  for (let ornateB of ornateSelectorB) {
    ornateB.src = "img/bottomOrnate_" + randOrnate + ".png";
    ornateB.className =
      "ornamentB" + randOrnate + " bottomOrnateImg OrnateImgB";
  }
};

// Function to scale the parent div on window resize

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

let currentCorniceIndex = 0; // Track the current cornice index

function changeCornice() {
  currentCorniceIndex = Math.floor(Math.random() * 3); // Update the index
  let corniceSelector = document.querySelectorAll(".corniceImg");
  for (let cornice of corniceSelector) {
    cornice.src = "img/cornice_" + currentCorniceIndex + ".png"; // Set the new image
  }
}

let addLength = function addLength() {
  // Clone the existing cornice div and its children
  let cloneCornice = corniceDiv.cloneNode(true); // Deep clone to include children

  // Update the image source of the cloned cornice
  let corniceImg = cloneCornice.querySelector(".corniceImg"); // Select the image element
  if (corniceImg) {
    corniceImg.src = "img/cornice_" + currentCorniceIndex + ".png"; // Set the correct image
  }

  console.log(cloneCornice);
  lengthMulitple++;

  for (let i = 0; i < Math.round(heightMulitple); i++) {
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
    windowImg.src = "img/window_" + randWidnow + ".png";
  }

  // Append the cloned cornice to the container
  corniceDivCont.appendChild(cloneCornice);

  // Set the same event listeners if necessary
  // Example:
  // cloneCornice.addEventListener('click', someEventHandler);

  let wrapperMargin = wrapperDiv.clientWidth - wrapperDiv.clientWidth * 0.35;
  let newScale = 1 * (wrapperMargin / parent.clientWidth);

  // Only update scale if the new scale is lower than the current scale
  if (newScale < parent.style.scale) {
    parent.style.scale = newScale;
    console.log("scale is " + parent.style.scale);
  }

  // Additional condition for lengthMulitple
  if (
    lengthMulitple > 5.2 &&
    newScale < 1 * (wrapperMargin / parent.clientHeight)
  ) {
    console.log(wrapperMargin, parent.clientWidth);
    console.log(wrapperMargin / parent.clientWidth);
  }
};

let addHeight = function addHeight() {
  heightMulitple++;

  for (let i = 0; i < Math.round(lengthMulitple); i++) {
    let randWindow = Math.floor(Math.random() * 36);
    let windowImg = document.getElementById("windowImg");
    let unitContainerHeight = unitContainer.clientHeight * heightMulitple;
    let cloneFacadeContainer = unitContainer.cloneNode(true);
    buildingContainer.style.height = unitContainerHeight + "px";

    cloneCount++;
    cloneFacadeContainer.id = "clone-y-" + cloneCount;
    cloneFacadeContainer.className = "unitContainer clone new height y";
    buildingContainer.appendChild(cloneFacadeContainer);
    windowImg.src = "img/window_" + randWindow + ".png";
  }

  let wrapperMargin = wrapperDiv.clientHeight - wrapperDiv.clientHeight * 0.1;
  let newScale = 1 * (wrapperMargin / parent.clientHeight);
  if (newScale < parent.style.scale) {
    console.log("scale is " + parent.style.scale);

    parent.style.scale = newScale;
  }
};
// Variables to keep track of last scales
let lastHeightScale = 1; // Initialize with 1, assuming no scaling
let lastLengthScale = 1; // Initialize with 1, assuming no scaling

let subLength = function subLength() {
  if (lengthMulitple > 1.3) {
    lengthMulitple--;

    const createdCorniceClone = document.querySelector(".corniceDiv");
    createdCorniceClone.remove();

    for (let i = 0; i < Math.round(heightMulitple); i++) {
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
  let newScale = 1 * (wrapperMargin / parent.clientWidth);

  // Log current scales
  console.log("Current newScale (length):", newScale);
  console.log("Last Height Scale:", lastHeightScale);
  console.log("Comparing Length and Height scales...");

  // Adopt the smaller value if newScale is less than or equal to lastHeightScale
  if (newScale <= lastHeightScale) {
    parent.style.scale = newScale; // Adopt the smaller scale
    lastLengthScale = newScale; // Update last length scale
    console.log("scale (length) adopted to:", parent.style.scale);
  } else {
    // If newScale is greater, just update the last length scale
    lastLengthScale = newScale;
    console.log(
      "scale (length) not updated; retaining height scale:",
      lastHeightScale
    );
  }

  // Prevent scaling above 1
  if (parent.style.scale > 1) {
    parent.style.scale = 1;
  }
};

let subHeight = function subHeight() {
  if (heightMulitple > 1.3) {
    heightMulitple--;
    for (let i = 0; i < Math.round(lengthMulitple); i++) {
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
  let newScale = 1 * (wrapperMargin / parent.clientHeight);

  // Log current scales
  console.log("Current newScale (height):", newScale);
  console.log("Last Length Scale:", lastLengthScale);
  console.log("Comparing Height and Length scales...");

  // Adopt the smaller value if newScale is less than or equal to lastLengthScale
  if (newScale <= lastLengthScale) {
    parent.style.scale = newScale; // Adopt the smaller scale
    lastHeightScale = newScale; // Update last height scale
    console.log("scale (height) adopted to:", parent.style.scale);
  } else {
    // If newScale is greater, just update the last height scale
    lastHeightScale = newScale;
    console.log(
      "scale (height) not updated; retaining length scale:",
      lastLengthScale
    );
  }

  // Prevent scaling above 1
  if (parent.style.scale > 1) {
    parent.style.scale = 1;
  }

  if (height > 20) {
    document.title = "tower of ਲبلил通բա";
  }
};

/// Function to scale the parent div on window resize
let resizeParentScale = function () {
  let wrapperMarginWidth =
    wrapperDiv.clientWidth - wrapperDiv.clientWidth * 0.35;
  let newWidthScale = wrapperMarginWidth / parent.clientWidth;

  let wrapperMarginHeight =
    wrapperDiv.clientHeight - wrapperDiv.clientHeight * 0.1;
  let newHeightScale = wrapperMarginHeight / parent.clientHeight;

  console.log("New Width Scale:", newWidthScale);
  console.log("New Height Scale:", newHeightScale);

  // Choose the smaller scale to maintain consistency with existing functions
  let newScale = Math.min(newWidthScale, newHeightScale);
  console.log("Chosen newScale (min of both):", newScale);

  // Log the current last scales
  console.log("Last Height Scale:", lastHeightScale);
  console.log("Last Length Scale:", lastLengthScale);

  // Update the parent scale only if the newScale is less than or equal to the last height and length scales
  if (newScale <= lastHeightScale && newScale <= lastLengthScale) {
    parent.style.scale = newScale; // Ensure scale is set correctly
    console.log("Parent scale updated to:", parent.style.scale);
  } else {
    console.log("Parent scale not updated; retaining current scale.");
  }

  // Prevent scaling above 1
  if (parseFloat(parent.style.scale) > 1) {
    parent.style.scale = 1;
    console.log("Parent scale set to 1 to prevent overflow.");
  }
};

// Attach the resize event listener
window.addEventListener("resize", resizeParentScale);

// Call the function initially to set the scale on load
resizeParentScale();
