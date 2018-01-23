import * as React from 'react';
import styled from 'react-emotion';

import { Route, Switch } from 'react-router-dom';

import Music from 'src/components/Media/Music/Music';
import Photos from 'src/components/Media/Photos/Photos';
import Videos from 'src/components/Media/Videos/Videos';
import { cliburn1 } from 'src/styles/imageUrls';
import { container } from 'src/styles/mixins';

const MediaContainer = styled('div')`
    height: 100%;
    width: 100%;
    background: url(${cliburn1}) no-repeat;
    background-size: cover;
    ${container};
`;

const Media: React.SFC<{}> = () => (
    <MediaContainer>
        <Switch>
            <Route path="/media/videos" component={Videos} exact={true} />
            <Route
                path="/media/music"
                render={(props) =>
                    <Route
                        path="/media/music/:track?"
                        render={(childProps) => (
                            <Music {...childProps} baseRoute={props.match.url} />
                        )}
                        exact={true}
                    />
                }
            />
            <Route path="/media/photos" component={Photos} exact={true} />
        </Switch>
    </MediaContainer>
);

export default Media;
