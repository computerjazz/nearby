import React from 'react';

var WikiItem = React.createClass({
	render: function() {
		return (
			<div>
			<a href={"https://en.wikipedia.org/?curid=" + this.props.data.pageid }> { this.props.data.title } </a>
			</div>
			);
	}
});

export default WikiItem;