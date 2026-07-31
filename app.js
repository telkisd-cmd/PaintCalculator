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
  vesselName.toUpperCase() +
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

    y += 15;

    for(let position in summaryData.positions){

      let item =
        summaryData.positions[position];

      // Thick separator between positions

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

// Thin separator between coats

doc.setLineWidth(0.2);

doc.line(
  25,
  y,
  185,
  y
);

y += 4;
        
        y += 8;
      }

      y += 5;
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
