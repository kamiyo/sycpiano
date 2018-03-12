import * as React from 'react';
import { css } from 'react-emotion';

import PhotoListItem from 'src/components/Media/Photos/PhotoListItem';
import { PhotoItem } from 'src/components/Media/Photos/types';
import { idFromItem } from 'src/components/Media/Photos/utils';
import Playlist from 'src/components/Media/Playlist';

const getPhotoListStyle = (isMobile: boolean) => css`
    padding-left: ${isMobile ? 0 : 5}px;
    background-color: black;
    top: 0;
`;

const photoULStyle = (isMobile: boolean) => css`
    /* stylelint-disable-next-line */
    ${!isMobile && `background-color: black;`}
`;

const getPlaylistExtraStyles = (isMobile: boolean) => ({
    div: getPhotoListStyle(isMobile),
    ul: photoULStyle(isMobile),
});

interface PhotoListProps {
    isMobile?: boolean;
    items: PhotoItem[];
    currentItem: PhotoItem;
    selectPhoto: (item: PhotoItem) => void;
}

const PhotoList: React.SFC<PhotoListProps> = ({ isMobile, items, currentItem, selectPhoto }) => (
    <Playlist
        id="photos_ul"
        extraStyles={getPlaylistExtraStyles(isMobile)}
        hasToggler={false}
        isShow={true}
        shouldAppear={false}
        isMobile={isMobile}
    >
        {items.map((item) => (
            <PhotoListItem
                key={item.file}
                item={item}
                currentItemId={isMobile ? null : idFromItem(currentItem)}
                onClick={isMobile ? null : selectPhoto}
                isMobile={isMobile}
            />
        ))}
    </Playlist>
);

export default PhotoList;
