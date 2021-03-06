import React, { useState, useEffect } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import * as genresInitialState from '../helpers/genreSelectInitialState.json';
import { GreenCheckbox }  from '../shared/GreenCheckbox';

export default function GenreSelector(props: {onChange: (newValue: any[]) => void}) {
    const [state, setState] = useState(genresInitialState.popular_genres)

    useEffect(() => {
        props.onChange(state)
    }, [state, props]);

    const handleChange = (event: { target: { checked: boolean; name: string; }; }) => {
        let updated_box = {id: event.target.name, checked: event.target.checked};
        let updated_state: { id: string; checked: boolean; }[] = [];
        state.map((genre) => {
            if (genre.id === event.target.name) {
                return updated_state.push(updated_box);
            } else {
                return updated_state.push(genre);
            }
        })
        setState(state => updated_state)
    }
    return (
        <React.Fragment>
            <FormGroup row>
                {state.map((genre, i) => {
                    return (
                        <FormControlLabel
                            control={<GreenCheckbox checked={genre.checked} onChange={handleChange} name={genre.id}/>}
                            label={genre.id}
                            key={i}
                        />
                    )
                })}
            </FormGroup>
        </React.Fragment>
    );
}