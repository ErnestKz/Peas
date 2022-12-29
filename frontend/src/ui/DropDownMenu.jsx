import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';


const DropDownMenu = ({ onChange, activeOption, possibleOptions, renderOptionFn }) => {
    const options = possibleOptions.map( option => {
	return (<option value={option}> { renderOptionFn(option) } </option>)
    });
    
    return (
	<select id="lang" onChange={onChange} value={activeOption}>
            { options }
	</select>);
};


export { DropDownMenu };
