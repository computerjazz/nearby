import React from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

var MapView = React.createClass ({
	getInitialState: function() {
		return {
			center: [0,0],
			mapData: []
		};
	},

	componentWillReceiveProps: function(nextProps) {
		var center = nextProps.center;
		var zoom = nextProps.mapZoom;
		var mapData = nextProps.mapData;

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
						"icon": "marker",

					}
				}
			});

		if (map.getSource("points")) {
			map.getSource("points").setData({
				"type": "geojson",
				"data": {
					"type": "FeatureCollection",
					"features": sourceData
				}
			});

		} else {
			map.addSource("points", {
				"type": "geojson",
				"data": {
					"type": "FeatureCollection",
					"features": sourceData
				}
			});

		}

		map.addLayer({
			"id": "points",
			"type": "symbol",
			"source": "points",
			"layout": {
				"icon-image": "{icon}-15",
				"text-field": "{title}",
				"text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
				"text-offset": [0, 0.6],
				"text-anchor": "top"
			}
		});

	},
	render: function() {
		return (<div id="mapDisplay" style={{'height':'100%'}}>

			</div>);
	}
});

export default MapView;