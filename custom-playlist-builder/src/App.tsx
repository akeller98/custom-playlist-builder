import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import './App.css';
import MetricSlider from './components/MetricSlider';
import GenreSelector from './components/GenreSelector';
import Button from '@material-ui/core/Button';

function App() {
  const [accessToken, setAccessToken] = React.useState('');
  const [popularity, setPopularity] = React.useState(0);
  const [energy, setEnergy] = React.useState(0);
  const [instrumentalness, setInstrumentalness] = React.useState(0);
  const [acousticness, setAcousticness] = React.useState(0);
  const [happiness, setHappiness] = React.useState(0);
  const [selectedGenres, setSelectedGenres] = React.useState([{id: 'default', checked: false}]);

  useEffect(() => {
    let parsed = queryString.parse(window.location.search).access_token;
    if (typeof parsed === "string") {
      setAccessToken(parsed)
    }
  }, [accessToken])

  function handlePopularityChange(newPopularity: number): void {
    setPopularity(newPopularity);
  }

  function handleEnergyChange(newEnergy: number): void {
    setEnergy(newEnergy);
  }

  function handleInstrumentallnessChange(newInstrumentalness: number): void {
    setInstrumentalness(newInstrumentalness);
  }

  function handleAcousticnessChange(newAcousticness: number): void {
    setAcousticness(newAcousticness);
  }

  function handleHappinessChange(newHappiness: number): void {
    setHappiness(newHappiness);
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

  function queryBuilder(): string {
    const endpoint: string = 'https://api.spotify.com/v1/recommendations?';
    const genreString: string = generateSeedGenres();
    return endpoint
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
            <Button variant="outlined" color="primary">
              Generate
            </Button>
          </div>
        </div>
      </div>
      <div className="display-panel">
        Display Panel
      </div>
    </div>
  );
}

export default App;
