import React from 'react';

export default class VideoPlaylistItem extends React.Component {
    onClick() {
        this.props.onClick(this.props.video.snippet.resourceId.videoId);
    }

    render() {
        let video = this.props.video;

        return (
            <li className={`videoPlaylistItem${this.props.isActive ? ' active' : ''}`} onClick={this.onClick.bind(this)}>
                <div className="itemContent">
                    <img className="section" src={video.snippet.thumbnails.high.url}></img>
                    <div className="section videoInfo">
                        <h4>{video.snippet.title}</h4>
                    </div>
                </div>
            </li>
            );
    }
}

/*
{
  "kind": "youtube#playlistItem",
  "etag": etag,
  "id": string,
  "snippet": {
    "publishedAt": datetime,
    "channelId": string,
    "title": string,
    "description": string,
    "thumbnails": {
      (key): {
        "url": string,
        "width": unsigned integer,
        "height": unsigned integer
      }
    },
    "channelTitle": string,
    "playlistId": string,
    "position": unsigned integer,
    "resourceId": {
      "kind": string,
      "videoId": string,
    }
  },
  "contentDetails": {
    "videoId": string,
    "startAt": string,
    "endAt": string,
    "note": string
  },
  "status": {
    "privacyStatus": string
  }
}
*/