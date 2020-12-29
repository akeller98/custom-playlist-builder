import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';
import { GreenCheckbox } from '../shared/GreenCheckbox';
import './MetricSlider.css';

const GreenSlider = withStyles({
    root: {
      color: '#52af77',
    },
    thumb: {
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
  })(Slider);

function valuetext(value: number) {
    return `${value}`;
}

export default function MetricSlider(props: {name: string, onChange: (newValue: number, isEnabled: boolean) => void, initEnabled: boolean}) {
    const defaultVal = 20;
    const [currValue, setCurrValue] = useState(defaultVal);
    const [isEnabled, setIsEnabled] = useState(props.initEnabled);

    useEffect(() => {
        props.onChange(currValue, isEnabled)
    }, [currValue, isEnabled, props])

    function handleChange(event: object, value: number | number[]) {
        if (typeof value === "number") {
            setCurrValue(value)
        }   
    }

    const handleEnabledChange = (event: { target: { checked: boolean; name: string; }; }) => {
        setIsEnabled(event.target.checked);
    }

    return (
        <div className="slider-wrapper">
            <div className="slider-group">
                <div className="slider-title">
                    <Typography id="discrete-slider-always">
                        {props.name}
                    </Typography>
                </div>
                <div className="slider-checkbox">
                        <GreenCheckbox checked={isEnabled} onChange={handleEnabledChange}/>
                </div>
            </div>
            <div className="slider-control">
                <GreenSlider
                    defaultValue={defaultVal}
                    getAriaValueText={valuetext}
                    aria-labelledby="discrete-slider-always"
                    step={5}
                    valueLabelDisplay="on"
                    onChange={handleChange}
                    disabled={!isEnabled}
                />
            </div>
        </div>
    );
}