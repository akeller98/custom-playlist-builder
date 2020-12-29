import queryBuilder from '../helpers';

export const getUserData = async (parsed: string): Promise<any> => {
    const res = await fetch('https://api.spotify.com/v1/me', {
        headers: {'Authorization': 'Bearer ' + parsed}
    });
    return await res.json();
}

export const getPlaylist = async (accessToken: string,
                                selectedGenres: any[],
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
                                ): Promise<any> => {
    const res = await fetch(queryBuilder(selectedGenres, 
                                        isPopularity, 
                                        popularity,
                                        isEnergy,
                                        energy,
                                        isInstrumentalness,
                                        instrumentalness,
                                        isAcousticness,
                                        acousticness,
                                        isHappiness,
                                        happiness
                                        ), {
        headers: {'Authorization': 'Bearer ' + accessToken}
    });
    return await res.json();
}

export const createPlaylist = async (accessToken: string, id: string, playlistTitle: string): Promise<any> => {
    const res = await fetch(`https://api.spotify.com/v1/users/${id}/playlists`, {
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
    });
    return await res.json();
}

export const addToPlaylist = async (accessToken: string, playlistId: string, uris: string[]) => {
    const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Accept': 'application/json'
        },
        method: 'post',
        body: JSON.stringify({
          uris: uris
        })
    });
    return await res.json();
}
