import 'less/Media/media.less';

import * as React from 'react';

import { Route, Switch } from 'react-router-dom';

import Music from 'js/components/Media/Music/Music';
import Photos from 'js/components/Media/Photos/Photos';
import Videos from 'js/components/Media/Videos/Videos';

const Media = () => (
    <div className='mediaContainer container'>
        <Switch>
            <Route path='/media/videos' component={Videos} exact={true} />
            <Route
                path='/media/music'
                render={(props) =>
                    <Route
                        path='/media/music/:track?'
                        render={(childProps) => (
                            <Music {...childProps} baseRoute={props.match.url} />
                        )}
                        exact={true}
                    />
                }
            />
            <Route path='/media/pictures' component={Photos} exact={true} />
        </Switch>
    </div>
);

export default Media;
