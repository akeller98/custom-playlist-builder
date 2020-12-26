import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

export const ProgressBar = withStyles((theme: Theme) =>
  createStyles({
    root: {
        width: '100%',
        marginTop: '0.5em',
    },
    colorPrimary: {
      backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
      backgroundColor: '#1DB954',
    },
  }),
)(LinearProgress);