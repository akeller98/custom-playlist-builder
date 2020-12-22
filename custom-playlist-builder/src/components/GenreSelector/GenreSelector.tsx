import React, { useState, useEffect } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import * as genres from '../helpers/genres.json';
import * as genresInitialState from '../helpers/genreSelectInitialState.json';
import { GreenCheckbox }  from '../shared/GreenCheckbox';

export default function GenreSelector(props: {onChange: (newValue: any[]) => void}) {
    //const [state, setState] = useState(genresInitialState.popular_genres)
    const [state, setState] = useState([
        {id: "pop", checked: false}, 
        {id: "hip-hop", checked: false}, 
        {id: "rock", checked: false}, 
        {id: "edm", checked: false}, 
        {id: "indie", checked: false}, 
        {id: "k-pop", checked: false}, 
        {id: "country", checked: false}, 
        {id: "classical", checked: false}, 
    ]);

    useEffect(() => {
        props.onChange(state)
    }, [state]);

    const handleChange = (event: { target: { checked: boolean; name: string; }; }) => {
        let updated_box = {id: event.target.name, checked: event.target.checked};
        let updated_state: { id: string; checked: boolean; }[] = [];
        state.map((genre) => {
            if (genre.id === event.target.name) {
                updated_state.push(updated_box);
            } else {
                updated_state.push(genre);
            }
        })
        setState(state => updated_state)
    }
    return (
        <React.Fragment>
            <FormGroup row>
                {state.map((genre) => {
                    return (
                        <FormControlLabel
                            control={<GreenCheckbox checked={genre.checked} onChange={handleChange} name={genre.id}/>}
                            label={genre.id}
                        />
                    )
                })}
            </FormGroup>
        </React.Fragment>
    );
}