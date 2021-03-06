# Giphy Browser

## Trade-offs and design decisions

- The component for displaying GIFs with infinitely scrolling lets its own height grow as needed and causes its containers’ content to overflow, rather than putting the scrollbar on itself and allowing/requiring the parent component to set the height. This decision made the component more error prone and complex to use in the general case (requiring the parent to pass in the proper scrollable ancestral element, in this case `document.documentElement`), but fulfills its current mission very simply (no need to calculate the desired height to fill the screen) and it is uncertain what properties will be desired when we want to use it differently later.
- The logic to prevent duplicate requests while scrolling is handled in the slice. As React’s strict mode taught me, rendering may be interrupted and restarted, so we can’t rely on the component’s state to remember old requests. Intuitively, it’s the fault of the component that multiple requests could be made at once, so allowing one request globally for this slice seems needlessly rigid and hinders reuse. At the same time, since the slice is tied to the one component instance anyway, this global restriction is simpler than writing checks at every call site.
- The logic to detect whether it is necessary to fetch more gifs to fill the screen is not in a Redux reducer because it only depends on the state of the DOM which is not something that can be moved to the store, only synced with the store. With syncing of course there is the potential for the data to go out of sync. Not putting code in the reducer however tends to make it less testable, so I was just sure to split it out and test it. It also means if the state were to be saved in the browser history, the scroll position would be lost, but that's probably for the best since the latest results may change frequently.
- I built an index from Gif ID to its index in the search results array to find more info on the selected Gif in the full screen display. This seems overly complicated now as the necessary information about the selected Gif could’ve been duplicated in the global state so no lookup would’ve been necessary, but the Redux style guide recommends normalizing data. Copying the data could mean we’d have to write more complex logic or make extra code changes later if we needed to update data associated with a GIF while the full screen display was open. (On second thought, that sounds particularly unlikely and probably wouldn’t matter unless state data led to a crash.) Also, the index is likely to be useful in the future, and passing GIF objects rather than just an ID is a taller requirement on client code that might constrain future changes.
- I made reducer unit tests more verbose so I could type-check the initial and expected states. (They’re more verbose because type-checking inline object literals isn’t supported in TypeScript: https://github.com/microsoft/TypeScript/issues/7481)


## Remaining work

- Unit test React components (Redux slices, Giphy API wrapper are unit tested), and integration smoke test
- `useInfiniteScrolling` needs to be simplified and verified for correctness in detecting when to load more images. Most
  importantly, must always fire when there are changes to any of the variables in the calculation to avoid erroneously
  indicating the end of results. For reusability, should work in `overflow:scroll` elements (not just `window`).
  Consider using the IntersectionObserver Web API.
- Filter duplicate images across requests. An image might appear twice in search results when they are reordered in rank
  during the time in between requests; for example, an image that suddenly becomes the most popular trending image may
  cause the last image of the previous request to be the first one served on the next request.
- Use browser navigation to access previous searches
- Consider temporarily removing items from the DOM when scrolling down far to prevent too many DOM nodes being loaded
  in the document, if performance tests indicate this is necessary.
- Consider optimizing Redux selectors if performance tests are poor on mobile
- Scale full screen original image down if it doesn't fit on the screen, especially for mobile
- Reduce margins when screen size is small so multiple columns will display on mobile
- Disable scrolling while in full screen mode
- Automatic retries when failing to fetch from Giphy
- Ensure network requests have timeouts
- Cancel rather than ignore pending network requests when query changes
- Make lower-level components reusable by not tying them to absolute paths in the global redux state (if that's possible
  idiomatically for Redux apps)
- Accessibility, dark theme
- Make images stack vertically independently of other columns, rather than align in a grid, as the official Giphy
  website does
- Add button to clear search box and go back to trending view
- Pin search box to top of screen
- Add button to scroll to top
- Add button to copy link to current gif
- Add branding, CSS animations, fix atrocious aesthetics
- Cache recent searches, button to save images for offline access
- Progressive web app for native feel and better offline access of cached content
- Predictive autofill for search
- Add sharing features
- Support for other Giphy media types
- Allow bookmarking / favoriting particular gifs
- Support other spoken languages

## Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
