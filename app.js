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

};

// ------------------------
// TABS
// ------------------------

function showTab(tab){

  document.getElementById("paintTab").style.display =
    "none";

  document.getElementById("hullTab").style.display =
    "none";

  document.getElementById("jtsTab").style.display =
    "none";

  document.getElementById("summaryTab").style.display =
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

  if(tab==="summary")
    document.getElementById("summaryTab").style.display =
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
</div>

<button onclick="sendAreaToPaint(${flatBottom})">
SEND TO PAINT
</button>

<button onclick="sendHullToSummary('Flat Bottom',${flatBottom})">
SEND TO SUMMARY
</button>

</div>

<div class="card">

<h3>Vertical Sides</h3>

<div class="result">
${verticalSides.toFixed(0)} m²
</div>

<button onclick="sendAreaToPaint(${verticalSides})">
SEND TO PAINT
</button>

<button onclick="sendHullToSummary('Vertical Sides',${verticalSides})">
SEND TO SUMMARY
</button>

</div>

<div class="card">

<h3>Boottop</h3>

<div class="result">
${boottop.toFixed(0)} m²
</div>

<button onclick="sendAreaToPaint(${boottop})">
SEND TO PAINT
</button>

<button onclick="sendHullToSummary('Boottop',${boottop})">
SEND TO SUMMARY
</button>

</div>

<div class="card">

<h3>Topside</h3>

<div class="result">
${topside.toFixed(0)} m²
</div>

<button onclick="sendAreaToPaint(${topside})">
SEND TO PAINT
</button>

<button onclick="sendHullToSummary('Topside',${topside})">
SEND TO SUMMARY
</button>

</div>

<div class="card">

<h3>Total Area</h3>

<div class="result">
${totalArea.toFixed(0)} m²
</div>

<button onclick="sendAreaToPaint(${totalArea})">
SEND TO PAINT
</button>

<button onclick="sendHullToSummary('Total Area',${totalArea})">
SEND TO SUMMARY
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
