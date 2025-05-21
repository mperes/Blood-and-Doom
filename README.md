# Blood and Doom

This is the character sheet for Blood and Doom, created by Miguel Peres on behalf of the publisher, Dicetale Games.

## Developing

You need to have `nodejs` and `npm` installed.

Then, run `npm install` in this folder to install dependencies.

With dependencies installed you can run `npm run build` to build the project or `npm run dev` to continually build every time you change a source file.

The build output can be found in `build/`

## Structure

You can see in `src/index.pug` where the other pug files are included. They are mostly split by sheet location.

All the TypeScript files in `src/ts` are concatenated together and then placed into a worker script in the sheet html. The typescript files are mostly organised by function.

`styles.scss` is transpiled into pure CSS.

## Changelog

### 1.0.0

-   Initial release of the sheet.
    -   Full support for all necessary information during play.
