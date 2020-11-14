import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeFullScreen, selectFullScreenGifId } from './fullScreenGifSlice';
import styles from './FullScreenGif.module.css';
import { RootState } from '../../app/store';
import { FullScreen } from './FullScreen';

function selectGifFromId(gifId: string) {
    return (state: RootState) => {
        const index = state.infiniteGifScroller.gifIndex[gifId];
        return state.infiniteGifScroller.gifs[index];
    };
}

export function FullScreenGif() {
    const dispatch = useDispatch();
    
    function onClick() {
        dispatch(closeFullScreen());
    }

    const gifId = useSelector(selectFullScreenGifId);
    const gif = useSelector(selectGifFromId(gifId!));
    const gifImage = gif.originalImage;
    const imageStyle = {
        width: gifImage.width,
        height: gifImage.height,
    }
    const containerStyle = {
        width: gifImage.width,
    }

    return (
        <FullScreen onClick={onClick}>
            <div className={styles.centerOnScreen}>
                <div style={containerStyle}>
                    <img src={gifImage.url} style={imageStyle} alt={gif.title} />
                </div>
            </div>
        </FullScreen>
    );
}