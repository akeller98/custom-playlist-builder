import React, { useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { AlertVariant, AlertMessage, AlertString } from '../helpers/AlertEnum';

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
      height: '2em',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
      zIndex: 100,
    },
}));

export function SnackbarNotif(props: {isOpen: boolean, message: string, onClose: (isClosed: boolean) => void}) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(props.isOpen);
    let severity: any = '';
    let alertString: string = '';

    useEffect(() => {
        props.onClose(!open);
    }, [open, props])

    if (props.message === AlertMessage.GenreError) {
        severity = AlertVariant.INSUFFICIENT_GENRES;
        alertString = AlertString.GenreError;
    } else if (props.message === AlertMessage.TokenError) {
        severity = AlertVariant.TOKEN_EXPIRED;
        alertString = AlertString.TokenError;
    } else {
        severity = AlertVariant.SAVE_SUCCESS;
        alertString = AlertString.SaveSuccess;
    }

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
    };
    return (
        <div className={classes.root}>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity}>
                    {alertString}
                </Alert>
            </Snackbar>
        </div>
    );
}