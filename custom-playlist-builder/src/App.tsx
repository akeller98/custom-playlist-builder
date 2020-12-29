import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Spring } from "react-spring/renderprops";
import { GreenButton } from './components/shared/GreenButton';
import SpotifyList from './components/SpotifyList/SpotifyList';
import { InputField } from './components/shared/InputField/InputField';
import { CircularProgressBar } from './components/shared/CircularProgressBar';
import { AlertMessage } from './components/helpers/AlertEnum';
import { SnackbarNotif } from './components/Snackbar/SnackbarNotif';
import SignInModal from './components/Modal/SignInModal';
import { WelcomeText } from './components/WelcomeText/WelcomeText';
import { SettingsPanel } from './components/SettingsPanel/SettingsPanel';
import { getUserData, createPlaylist, addToPlaylist } from './components/helpers/http/http';
import './App.css';

function App() {
  const [accessToken, setAccessToken] = useState('');
  const [spotifyRes, setSpotifyRes] = useState({seeds: [], tracks: []});
  const [userData, setUserData] = useState({display_name: '', images: [{url: ''}], id: ''});
  const [playlistTitle, setPlaylistTitle] = useState('Untitled-Playlist-1');
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [isPlaylistLoading, setIsPlaylistLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      let parsed = queryString.parse(window.location.search).access_token;
      if (typeof parsed === "string") {
        setAccessToken(parsed)
      } else {
        return;
      }
      const data = await getUserData(parsed);
      setUserData(data);
    }
    fetchUserData();
  }, [])

  function handleTitleChange(newTitle: string) {
    setPlaylistTitle(newTitle);
  }
  
  function handleVisibleChange(newVisible: boolean) {
    setIsVisible(newVisible);
  }

  function handleSnackbarClose(isClosed: boolean) {
    if (isClosed) {
      setMessage('');
    }
  }

  function handleMessageChange(newMessage: string) {
    setMessage(newMessage);
  }

  function handleSpotifyResChange(newRes: any) {
    setSpotifyRes(newRes);
  }

  function handleIsPlaylistLoading(newIsLoading: boolean) {
    setIsPlaylistLoading(newIsLoading);
  }

  function onSave(): void {
    setIsSaveLoading(true);
    const savePlaylist = async () => {
      const data = await createPlaylist(accessToken, userData.id, playlistTitle);
      if (data.error) {
        setMessage(AlertMessage.TokenError);
        setIsSaveLoading(false);
        return;
      }
      let uris: string[] = []
      spotifyRes.tracks.map((track: any) => {
        return uris.push(track.uri);
      });
      if (data.id) {
        const addTracks = async () => {
          const addData = await addToPlaylist(accessToken, data.id, uris);
          if (addData.error) {
            setIsSaveLoading(false);
            setMessage(AlertMessage.TokenError);
            return;
          }
          setMessage(AlertMessage.SaveSuccess);
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
    <div className="App">
      <Grid container spacing={0}>
        <Grid item lg={4} md={4} sm={12} xs={12} className="App-header">
          <div className="settings-panel">
            <SettingsPanel 
              accessToken={accessToken} 
              setMessage={handleMessageChange} 
              setSpotifyRes={handleSpotifyResChange} 
              setIsPlaylistLoading={handleIsPlaylistLoading}/>
          </div>
        </Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} className="display-panel">
          {accessToken === '' &&
            <div className="welcome-text">
              <WelcomeText />
            </div>
          }
          {isVisible && accessToken !== '' &&
            <div className="display-header">
              <img src={userData.images[0].url} className="user-image" alt={userData.display_name}/>
                <div className="user-data">
                  <div className="hello-text">
                    <Typography variant="h4">
                      {`Welcome back, ${userData.display_name}!`}
                    </Typography>
                  </div>
                  <div className="create-playlist-text">
                    <InputField onChange={handleTitleChange} title={playlistTitle}/>
                    <div className="save-button-container">
                      {isSaveLoading ? 
                        <div className="loading-save">
                          <CircularProgressBar />
                        </div> :
                        <GreenButton className={spotifyRes.seeds.length === 0 ? "save-button" : ''} variant="outlined" color="primary" onClick={onSave} disabled={spotifyRes.seeds.length === 0}>
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
              props => (
                <div className="sm-display-header" style={props}>
                  <img src={userData.images[0].url} className="user-image" alt={userData.display_name}/>
                    <div className="user-data">
                      <div className="sm-create-playlist-text">
                        <InputField onChange={handleTitleChange} title={playlistTitle}/>
                        <div className="save-button-container">
                        {isSaveLoading ? 
                          <div className="loading-save">
                            <CircularProgressBar />
                          </div> :
                          <GreenButton className={spotifyRes.seeds.length === 0 ? "save-button" : ''} variant="outlined" color="primary" onClick={onSave} disabled={spotifyRes.seeds.length === 0}>
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
          {isPlaylistLoading &&
            <div className="loading-playlist">
              <CircularProgressBar />
            </div>
          }
          {spotifyRes.seeds.length === 0 && !isPlaylistLoading && accessToken !== '' &&
            <div className="instruction-text">
              <Typography variant="h5">Use the panel on the left to generate a playlist</Typography>
            </div>
          }
          {spotifyRes.seeds.length !== 0 && spotifyRes.tracks.length === 0 && !isPlaylistLoading &&
            <div className="no-found-text">
              <Typography variant="h5">We couldn't find any music!</Typography>
              <Typography variant="h6">Try a different search</Typography>
            </div>
          }
          {spotifyRes.tracks.length !==0 && spotifyRes.seeds.length !==0 && 
            <SpotifyList tracks={spotifyRes.tracks} onChange={handleVisibleChange}/>
          }
          {message !== '' &&
            <SnackbarNotif isOpen={true} message={message} onClose={handleSnackbarClose}/>
          }
        </Grid>
      </Grid>
      {message === AlertMessage.TokenError &&
        <SignInModal />
      }
    </div>
  );
}

export default App;
