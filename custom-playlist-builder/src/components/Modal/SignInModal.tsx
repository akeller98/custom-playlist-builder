import React, { useState, useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import { GreenButton } from '../shared/GreenButton';
import * as config from '../../config/config.json';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '25%',
      backgroundColor: '#424242',
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      marginLeft: '38%',
      marginTop: '15%',
      color: 'white'
    },
    signInButton: {
      textAlign: 'center'
    },
    modalBody: {
      textAlign: 'center'
    }
  }),
);

export default function SignInModal(props: {isSignInVisible: boolean, setIsSignInVisible: (isVisible: boolean) => void}) {
  const classes = useStyles();
  const [open, setOpen] = useState(props.isSignInVisible);

  useEffect(() => {
    props.setIsSignInVisible(open);
  }, [open, props]);

  const handleClose = () => {
    setOpen(false);
  };

  const onClick = (event: any) => {
    event.preventDefault();
    window.location.href=config.signInURL;
  }

  return (
    <div>
      <Modal
        open={true}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.paper}>
          <Typography variant="h4">Uh oh!</Typography>
          <br />
          <div className={classes.modalBody}>
            <Typography id="simple-modal-description">
              Looks like your token expired. Please sign in again:
            </Typography>
          </div>
          <br />
          <div className={classes.signInButton}>
            <GreenButton variant="outlined" color="primary" onClick={onClick}>Sign In</GreenButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
