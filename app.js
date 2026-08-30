// ------------------------
// GLOBAL DATA
// ------------------------

let summaryData = {
  positions: {},
  totalLitres: 0,
  totalDrums: 0
};

let currentPaintResult = {

  position: "",
  coat: "",
  litres: 0,
  drums: 0,
  area: 0
};

let pdpData = [];

let vesselPhotoData = "";

// ------------------------
// STARTUP
// ------------------------

window.onload = function(){
  
  let today = new Date();

  let formattedDate =
    today.toLocaleDateString();

  let dateField =
    document.getElementById("reportDate");

  if(dateField){
    dateField.value = formattedDate;
  }

let autoSave =
  localStorage.getItem("autoSave");

loadSummary();

  initializePhotoUpload();

  resetStations();

  document.getElementById(
    "mainMenuTab"
  ).style.display = "block";

  if(autoSave === "false"){

  document.getElementById(
    "autoSaveToggle"
  ).checked = false;

}

let darkMode =
  localStorage.getItem(
    "darkMode"
  );

if(darkMode === "false"){

  document.getElementById(
    "darkModeToggle"
  ).checked = false;

  document.body.classList.add(
    "lightMode"
  );

}
  
};

// ------------------------
// TABS
// ------------------------

function showTab(tab){

  document.getElementById("mainMenuTab").style.display = "none";
  document.getElementById("paintTab").style.display = "none";
  document.getElementById("hullTab").style.display = "none";
  document.getElementById("jtsTab").style.display = "none";
  document.getElementById("summaryTab").style.display = "none";
  document.getElementById("settingsTab").style.display = "none";
  document.getElementById("pdpTab").style.display = "none";
  document.getElementById("calculatorTab").style.display = "none";

  document
  .querySelectorAll(".activeNav")
  .forEach(el =>
    el.classList.remove("activeNav")
  );

  if(tab==="mainMenu")
  document
    .querySelectorAll(".navDashboard")
    .forEach(el =>
      el.classList.add("activeNav")
    );

if(tab==="paint")
  document
    .querySelectorAll(".navPaint")
    .forEach(el =>
      el.classList.add("activeNav")
    );

if(tab==="hull")
  document
    .querySelectorAll(".navHull")
    .forEach(el =>
      el.classList.add("activeNav")
    );

if(tab==="jts")
  document
    .querySelectorAll(".navJts")
    .forEach(el =>
      el.classList.add("activeNav")
    );

if(tab==="calculator")
  document
    .querySelectorAll(".navCalculator")
    .forEach(el =>
      el.classList.add("activeNav")
    );

if(tab==="pdp")
  document
    .querySelectorAll(".navPdp")
    .forEach(el =>
      el.classList.add("activeNav")
    );

if(tab==="summary")
  document
    .querySelectorAll(".navSummary")
    .forEach(el =>
      el.classList.add("activeNav")
    );

  if(tab==="mainMenu")
    document.getElementById("mainMenuTab").style.display = "block";

  if(tab==="paint")
    document.getElementById("paintTab").style.display = "block";

  if(tab==="hull")
    document.getElementById("hullTab").style.display = "block";

  if(tab==="jts")
    document.getElementById("jtsTab").style.display = "block";

  if(tab==="calculator")
    document.getElementById("calculatorTab").style.display = "block";

  if(tab==="pdp")
    document.getElementById("pdpTab").style.display = "block";

  if(tab==="settings")
    document.getElementById("settingsTab").style.display = "block";

  if(tab==="summary"){

    document.getElementById("summaryTab").style.display = "block";

    document.getElementById("summaryVesselTitle").innerText =
      document.getElementById("vesselName").value || "NO VESSEL";

    document.getElementById("summaryVesselIMO").innerText =
      "IMO " +
      (document.getElementById("imo").value || "-");

    document.getElementById("summaryLocation").innerText =
      document.getElementById("location").value || "NO LOCATION";

    let totalJTS =
      Number(document.getElementById("jtsFlatBottom").value || 0) +
      Number(document.getElementById("jtsVerticalSides").value || 0) +
      Number(document.getElementById("jtsBoottop").value || 0) +
      Number(document.getElementById("jtsTopside").value || 0) +
      Number(document.getElementById("jtsOther").value || 0);

    document.getElementById("totalJTSKPI").innerText =
      totalJTS.toLocaleString();
  }

}

// ------------------------
// PAINT CALCULATOR
// ------------------------

function calculatePaint(){

  let solids =
    parseFloat(
      document.getElementById("solids").value
    ) || 0;

  let loss =
    parseFloat(
      document.getElementById("loss").value
    ) || 0;

  let dft =
    parseFloat(
      document.getElementById("dft").value
    ) || 1;

  let area =
    parseFloat(
      document.getElementById("area").value
    ) || 0;

  let areaPercent =
    parseFloat(
      document.getElementById("areaPercent").value
    ) || 100;

  let drum =
    parseFloat(
      document.getElementById("drum").value
    ) || 1;

  let effectiveArea =
    area * areaPercent / 100;

  let result1 =
    10 * solids * loss;

  let result2 =
    result1 / dft;

  let litres =
    effectiveArea / result2;

  let drums =
    litres / drum;

  document.getElementById("r1").innerHTML =
    result1.toFixed(1);

  document.getElementById("r2").innerHTML =
    result2.toFixed(1);

  document.getElementById("litres").innerHTML =
    litres.toFixed(1);

  document.getElementById("drums").innerHTML =
    drums.toFixed(1);

  currentPaintResult = {
    position:
      document.getElementById("paintPosition").value,

    coat:
      document.getElementById("coatNumber").value,

    litres: litres,

    drums: drums,

    area: area
  };

}

// ------------------------
// SEND PAINT TO SUMMARY
// ------------------------

function sendPaintToSummary(){

  let position =
    currentPaintResult.position;

  let coat =
    currentPaintResult.coat;

  if(!position){
    alert("Calculate first");
    return;
  }

  if(!summaryData.positions[position]){

    summaryData.positions[position] = {

      area:
        currentPaintResult.area,

      coats:{}

    };

  }

  summaryData.positions[position].area =
    currentPaintResult.area;

  summaryData.positions[position].coats[coat] = {

    litres:
      currentPaintResult.litres,

    drums:
      Math.ceil(
        currentPaintResult.drums
      )

  };

  renderSummary();

}

// ------------------------
// HULL CALCULATOR
// ------------------------

let flatBottomArea = 0;
let verticalSidesArea = 0;
let boottopArea = 0;
let topsideArea = 0;

function calculateHull(){

  let loa =
    parseFloat(
      document.getElementById("loa").value
    ) || 0;

  let lbp =
    parseFloat(
      document.getElementById("lbp").value
    ) || 0;

  let breadth =
    parseFloat(
      document.getElementById("breadth").value
    ) || 0;

  let draught =
    parseFloat(
      document.getElementById("draught").value
    ) || 0;

  let height =
    parseFloat(
      document.getElementById("height").value
    ) || 0;

  let dwt =
    parseFloat(
      document.getElementById("dwt").value
    ) || 0;

  let boottopHeight =
    parseFloat(
      document.getElementById("boottopHeight").value
    ) || 0;

  let manualFactor =
    parseFloat(
      document.getElementById("hullFactor").value
    );

  let hullFactor = 0;

  if(!manualFactor){

    if(dwt < 20000)
      hullFactor = 0.67;

    else if(dwt < 40000)
      hullFactor = 0.75;

    else if(dwt <= 100000)
      hullFactor = 0.85;

    else
      hullFactor = 0.90;

    document.getElementById("hullFactor").value =
      hullFactor;

  }
  else{

    hullFactor = manualFactor;

  }

  let topsideHeight =
    height - draught;

  let flatBottom =
    lbp * breadth * hullFactor;

  let verticalSides =
    2 * draught * loa;

  let boottop =
    2 *
    boottopHeight *
    (lbp + 0.5 * breadth);

  let topside =
    2 *
    topsideHeight *
    (loa + 0.5 * breadth) *
    1.10;

  let totalArea =
    flatBottom +
    verticalSides +
    boottop +
    topside;

flatBottomArea = flatBottom;

verticalSidesArea = verticalSides;

boottopArea = boottop;

topsideArea = topside;
  
document.getElementById("flatBottomKPI").innerHTML =
  flatBottom.toFixed(0) + " m²";

document.getElementById("verticalSidesKPI").innerHTML =
  verticalSides.toFixed(0) + " m²";

document.getElementById("boottopKPI").innerHTML =
  boottop.toFixed(0) + " m²";

document.getElementById("topsideKPI").innerHTML =
  topside.toFixed(0) + " m²";

document.getElementById("totalAreaKPIHull").innerHTML =
  totalArea.toFixed(0) + " m²";

}

// ------------------------
// SEND TO PAINT
// ------------------------

function sendAreaToPaint(area){

  document.getElementById("area").value =
    area.toFixed(0);

  showTab("paint");

}

// ------------------------
// SUMMARY
// ------------------------

function renderSummary(){

  let html = `

  <div class="summaryGridHeader">

    <div>AREA</div>

    <div>COAT</div>

    <div>SQM</div>

    <div>LITRES</div>

    <div>DRUMS</div>

  </div>

  `;

  let totalLitres = 0;
  let totalDrums = 0;

  for(let position in summaryData.positions){

    let item =
      summaryData.positions[position];

    for(let coat in item.coats){

      let coatData =
        item.coats[coat];

      totalLitres +=
        coatData.litres;

      totalDrums +=
        coatData.drums;

      html += `

      <div class="summaryGridRow">

        <div>${position}</div>

        <div>${coat}</div>

        <div>${item.area.toFixed(0)}</div>

        <div>${coatData.litres.toFixed(1)}</div>

        <div>${Math.ceil(coatData.drums)}</div>

      </div>

      `;
    }
  }

document.getElementById(
  "totalLitresKPI"
).innerText =
  totalLitres.toFixed(1);

document.getElementById(
  "totalAreaKPI"
).innerText =
  Math.ceil(totalDrums);
  
  document.getElementById(
    "summaryContent"
  ).innerHTML = html;
}

function sendHullToSummary(position, area){

  if(!summaryData.positions[position]){

    summaryData.positions[position] = {

      area: area,
      coats: {}

    };

  }

  summaryData.positions[position].area = area;

  renderSummary();

}

function getJtsValue(position){

  if(position==="Flat Bottom")
    return parseFloat(document.getElementById("jtsFlatBottom").value) || 0;

  if(position==="Vertical Sides")
    return parseFloat(document.getElementById("jtsVerticalSides").value) || 0;

  if(position==="Boottop")
    return parseFloat(document.getElementById("jtsBoottop").value) || 0;

  if(position==="Topside")
    return parseFloat(document.getElementById("jtsTopside").value) || 0;

  if(position==="Other")
    return parseFloat(document.getElementById("jtsOther").value) || 0;

  return 0;

}

function jtsToPaint(position){

  let area =
    getJtsValue(position);

  document.getElementById("area").value =
    area;

  document.getElementById("paintPosition").value =
    position;

  showTab("paint");

}

function jtsToSummary(position){

  let area =
    getJtsValue(position);

  if(!summaryData.positions[position]){

    summaryData.positions[position] = {

      area: area,
      coats: {}

    };

  }

  summaryData.positions[position].area =
    area;

  renderSummary();

}

function saveSummary(){

  let autoSave =
    localStorage.getItem("autoSave");

  if(autoSave !== "false"){

    alert(
      "Autosave is ON. Manual save is not required."
    );

    return;
  }

let projectData = {

  vessel:
    document.getElementById("vesselName").value,

  imo:
    document.getElementById("imo").value,

  location:
    document.getElementById("location").value,

  inspector:
    document.getElementById("inspector").value,

  ownerRep:
    document.getElementById("ownerRep").value,

  jtsFlatBottom:
    document.getElementById("jtsFlatBottom").value,

  jtsVerticalSides:
    document.getElementById("jtsVerticalSides").value,

  jtsBoottop:
    document.getElementById("jtsBoottop").value,

  jtsTopside:
    document.getElementById("jtsTopside").value,

  jtsOther:
    document.getElementById("jtsOther").value,

  jtsOtherDescription:
  document.getElementById(
    "jtsOtherDescription"
  )?.value || "",

  loa:
  document.getElementById("loa")?.value || "",

lbp:
  document.getElementById("lbp")?.value || "",

breadth:
  document.getElementById("breadth")?.value || "",

draught:
  document.getElementById("draught")?.value || "",

height:
  document.getElementById("height")?.value || "",

dwt:
  document.getElementById("dwt")?.value || "",

boottopHeight:
  document.getElementById(
    "boottopHeight"
  )?.value || "",

hullFactor:
  document.getElementById(
    "hullFactor"
  )?.value || "",

  solids:
    document.getElementById("solids").value,

  loss:
    document.getElementById("loss").value,

  dft:
    document.getElementById("dft").value,

  area:
    document.getElementById("area").value,

areaPercent:
  document.getElementById(
    "areaPercent"
  )?.value || "",
  
  drum:
    document.getElementById("drum").value,

  totalSprays:
    document.getElementById("totalSprays")?.value || "",

  spraysPerStation:
    document.getElementById("spraysPerStation")?.value || "",

  paintDescription:
    document.getElementById("paintDescription")?.value || "",

  pdpComments:
    document.getElementById("pdpComments")?.value || "",

  summary:
    summaryData,

  photo:
    vesselPhotoData

};

  localStorage.setItem(
    "paintCalculatorSummary",
    JSON.stringify(projectData)
  );

  alert("Summary Saved");

}

function loadSummary(){

  let savedData =
    localStorage.getItem(
      "paintCalculatorSummary"
    );

  if(!savedData)
    return;

  let projectData =
    JSON.parse(savedData);

  document.getElementById("vesselName").value =
    projectData.vessel || "";

  document.getElementById("imo").value =
    projectData.imo || "";

  document.getElementById("location").value =
    projectData.location || "";

document.getElementById("inspector").value =
  projectData.inspector || "";

document.getElementById("ownerRep").value =
  projectData.ownerRep || "";

document.getElementById("jtsFlatBottom").value =
  projectData.jtsFlatBottom || "";

document.getElementById("jtsVerticalSides").value =
  projectData.jtsVerticalSides || "";

document.getElementById("jtsBoottop").value =
  projectData.jtsBoottop || "";

document.getElementById("jtsTopside").value =
  projectData.jtsTopside || "";

document.getElementById("jtsOther").value =
  projectData.jtsOther || "";

  if(document.getElementById(
  "jtsOtherDescription"
)){
  document.getElementById(
    "jtsOtherDescription"
  ).value =
    projectData.jtsOtherDescription || "";
}

  if(document.getElementById("loa")){
  document.getElementById("loa").value =
    projectData.loa || "";
}

if(document.getElementById("lbp")){
  document.getElementById("lbp").value =
    projectData.lbp || "";
}

if(document.getElementById("breadth")){
  document.getElementById("breadth").value =
    projectData.breadth || "";
}

if(document.getElementById("draught")){
  document.getElementById("draught").value =
    projectData.draught || "";
}

if(document.getElementById("height")){
  document.getElementById("height").value =
    projectData.height || "";
}

if(document.getElementById("dwt")){
  document.getElementById("dwt").value =
    projectData.dwt || "";
}

if(document.getElementById("boottopHeight")){
  document.getElementById(
    "boottopHeight"
  ).value =
    projectData.boottopHeight || "";
}

if(document.getElementById("hullFactor")){
  document.getElementById(
    "hullFactor"
  ).value =
    projectData.hullFactor || "";
}

  if(document.getElementById(
  "areaPercent"
)){
  document.getElementById(
    "areaPercent"
  ).value =
    projectData.areaPercent || "";
}

document.getElementById("solids").value =
  projectData.solids || "";

document.getElementById("loss").value =
  projectData.loss || "";

document.getElementById("dft").value =
  projectData.dft || "";

document.getElementById("area").value =
  projectData.area || "";

document.getElementById("drum").value =
  projectData.drum || "";

if(document.getElementById("totalSprays")){
  document.getElementById("totalSprays").value =
    projectData.totalSprays || "";
}

if(document.getElementById("spraysPerStation")){
  document.getElementById("spraysPerStation").value =
    projectData.spraysPerStation || "";
}

if(document.getElementById("paintDescription")){
  document.getElementById("paintDescription").value =
    projectData.paintDescription || "";
}

if(document.getElementById("pdpComments")){
  document.getElementById("pdpComments").value =
    projectData.pdpComments || "";
}
  
  summaryData =
    projectData.summary || {
      positions:{}
    };

vesselPhotoData =
  projectData.photo || "";

if(vesselPhotoData){

  let preview =
    document.getElementById(
      "photoPreview"
    );

  preview.src =
    vesselPhotoData;

  preview.style.display =
    "block";
}  
  
  renderSummary();

}

function clearProject(){

  if(!confirm("Clear current project?"))
    return;

  summaryData = {
    positions:{},
    totalLitres:0,
    totalDrums:0
  };

  currentPaintResult = {
    position:"",
    coat:"",
    litres:0,
    drums:0,
    area:0
  };

  // SUMMARY

  document.getElementById("vesselName").value = "";
  document.getElementById("imo").value = "";
  document.getElementById("location").value = "";

  // PAINT

  document.getElementById("solids").value = "";
  document.getElementById("loss").value = "";
  document.getElementById("dft").value = "";
  document.getElementById("area").value = "";
  document.getElementById("drum").value = "";

  document.getElementById("r1").innerHTML = "0";
  document.getElementById("r2").innerHTML = "0";
  document.getElementById("litres").innerHTML = "0";
  document.getElementById("drums").innerHTML = "0";

  // HULL

  document.getElementById("loa").value = "";
  document.getElementById("lbp").value = "";
  document.getElementById("breadth").value = "";
  document.getElementById("draught").value = "";
  document.getElementById("height").value = "";
  document.getElementById("dwt").value = "";
  document.getElementById("boottopHeight").value = "";
  document.getElementById("hullFactor").value = "";

  if(document.getElementById("hullResults")){

  document.getElementById(
    "hullResults"
  ).innerHTML = "";

}

  // JTS

  document.getElementById("jtsFlatBottom").value = "";
  document.getElementById("jtsVerticalSides").value = "";
  document.getElementById("jtsBoottop").value = "";
  document.getElementById("jtsTopside").value = "";
  document.getElementById("jtsOther").value = "";

  localStorage.removeItem(
    "paintCalculatorSummary"
  );

  renderSummary();

  alert("Project Cleared");

}

function toggleCoatMode(){

  let mode =
    document.getElementById("coatMode").value;

  let selector =
    document.getElementById("coatSelector");

  if(mode === "Multi Coat"){

    selector.style.display = "block";

  }
  else{

    selector.style.display = "none";

    document.getElementById("coatNumber").value =
      "1st Coat";

  }

}

function initializePhotoUpload(){

  let photoInput =
    document.getElementById("vesselPhoto");

  if(!photoInput)
    return;

  photoInput.addEventListener(
    "change",
    function(event){

      let file =
        event.target.files[0];

      if(!file)
        return;

      let reader =
        new FileReader();

      reader.onload =
        function(e){

          vesselPhotoData =
            e.target.result;

          let preview =
            document.getElementById(
              "photoPreview"
            );

          if(preview){

            preview.src =
              vesselPhotoData;

            preview.style.display =
              "block";

          }

        };

      reader.readAsDataURL(
        file
      );

    }
  );

}

let calcValue = "";

function calcPress(value){

  if(
    document.getElementById("calcDisplay").value === "0"
  ){
    calcValue = value;
  }
  else{
    calcValue += value;
  }

  document.getElementById("calcDisplay").value =
    calcValue;

}

function calculateResult(){

  try{

    calcValue =
      eval(calcValue).toString();

    document.getElementById("calcDisplay").value =
      calcValue;

  }
  catch{

    document.getElementById("calcDisplay").value =
      "Error";

  }

}

function clearCalc(){

  calcValue = "";

  document.getElementById("calcDisplay").value =
    "0";

}

function deleteLast(){

  let display =
    document.getElementById("calcDisplay");

  let currentValue =
    display.value;

  if(
    currentValue === "0" ||
    currentValue === "Error"
  ){
    return;
  }

  currentValue =
    currentValue.slice(0,-1);

  if(currentValue === ""){

    currentValue = "0";

  }

  calcValue = currentValue;

  display.value = currentValue;

}

function copyResult(){

  navigator.clipboard.writeText(
    document.getElementById("calcDisplay").value
  );

  alert("Result Copied");

}

function sendToArea(){

  document.getElementById("area").value =
    document.getElementById("calcDisplay").value;

  showTab("paint");

}


function sendPaintToPDP(){

  if(!currentPaintResult.position){

    alert("Calculate first");
    return;

  }

  pdpData.push({

    position:
      currentPaintResult.position,

    coat:
      currentPaintResult.coat,

    litres:
      currentPaintResult.litres,

    drums:
      Math.ceil(currentPaintResult.drums)

  });

}

function calculateStations(totalSprays){

  return Math.ceil(
    totalSprays / 3
  );

}

function generatePDP(){

 let totalSprays =
  parseInt(
    document.getElementById(
      "totalSprays"
    ).value
  );

let totalDrums = 0;

pdpData.forEach(item => {

  totalDrums += item.drums;

});

let drumsPerSpray =
  totalDrums / totalSprays;  
  
let spraysPerStation =
  parseInt(
    document.getElementById(
      "spraysPerStation"
    ).value
  ) || 3;
  
if(!totalSprays){

  alert("Enter Total Spray Guns");
  return;

}

let stations =
  Math.ceil(
    totalSprays /
    spraysPerStation
  );

  if(!stations){

    alert("Enter Spray Stations");
    return;

  }
  
let portStations =
  Math.floor(stations / 2);

let starboardStations =
  Math.floor(stations / 2);

let portFwd =
  Math.round(portStations * 0.30);

let portMid =
  Math.round(portStations * 0.40);

let portAft =
  portStations -
  portFwd -
  portMid;

let stbFwd =
  Math.round(starboardStations * 0.30);

let stbMid =
  Math.round(starboardStations * 0.40);

let stbAft =
  starboardStations -
  stbFwd -
  stbMid;
  
if(stations % 2 !== 0){

  let extraSide =
    document.querySelector(
      'input[name="extraSide"]:checked'
    ).value;

  if(extraSide === "port"){

    portStations++;

  }
  else{

    starboardStations++;

  }

}

let portFwdSprays =
  portFwd * spraysPerStation;

let portMidSprays =
  portMid * spraysPerStation;

let portAftSprays =
  portAft * spraysPerStation;

let stbFwdSprays =
  stbFwd * spraysPerStation;

let stbMidSprays =
  stbMid * spraysPerStation;

let stbAftSprays =
  stbAft * spraysPerStation;

  let totalZoneSprays =

  portFwdSprays +
  portMidSprays +
  portAftSprays +

  stbFwdSprays +
  stbMidSprays +
  stbAftSprays;
  
  let portFwdDrums =
  Math.round(
    totalDrums *
    portFwdSprays /
    totalZoneSprays
  );

let portMidDrums =
  Math.round(
    totalDrums *
    portMidSprays /
    totalZoneSprays
  );

let portAftDrums =
  Math.round(
    totalDrums *
    portAftSprays /
    totalZoneSprays
  );

let stbFwdDrums =
  Math.round(
    totalDrums *
    stbFwdSprays /
    totalZoneSprays
  );

let stbMidDrums =
  Math.round(
    totalDrums *
    stbMidSprays /
    totalZoneSprays
  );

  let stbAftDrums =

  totalDrums

  - portFwdDrums
  - portMidDrums
  - portAftDrums

  - stbFwdDrums
  - stbMidDrums;

  let totalPortDrums =

  portFwdDrums +
  portMidDrums +
  portAftDrums;

let totalStbdDrums =

  stbFwdDrums +
  stbMidDrums +
  stbAftDrums;

document.getElementById(
  "portDrumsKPI"
).innerText =
  totalPortDrums;

document.getElementById(
  "stbdDrumsKPI"
).innerText =
  totalStbdDrums;

document.getElementById(
  "totalDrumsKPI"
).innerText =
  totalDrums;

let portSprays =
  Math.ceil(totalSprays / 2);

let stbdSprays =
  totalSprays - portSprays;

let portList = [];
let stbdList = [];

  let portBase =
  Math.floor(
    totalPortDrums /
    portSprays
  );

let portRemain =
  totalPortDrums %
  portSprays;

for(
  let i = 1;
  i <= portSprays;
  i++
){

  let drums =
    portBase;

  if(portRemain > 0){

    drums++;

    portRemain--;

  }

  portList.push({

    id:"SP"+i,

    drums:drums

  });

}

  let stbdBase =
  Math.floor(
    totalStbdDrums /
    stbdSprays
  );

let stbdRemain =
  totalStbdDrums %
  stbdSprays;

for(
  let i = 1;
  i <= stbdSprays;
  i++
){

  let drums =
    stbdBase;

  if(stbdRemain > 0){

    drums++;

    stbdRemain--;

  }

  stbdList.push({

    id:"SP"+(portSprays+i),

    drums:drums

  });

}

document.getElementById(
  "pdpDetails"
).innerHTML = "";

let portHtml = "";

portList.forEach(s => {

  portHtml += `

  <div class="blueprintSpray">

    <span>${s.id}</span>

    <input
      type="number"
      value="${s.drums}"
      class="sprayInput"
      data-side="port"
    >

  </div>

  `;

});

let stbdHtml = "";
  
stbdList.forEach(s => {

  stbdHtml += `

  <div class="blueprintSpray">

    <span>${s.id}</span>

    <input
      type="number"
      value="${s.drums}"
      class="sprayInput"
      data-side="stbd"
    >

  </div>

  `;

});

console.log(portList);
console.log(stbdList);

console.log("PORT HTML:", portHtml);
console.log("STBD HTML:", stbdHtml);

document.getElementById(
  "blueprintAllocation"
).innerHTML = `

<div class="blueprintColumn">

${portHtml}

</div>

<div class="blueprintShip">

  <div class="figmaShip">

    <div class="figmaFwd">
      FWD
    </div>

    <div class="figmaMid">
      MIDSHIP
    </div>

    <div class="figmaAft">
      AFT
    </div>

  </div>

</div>

<div class="blueprintColumn">

${stbdHtml}

</div>

`;

document.getElementById(
  "pdfBlueprint"
).innerHTML =
document.getElementById(
  "blueprintAllocation"
).innerHTML;

  let stationData = {};

  pdpData.forEach(item => {

    let totalDrums =
      item.drums;

    let base =
      Math.floor(
        totalDrums / stations
      );

    let remainder =
      totalDrums % stations;

    for(let i=1;i<=stations;i++){

      let drums = base;

      if(remainder > 0){

        drums++;
        remainder--;

      }

      stationData[i] =
        (stationData[i] || 0) +
        drums;

    }

  });

 for(let i=1;i<=8;i++){

  let station =
    document.getElementById(
      "st"+i
    );

  if(!station)
    continue;

  station.innerHTML = "";
}

}

function recalculateSprays(){

  let port = 0;
  let stbd = 0;

  document
    .querySelectorAll(
      '.sprayInput[data-side="port"]'
    )
    .forEach(el => {

      port +=
        Number(el.value || 0);

    });

  document
    .querySelectorAll(
      '.sprayInput[data-side="stbd"]'
    )
    .forEach(el => {

      stbd +=
        Number(el.value || 0);

    });

  document.getElementById(
    "portDrumsKPI"
  ).innerText =
    port;

  document.getElementById(
    "stbdDrumsKPI"
  ).innerText =
    stbd;

  document.getElementById(
    "totalDrumsKPI"
  ).innerText =
    port + stbd;

}

function getLatestPDPItem(){

  if(pdpData.length === 0)
    return null;

  return pdpData[
    pdpData.length - 1
  ];

}

async function createPDPPDF(){

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  let y = 20;

let logo =
  document.getElementById(
    "pdfLogo"
  );

if(logo){

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width =
    logo.naturalWidth;

  canvas.height =
    logo.naturalHeight;

  const ctx =
    canvas.getContext("2d");

  ctx.drawImage(
    logo,
    0,
    0
  );

  const logoData =
    canvas.toDataURL(
      "image/png"
    );

  doc.addImage(
    logoData,
    "PNG",
    15,
    10,
    20,
    20
  );

}
  
  let vesselName =
    document.getElementById("vesselName").value || "-";

  let imo =
    document.getElementById("imo").value || "-";

  let location =
    document.getElementById("location").value || "-";

  let date =
    new Date().toLocaleDateString("en-GB");

  let paintField =
    document.getElementById("paintDescription");

  let paintDescription =
    paintField ? paintField.value : "-";

  let commentsField =
    document.getElementById("pdpComments");

  let comments =
    commentsField ? commentsField.value : "-";

  doc.setFontSize(18);

  doc.text(
    "PAINT DISTRIBUTION PLAN",
    45,
    y
  );

  y += 15;

  doc.setFontSize(12);

  doc.text("Vessel : " + vesselName,20,y);
  y += 8;

  doc.text("IMO : " + imo,20,y);
  y += 8;

  doc.text("Location : " + location,20,y);
  y += 8;

  doc.text("Date : " + date,20,y);
  y += 8;

  doc.text("Paint : " + paintDescription,20,y);
  y += 16;

  let commentLines =
    doc.splitTextToSize(
      "Comments : " + comments,
      170
    );

  doc.text(commentLines,20,y);

  y += commentLines.length * 6 + 10;

  doc.setFontSize(14);

  doc.text(
    "VESSEL DISTRIBUTION",
    20,
    y
  );

  y += 10;

let blueprint =
  document.getElementById(
    "pdfBlueprint"
  );

  blueprint.style.display =
  "grid";

blueprint.style.gridTemplateColumns =
  "150px 300px 150px";

blueprint.style.gap =
  "40px";
  
let oldWidth =
  blueprint.style.width;

blueprint.style.width =
  "700px";

const canvas =
  await html2canvas(
    blueprint,
    {
      scale:3
    }
  );
  
console.log(
  canvas.width,
  canvas.height
);
  
blueprint.style.width =
  oldWidth;

const blueprintImage =
  canvas.toDataURL("image/png");

const pdfWidth = 120;

const pdfHeight =
  canvas.height *
  pdfWidth /
  canvas.width;

doc.addImage(
  blueprintImage,
  "PNG",
  45,
  y,
  pdfWidth,
  pdfHeight
);
  
doc.addPage();

y = 20;

  doc.setFontSize(14);

  doc.text(
    "DISTRIBUTION SUMMARY",
    20,
    y
  );

  y += 10;

  doc.setFontSize(12);

  doc.text(
    "PORT : " +
    document.getElementById(
      "portDrumsKPI"
    ).innerText,
    20,
    y
  );

  y += 8;

  doc.text(
    "TOTAL : " +
    document.getElementById(
      "totalDrumsKPI"
    ).innerText,
    20,
    y
  );

  y += 8;

  doc.text(
    "STBD : " +
    document.getElementById(
      "stbdDrumsKPI"
    ).innerText,
    20,
    y
  );

const totalPages =
  doc.getNumberOfPages();

for(let i=1;i<=totalPages;i++){

  doc.setPage(i);

  doc.setFontSize(8);

  doc.text(
    "Paint Calculator Pro v1.0.0",
    20,
    280
  );

  doc.text(
    "Generated by Dimitris Telkiridis",
    80,
    280
  );

  doc.text(
    "Page " + i + " / " + totalPages,
    170,
    280
  );

}

  return doc;

}

async function exportPDPPDF(){

  let vesselName =
    document.getElementById(
      "vesselName"
    ).value || "Vessel";

  const doc =
    await createPDPPDF();

  doc.save(
    vesselName.replaceAll(" ","_") +
    "_PDP.pdf"
  );

}

let shareInProgress = false;

async function sharePDPPDF(){

  if (shareInProgress)
    return;

  shareInProgress = true;

  try {

    let vesselName =
      document.getElementById(
        "vesselName"
      ).value || "Vessel";

document.body.style.cursor = "wait";
    
    const doc =
      await createPDPPDF();

    const pdfBlob =
      doc.output("blob");

    const file =
      new File(
        [pdfBlob],
        vesselName.replaceAll(" ","_") +
        "_PDP.pdf",
        {
          type:"application/pdf"
        }
      );

    await navigator.share({
      title:
        "Paint Distribution Plan",
      files:[file]
    });

  }
 catch(error){

  console.log(error);

  alert(
    "PDF sharing is not supported on this browser.\n\n" +
    "The PDP report will be downloaded instead."
  );

  let vesselName =
    document.getElementById(
      "vesselName"
    ).value || "Vessel";

  const doc =
    await createPDPPDF();

  doc.save(
    vesselName.replaceAll(" ","_") +
    "_PDP.pdf"
  );

}
  finally{

document.body.style.cursor = "default";
    
    shareInProgress = false;

  }

}

function resetStations(){

  [
    "portFwd",
    "portMid",
    "portAft",
    "stbFwd",
    "stbMid",
    "stbAft"
  ].forEach(id => {

    let el =
      document.getElementById(id);

    if(el){

      el.innerHTML = "";

    }

  });

}

function saveField(id){

  let autoSave =
    localStorage.getItem("autoSave");

  if(autoSave !== "false"){

    localStorage.setItem(
      id,
      document.getElementById(id).value
    );

  }

}

function loadField(id){

  const value =
    localStorage.getItem(id);

  if(value !== null){

    document.getElementById(id).value =
      value;

  }

}

window.addEventListener("load",()=>{

let autoSave =
  localStorage.getItem("autoSave");

if(autoSave !== "false"){

  loadField("vesselName");
  loadField("imo");
  loadField("location");
  loadField("inspector");
  loadField("ownerRep");

  loadField("jtsFlatBottom");
  loadField("jtsVerticalSides");
  loadField("jtsBoottop");
  loadField("jtsTopside");
  loadField("jtsOther");

  loadField("solids");
  loadField("loss");
  loadField("dft");
  loadField("area");
  loadField("drum");

}

showTab("mainMenu");

});

async function createSummaryPDF(){

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  let vesselName =
    document.getElementById("vesselName")?.value || "-";

  let imo =
    document.getElementById("imo")?.value || "-";

  let location =
    document.getElementById("location")?.value || "-";

  let reportDate =
    document.getElementById("reportDate")?.value ||
    new Date().toLocaleDateString("en-GB");

  let inspector =
    document.getElementById("inspector")?.value || "-";

  let ownerRep =
    document.getElementById("ownerRep")?.value || "-";

  let totalDrums =
    document.getElementById("totalAreaKPI")?.innerText || "0";

  let totalLitres =
    document.getElementById("totalLitresKPI")?.innerText || "0";

  let y = 20;

let logo =
  document.getElementById(
    "pdfLogo"
  );

if(logo){

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width =
    logo.naturalWidth;

  canvas.height =
    logo.naturalHeight;

  const ctx =
    canvas.getContext("2d");

  ctx.drawImage(
    logo,
    0,
    0
  );

  const logoData =
    canvas.toDataURL(
      "image/png"
    );

  doc.addImage(
    logoData,
    "PNG",
    15,
    10,
    20,
    20
  );

}
  
  // HEADER

  doc.setFontSize(22);

  doc.text(
    "COATING ESTIMATION REPORT",
    45,
    y
  );

  doc.line(
    20,
    y + 3,
    190,
    y + 3
  );

  y += 15;

  // PHOTO

  if(vesselPhotoData){

   doc.rect(
  128,
  28,
  64,
  49
);

doc.addImage(
  vesselPhotoData,
  "JPEG",
  130,
  30,
  60,
  45
);

  }

  // PROJECT INFO

  doc.setFontSize(12);

  doc.text(
    "Date : " + reportDate,
    20,
    y
  );

  y += 10;

  doc.text(
    "Vessel : " + vesselName,
    20,
    y
  );

  y += 10;

  doc.text(
    "IMO : " + imo,
    20,
    y
  );

  y += 10;

  doc.text(
    "Location : " + location,
    20,
    y
  );

  y += 20;

  // KPI BOXES

  doc.rect(20,y,50,25);
  doc.rect(80,y,50,25);
  doc.rect(140,y,50,25);

  doc.setFontSize(10);

  doc.text(
    "TOTAL DRUMS",
    27,
    y + 8
  );

  doc.text(
    totalDrums.toString(),
    40,
    y + 18
  );

  doc.text(
    "TOTAL LITRES",
    87,
    y + 8
  );

  doc.text(
    totalLitres.toString(),
    95,
    y + 18
  );

  doc.text(
    "POSITIONS",
    147,
    y + 8
  );

  doc.text(
    Object.keys(
      summaryData.positions
    ).length.toString(),
    160,
    y + 18
  );

  y += 45;

  // TABLE HEADER

  doc.setFontSize(12);

  doc.text("POSITION",20,y);
  doc.text("AREA",80,y);
  doc.text("COAT",110,y);
  doc.text("LITRES",145,y);
  doc.text("DRUMS",175,y);

  y += 5;

  doc.line(
    15,
    y,
    195,
    y
  );

  y += 8;

  // TABLE DATA

  let calcLitres = 0;
  let calcDrums = 0;

  for(let position in summaryData.positions){

    let item =
      summaryData.positions[position];

    for(let coat in item.coats){

      let coatData =
        item.coats[coat];

      calcLitres +=
        coatData.litres;

      calcDrums +=
        coatData.drums;

      doc.text(
        position,
        20,
        y
      );

      doc.text(
        item.area.toFixed(0),
        80,
        y
      );

      doc.text(
        coat,
        110,
        y
      );

      doc.text(
        coatData.litres.toFixed(1),
        145,
        y
      );

      doc.text(
        Math.ceil(
          coatData.drums
        ).toString(),
        175,
        y
      );

      y += 8;

      doc.line(
        15,
        y,
        195,
        y
      );

      y += 5;

      if(y > 270){

        doc.addPage();

        y = 20;

      }

    }

  }

  // FINAL SUMMARY PAGE

  doc.addPage();

  doc.setFontSize(22);

  doc.text(
    "PROJECT SUMMARY",
    20,
    30
  );

  doc.setFontSize(14);

  doc.text(
    "TOTAL PROJECT LITRES : " +
    calcLitres.toFixed(1),
    20,
    60
  );

  doc.text(
    "TOTAL PROJECT DRUMS : " +
    Math.ceil(calcDrums),
    20,
    80
  );

  doc.text(
    "VESSEL : " +
    vesselName,
    20,
    100
  );

  doc.text(
    "IMO : " +
    imo,
    20,
    120
  );

  doc.text(
    "INSPECTING TECHNICIAN : " +
    inspector,
    20,
    140
  );

  doc.text(
    "OWNER REPRESENTATIVE : " +
    ownerRep,
    20,
    160
  );

const totalPages =
  doc.getNumberOfPages();

for(let i=1;i<=totalPages;i++){

  doc.setPage(i);

  doc.setFontSize(8);

  doc.text(
    "Paint Calculator Pro v1.0.0",
    20,
    280
  );

  doc.text(
    "Generated by Dimitris Telkiridis",
    80,
    280
  );

  doc.text(
    "Page " + i + " / " + totalPages,
    170,
    280
  );

}
  
  return doc;

}

async function exportPDF(){

  const doc =
    await createSummaryPDF();

  let vesselName =
    document.getElementById(
      "vesselName"
    )?.value || "Vessel";

  doc.save(
    vesselName.replaceAll(" ","_") +
    "_Coating_Estimation_Report.pdf"
  );

}

let summaryShareInProgress = false;

async function sharePDF(){

  if(summaryShareInProgress)
    return;

  summaryShareInProgress = true;

  try{

    const doc =
      await createSummaryPDF();

    let vesselName =
      document.getElementById(
        "vesselName"
      )?.value || "Vessel";

    const pdfBlob =
      doc.output("blob");

    const file =
      new File(
        [pdfBlob],
        vesselName.replaceAll(" ","_") +
        "_Coating_Estimation_Report.pdf",
        {
          type:"application/pdf"
        }
      );

    await navigator.share({
      title:
        "Coating Estimation Report",
      files:[file]
    });

  }
  catch(error){

    console.log(error);

    alert(
      "PDF sharing is not supported on this browser.\n\n" +
      "The report will be downloaded instead."
    );

    const doc =
      await createSummaryPDF();

    let vesselName =
      document.getElementById(
        "vesselName"
      )?.value || "Vessel";

    doc.save(
      vesselName.replaceAll(" ","_") +
      "_Coating_Estimation_Report.pdf"
    );

  }
  finally{

    summaryShareInProgress = false;

  }

}

function sendHullAreaToPaint(
  position,
  area
){

  document.getElementById(
    "paintPosition"
  ).value = position;

  document.getElementById(
    "area"
  ).value = area.toFixed(0);

  showTab("paint");

}

function updateJTSTotal(){

  let total = 0;

  total += parseFloat(document.getElementById("jtsFlatBottom").value) || 0;

  total += parseFloat(document.getElementById("jtsVerticalSides").value) || 0;

  total += parseFloat(document.getElementById("jtsBoottop").value) || 0;

  total += parseFloat(document.getElementById("jtsTopside").value) || 0;

  total += parseFloat(document.getElementById("jtsOther").value) || 0;

  document.getElementById("jtsTotalArea").innerHTML =
    total.toLocaleString() + " m²";

}

function toggleAutoSave(){

  let state =
    document.getElementById(
      "autoSaveToggle"
    ).checked;

  localStorage.setItem(
    "autoSave",
    state
  );

  if(state === false){

    localStorage.removeItem("vesselName");
    localStorage.removeItem("imo");
    localStorage.removeItem("location");
    localStorage.removeItem("inspector");
    localStorage.removeItem("ownerRep");

    localStorage.removeItem("jtsFlatBottom");
    localStorage.removeItem("jtsVerticalSides");
    localStorage.removeItem("jtsBoottop");
    localStorage.removeItem("jtsTopside");
    localStorage.removeItem("jtsOther");

    localStorage.removeItem("solids");
    localStorage.removeItem("loss");
    localStorage.removeItem("dft");
    localStorage.removeItem("area");
    localStorage.removeItem("drum");
    localStorage.removeItem(
  "paintCalculatorSummary"
);

  }

}

function toggleDarkMode(){

console.log("Dark mode changed");
  
  let darkMode =
    document.getElementById(
      "darkModeToggle"
    ).checked;

  localStorage.setItem(
    "darkMode",
    darkMode
  );

  if(darkMode){

    document.body.classList.remove(
      "lightMode"
    );

  }
  else{

    document.body.classList.add(
      "lightMode"
    );

  }

}

function toggleMobileMenu(){

  document
    .querySelectorAll(".sidebar")
    .forEach(sidebar => {

      sidebar.classList.toggle(
        "mobileOpen"
      );

    });

  document
    .getElementById(
      "mobileOverlay"
    )
    .classList.toggle(
      "show"
    );

}

function closeMobileMenu(){

console.log("CLOSE");
  
  document
    .querySelectorAll(".sidebar")
    .forEach(sidebar => {

      sidebar.classList.remove(
        "mobileOpen"
      );

    });

  document
    .getElementById(
      "mobileOverlay"
    )
    .classList.remove(
      "show"
    );

}

function exportProject(){

  const data = {

    vessel:
      document.getElementById(
        "vesselName"
      ).value,

    imo:
      document.getElementById(
        "imo"
      ).value,

    location:
      document.getElementById(
        "location"
      ).value,

    summaryData,

    pdpData,

    vesselPhotoData

  };

  const blob =
    new Blob(
      [
        JSON.stringify(
          data,
          null,
          2
        )
      ],
      {
        type:"application/json"
      }
    );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download =
    "PaintCalculatorProject.json";

  a.click();

  URL.revokeObjectURL(url);

}

function importProject(){

  document
    .getElementById(
      "importProjectFile"
    )
    .click();

}

document
.getElementById(
  "importProjectFile"
)
.addEventListener(
"change",

function(event){

const file =
  event.target.files[0];

if(!file)
  return;

const reader =
  new FileReader();

reader.onload =
function(e){

const data =
  JSON.parse(
    e.target.result
  );

document.getElementById(
  "vesselName"
).value =
  data.vessel || "";

document.getElementById(
  "imo"
).value =
  data.imo || "";

document.getElementById(
  "location"
).value =
  data.location || "";

summaryData =
  data.summaryData || {
    positions:{}
  };

pdpData =
  data.pdpData || [];

vesselPhotoData =
  data.vesselPhotoData || "";

renderSummary();

alert(
  "Project Imported"
);

};

reader.readAsText(file);

});

window.addEventListener(
  "load",
  () => {

    setTimeout(() => {

      document
        .getElementById(
          "splashScreen"
        )
        .classList.add(
          "splashHide"
        );

    },1500);

  }
);

document.addEventListener(
  "input",
  function(event){

    if(
      event.target.classList.contains(
        "sprayInput"
      )
    ){

      recalculateSprays();

    }

  }
);
