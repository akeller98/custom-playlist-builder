import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import './App.css';
import MetricSlider from './components/MetricSlider/MetricSlider';
import GenreSelector from './components/GenreSelector/GenreSelector';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { GreenButton } from './components/shared/GreenButton';
import SpotifyList from './components/SpotifyList/SpotifyList';
import { InputField } from './components/shared/InputField/InputField';

function App() {
  const [accessToken, setAccessToken] = React.useState('');
  const [popularity, setPopularity] = React.useState(0);
  const [isPopularity, setIsPopularity] = React.useState(true);
  const [energy, setEnergy] = React.useState(0);
  const [isEnergy, setIsEnergy] = React.useState(true);
  const [instrumentalness, setInstrumentalness] = React.useState(0);
  const [isInstrumentalness, setIsInstrumentalness] = React.useState(true);
  const [acousticness, setAcousticness] = React.useState(0);
  const [isAcousticness, setIsAcousticness] = React.useState(true);
  const [happiness, setHappiness] = React.useState(0);
  const [isHappiness, setIsHappiness] = React.useState(true);
  const [selectedGenres, setSelectedGenres] = React.useState([{id: 'default', checked: false}]);
  const [spotifyRes, setSpotifyRes] = React.useState({seeds: [], tracks: []});
  const [userData, setUserData] = React.useState({display_name: '', images: [{url: ''}], id: ''});
  const [scrollTop, setScrollTop] = React.useState(0);
  const [scrolling, setScrolling] = React.useState(false);
  const [playlistTitle, setPlaylistTitle] = React.useState('');

  const style = {
    height: calcHeight() + 'em'
  };

  const welcomeTextStyle = {
    opacity: `${(100 - ((8 - calcHeight()) / 4) *100)}%`
  }

  function calcHeight() {
    let height: number = (8 - (scrollTop/16)); 
    if (height > 4) {
      return height;
    }
    else {
      return 4;
    }
  }

  useEffect(() => {
    const onScroll = (e: any) => {
      setScrollTop(e.target.documentElement.scrollTop);
      setScrolling(e.target.documentElement.scrollTop > scrollTop);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollTop])

  useEffect(() => {
    let parsed = queryString.parse(window.location.search).access_token;
    if (typeof parsed === "string") {
      setAccessToken(parsed)
    }
    fetch('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer ' + parsed}
    }).then(res => res.json())
    .then(data => {
      setUserData(data);
      console.log(data);
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
  
  function generateSeedGenres(): string {
    let selected_arr: string[] = [];
    selectedGenres.map((genre) => {
      if (genre.checked) {
        selected_arr.push(genre.id);
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
    console.log(queryBuilder());
    fetch(queryBuilder(), {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(res => res.json())
    .then(data => {
      setSpotifyRes(data);
      console.log(data);
    });
  }

  function onSave(): void {
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
        console.log(data);
        let uris: string[] = []
        spotifyRes.tracks.map((track: any) => {
          uris.push(track.uri);
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
            console.log(data);
          })
        } else {
          console.log('uh oh');
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
              <GreenButton variant="outlined" color="primary" onClick={onGenerate}>
                Generate
              </GreenButton>
            </div>
          </div>
        </Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} className="display-panel">
          <div className="display-header" style={style}>
            <img src={userData.images[0].url} className="user-image" />
              <div className="user-data">
                {calcHeight() !== 4 &&
                  <div className="welcome-text" style={welcomeTextStyle}>
                    <Typography variant="h4">
                      {`Welcome back, ${userData.display_name}!`}
                    </Typography>
                  </div>
                }
                <div className={calcHeight() === 4 ? "sm-create-playlist-text" : "create-playlist-text"} style={calcHeight() !== 4 ? welcomeTextStyle : {}}>
                  <InputField onChange={handleTitleChange}/>
                  <div className="save-button">
                    <GreenButton variant="outlined" color="primary" onClick={onSave} disabled={spotifyRes.seeds.length === 0}>
                      Save Playlist
                    </GreenButton>
                  </div>
                </div>
            </div>
            
          </div>
          {spotifyRes.tracks.length !==0 && spotifyRes.seeds.length !==0 && 
            <SpotifyList tracks={spotifyRes.tracks} />
          }
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
