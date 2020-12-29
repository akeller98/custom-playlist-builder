import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import SpotifyListItem from '../SpotifyListItem/SpotifyListItem';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: '#161b22',
    },
  }),
);

export default function SpotifyList(props: {tracks: object[], onChange: (newVisible: boolean) => void}) {
    const classes = useStyles();

    return (
        <List className={classes.root}>
            {props.tracks.map((track, i) => {
                return (
                    <SpotifyListItem key={i} track={track} index={i} onChange={props.onChange}/>
                )
            })}
        </List>
    )
}