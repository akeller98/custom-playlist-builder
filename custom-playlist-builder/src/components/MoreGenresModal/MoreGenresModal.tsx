import React, { useState, useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import * as genresInitialState from '../helpers/genreSelectInitialState.json';
import clsx from 'clsx';
import './MoreGenresModal.css';
import { FormControlLabel, FormGroup } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { GreenCheckbox } from '../shared/GreenCheckbox';
import { GreenButton } from '../shared/GreenButton';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function MoreGenresModal(props: {onChange: (newValue: any[]) => void}) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(genresInitialState.genres);
  const [search, setSearch] = useState('');
  const [clickedAway, setClickedAway] = useState(false);
  const [anchorState, setAnchorState] = React.useState({
    left: false,
  });
  const [moreGenreCount, setMoreGenreCount] = useState(0);

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      list: {
        width: '30em',
        backgroundColor: '#0d1117',
        height: search === '' ? '' : '100%'
      },
      fullList: {
        width: 'auto',
        backgroundColor: '#0d1117',
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
    }),
  );
  const classes = useStyles();

  useEffect(() => {
    props.onChange(state)
  }, [state, props]);

  useEffect(() => {
    if (clickedAway) {
      setOpen(false);
    }
  }, [clickedAway])

  const handleClickAway = () => {
    setClickedAway(true);
    toggleDrawer('left', false)
  }

  const toggleDrawer = (anchor: Anchor, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (open && !clickedAway) {
      setAnchorState({ ...anchorState, [anchor]: open });
    } else {
      setAnchorState({ ...anchorState, [anchor]: open });
    }
    
  };

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

  const list = (anchor: Anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
    >
      <div className={classes.search}>
        <input type='text' placeholder="Search Genre" className="text-input" value={search} onChange={handleSearchChange}/>
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
  );

  const handleSearchChange = (event: any) => {
    setSearch(event.target.value);
  }

  return (
    <div>
      
        <React.Fragment key={'left'}>
        <ClickAwayListener onClickAway={handleClickAway}>
          <div className="more-genres-modal">
            <GreenButton variant="outlined" color="primary" onClick={toggleDrawer('left', true)}>{`More Genres ${moreGenreCount !== 0 ? `+${moreGenreCount}` : ''}`}</GreenButton>
            <SwipeableDrawer
              anchor={'left'}
              open={anchorState['left']}
              onClose={toggleDrawer('left', false)}
              onOpen={toggleDrawer('left', true)}
            >
              {list('left')}
          </SwipeableDrawer>
          </div>
        </ClickAwayListener>
        </React.Fragment>
      
    </div>
  );
}
