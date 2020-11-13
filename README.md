# Giphy Browser

## Remaining work

- `useInfiniteScrolling` needs to be simplified and verified for correctness in detecting when to load more images. Most
  importantly, must always fire when there are changes to any of the variables in the calculation to avoid erroneously
  indicating the end of results. For reusability, should work in `overflow:scroll` elements (not just `window`).
- Filter duplicate images across requests. Perhaps between requests, a popular trending gif would lower the rank of the
  rest of the gifs, meaning that on a subsequent request the first image served would be the same as the
  last image from the previous request.
- Optimize Redux selectors
- Scale full screen original image down if it doesn't fit on the screen, especially for mobile
- Reduce margins when screen size is small so multiple columns will display on mobile
- Disable scrolling while in full screen mode
- Automatic retries when failing to fetch from Giphy
- Ensure network requests have timeouts
- Move scroll & resize detection code into a higher-order component so the infinite gif scroller can focus on displaying gifs
- Cancel network requests when query changes
- Make lower-level components reusable by not tying them to absolute paths in the global redux state
- Integration smoke test
- Accessibility
- Fix atrocious aesthetics
- Use browser navigation to access previous searches
- Add button to clear search box and go back to trending view
- Pin search box to top of screen
- Add button to scroll to top
- Add button to copy link to current gif
- Make an app icon
- Add CSS animations
- Cache recent searches
- Predictive autofill for search
- Add sharing features
- Support for other Giphy media types
- Allow bookmarking / favoriting particular gifs
- Progressive web app for native feel and better offline access of cached content
- Support other languages
- Dark theme

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
