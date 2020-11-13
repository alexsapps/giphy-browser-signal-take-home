import React from 'react';
import { useDispatch } from 'react-redux';
import { setQuery } from './searchBarSlice';
import styles from './SearchBar.module.css';

/** React component for the user to set or clear a search query. */
export function SearchBar() {
    const dispatch = useDispatch();
    const textboxRef = React.createRef<HTMLInputElement>();

    function onClick() {
        const query = textboxRef.current!.value.trim();
        dispatch(setQuery(query));
    }

    function onKeyUp(e: React.KeyboardEvent) {
        if(e.key === "Enter") {
            e.preventDefault();
            onClick();
        }
    }

    return (
        <div className={styles.searchBar}>
            <input type="text" placeholder="Search GIPHY" ref={textboxRef} onKeyUp={onKeyUp}></input>
            <button onClick={onClick}>Search</button>
        </div>
    );
}