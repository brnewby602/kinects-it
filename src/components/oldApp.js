import React, { PropTypes } from 'react';
import { TitleBar } from './TitleBar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

/**
* This is an import the global styles sheet.
* Webpack combines this and ouputs as a unique stylesheet when run
*/
import '../assets/scss/app.scss';

export const App = (props) => (
  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
    <div className="app-container">
      <TitleBar />
      <div className="row medium-10 columns">
        {props.children}
      </div>
    </div>
  </MuiThemeProvider>
);

App.propTypes = {
  children: PropTypes.element,
  route: PropTypes.object,
};

