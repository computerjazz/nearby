import React from 'react';

var WikiItem = React.createClass({
	render: function() {
		return (
			<div>
			<a href={"https://en.wikipedia.org/?curid=" + this.props.pageid }> { this.props.title } </a>
			</div>
			);
	}
});

export default WikiItem;