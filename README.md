
# Ontario Road Connectivity: Interactive Cellular Coverage Web Map

An interactive Web GIS application visualizing cellular network coverage along Ontario's road network.

The project combines provincial road data with cellular coverage information to classify road segments by available network service: None, LTE, 5G, or Both.

Developed using ArcGIS Pro, ArcGIS Online, Leaflet, and JavaScript, the application allows users to explore road connectivity, search for specific roads, and examine associated road attributes.

**[Explore the Live Interactive Map](https://asage101.github.io/ontario-road-connectivity/)**

![Map Screenshot](assets/map_screenshot.png)

---

## Project Overview

This project visualizes road connectivity across Ontario using a published ArcGIS Online Vector Tile Layer and Feature Layer.

The application allows users to explore cellular coverage by road segment, search for road names, filter by jurisdiction, and inspect road attributes such as speed limit, pavement surface, and jurisdiction.

By combining GIS data processing with interactive web mapping, the project demonstrates how geographic information can be made more accessible and useful for exploring telecommunications infrastructure and road connectivity.

## Live Map

https://asage101.github.io/ontario-road-connectivity/

## Features

- Ontario-wide road coverage visualization
- Coverage categories:
  - None
  - LTE
  - 5G
  - Both
- Search by road name
- Filter search by jurisdiction
- Clickable road segments with popup details
- Interactive legend
- Expandable information card

## How to Use

- Search for roads by name
- Filter results by jurisdiction
- Click road segments to view available attributes
- Explore provincial patterns of road connectivity and service availability

---

## Data and Processing

The project was built using road and cellular coverage data processed in ArcGIS Pro.

### Workflow

1. Road and coverage data were cleaned and joined in ArcGIS Pro.
2. Coverage classes were assigned to road segments.
3. Geometry was simplified for web display.
4. Data was published to ArcGIS Online as:
   - **Vector Tile Layer:** For efficient rendering of road segments.
   - **Feature Layer:** For search functionality and attribute queries.
5. The interactive web map was developed using Leaflet, Esri Leaflet, and Esri Leaflet Vector.

This workflow combines desktop GIS processing with cloud-hosted geospatial services and web development to create an interactive mapping application.

## Technical Implementation

The application uses a combination of ArcGIS Online services and Leaflet-based web mapping tools to visualize and interact with Ontario's road connectivity data.

### GIS Data Processing

ArcGIS Pro was used to prepare the spatial datasets, including cleaning and joining road network data with cellular coverage information, assigning coverage classifications, and simplifying geometry for web visualization.

These processing steps prepared the geographic data for publication and use in an interactive web environment.

### Web Mapping Architecture

The processed data was published through ArcGIS Online using two complementary services:

- **Vector Tile Layer:** Supports efficient rendering of road segments across Ontario.
- **Feature Layer:** Provides access to road attributes for searching, filtering, and interactive popups.

The front-end application was developed using HTML, CSS, JavaScript, Leaflet, Esri Leaflet, and Esri Leaflet Vector.

This approach separates map visualization from attribute queries, allowing the application to display a large geographic dataset while maintaining interactive functionality.

### Interactive Functionality

The application provides several ways to explore and interact with the spatial data.

Users can search for individual roads, filter search results by jurisdiction, and select road segments to examine attributes such as speed limit, pavement surface, and cellular coverage classification.

An interactive legend and expandable information card provide additional context for interpreting the map.

---

## Technical Considerations

### Rendering Performance

Displaying road-level geographic information across an entire province presents challenges related to dataset size and rendering performance.

Geometry simplification and vector tile publishing were used to make the road network more suitable for interactive web visualization.

### Attribute Accessibility

Vector tiles support efficient visualization but are not designed to provide the full attribute-query functionality needed for road searches and detailed popups.

The application uses a separate feature layer to support these interactions.

### Data Limitations

The map represents cellular coverage based on the source datasets and their classifications.

Actual connectivity may vary because of terrain, network conditions, and differences between reported and experienced coverage.

The application is intended for geographic exploration rather than guaranteeing cellular service at a particular location.

---

## Technologies Used

- **Programming:** HTML, CSS, JavaScript
- **Web Mapping:** Leaflet, Esri Leaflet, Esri Leaflet Vector
- **GIS Processing:** ArcGIS Pro
- **Data Hosting and Publishing:** ArcGIS Online
- **Geospatial Methods:** Spatial data processing, attribute joins, geometry simplification, vector tile publishing

## Data Sources

This project uses publicly available spatial data from the following sources:

- **Ontario Road Network Composite Service**  
  Land Information Ontario  
  https://geohub.lio.gov.on.ca/maps/mnrf::ontario-road-network-composite-service/about

- **CRTC Geographic Service Coverage Data**  
  Canadian Radio-television and Telecommunications Commission  
  https://crtc.gc.ca/eng/television/services/geo.htm

---

## Project Structure

```text
.
├── index.html
├── style.css
├── app.js
├── assets/
│   └── map_screenshot.png
└── README.md
```

## Project Summary

Ontario Road Connectivity demonstrates the integration of GIS data processing, geospatial web services, and front-end development to create an interactive geographic application.

The project provided practical experience preparing spatial datasets for web visualization, publishing vector tile and feature layers through ArcGIS Online, and developing interactive mapping functionality using JavaScript and Leaflet.

By combining these components, the application provides a way to explore patterns of cellular network coverage along Ontario's road network.

---

## Explore the Project

**[Launch the Interactive Ontario Road Connectivity Map](https://asage101.github.io/ontario-road-connectivity/)**

![Map Screenshot](assets/map_screenshot.png)

