import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import './App.css';
import MetricSlider from './components/MetricSlider';
import GenreSelector from './components/GenreSelector';
import Button from '@material-ui/core/Button';

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

  useEffect(() => {
    let parsed = queryString.parse(window.location.search).access_token;
    if (typeof parsed === "string") {
      setAccessToken(parsed)
    }
  }, [accessToken])

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
      tuneableString += "&min_popularity=" + popularity;
    }
    if (isEnergy) {
      tuneableString += "&min_energy=" + String(energy/100);
    }
    if (isInstrumentalness) {
      tuneableString += "&min_instrumentalness=" + String(instrumentalness/100);
    }
    if (isAcousticness) {
      tuneableString += "&min_acousticness=" + String(acousticness/100);
    }
    if (isHappiness) {
      tuneableString += "&target_valence=" + String(happiness/100); 
    }
    return tuneableString;
  }

  function queryBuilder(): string {
    let endpoint: string = 'https://api.spotify.com/v1/recommendations?';
    endpoint += generateSeedGenres() + buildTuneableString();
    return endpoint
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

  return (
    <div className="App">
      <div className="App-header">
        <div className="settings-panel">
          <div className="genre-selector">
            <GenreSelector onChange={handleGenreChange}/>
          </div>
          <div className="metrics-panel">
            <MetricSlider 
              name="Popularity"
              onChange={handlePopularityChange}
              />
            <MetricSlider 
              name="Energy"
              onChange={handleEnergyChange}
            />
            <MetricSlider 
              name="Instrumentalness"
              onChange={handleInstrumentallnessChange}
              />
            <MetricSlider 
              name="Acousticness"
              onChange={handleAcousticnessChange}
              />
            <MetricSlider 
              name="Happiness"
              onChange={handleHappinessChange}
              />
            <Button variant="outlined" color="primary" onClick={onGenerate}>
              Generate
            </Button>
          </div>
        </div>
      </div>
      <div className="display-panel">
        {JSON.stringify(spotifyRes)}
      </div>
    </div>
  );
}

export default App;
