
function generateSeedGenres(selectedGenres: any[], selectedMoreGenres: any[]): string {
    let selected_arr: string[] = [];
    selectedGenres.forEach((genre) => {
      if (genre.checked) {
        selected_arr.push(genre.id);
      }
    });
    selectedMoreGenres.forEach((genre) => {
        if (genre.checked) {
          selected_arr.push(genre.id);
        }
      });
    return "seed_genres=" + selected_arr.join('%2C');
}

function buildTuneableString(isPopularity: boolean, 
                            popularity: number,
                            isEnergy: boolean,
                            energy: number,
                            isInstrumentalness: boolean,
                            instrumentalness: number,
                            isAcousticness: boolean,
                            acousticness: number,
                            isHappiness: boolean,
                            happiness: number
                            ): string {
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

export default function queryBuilder(selectedGenres: any[],
                                    selectedMoreGenres: any[],
                                    isPopularity: boolean, 
                                    popularity: number,
                                    isEnergy: boolean,
                                    energy: number,
                                    isInstrumentalness: boolean,
                                    instrumentalness: number,
                                    isAcousticness: boolean,
                                    acousticness: number,
                                    isHappiness: boolean,
                                    happiness: number
                                    ): string {
    return 'https://api.spotify.com/v1/recommendations?' + generateSeedGenres(selectedGenres, selectedMoreGenres) + buildTuneableString(isPopularity, popularity, isEnergy, energy, isInstrumentalness, instrumentalness, isAcousticness, acousticness, isHappiness, happiness) + "&limit=30";
}