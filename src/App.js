import React from 'react';
var $ = require("jquery");
import WikiItem from './WikiItem';

var App = React.createClass({
  getInitialState: function() {
    return {
      myLatitude: 0,
      myLongitude: 0,
      radius: 2000,
      data: []
    };
  },
  componentDidMount: function() {
    if (navigator.geolocation) {
       //var self = this;
       navigator.geolocation.getCurrentPosition(function(position) {
        this.setState({
          myLatitude: position.coords.latitude,
          myLongitude: position.coords.longitude
        });
        this.makeUrl();
      }.bind(this));

    } else {
      // can't get user's location, display default location
    }
    
  },
  
  makeUrl: function() {


      var url = "https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=" + this.state.radius + "&gscoord=" + this.state.myLatitude + "%7C" + this.state.myLongitude + "&format=json";
      console.log("Url: " + url);


    $.ajax({
      type: 'GET',
      url: url,
      //jsonpCallback: callback, //specify callback name
      contentType: 'application/json',
      dataType: 'jsonp', //specify jsonp
      success: function(data) {
        console.log("Success" + JSON.stringify(data.query.geosearch));
        this.setState({data: data.query.geosearch});
      }.bind(this),
      error: function(e) {
         console.log('error', e);
      }
    });
  },

  render: function () {
    return (
      <div className="App">
        <div className="App-header">

          <h2>Ready to adventure?</h2>
        </div>
        <p className="App-intro">
          The following sites are nearby:
        </p>
        <ul className="WikiItem-container">
        { this.state.data.map(locationObj => (
          <WikiItem key={locationObj.pageid} data={locationObj} />)
          )}

        </ul>
      </div>
    );
  }
    

})

export default App;
