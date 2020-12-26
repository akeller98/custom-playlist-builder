import React, {useState, useEffect, useRef} from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
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
    playPause: {
        color: '#1DB954',
        height: '1.5em',
        width: '1.5em'
    }
  }),
);

export default function SpotifyListItem(props: {key: any, track: any}) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioEl: any = useRef(null);
    const classes = useStyles();

    useEffect(() => {
        if (isPlaying && audioEl.current !== null) {
            audioEl.current.play();
        } else if(!isPlaying && audioEl.current !== null){
            audioEl.current.pause();
        }
    })

    const getArtists = () => {
        let artist_list: any[] = [];
        props.track.artists.map((artist: any) => {
            artist_list.push(artist.name);
        })
        return artist_list.join(', ');
    }

    const onPlayPauseClick = () => {
        if (isPlaying) {
            setIsPlaying(false)
            console.log('pause')
        } else {
            setIsPlaying(true)
            console.log('play')
        }
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
                        {props.track.album.name}
                        <br/>
                        {getArtists()}
                        
                    </Typography>
                    </React.Fragment>
                }
            />
            {props.track.preview_url &&
                <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="play-pause-button" onClick={onPlayPauseClick}>
                    <PlayCircleOutlineIcon className={classes.playPause}/>
                </IconButton>
                <audio ref={audioEl} src={props.track.preview_url} />
                </ListItemSecondaryAction>
            }
        </ListItem>
    )
}