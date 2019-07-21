import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import FileList from './FileList';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
    },
    typography: {},
});

/**
 * The App react component.
 */
class App extends Component {
    public displayName: string = App.name;

    render(): JSX.Element {
        return (
            <MuiThemeProvider theme={theme}>
                <FileList />
            </MuiThemeProvider>
        );
    }
}

export default App;
