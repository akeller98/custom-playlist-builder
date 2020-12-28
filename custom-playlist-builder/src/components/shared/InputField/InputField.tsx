import React from 'react';
import './InputField.css';

export function InputField() {
    return (
        <form noValidate>
            <input placeholder="Name your playlist" className={"text-input"}/>
        </form>
    )
}
