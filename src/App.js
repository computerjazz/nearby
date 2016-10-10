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
        prop: 'coordinates|pageimages|pageterms',
        colimit: 50,
        piprop: 'thumbnail',
        pithumbnailsize: 144,
        pilimit: 50,
        wbptterms: 'description',
        generator: 'geosearch',
        ggsradius: this.state.radius,
        ggscoord: myLat + '|' + myLng,
        ggslimit: 50,
        format: 'json'
      },
      contentType: 'application/json',
      dataType: 'jsonp', //specify jsonp
      success: function(rawData) {

        var rawData = rawData.query.pages;
        console.log("Success" + JSON.stringify(rawData, null, 2));
        this.setState({rawData: rawData});

        this.setMapData(rawData);
      }.bind(this),
      error: function(e) {
       console.log('error', e);
     }
   });
  },

  setMapData: function(rawData) {

    var mapData = [];

    for (var key in rawData) {
      var currentItem = rawData[key];
      var item = {};

      // for some reason some items don't have coordinate info
      if (currentItem.coordinates) {
        item['pageid'] = currentItem.pageid;
        item['title'] = currentItem.title;
        item['loc'] = [currentItem.coordinates[0].lon, currentItem.coordinates[0].lat];
        //console.log(JSON.stringify(item, null, 2)); 
        mapData.push(item);
      }
    }

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
      { this.state.mapData.map(item => (
        <WikiItem key={item.pageid} 
        pageid={item.pageid} 
        title={item.title} />)
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
