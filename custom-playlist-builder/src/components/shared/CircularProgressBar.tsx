import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

export const CircularProgressBar = withStyles((theme: Theme) =>
  createStyles({
    root: {
        color: '#1DB954',
    },
  }),
)(CircularProgress);