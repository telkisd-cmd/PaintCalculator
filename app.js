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

  loadSummary();

  initializePhotoUpload();

  resetStations();

document.getElementById(
  "mainMenuTab"
).style.display = "block";
  
};

// ------------------------
// TABS
// ------------------------

function showTab(tab){

  document.getElementById("mainMenuTab").style.display =
  "none";

  document.getElementById("paintTab").style.display =
    "none";

  document.getElementById("hullTab").style.display =
    "none";

  document.getElementById("jtsTab").style.display =
    "none";

  document.getElementById("summaryTab").style.display =
    "none";

document.getElementById("settingsTab").style.display =
  "none";
  
document.getElementById("pdpTab").style.display =
  "none";
  
document.getElementById("calculatorTab").style.display =
  "none";
  
  if(tab==="paint")
    document.getElementById("paintTab").style.display =
      "block";

  if(tab==="hull")
    document.getElementById("hullTab").style.display =
      "block";

  if(tab==="jts")
    document.getElementById("jtsTab").style.display =
      "block";

if(tab==="calculator")
  document.getElementById("calculatorTab").style.display =
    "block";

if(tab==="pdp")
  document.getElementById("pdpTab").style.display =
    "block";
  
 if(tab==="summary"){

  document.getElementById("summaryTab").style.display =
    "block";

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

   let totalArea =

  Number(document.getElementById("area").value || 0);

document.getElementById("totalAreaKPI").innerText =
  totalArea.toLocaleString();

   let litresValue =

  document.getElementById("litres").innerText || "0";

document.getElementById("totalLitresKPI").innerText =
  litresValue;

}

if(tab==="settings")
  document.getElementById("settingsTab").style.display =
    "block";
  
if(tab=="mainMenu")
  document.getElementById("mainMenuTab").style.display =
    "block";
  
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

  let html = `

<div class="card">

<h3>Height Of Topside</h3>
<div class="result">
${topsideHeight.toFixed(1)} m
</div>

</div>

<div class="card">

<h3>Flat Bottom</h3>

<div class="result">
${flatBottom.toFixed(0)} m²
<div class="actionButtons">

<button onclick="sendAreaToPaint(${flatBottom})">
PAINT
</button>

<button onclick="sendHullToSummary('Flat Bottom',${flatBottom})">
SUMMARY
</button>

</div>

<div class="card">

<h3>Vertical Sides</h3>

<div class="result">
${verticalSides.toFixed(0)} m²
<div class="actionButtons">

<button onclick="sendAreaToPaint(${verticalSides})">
PAINT
</button>

<button onclick="sendHullToSummary('Vertical Sides',${verticalSides})">
SUMMARY
</button>

</div>

<div class="card">

<h3>Boottop</h3>

<div class="result">
${boottop.toFixed(0)} m²
<div class="actionButtons">

<button onclick="sendAreaToPaint(${boottop})">
PAINT
</button>

<button onclick="sendHullToSummary('Boottop',${boottop})">
SUMMARY
</button>

</div>

<div class="card">

<h3>Topside</h3>

<div class="result">
${topside.toFixed(0)} m²
<div class="actionButtons">

<button onclick="sendAreaToPaint(${topside})">
PAINT
</button>

<button onclick="sendHullToSummary('Topside',${topside})">
SUMMARY
</button>

</div>

<div class="card">

<h3>Total Area</h3>

<div class="result">
${totalArea.toFixed(0)} m²
<div class="actionButtons">

<button onclick="sendAreaToPaint(${totalArea})">
PAINT
</button>

<button onclick="sendHullToSummary('Total Area',${totalArea})">
SUMMARY
</button>

</div>

`;

  document.getElementById("hullResults").innerHTML =
    html;

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

  let html = "";

  let totalLitres = 0;
  let totalDrums = 0;

  for(let position in summaryData.positions){

    let item =
      summaryData.positions[position];

    html += `
    <div class="summarySection">

      <div class="summaryTitle">
      ${position}
      </div>

      <p>
      Area:
      ${item.area.toFixed(0)} m²
      </p>
    `;

    for(let coat in item.coats){

      let coatData =
        item.coats[coat];

      totalLitres +=
        coatData.litres;

      totalDrums +=
        coatData.drums;

      html += `
      <p>

      <strong>${coat}</strong>

      <br>

      Litres:
      ${coatData.litres.toFixed(1)}

      <br>

      Drums:
      ${coatData.drums}

      </p>
      `;
    }

    html += `
    </div>
    `;
  }

  html += `
  <div class="totalBox">

  TOTAL PROJECT LITRES

  <br><br>

  ${totalLitres.toFixed(1)}

  <br><br>

  TOTAL PROJECT DRUMS

  <br><br>

  ${Math.ceil(totalDrums)}

  </div>
  `;

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

  let projectData = {

    vessel:
      document.getElementById("vesselName").value,

    imo:
      document.getElementById("imo").value,

    location:
      document.getElementById("location").value,

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

function exportPDF(){

  let vesselName =
    document.getElementById("vesselName").value.trim();

  if(vesselName === ""){

    alert(
      "Please enter Vessel Name before exporting PDF."
    );

    return;
  }
  
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(18);

  doc.text(
  " COATING ESTIMATION REPORT",
  20,
  y
);

  y += 15;

  doc.setFontSize(12);

if(vesselPhotoData){

  doc.addImage(
    vesselPhotoData,
    "JPEG",
    130,
    15,
    60,
    45
  );

}
  
  doc.text(
    "Date: " +
    document.getElementById("reportDate").value,
    20,
    y
  );

  y += 10;

  doc.text(
    "Vessel: " +
    document.getElementById("vesselName").value,
    20,
    y
  );

  y += 10;

  doc.text(
    "IMO: " +
    document.getElementById("imo").value,
    20,
    y
  );

  y += 10;

  doc.text(
    "Location: " +
    document.getElementById("location").value,
    20,
    y
  );

  y += 30;

  let totalLitres = 0;
  let totalDrums = 0;

for(let position in summaryData.positions){

  let item =
    summaryData.positions[position];

  doc.setLineWidth(1);

  doc.line(
    15,
    y,
    195,
    y
  );

  y += 8;

  doc.setFontSize(14);

  doc.text(
    position,
    20,
    y
  );

    y += 8;

    doc.setFontSize(11);

    doc.text(
      "Area: " +
      item.area.toFixed(0) +
      " m2",
      20,
      y
    );

    y += 8;

    for(let coat in item.coats){

      let coatData =
        item.coats[coat];

      totalLitres +=
        coatData.litres;

      totalDrums +=
        coatData.drums;

     doc.text(
  coat +
  " | Litres: " +
  coatData.litres.toFixed(1) +
  " | Drums: " +
  coatData.drums,
  25,
  y
);

y += 4;

doc.setLineWidth(0.2);

doc.line(
  25,
  y,
  185,
  y
);

y += 4;

      if(y > 270){

        doc.addPage();

        y = 20;

      }

    }

    y += 6;

  }

  doc.setFontSize(16);

  doc.text(
    "TOTAL PROJECT LITRES",
    20,
    y
  );

  y += 10;

  doc.text(
    totalLitres.toFixed(1),
    20,
    y
  );

  y += 15;

  doc.text(
    "TOTAL PROJECT DRUMS",
    20,
    y
  );

  y += 10;

  doc.text(
    Math.ceil(totalDrums).toString(),
    20,
    y
  );

  let fileName =
  vesselName.replaceAll(" ","_");

doc.save(
  fileName +
  "_Coating_Estimation_Report.pdf"
);

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

  document.getElementById("hullResults").innerHTML = "";

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

async function sharePDF(){

  let vesselName =
    document.getElementById("vesselName").value.trim();

  if(vesselName === ""){

    alert(
      "Please enter Vessel Name before sharing PDF."
    );

    return;
  }

  try{

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);

    doc.text(
      "COATING ESTIMATION REPORT",
      20,
      y
    );

    // INFO AREA

    doc.rect(
      15,
      30,
      95,
      50
    );

    doc.rect(
      110,
      30,
      85,
      50
    );

    doc.setFontSize(12);

    doc.text(
      "Vessel : " +
      document.getElementById("vesselName").value,
      20,
      42
    );

    doc.text(
      "IMO : " +
      document.getElementById("imo").value,
      20,
      54
    );

    doc.text(
      "Port : " +
      document.getElementById("location").value,
      20,
      66
    );

    doc.text(
      "Date : " +
      document.getElementById("reportDate").value,
      20,
      78
    );

    if(vesselPhotoData){

      doc.addImage(
        vesselPhotoData,
        "JPEG",
        113,
        33,
        79,
        44
      );

    }

    y = 95;

    for(let position in summaryData.positions){

      let item =
        summaryData.positions[position];

      // Thick line between positions

      doc.setLineWidth(0.8);

      doc.line(
        15,
        y,
        195,
        y
      );

      y += 8;

      doc.setFontSize(14);

      doc.text(
        position,
        20,
        y
      );

      y += 8;

      doc.setFontSize(11);

      doc.text(
        "Area: " +
        item.area.toFixed(0) +
        " m2",
        20,
        y
      );

      y += 10;

      for(let coat in item.coats){

        let coatData =
          item.coats[coat];

        doc.text(
          coat +
          " | Litres: " +
          coatData.litres.toFixed(1) +
          " | Drums: " +
          coatData.drums,
          25,
          y
        );

        y += 4;

        doc.setLineWidth(0.2);

        doc.line(
          25,
          y,
          185,
          y
        );

        y += 8;

        if(y > 270){

          doc.addPage();

          y = 20;

        }

      }

      y += 8;

      if(y > 270){

        doc.addPage();

        y = 20;

      }

    }

    const pdfBlob =
      doc.output("blob");

    let fileName =
      vesselName.replaceAll(" ","_");

    const pdfFile =
      new File(
        [pdfBlob],
        fileName +
        "_Coating_Estimation_Report.pdf",
        {
          type:"application/pdf"
        }
      );

    if(
      navigator.canShare &&
      navigator.canShare({
        files:[pdfFile]
      })
    ){

      await navigator.share({

        title:
        vesselName +
        " Coating Estimation Report",

        files:[pdfFile]

      });

    }
    else{

      alert(
        "PDF sharing is not supported on this device."
      );

    }

  }
  catch(error){

    console.log(error);

  }

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

          preview.src =
            vesselPhotoData;

          preview.style.display =
            "block";

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

  alert("Added to PDP");

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

if(window.innerWidth <= 768){

  document.getElementById(
    "portFwd"
  ).innerHTML = `1:${portFwdDrums}`;

}
else{

  document.getElementById(
    "portFwd"
  ).innerHTML =

  `PORT FWD
  <br>
  ${portFwd} Stations
  <br>
  ${portFwd * spraysPerStation} Sprays
  <br>
  ${portFwdDrums} Drums`;

}

if(window.innerWidth <= 768){

  document.getElementById(
    "portMid"
  ).innerHTML = `2:${portMidDrums}`;

}
else{

  document.getElementById(
    "portMid"
  ).innerHTML =

  `PORT MID
  <br>
  ${portMid} Stations
  <br>
  ${portMid * spraysPerStation} Sprays
  <br>
  ${portMidDrums} Drums`;

}

if(window.innerWidth <= 768){

  document.getElementById(
    "portAft"
  ).innerHTML = `3:${portAftDrums}`;

}
else{

  document.getElementById(
    "portAft"
  ).innerHTML =

  `PORT AFT
  <br>
  ${portAft} Stations
  <br>
  ${portAft * spraysPerStation} Sprays
  <br>
  ${portAftDrums} Drums`;

}

if(window.innerWidth <= 768){

  document.getElementById(
    "stbFwd"
  ).innerHTML = `4:${stbFwdDrums}`;

}
else{

  document.getElementById(
    "stbFwd"
  ).innerHTML =

  `STB FWD
  <br>
  ${stbFwd} Stations
  <br>
  ${stbFwd * spraysPerStation} Sprays
  <br>
  ${stbFwdDrums} Drums`;

}

if(window.innerWidth <= 768){

  document.getElementById(
    "stbMid"
  ).innerHTML = `5:${stbMidDrums}`;

}
else{

  document.getElementById(
    "stbMid"
  ).innerHTML =

  `STB MID
  <br>
  ${stbMid} Stations
  <br>
  ${stbMid * spraysPerStation} Sprays
  <br>
  ${stbMidDrums} Drums`;

}

if(window.innerWidth <= 768){

  document.getElementById(
    "stbAft"
  ).innerHTML = `6:${stbAftDrums}`;

}
else{

  document.getElementById(
    "stbAft"
  ).innerHTML =

  `STB AFT
  <br>
  ${stbAft} Stations
  <br>
  ${stbAft * spraysPerStation} Sprays
  <br>
  ${stbAftDrums} Drums`;

}

if(window.innerWidth <= 768){

  document.getElementById(
    "mobilePDPLayout"
  ).innerHTML = `

  <div class="mobilePDPGrid">

    <div>PORT</div>

    <div class="mobileCenter">
      FWD
    </div>

    <div>STB</div>

    <div>1:${portFwdDrums}</div>

    <div class="mobileCenter">
      │
    </div>

    <div>4:${stbFwdDrums}</div>

    <div>2:${portMidDrums}</div>

    <div class="mobileCenter">
      ─┼─
    </div>

    <div>5:${stbMidDrums}</div>

    <div>3:${portAftDrums}</div>

    <div class="mobileCenter">
      │
    </div>

    <div>6:${stbAftDrums}</div>

    <div></div>

    <div class="mobileCenter">
      AFT
    </div>

    <div></div>

  </div>

  `;

}
else{

  document.getElementById(
    "mobilePDPLayout"
  ).innerHTML = "";

}

let sprayAllocation = [];

let sprayCounter = 1;
  
let detailHtml = "";

[
  {
    name:"PORT FWD",
    stations:portFwd,
    sprays:portFwd * spraysPerStation,
    drums:portFwdDrums,
    prefix:"P"
  },

  {
    name:"PORT MID",
    stations:portMid,
    sprays:portMid * spraysPerStation,
    drums:portMidDrums,
    prefix:"P"
  },

  {
    name:"PORT AFT",
    stations:portAft,
    sprays:portAft * spraysPerStation,
    drums:portAftDrums,
    prefix:"P"
  },

  {
    name:"STB FWD",
    stations:stbFwd,
    sprays:stbFwd * spraysPerStation,
    drums:stbFwdDrums,
    prefix:"S"
  },

  {
    name:"STB MID",
    stations:stbMid,
    sprays:stbMid * spraysPerStation,
    drums:stbMidDrums,
    prefix:"S"
  },

  {
    name:"STB AFT",
    stations:stbAft,
    sprays:stbAft * spraysPerStation,
    drums:stbAftDrums,
    prefix:"S"
  }

].forEach(zone => {

detailHtml += `

<div class="detailCard">

<hr>

<h3>${zone.name}</h3>

<p>
Stations : ${zone.stations}
</p>

<p>
Sprays : ${zone.sprays}
</p>

<p>
Drums : ${zone.drums}
</p>

`;

 let baseDrumsPerStation =
  Math.floor(
    zone.drums /
    zone.stations
  );

let remainingDrums =
  zone.drums %
  zone.stations;

for(
  let i = 1;
  i <= zone.stations;
  i++
){

  let stationDrums =
    baseDrumsPerStation;

  if(remainingDrums > 0){

    stationDrums++;

    remainingDrums--;

  }

let baseDrumsPerSpray =
  Math.floor(
    stationDrums /
    spraysPerStation
  );

let sprayRemaining =
  stationDrums %
  spraysPerStation;

  
  detailHtml += `

  <p>

  ${zone.prefix}${i}

  |

  ${spraysPerStation} Sprays

  |

  ${stationDrums} Drums

  </p>

  `;

}

for(
  let s = 1;
  s <= spraysPerStation;
  s++
){

  let sprayDrums =
    baseDrumsPerSpray;

  if(sprayRemaining > 0){

    sprayDrums++;

    sprayRemaining--;

  }

  sprayAllocation.push({

    id:
      "SP" +
      sprayCounter,

    zone:
      zone.name,

    station:
      zone.prefix + i,

    drums:
      sprayDrums

  });

  detailHtml += `

  <div
  style="
  margin-left:25px;
  color:#cccccc;
  ">

  SP${sprayCounter}

  |

  ${sprayDrums} Drums

  </div>

  `;

  sprayCounter++;

}
  
  detailHtml += `

  </div>

  `;

});

document.getElementById(
  "pdpDetails"
).innerHTML =
  detailHtml;

document.getElementById(
  "pdpSummary"
).innerHTML = `
  
<h3>PDP Summary</h3>

<p>
Total Sprays :
${totalSprays}
</p>

<p>
Sprays Per Station :
${spraysPerStation}
</p>

<p>
Total Stations :
${stations}
</p>

<p>
Port Stations :
${portStations}
</p>

<p>
Starboard Stations :
${starboardStations}
</p>

`;
  
  if(!stations){

    alert("Enter Spray Stations");
    return;

  }

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

function getLatestPDPItem(){

  if(pdpData.length === 0)
    return null;

  return pdpData[
    pdpData.length - 1
  ];

}

function exportPDPPDF(){

  let latest =
    getLatestPDPItem();

  if(!latest){

    alert(
      "Add Paint To PDP First"
    );

    return;

  }

  const { jsPDF } =
    window.jspdf;

  const doc =
    new jsPDF();

  let y = 20;

  let vesselName =
    document.getElementById(
      "vesselName"
    ).value || "-";

  let paintDescription =
    document.getElementById(
      "paintDescription"
    ).value || "-";

  let comments =
    document.getElementById(
      "pdpComments"
    ).value || "-";

  let date =
    document.getElementById(
      "reportDate"
    ).value || "-";

  doc.setFontSize(18);

  doc.text(
    "PAINT DISTRIBUTION PLAN",
    20,
    y
  );

  y += 15;

  doc.setFontSize(12);

  doc.text(
    "Vessel : " +
    vesselName,
    20,
    y
  );

  y += 8;

  doc.text(
    "Date : " +
    date,
    20,
    y
  );

  y += 8;

  doc.text(
    "Position : " +
    latest.position,
    20,
    y
  );

  y += 8;

  doc.text(
    "Coat : " +
    latest.coat,
    20,
    y
  );

  y += 8;

  doc.text(
    "Paint : " +
    paintDescription,
    20,
    y
  );

  y += 8;

  let commentLines =
    doc.splitTextToSize(
      "Comments : " +
      comments,
      170
    );

  doc.text(
    commentLines,
    20,
    y
  );

  y +=
    commentLines.length * 6 +
    10;

  doc.setFontSize(14);

  doc.text(
    "VESSEL DISTRIBUTION",
    20,
    y
  );

  y += 10;

let vesselImage =
  document.getElementById(
    "vesselOutline"
  );

let canvas =
  document.createElement(
    "canvas"
  );

canvas.width =
  vesselImage.naturalWidth;

canvas.height =
  vesselImage.naturalHeight;

let ctx =
  canvas.getContext("2d");

ctx.drawImage(
  vesselImage,
  0,
  0
);

let imageData =
  canvas.toDataURL(
    "image/png"
  );

doc.addImage(
  imageData,
  "PNG",
  80,
  y,
  50,
  80
);
  
  doc.setFontSize(10);

  doc.text(
    document.getElementById(
      "portFwd"
    ).innerText,
    15,
    y
  );

  doc.text(
    document.getElementById(
      "portMid"
    ).innerText,
    15,
    y + 25
  );

  doc.text(
    document.getElementById(
      "portAft"
    ).innerText,
    15,
    y + 50
  );

  doc.text(
    document.getElementById(
      "stbFwd"
    ).innerText,
    145,
    y
  );

  doc.text(
    document.getElementById(
      "stbMid"
    ).innerText,
    145,
    y + 25
  );

  doc.text(
    document.getElementById(
      "stbAft"
    ).innerText,
    145,
    y + 50
  );

  y += 80;

  doc.setFontSize(14);

  doc.text(
    "DETAILED ALLOCATION",
    20,
    y
  );

  y += 10;

let details =
  document.getElementById(
    "pdpDetails"
  ).innerText;

let detailLines =
  doc.splitTextToSize(
    details,
    170
  );

doc.setFontSize(10);

detailLines.forEach(line => {

  if(y > 270){

    doc.addPage();

    y = 20;

  }

  doc.text(
    line,
    20,
    y
  );

  y += 5;

});

  let fileName =
    vesselName.replaceAll(
      " ",
      "_"
    );

  doc.save(
    fileName +
    "_PDP.pdf"
  );

}

async function sharePDPPDF(){

  exportPDPPDF();

}

function resetStations(){

  document.getElementById(
    "portFwd"
  ).innerHTML = "";

  document.getElementById(
    "portMid"
  ).innerHTML = "";

  document.getElementById(
    "portAft"
  ).innerHTML = "";

  document.getElementById(
    "stbFwd"
  ).innerHTML = "";

  document.getElementById(
    "stbMid"
  ).innerHTML = "";

  document.getElementById(
    "stbAft"
  ).innerHTML = "";

}
