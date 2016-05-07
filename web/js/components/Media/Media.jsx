import '@/less/media/media.less';

import React from 'react';

export default class Media extends React.Component {
	render() {
		return (
			<div className='mediaContainer container'>
                {this.props.children}
			</div>
		);
	}
}