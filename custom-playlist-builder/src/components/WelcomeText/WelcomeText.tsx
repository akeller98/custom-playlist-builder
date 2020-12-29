import Typography from '@material-ui/core/Typography';
import { GreenButton } from '../shared/GreenButton';
import * as config from '../../config/config.json';
import './WelcomeText.css';

export function WelcomeText() {
    const onClick = (event: any) => {
        event.preventDefault();
        window.location.href=config.signInURL;
    }

    return (
        <div className="welcome-text">
            <Typography variant="h4">Welcome to Custom Playlist Builder!</Typography>
            <Typography variant="h6">Please sign in to Spotify</Typography>
            <br />
            <GreenButton variant="outlined" color="primary" onClick={onClick}>Sign In</GreenButton>
        </div>
    )
}