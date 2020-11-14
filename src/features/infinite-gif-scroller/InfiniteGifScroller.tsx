import React from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { SingleGifView } from './SingleGifView';
import styles from './InfiniteGifScroller.module.css';
import { fetchGifsAsync, selectGifs, selectErrorLoadingGifs, selectIsLoading, selectIsMore } from './infiniteGifScrollerSlice';
import { useInfiniteScrolling } from './useInfiniteScrolling';

/**
 * Component for infinite scrolling through images.
 * 
 * The component accepts a "scrollElement" prop which must be set to the nearest
 * ancestor HTML element that scrolls when its content overflows. This is the
 * element that the user will scroll in as this component grows its height
 * continuously.
 */
export function InfiniteGifScroller(props: { scrollElement: HTMLElement }) {
    const dispatch = useAppDispatch();
    const containerRef = React.createRef<HTMLDivElement>();

    const gifs = useSelector(selectGifs);
    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectErrorLoadingGifs);
    const isMore = useSelector(selectIsMore);

    function loadMore() {
        if (isLoading || error !== null || !isMore) return;

        dispatch(fetchGifsAsync({}));
    }

    useInfiniteScrolling(containerRef, props.scrollElement, loadMore);

    let errorDisplay: React.ReactNode | null = null;
    if (error !== null) {
        errorDisplay = (
            <>
                <p>Error: {error.message}</p>
                <button onClick={() => dispatch(fetchGifsAsync({}))}>
                    Retry
                </button>
            </>
        );
    }

    return (
        <div className={styles.resultsView} ref={containerRef}>
            <div className={styles.gifsCollection}>
                { gifs.map(gif => 
                    <div className={styles.gif} key={gif.id}>
                        <SingleGifView gif={gif}></SingleGifView>
                    </div>
                )}
            </div>
            {errorDisplay}
            {isLoading ? <p>Loading...</p> : null}
        </div>
    );
}