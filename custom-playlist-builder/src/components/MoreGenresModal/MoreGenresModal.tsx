import React, { useState, useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import * as genresInitialState from '../helpers/genreSelectInitialState.json';
import { FormControlLabel, FormGroup } from '@material-ui/core';
import { GreenCheckbox } from '../shared/GreenCheckbox';
import { GreenButton } from '../shared/GreenButton';
import './MoreGenresModal.css';

export default function MoreGenresModal(props: {onChange: (newValue: any[]) => void}) {
  const [state, setState] = useState(genresInitialState.genres);
  const [search, setSearch] = useState('');
  const [anchorState, setAnchorState] = useState(false)
  const [moreGenreCount, setMoreGenreCount] = useState(0);

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      list: {
        width: '30em',
        backgroundColor: '#0d1117',
        height: search === '' ? '' : '100%'
      },
      boxes: {
        color: 'white',
      },
      genreList: {
        padding: '5%',
        backgroundColor: '#0d1117',
      },
      search: {
        position: 'sticky',
        top: 0,
        backgroundColor: '#0d1117',
        boxSizing: 'border-box',
        paddingTop: '2em',
        zIndex: 100,
        marginLeft: '1em'
      },
      closeButton: {
        color: 'white'
      }
    }),
  );
  const classes = useStyles();

  useEffect(() => {
    props.onChange(state)
  }, [state, props]);

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    setAnchorState(open);
  };

  const handleSearchChange = (event: any) => {
    setSearch(event.target.value);
  }

  const handleChange = (event: { target: { checked: boolean; name: string; }; }) => {
    let updated_box = {id: event.target.name, checked: event.target.checked};
    let updated_state: { id: string; checked: boolean; }[] = [];
    if (event.target.checked) {
      setMoreGenreCount(moreGenreCount + 1);
    } else {
      setMoreGenreCount(moreGenreCount - 1);
    }
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
    <div>  
      <React.Fragment key={'left'}>       
        <div className="more-genres-modal">
          <GreenButton variant="outlined" color="primary" onClick={toggleDrawer(true)}>{`More Genres ${moreGenreCount !== 0 ? `+${moreGenreCount}` : ''}`}</GreenButton>
          <SwipeableDrawer
            anchor={'left'}
            open={anchorState}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
          >
            <div
              className={classes.list}
              role="presentation"
            >
              <div className={classes.search}>
                <input type='text' placeholder="Search Genre" className="text-input" value={search} onChange={handleSearchChange}/>
                <IconButton edge="end" className={classes.closeButton} aria-label="close-buton" onClick={toggleDrawer(false)}>
                  <CloseIcon />
                </IconButton>
              </div>
              <FormGroup row className={classes.genreList}>
                  {state.filter((g) => {
                    if (search === '') {
                      return g
                    }
                    return g.id.match(search)
                  }).map((genre, i) => {
                      return (
                        <FormControlLabel
                            control={<GreenCheckbox checked={genre.checked} name={genre.id} onChange={handleChange}/>}
                            label={genre.id}
                            key={i}
                            className={classes.boxes}
                        />
                      )
                  })}
              </FormGroup>
            </div>
          </SwipeableDrawer>
        </div>
      </React.Fragment>      
    </div>
  );
}
