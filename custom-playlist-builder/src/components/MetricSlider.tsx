import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

function valuetext(value: number) {
    return `${value}°C`;
}

export default function MetricSlider(props: {name: string, onChange: (newValue: number) => void}) {
    const defaultVal = 20
    const [currValue, setCurrValue] = useState(defaultVal)

    useEffect(() => {
        props.onChange(currValue)
    }, [currValue])

    function handleChange(event: object, value: number | number[]) {
        if (typeof value == "number") {
            setCurrValue(value)
        }   
    }

    return (
        <React.Fragment>
            <Typography id="discrete-slider-always" gutterBottom>
                {props.name}
            </Typography>
            <Slider
                defaultValue={defaultVal}
                getAriaValueText={valuetext}
                aria-labelledby="discrete-slider-always"
                step={5}
                valueLabelDisplay="on"
                onChange={handleChange}
            />
        </React.Fragment>
    );
}