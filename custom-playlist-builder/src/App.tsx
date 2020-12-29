import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Spring } from "react-spring/renderprops";
import { GreenButton } from './components/shared/GreenButton';
import SpotifyList from './components/SpotifyList/SpotifyList';
import { InputField } from './components/shared/InputField/InputField';
import { CircularProgressBar } from './components/shared/CircularProgressBar';
import MetricSlider from './components/MetricSlider/MetricSlider';
import GenreSelector from './components/GenreSelector/GenreSelector';
import { AlertMessage } from './components/helpers/AlertEnum';
import { SnackbarNotif } from './components/Snackbar/SnackbarNotif';
import SignInModal from './components/Modal/SignInModal';
import { WelcomeText } from './components/WelcomeText/WelcomeText';
import './App.css';

function App() {
  const [accessToken, setAccessToken] = useState('');
  const [popularity, setPopularity] = useState(0);
  const [isPopularity, setIsPopularity] = useState(true);
  const [energy, setEnergy] = useState(0);
  const [isEnergy, setIsEnergy] = useState(true);
  const [instrumentalness, setInstrumentalness] = useState(0);
  const [isInstrumentalness, setIsInstrumentalness] = useState(true);
  const [acousticness, setAcousticness] = useState(0);
  const [isAcousticness, setIsAcousticness] = useState(true);
  const [happiness, setHappiness] = useState(0);
  const [isHappiness, setIsHappiness] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState([{id: 'default', checked: false}]);
  const [spotifyRes, setSpotifyRes] = useState({seeds: [], tracks: []});
  const [userData, setUserData] = useState({display_name: '', images: [{url: ''}], id: ''});
  const [playlistTitle, setPlaylistTitle] = useState('Untitled-Playlist-1');
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [isPlaylistLoading, setIsPlaylistLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  useEffect(() => {
    let parsed = queryString.parse(window.location.search).access_token;
    if (typeof parsed === "string") {
      setAccessToken(parsed)
    } else {
      return;
    }
    fetch('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer ' + parsed}
    }).then(res => res.json())
    .then(data => {
      setUserData(data);
    });
  }, [])

  function handlePopularityChange(newPopularity: number, isEnabled: boolean): void {
    setPopularity(newPopularity);
    setIsPopularity(isEnabled);
  }

  function handleEnergyChange(newEnergy: number, isEnabled: boolean): void {
    setEnergy(newEnergy);
    setIsEnergy(isEnabled);
  }

  function handleInstrumentallnessChange(newInstrumentalness: number, isEnabled: boolean): void {
    setInstrumentalness(newInstrumentalness);
    setIsInstrumentalness(isEnabled);
  }

  function handleAcousticnessChange(newAcousticness: number, isEnabled: boolean): void {
    setAcousticness(newAcousticness);
    setIsAcousticness(isEnabled);
  }

  function handleHappinessChange(newHappiness: number, isEnabled: boolean): void {
    setHappiness(newHappiness);
    setIsHappiness(isEnabled);
  }

  function handleGenreChange(newSelectedGenres: {id: string, checked: boolean}[]) {
    setSelectedGenres(newSelectedGenres);
  }

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

  function generateSeedGenres(): string {
    let selected_arr: string[] = [];
    selectedGenres.map((genre) => {
      if (genre.checked) {
        return selected_arr.push(genre.id);
      }
    });
    return "seed_genres=" + selected_arr.join('%2C');
  }

  function buildTuneableString(): string {
    let tuneableString: string = '';
    if (isPopularity) {
      tuneableString += "&target_popularity=" + popularity;
    }
    if (isEnergy) {
      tuneableString += "&target_energy=" + String(energy/100);
    }
    if (isInstrumentalness) {
      tuneableString += "&target_instrumentalness=" + String(instrumentalness/100);
    }
    if (isAcousticness) {
      tuneableString += "&target_acousticness=" + String(acousticness/100);
    }
    if (isHappiness) {
      tuneableString += "&target_valence=" + String(happiness/100); 
    }
    return tuneableString;
  }

  function queryBuilder(): string {
    return 'https://api.spotify.com/v1/recommendations?' + generateSeedGenres() + buildTuneableString() + "&limit=30";
  }

  function onGenerate(): void {
    let selected: boolean[] = [];
    selectedGenres.map((genre: any) => {
      return selected.push(genre.checked);
    });
    let check: boolean = selected.every((e) => {return !e});
    if (check) {
      setIsPlaylistLoading(false);
      setMessage(AlertMessage.GenreError);
      return;
    }
    setSpotifyRes({seeds: [], tracks: []});
    setIsPlaylistLoading(true);
    console.log(queryBuilder());
    fetch(queryBuilder(), {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(res => res.json())
    .then(data => {
      setIsPlaylistLoading(false);
      setSpotifyRes(data);
      console.log(data);
    });
  }

  function onSave(): void {
    setIsSaveLoading(true);
    fetch(`https://api.spotify.com/v1/users/${userData.id}/playlists`, {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify({
        name: playlistTitle,
        public: false,
        description: 'Created using Custom Playlist Builder'
      })
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          setMessage(AlertMessage.TokenError);
          setIsSaveLoading(false);
          return;
        }
        console.log(data);
        let uris: string[] = []
        spotifyRes.tracks.map((track: any) => {
          return uris.push(track.uri);
        });
        if (data.id) {
          fetch(`https://api.spotify.com/v1/playlists/${data.id}/tracks`, {
            headers: {
              'Authorization': 'Bearer ' + accessToken,
              'Accept': 'application/json'
            },
            method: 'post',
            body: JSON.stringify({
              uris: uris
            })
          }).then(res => res.json())
          .then(data => {
            if (data.error) {
              setIsSaveLoading(false);
              setMessage(AlertMessage.TokenError);
              return;
            }
            setMessage(AlertMessage.SaveSuccess);
            setIsSaveLoading(false);
            console.log(data);
          })
        } else {
          console.log('uh oh');
          setIsSaveLoading(false);
          return;
        }
      })
  }

  return (
    <div className="App">
      <Grid container spacing={0}>
        <Grid item lg={4} md={4} sm={12} xs={12} className="App-header">
          <div className="settings-panel">
            <div className="sub-title">
              <Typography variant="h4">Genres</Typography>
            </div>
            <div className="genre-selector">
              <GenreSelector onChange={handleGenreChange}/>
            </div>
            <div className="metrics-panel">
              <div className="sub-title">
                <Typography variant="h4">Tuners</Typography>
              </div>
              <MetricSlider 
                name="Popularity"
                onChange={handlePopularityChange}
                initEnabled={true}
                />
              <MetricSlider 
                name="Energy"
                onChange={handleEnergyChange}
                initEnabled={false}
              />
              <MetricSlider 
                name="Instrumentalness"
                onChange={handleInstrumentallnessChange}
                initEnabled={false}
                />
              <MetricSlider 
                name="Acousticness"
                onChange={handleAcousticnessChange}
                initEnabled={false}
                />
              <MetricSlider 
                name="Happiness"
                onChange={handleHappinessChange}
                initEnabled={false}
                />
              <GreenButton className={accessToken === '' ? "save-button" : ''} variant="outlined" color="primary" onClick={onGenerate} disabled={accessToken === ''}>
                Generate
              </GreenButton>
            </div>
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
          {spotifyRes.seeds.length === 0 && !isPlaylistLoading &&
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
