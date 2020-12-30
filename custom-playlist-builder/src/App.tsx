import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import Grid from '@material-ui/core/Grid';
import { AlertMessage } from './components/helpers/AlertEnum';
import { SnackbarNotif } from './components/Snackbar/SnackbarNotif';
import SignInModal from './components/Modal/SignInModal';
import { WelcomeText } from './components/WelcomeText/WelcomeText';
import { SettingsPanel } from './components/SettingsPanel/SettingsPanel';
import { DisplayPanel } from './components/DisplayPanel/DisplayPanel';
import { getUserData } from './components/helpers/http/http';
import MoreGenresModal from './components/MoreGenresModal/MoreGenresModal';
import './App.css';

function App() {
  const [accessToken, setAccessToken] = useState('');
  const [spotifyRes, setSpotifyRes] = useState({seeds: [], tracks: []});
  const [userData, setUserData] = useState({display_name: '', images: [{url: ''}], id: ''});
  const [message, setMessage] = useState('');
  const [isPlaylistLoading, setIsPlaylistLoading] = useState(false);
  const [isSignInVisible, setIsSignInVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      let parsed = queryString.parse(window.location.search).access_token;
      if (typeof parsed === "string") {
        setAccessToken(parsed)
      } else {
        return;
      }
      const data = await getUserData(parsed);
      if (data.error) {
        setMessage(AlertMessage.TokenError);
        setIsSignInVisible(true);
        return;
      }
      setUserData(data);
    }
    fetchUserData();
  }, [])

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

  function handleIsSignInVisible(isSignInVisible: boolean) {
    setIsSignInVisible(isSignInVisible);
  }

  return (
    <div className="App">
      <Grid container spacing={0}>
        <Grid item xl={4} lg={4} md={4} sm={12} xs={12} className="App-header">
          <div className="settings-panel">
            <SettingsPanel 
              accessToken={accessToken} 
              setMessage={handleMessageChange} 
              setSpotifyRes={handleSpotifyResChange} 
              setIsPlaylistLoading={handleIsPlaylistLoading}
              setIsSignInVisible={handleIsSignInVisible}/>
          </div>
        </Grid>
        <Grid item xl={8} lg={8} md={8} sm={12} xs={12} className="display-panel">
          {accessToken === '' &&
            <div className="welcome-text">
              <WelcomeText />
            </div>
          }
          {userData.id !== '' &&
            <DisplayPanel 
              accessToken={accessToken}
              userData={userData}
              spotifyRes={spotifyRes}
              isPlaylistLoading={isPlaylistLoading}
              setMessage={handleMessageChange}
              setIsSignInVisible={handleIsSignInVisible}/>
          }
        </Grid>
      </Grid>
      {message !== '' &&
            <SnackbarNotif isOpen={true} message={message} onClose={handleSnackbarClose}/>
      }
      {isSignInVisible &&
        <SignInModal isSignInVisible={isSignInVisible} setIsSignInVisible={handleIsSignInVisible}/>
      }
    </div>
  );
}

export default App;
