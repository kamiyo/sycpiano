import 'less/Media/media.less';

import * as React from 'react';

import { Route, Switch } from 'react-router-dom';

import Music from 'src/components/Media/Music/Music';
import Photos from 'src/components/Media/Photos/Photos';
import Videos from 'src/components/Media/Videos/Videos';

const Media: React.SFC<{}> = () => (
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
            <Route path='/media/photos' component={Photos} exact={true} />
        </Switch>
    </div>
);

export default Media;
