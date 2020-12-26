import React, {useState, useEffect, useRef} from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { ProgressBar } from '../shared/ProgressBar';

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
    },
    disabled: {
        color: '#bdbdbd',
        height: '1.5em',
        width: '1.5em'
    },
  }),
);

export default function SpotifyListItem(props: {key: any, track: any}) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [currTime, setCurrTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const audioEl: any = useRef(null);
    const classes = useStyles();
    const duration = 61;

    useEffect(() => {
        let interval: any = null;
        if (isPlaying && currTime !== duration) {
            interval = setInterval(() => {
                setCurrTime(currTime => currTime + 1);
              }, 500);
        } 
        else if (isPlaying && currTime === duration) {
            setIsPlaying(false);
            setCurrTime(0);
            clearInterval(interval);
            setIsActive(false);
        }
        else if (!isPlaying && currTime !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currTime])

    useEffect(() => {
        if (isPlaying && audioEl.current !== null) {
            audioEl.current.play();
        } else if(!isPlaying && audioEl.current !== null){
            audioEl.current.pause();
        }
    }, [isPlaying])

    useEffect(() => {
        setIsDisabled(props.track.preview_url === null);
    }, [isDisabled])

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
        } else {
            setIsPlaying(true)
            setIsActive(true);
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
                    {isActive &&
                        <ProgressBar variant="determinate" value={currTime * (100/duration)}/>
                    }
                    </React.Fragment>
                }
            />
            <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="play-pause-button" onClick={onPlayPauseClick} disabled={isDisabled}>
                    {!isPlaying && 
                        <PlayCircleOutlineIcon className={isDisabled ? classes.disabled : classes.playPause}/>
                    }
                    {isPlaying &&
                        <PauseCircleOutlineIcon className={classes.playPause} />
                    }
                </IconButton>
                <audio ref={audioEl} src={props.track.preview_url} />
            </ListItemSecondaryAction>
        </ListItem>
    )
}