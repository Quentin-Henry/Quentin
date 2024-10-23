const parent = document.getElementById("parent");
const buildingContainer = document.getElementById("buildingCont");
const unitContainer = document.getElementById("unitContainer");
const corniceDiv = document.getElementById("corniceDiv");
const corniceDivCont = document.getElementById("corniceDivCont");
const ornamentDiv = document.getElementsByClassName("ornament");
const wrapperDiv = document.getElementById("center-wrapper");
const windowImg = document.getElementById("windowImg");

let lengthMultiplier = 1.1;
let heightMultiplier = 1.1;
let cloneCount = 0;

function updateBuildingContainerWidth() {
  const width = unitContainer.clientWidth * lengthMultiplier;
  buildingContainer.style.width = `${width}px`;
  corniceDiv.style.width = `${width}px`;
  corniceDivCont.style.width = `${width}px`;
}

function changeWindow(window) {
  const img = window.querySelector("img");
  img.src = `img/window_${Math.floor(Math.random() * 36)}.png`;
}

function changeOrnate(ornate) {
  const ornateSelector = ornate.querySelector("img");
  const randOrnate = Math.floor(Math.random() * 2);
  ornateSelector.src = `img/topOrnate_${randOrnate}.png`;
  document.getElementById(
    "topOrnateImg"
  ).src = `img/topOrnate_${randOrnate}.png`;
  document.getElementById(
    "bottomOrnateImg"
  ).src = `img/bottomOrnate_${randOrnate}.png`;
}

function changeCornice() {
  const randCornice = Math.floor(Math.random() * 3);
  document.querySelectorAll(".corniceImg").forEach((cornice) => {
    cornice.src = `img/cornice_${randCornice}.png`;
  });
}

function scaleParent() {
  const wrapperMargin = wrapperDiv.clientWidth * 0.65;
  parent.style.scale = Math.min(wrapperMargin / parent.clientWidth, 1);
}

function addLength() {
  const cloneCornice = corniceDiv.cloneNode(true);
  corniceDivCont.appendChild(cloneCornice);

  lengthMultiplier++;
  for (let i = 0; i < Math.round(heightMultiplier); i++) {
    const cloneUnitContainer = unitContainer.cloneNode(true);
    cloneCount++;
    cloneUnitContainer.id = `clone-x-${cloneCount}`;
    cloneUnitContainer.className = "unitContainer clone new length x";
    buildingContainer.appendChild(cloneUnitContainer);
    windowImg.src = `img/window_${Math.floor(Math.random() * 36)}.png`;
  }
  updateBuildingContainerWidth();
  scaleParent();
}

function subLength() {
  if (lengthMultiplier > 1.3) {
    lengthMultiplier--;
    const createdCorniceClone = document.querySelector(".corniceDiv");
    createdCorniceClone.remove();

    for (let i = 0; i < Math.round(heightMultiplier); i++) {
      const createdClone = document.querySelector(".new");
      createdClone.remove();
      cloneCount--;
    }
    updateBuildingContainerWidth();
    scaleParent();
  }
}

function addHeight() {
  heightMultiplier++;
  for (let i = 0; i < Math.round(lengthMultiplier); i++) {
    const cloneFacadeContainer = unitContainer.cloneNode(true);
    cloneCount++;
    cloneFacadeContainer.id = `clone-y-${cloneCount}`;
    cloneFacadeContainer.className = "unitContainer clone new height y";
    buildingContainer.appendChild(cloneFacadeContainer);
    windowImg.src = `img/window_${Math.floor(Math.random() * 36)}.png`;
  }
  scaleParent();
}

function subHeight() {
  if (heightMultiplier > 1.3) {
    heightMultiplier--;
    for (let i = 0; i < Math.round(lengthMultiplier); i++) {
      const createdClone = document.querySelector(".new");
      createdClone.remove();
      cloneCount--;
    }
    scaleParent();
  }
  if (heightMultiplier > 20) {
    document.title = "tower of ਲਬਿਲ通բա";
  }
}

// Event Listeners
document.getElementById("plusLength").onclick = addLength;
document.getElementById("minusLength").onclick = subLength;
document.getElementById("plusHeight").onclick = addHeight;
document.getElementById("minusHeight").onclick = subHeight;
ornamentDiv.onclick = changeOrnate;

updateBuildingContainerWidth();
