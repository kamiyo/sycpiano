import '@/less/Media/media.less';

import React from 'react';

import { Switch, Route } from 'react-router-dom';
import Videos from '@/js/components/Media/Videos/Videos.jsx';
import Music from '@/js/components/Media/Music/Music.jsx';
import Photos from '@/js/components/Media/Photos/Photos.jsx';

const Media = () => (
	<div className='mediaContainer container'>
		<Switch>
			<Route path='/media/videos' component={Videos} exact />
			<Route path='/media/music' render={(props) => {
				const baseRoute = props.match.url;
				return <Route path='/media/music/:track?' render={(childProps) => (
					<Music {...childProps} baseRoute={baseRoute} />
				)} exact />
			}} />
			<Route path='/media/pictures' component={Photos} exact />
		</Switch>
	</div>
)

export default Media;