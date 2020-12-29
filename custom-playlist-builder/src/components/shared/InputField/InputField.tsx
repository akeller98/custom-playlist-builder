import React, { useState, useEffect } from 'react';
import './InputField.css';

export function InputField(props: {onChange: (newTitle: string) => void, title: string}) {
    const [title, setTitle] = useState(props.title);

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
