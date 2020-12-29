import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import GenreSelector from '../GenreSelector/GenreSelector';
import MetricSlider from '../MetricSlider/MetricSlider';
import { GreenButton } from '../shared/GreenButton';
import { AlertMessage } from '../helpers/AlertEnum';
import { getPlaylist } from '../helpers/http/http';
import './SettingsPanel.css';

export function SettingsPanel(props: {accessToken: string,
                                        setMessage: (newMessage: string) => void,
                                        setSpotifyRes: (newRes: any) => void,
                                        setIsPlaylistLoading: (newIsLoading: boolean) => void
                                    }) {
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

    function onGenerate(): void {
        let selected: boolean[] = [];
        selectedGenres.map((genre: any) => {
          return selected.push(genre.checked);
        });
        let check: boolean = selected.every((e) => {return !e});
        if (check) {
          props.setIsPlaylistLoading(false);
          props.setMessage(AlertMessage.GenreError);
          return;
        }
        props.setSpotifyRes({seeds: [], tracks: []});
        props.setIsPlaylistLoading(true);
        const fetchPlaylist = async () => {
          const data = await getPlaylist(props.accessToken,
                                        selectedGenres,
                                        isPopularity,
                                        popularity,
                                        isEnergy,
                                        energy,
                                        isInstrumentalness,
                                        instrumentalness,
                                        isAcousticness,
                                        acousticness,
                                        isHappiness,
                                        happiness);
          props.setIsPlaylistLoading(false);
          props.setSpotifyRes(data);
        }
        fetchPlaylist();
      }

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

    return (
        <React.Fragment>
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
              <GreenButton className={props.accessToken === '' ? "save-button" : ''} variant="outlined" color="primary" onClick={onGenerate} disabled={props.accessToken === ''}>
                Generate
              </GreenButton>
            </div>
        </React.Fragment>
    )
}