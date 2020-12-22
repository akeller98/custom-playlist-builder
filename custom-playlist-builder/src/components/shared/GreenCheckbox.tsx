import React from 'react';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';

export const GreenCheckbox = withStyles({
    root: {
      color: '#1DB954',
      '&$checked': {
        color: '#1DB954',
      },
    },
    checked: {},
  })((props: CheckboxProps) => <Checkbox color="default" {...props} />);
