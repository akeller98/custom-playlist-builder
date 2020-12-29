import React, { useState, useEffect } from 'react';
import './InputField.css';

export function InputField(props: {onChange: (newTitle: string) => void}) {
    const [title, setTitle] = useState("Untitled-playlist-1");

    useEffect(() => {
        props.onChange(title);
    }, [title, props])

    const handleChange = (event: any) => {
        setTitle(event.target.value);
    }

    return (
        <input type='text' placeholder="Title your playlist" className={"text-input"} onChange={handleChange} value={title}/>
    )
}
