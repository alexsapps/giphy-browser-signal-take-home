import React from 'react';
import { SearchBar } from './features/search-box/SearchBar';
import { InfiniteGifScroller } from './features/infinite-gif-scroller/InfiniteGifScroller';
import './App.css';
import { isFullScreenMode } from './features/full-screen-gif/fullScreenGifSlice';
import { useSelector } from 'react-redux';
import { FullScreenGif } from './features/full-screen-gif/FullScreenGif';

function App() {
  const isFullScreen = useSelector(isFullScreenMode);

  return (
    <div className="App">
      <SearchBar />
      <InfiniteGifScroller scrollElement={document.documentElement} />
      {isFullScreen ? <FullScreenGif></FullScreenGif> : null}
    </div>
  );
}

export default App;
