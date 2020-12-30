import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { InputField } from '../shared/InputField/InputField';
import { CircularProgressBar } from '../shared/CircularProgressBar';
import { GreenButton } from '../shared/GreenButton';
import { Spring } from 'react-spring/renderprops';
import SpotifyList from '../SpotifyList/SpotifyList';
import { addToPlaylist, createPlaylist } from '../helpers/http/http';
import { AlertMessage } from '../helpers/AlertEnum';
import './DisplayPanel.css';

export const DisplayPanel = (props: {accessToken: string, 
                                    userData: any, 
                                    spotifyRes: any, 
                                    isPlaylistLoading: boolean, 
                                    setMessage: (newMessage: string) => void,
                                    setIsSignInVisible: (isSignInVisible: boolean) => void},
                                    ) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isSaveLoading, setIsSaveLoading] = useState(false);
    const [playlistTitle, setPlaylistTitle] = useState('Untitled-Playlist-1');

    useEffect(() => {
      console.log(props.accessToken)
    }, [])

    function handleTitleChange(newTitle: string) {
        setPlaylistTitle(newTitle);
    }
      
    function handleVisibleChange(newVisible: boolean) {
        setIsVisible(newVisible);
    }

    function onSave(): void {
        setIsSaveLoading(true);
        const savePlaylist = async () => {
          const data = await createPlaylist(props.accessToken, props.userData.id, playlistTitle);
          if (data.error) {
            props.setMessage(AlertMessage.TokenError);
            props.setIsSignInVisible(true);
            setIsSaveLoading(false);
            return;
          }
          let uris: string[] = []
          props.spotifyRes.tracks.map((track: any) => {
            return uris.push(track.uri);
          });
          if (data.id) {
            const addTracks = async () => {
              const addData = await addToPlaylist(props.accessToken, data.id, uris);
              if (addData.error) {
                setIsSaveLoading(false);
                props.setMessage(AlertMessage.TokenError);
                props.setIsSignInVisible(true);
                return;
              }
              props.setMessage(AlertMessage.SaveSuccess);
              setIsSaveLoading(false);
            };
            addTracks();
          } else {
            console.log('uh oh');
            setIsSaveLoading(false);
            return;
        }
      }
      savePlaylist();
    }

    return (
        <React.Fragment>
          {isVisible && props.accessToken !== '' &&
            <div className="display-header">
              <img src={props.userData.images[0].url} className="user-image" alt={props.userData.display_name}/>
                <div className="user-data">
                  <div className="hello-text">
                    <Typography variant="h4">
                      {`Welcome back, ${props.userData.display_name}!`}
                    </Typography>
                  </div>
                  <div className="create-playlist-text">
                    <InputField onChange={handleTitleChange} title={playlistTitle}/>
                    <div className="save-button-container">
                      {isSaveLoading ? 
                        <div className="loading-save">
                          <CircularProgressBar />
                        </div> :
                        <GreenButton className={props.spotifyRes.seeds.length === 0 ? "save-button" : ''} variant="outlined" color="primary" onClick={onSave} disabled={props.spotifyRes.seeds.length === 0}>
                          Save Playlist
                        </GreenButton>
                      }
                    </div>
                  </div>
                </div>
              </div>
          }
          {!isVisible &&
            <Spring
              from={{ opacity: !isVisible ? 0 : 1}}
              to={{ opacity: !isVisible ? 1 : 0}}
              config={{duration: 200}}
            >
            {
              (springProps: any) => (
                <div className="sm-display-header" style={springProps}>
                  <img src={props.userData.images[0].url} className="user-image" alt={props.userData.display_name}/>
                    <div className="user-data">
                      <div className="sm-create-playlist-text">
                        <InputField onChange={handleTitleChange} title={playlistTitle}/>
                        <div className="save-button-container">
                        {isSaveLoading ? 
                          <div className="loading-save">
                            <CircularProgressBar />
                          </div> :
                          <GreenButton className={props.spotifyRes.seeds.length === 0 ? "save-button" : ''} variant="outlined" color="primary" onClick={onSave} disabled={props.spotifyRes.seeds.length === 0}>
                            Save Playlist
                          </GreenButton>
                        }
                        </div>
                      </div>
                    </div>
                  </div>
              )
            }
            </Spring>
          }
          {props.isPlaylistLoading &&
            <div className="loading-playlist">
              <CircularProgressBar />
            </div>
          }
          {props.spotifyRes.seeds.length === 0 && !props.isPlaylistLoading && props.accessToken !== '' &&
            <div className="instruction-text">
              <Typography variant="h5">Use the panel on the left to generate a playlist</Typography>
            </div>
          }
          {props.spotifyRes.seeds.length !== 0 && props.spotifyRes.tracks.length === 0 && !props.isPlaylistLoading &&
            <div className="no-found-text">
              <Typography variant="h5">We couldn't find any music!</Typography>
              <Typography variant="h6">Try a different search</Typography>
            </div>
          }
          {props.spotifyRes.tracks.length !==0 && props.spotifyRes.seeds.length !==0 && 
            <SpotifyList tracks={props.spotifyRes.tracks} onChange={handleVisibleChange}/>
          }
        </React.Fragment>
    )
}