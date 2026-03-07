// ==============================
// Ontario Road Coverage Explorer
// ArcGIS Online Vector Tiles + Feature Layer Popups
// ==============================

// 1) Create map centered on Ontario
const map = L.map('map', { preferCanvas: true }).setView([50.0, -85.0], 5);
map.setMinZoom(4);
map.setMaxZoom(20);

// 2) Basemap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// ------------------------------
// URLs (yours)
// ------------------------------
const VTL_URL =
  //"https://vectortileservices.arcgis.com/E5vyYQKPMX5X3R3H/arcgis/rest/services/Ontario_Road_Connectivity/VectorTileServer";
  "https://vectortileservices.arcgis.com/E5vyYQKPMX5X3R3H/arcgis/rest/services/Ontario_Road_Connectivity/VectorTileServer";

// IMPORTANT: FeatureServer needs a layer index (usually /0)
const FEATURE_URL =
  "https://services.arcgis.com/E5vyYQKPMX5X3R3H/arcgis/rest/services/Ontario_Road_Connectivity/FeatureServer/0";

// 3) Vector tiles (fast drawing)
//const roadsVTL = L.esri.Vector.vectorTileLayer(VTL_URL).addTo(map);
const roadsVTL = L.esri.Vector.vectorTileLayer(VTL_URL, {
  style: (style) => {
    if (style.layers) {
      style.layers.forEach(layer => {
        if (layer.type === "line") {
          layer.paint["line-width"] = 300.5;  // make roads thicker
        }
      });
    }
    return style;
  }
}).addTo(map);
//const roadsVTL = L.esri.Vector.vectorTileLayer(VTL_URL).addTo(map);
//roadsVTL.bringToFront();
// 4) Feature layer (for querying attributes on click)
// Style is invisible so you don't double-draw roads.
const roadsFL = L.esri.featureLayer({
  url: FEATURE_URL,
  style: () => ({ opacity: 0, weight: 0 })
}).addTo(map);

// ------------------------------
// Helpers
// ------------------------------
function covLabel(cov) {
  if (cov === 1) return "LTE";
  if (cov === 2) return "5G";
  if (cov === 3) return "Both";
  return "None";
}

// Make click selection easier: enlarge tolerance if you miss roads
const CLICK_TOLERANCE_METERS = 35;

// Click → query nearest road segment → popup
map.on("click", (e) => {
  roadsFL.query()
    .nearby(e.latlng, CLICK_TOLERANCE_METERS)
    .run((err, fc) => {
      if (err) {
        console.error(err);
        return;
      }
      if (!fc || !fc.features || fc.features.length === 0) return;

      const p = fc.features[0].properties || {};

      const name = p.road_name || p.STREET_NAM || "Unnamed road";
      const juris = p.JURISDICTI || "Unknown";
      const speed = (p.SPEED_LIMI ?? "Unknown");
      //const lanes = (p.NUMBER_OF_ ?? "Unknown");
      const surface = (p.PAVEMENT_S && String(p.PAVEMENT_S).trim()) ? p.PAVEMENT_S : "Unknown";
      const coverage = covLabel(p.cov);

      L.popup()
        .setLatLng(e.latlng)
        .setContent(`
          <div style="min-width:240px">
            <b>${name}</b><br>
            <b>Coverage:</b> ${coverage}<br>
            <b>Jurisdiction:</b> ${juris}<br>
            <b>Speed limit:</b> ${speed}<br>
            <b>Surface:</b> ${surface}
          </div>
        `)
        .openOn(map);
    });
});

// ------------------------------
// Legend (coverage)
// ------------------------------
const legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
  const div = L.DomUtil.create("div", "legend");
  div.innerHTML = `
    <b>Cell Coverage</b><br>
    <i style="background:#90ee90"></i> 5G<br>
    <i style="background:#888888"></i> LTE<br>
    <i style="background:#e859b2"></i> Both<br>
    <i style="background:#0033cc"></i> None<br>
    <hr style="margin:8px 0;">
  `;
  return div;
};

legend.addTo(map);
// UI dropdown toggle
const btn = document.getElementById("ui-toggle");
const content = document.getElementById("ui-content");

btn.addEventListener("click", () => {
  const collapsed = content.classList.toggle("collapsed");
  btn.textContent = collapsed ? "More info ▾" : "More info ▴";
  btn.setAttribute("aria-expanded", String(!collapsed));
});
// ------------------------------
// Road name search (FeatureServer)
// Fields available: road_name, JURISDICTI, cov, SPEED_LIMI, PAVEMENT_S
// ------------------------------
const searchInput = document.getElementById("road-search");
const resultsBox = document.getElementById("search-results");
const jurisSelect = document.getElementById("jurisdiction-filter");

let searchTimer = null;
let lastSearchToken = 0;

function escapeSqlLike(s) {
  // escape single quotes and LIKE wildcards
  return String(s)
    .replace(/'/g, "''")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_");
}

function escapeSqlString(s) {
  // safe for: ... = 'value'
  return String(s).replace(/'/g, "''");
}

// ------------------------------
// Populate jurisdiction dropdown (sample-based)
// ------------------------------
roadsFL.query()
  .where("JURISDICTI IS NOT NULL")
  .fields(["JURISDICTI"])
  .returnGeometry(false)
  .limit(5000)
  .run((err, fc) => {
    if (err) {
      console.error("Jurisdiction load error:", err);
      return;
    }

    const feats = (fc && fc.features) ? fc.features : [];
    const set = new Set();

    feats.forEach(f => {
      const j = f.properties && f.properties.JURISDICTI;
      if (j && String(j).trim()) set.add(String(j).trim());
    });

    const jurisdictions = Array.from(set).sort((a, b) => a.localeCompare(b));
    jurisdictions.forEach(j => {
      const opt = document.createElement("option");
      opt.value = j;
      opt.textContent = j;
      jurisSelect.appendChild(opt);
    });
  });

function covLabel(cov) {
  if (cov === 1) return "LTE";
  if (cov === 2) return "5G";
  if (cov === 3) return "Both";
  return "None";
}

function showResults(items) {
  if (!items || items.length === 0) {
    resultsBox.innerHTML = `<div class="ui-result">No matches</div>`;
    resultsBox.classList.remove("collapsed");
    return;
  }

  resultsBox.innerHTML = "";
  items.forEach(({ feature, label, sub }) => {
    const div = document.createElement("div");
    div.className = "ui-result";
    div.innerHTML = `<div><b>${label}</b></div><small>${sub}</small>`;

    div.addEventListener("click", () => {
      resultsBox.classList.add("collapsed");

      // zoom to selected road segment
      const bounds = L.geoJSON(feature).getBounds();
      map.fitBounds(bounds.pad(0.25));

      // popup at center
      const p = feature.properties || {};
      const center = bounds.getCenter();

      const name = p.road_name || "Unnamed road";
      const juris = p.JURISDICTI || "Unknown";
      const speed = (p.SPEED_LIMI ?? "Unknown");
      const surface = (p.PAVEMENT_S && String(p.PAVEMENT_S).trim()) ? p.PAVEMENT_S : "Unknown";
      const coverage = covLabel(p.cov);

      L.popup()
        .setLatLng(center)
        .setContent(`
          <div style="min-width:240px">
            <b>${name}</b><br>
            <b>Coverage:</b> ${coverage}<br>
            <b>Jurisdiction:</b> ${juris}<br>
            <b>Speed limit:</b> ${speed}<br>
            <b>Surface:</b> ${surface}
          </div>
        `)
        .openOn(map);
    });

    resultsBox.appendChild(div);
  });

  resultsBox.classList.remove("collapsed");
}

function hideResults() {
  resultsBox.classList.add("collapsed");
}

searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(runSearch, 250);
});

// IMPORTANT: re-run search when jurisdiction changes
jurisSelect.addEventListener("change", () => {
  runSearch();
});

document.addEventListener("click", (e) => {
  if (!resultsBox.contains(e.target) && e.target !== searchInput) hideResults();
});

function runSearch() {
  const raw = (searchInput.value || "").trim();
  if (raw.length < 3) {
    hideResults();
    return;
  }

  const token = ++lastSearchToken;

  // Search term (uppercased for case-insensitive match)
  const q = escapeSqlLike(raw.toUpperCase());

  // Base where clause
  let where = `UPPER(road_name) LIKE '%${q}%'`;

  // Add jurisdiction filter (case-insensitive + trim-safe)
  const selectedJ = (jurisSelect.value || "").trim();
  if (selectedJ) {
    const jUpper = escapeSqlString(selectedJ.toUpperCase());
    where += ` AND UPPER(JURISDICTI) = '${jUpper}'`;
  }

  roadsFL.query()
    .where(where)
    .fields(["road_name", "JURISDICTI", "cov", "SPEED_LIMI", "PAVEMENT_S"])
    .returnGeometry(true)
    .limit(20)
    .run((err, fc) => {
      if (token !== lastSearchToken) return; // ignore stale results
      if (err) {
        console.error(err);
        showResults([]);
        return;
      }

      const feats = (fc && fc.features) ? fc.features : [];
      const items = feats.map(f => {
        const p = f.properties || {};
        const name = p.road_name || "Unnamed road";
        const juris = p.JURISDICTI || "Unknown";
        const cov = covLabel(p.cov);
        return {
          feature: f,
          label: name,
          sub: `${juris} • ${cov}`
        };
      });

      showResults(items);
    });
}