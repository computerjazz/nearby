import React from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

var MapView = React.createClass ({
	getInitialState: function() {
		return {
			center: [0,0],
			mapData: [],
			zoom: 13
		};
	},

	componentWillReceiveProps: function(nextProps) {
		var center = nextProps.center;
		var zoom = nextProps.mapZoom;
		var mapData = nextProps.mapData;
		console.log(mapData);

		// only update map if location has changed
		if (this.state.center[0] !== nextProps.center[0] || this.state.center[1] !== nextProps.center[1]) {
			this.updateMapCenter(center, zoom);	
			this.setState({
				center: nextProps.center
			});
		}

		if (mapData.length > 0) {
			this.addDataLayer(mapData);
		}
		
	},
	componentDidMount: function() {
		this.createMap();
	},
	createMap: function() {
		mapboxgl.accessToken = this.props.apiKey;
		
		var map = new mapboxgl.Map({
			container: 'mapDisplay',
			style: 'mapbox://styles/mapbox/basic-v9',
			zoom: 0
		});

		this.setState({
			map: map
		});
	},
	updateMapCenter: function(center, zoom) {
		var map = this.state.map;
		map.flyTo({
			center: center,
			zoom: zoom
		});
	},
	addDataLayer: function(mapData) {
		var map = this.state.map;

		var sourceData = mapData.map( item => {
				//console.log(JSON.stringify(item));
				return {
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": item.loc
					},
					"properties": {
						"title": item.title,
						"description": item.extract,
						"icon": "marker",
					}
				}
			});

		/* 
		An issue with duplicate "points" source IDs forced me to 
		implement this weirdly. If a source with ID 'points' already exists, 
		update it with new sourceData. Otherwise create it with sourceData
		*/

		var formattedMapData = {
				"type": "geojson",
				"data": {
					"type": "FeatureCollection",
					"features": sourceData
				},
				cluster:true,
				clusterMaxZoom:15
			};
		if (map.getSource("points")) {
			map.getSource("points").setData(formattedMapData);
		} else {
			map.addSource("points", formattedMapData);
		}
		
		// Add layer for the item locations & titles
		map.addLayer({
			"id": "points",
			"type": "symbol",
			"source": "points",
			"filter": ["!has", "point_count"],
			"layout": {
				"icon-image": "{icon}-15",
				"text-field": "{title}",
				"text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
				"text-offset": [0, 0.6],
				"text-anchor": "top"
			}
		});

		// Add layer for the cluster circles
		map.addLayer({
            "id": "cluster",
            "type": "circle",
            "source": "points",
            "paint": {
                "circle-color": '#f28cb1',
                "circle-radius": 18
            },
            "filter": ["all",
                    [">=", "point_count", 1],
                    ["<", "point_count", 100]] 
        });

		// Add a layer for the clusters' count labels
	    map.addLayer({
	        "id": "cluster-count",
	        "type": "symbol",
	        "source": "points",
	        "layout": {
	            "text-field": "{point_count}",
	            "text-font": [
	                "DIN Offc Pro Medium",
	                "Arial Unicode MS Bold"
	            ],
	            "text-size": 12
	        }
	    });

	    // When a click event occurs near a place, open a popup at the location of
		// the feature, with description HTML from its properties.
		map.on('click', function (e) {
		    var features = map.queryRenderedFeatures(e.point, { layers: ['points'] });

		    if (!features.length) {
		        return;
		    }

		    var feature = features[0];
		    map.flyTo({center: feature.geometry.coordinates});

		    // Populate the popup and set its coordinates
		    // based on the feature found.
		    var popup = new mapboxgl.Popup()
		        .setLngLat(feature.geometry.coordinates)
		        .setHTML(feature.properties.description)
		        .addTo(map);
		});

		// Use the same approach as above to indicate that the symbols are clickable
		// by changing the cursor style to 'pointer'.
		map.on('mousemove', function (e) {
		    var features = map.queryRenderedFeatures(e.point, { layers: ['points'] });
		    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
		});

			},
			render: function() {
				return (<div id="mapDisplay" style={{'height':'100%'}}></div>);
			}
		});

export default MapView;