import React from 'react';
import $ from 'jquery';

var WikiItem = React.createClass({
    getInitialState: function () {
        return {
            loc: [0,0]
        };
    },
	render: function() {
		return (
			<div>
            <img src={this.props.thumbnail.src} style={{float:'left',clear:'both', marginRight: 10}} />
			<a href={"https://en.wikipedia.org/?curid=" + this.props.pageid }> { this.props.title } </a>
            
            <p style={{ fontSize: 'smaller'}}> { this.props.extract }</p>
			</div>
			);
	}
});

export default WikiItem;