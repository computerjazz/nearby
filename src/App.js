import React from 'react';
import $ from 'jquery';

import WikiItem from './WikiItem';
import MapView from './MapView';
import APIkeys from './APIkeys';
import Grid from 'react-bootstrap/lib/Grid';
import Col from 'react-bootstrap/lib/Col'


var App = React.createClass({
  getInitialState(){
    return {
      center: [0, 0],
      radius: 2000,
      rawData: [],
      mapData: []
    };
  },

  componentDidMount: function() {
    if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        center: [position.coords.longitude, position.coords.latitude],
      });
      this.makeUrl();
    });

    

   } else {
      // if we can't get user's location, display default location
    }    
  },

  getUserLocation: function() {

  },

  setLocation: function(lat, long) {

  },
  
  makeUrl: function() {

    var url = "https://en.wikipedia.org/w/api.php";
    var myLng = this.state.center[0];
    var myLat = this.state.center[1];

    //console.log("Url: " + url);

    $.ajax({
      type: 'GET',
      url: url,
      data: {
        action: 'query',
        prop: 'extracts',
        list: 'geosearch',
        gsradius: this.state.radius,
        gscoord: myLat + '|' + myLng,
        format: 'json'
      },
      contentType: 'application/json',
      dataType: 'jsonp', //specify jsonp
      success: function(rawData) {
        console.log("Success" + JSON.stringify(rawData.query));
        var rawData = rawData.query.geosearch;
        this.setState({rawData: rawData});
        this.setMapData(rawData);
      }.bind(this),
      error: function(e) {
       console.log('error', e);
     }
   });
  },

  setMapData: function(rawData) {
    var mapData = rawData.map(item => {
      return {
        title: item.title,
        loc: [item.lon, item.lat]
      }
    });

    

    this.setState({
      mapData: mapData
    });

  },

  render: function() {
    return (
      <Grid className="App" style={{'height': '100%'}}>    
          <Col className="WikiItem-container" md={3}>
            <h2>Ready to adventure?</h2>
            <p className="App-intro">
          The following sites are nearby:
          </p>
          <ul>
          { this.state.rawData.map(locationObj => (
            <WikiItem key={locationObj.pageid} data={locationObj} />)
          )}
        </ul>
        </Col>
        <Col className="MapView-container" md={9} style={{'height': '100%'}}>
        <MapView apiKey={APIkeys.mapbox} 
            center={this.state.center}
            mapData={this.state.mapData} 
            mapZoom={14} />
          </Col>
      </Grid>
      );
  }


})

export default App;
