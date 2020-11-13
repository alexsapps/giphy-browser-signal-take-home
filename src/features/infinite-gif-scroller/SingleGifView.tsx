import React from 'react';
import { useDispatch } from 'react-redux';
import { GIF } from '../../app/gifType';
import { showFullScreen } from '../full-screen-gif/fullScreenGifSlice';

/** Component for displaying a single GIF. */
export function SingleGifView(props: { gif: GIF}) {
    const dispatch = useDispatch();

    const image = props.gif.fixedWidthImage;

    const imgStyle = {
        width: image.width,
        height: image.height
    };
    const containerStyle = {
        width: image.width
    };

    function onClick() {
        dispatch(showFullScreen(props.gif.id));
    }

    return (
        <div style={containerStyle} onClick={onClick}>
            <img src={image.url} style={imgStyle} alt={props.gif.title}></img>
            <p>{props.gif.title}</p>
        </div>
    );
}