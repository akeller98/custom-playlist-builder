import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    inline: {
      display: 'inline',
      color: '#1DB954'
    },
    albumImage: {
        objectFit: 'contain',
        width: '5em',
        marginRight: '1em',
    },
  }),
);

export default function SpotifyListItem(props: {track: any}) {
    const classes = useStyles();
    const img_src = props.track.album.images[0].url;

    const getArtists = () => {
        let artist_list: any[] = [];
        props.track.artists.map((artist: any) => {
            artist_list.push(artist.name);
        })
        return artist_list.join(', ');
    }

    return (
        <ListItem button={true} alignItems="flex-start">
            <img src={props.track.album.images[0].url} className={classes.albumImage}/>
            <ListItemText
                primary={props.track.name}
                secondary={
                    <React.Fragment>
                    <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                    >
                        {getArtists()}
                    </Typography>
                    </React.Fragment>
                }
            />
        </ListItem>
    )
}