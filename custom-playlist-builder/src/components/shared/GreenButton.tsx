import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

export const GreenButton = withStyles((theme) => ({
  outlined: {
    color: '#52af77',
    borderColor: '#2c6e46',
    '&:hover': {
      borderColor: '#52af77'
    },
  },
}))(Button);