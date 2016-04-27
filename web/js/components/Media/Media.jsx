import '@/less/media/media.less';

import React from 'react';
import SubNav from '@/js/components/SubNav/SubNav.jsx';

const links = ['videos', 'music', 'photos'];

export default class Media extends React.Component {
	render() {
		return (
			<div className='mediaContainer container'>
                <SubNav links={links} />
                {this.props.children}
			</div>
		);
	}
}