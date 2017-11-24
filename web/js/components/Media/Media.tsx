import 'less/Media/media.less';

import * as React from 'react';

import { Switch, Route } from 'react-router-dom';
import Videos from 'js/components/Media/Videos/Videos';
import Music from 'js/components/Media/Music/Music';
import Photos from 'js/components/Media/Photos/Photos';

const Media = () => (
	<div className='mediaContainer container'>
		<Switch>
			<Route path='/media/videos' component={Videos} exact={true} />
			<Route path='/media/music' render={(props) =>
				<Route path='/media/music/:track?' render={(childProps) => (
					<Music {...childProps} baseRoute={props.match.url} />
				)} exact />
			} />
			<Route path='/media/pictures' component={Photos} exact />
		</Switch>
	</div>
)

export default Media;
