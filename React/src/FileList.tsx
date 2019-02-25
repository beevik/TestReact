import React, { Component, MouseEvent } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import { WithStyles, createStyles } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { Set } from 'immutable';

/**
 * Custom styles for the elements of the FileList.
 */
const styles = (theme: Theme) => createStyles({
    root: {
        margin: '1em 1em',
        minWidth: '900px',
    },
    table: {
        margin: '0em 0em',
    },
    progress: {
        flexGrow: 1,
    },
    error: {
        padding: '1em 1em',
        margin: 'auto',
        textAlign: 'center',
        color: theme.palette.error.main,
    }
});

/**
 * A music file returned by the server.
 */
interface File {
    id: number;
    fileName: string;
    songTitle: string;
    artistName: string;
    albumName: string;
    trackNumber: number;
    year: number;
}

/**
 * The loading state of the FileList.
 */
enum LoadState {
    Loading,
    Loaded,
    Failed,
}

/**
 * The FileList react component's properties.
 */
interface Props extends WithStyles<typeof styles> {
}

/**
 * The FileList react component's state.
 */
interface State {
    files: Array<File>;
    loadState: LoadState;
    selection: Set<number>;
    idCounter: number;
}

/**
 * The FileList react component.
 */
class FileList extends Component<Props, State> {
    public displayName: string = FileList.name;

    /**
     * Construct a new FileList component in the loading state.
     */
    constructor(props: Props) {
        super(props);
        this.state = {
            files: [],
            loadState: LoadState.Loading,
            selection: Set<number>(),
            idCounter: 1,
        };
    }

    /**
     * When the component is mounted, asynchronously load its file data from
     * the server.
     */
    async componentDidMount(): Promise<void> {
        try {
            const response = await fetch('/api/files');
            if (!response.ok) {
                throw Error(response.statusText);
            }

            const files = await response.json() as Array<File>;

            this.setState(state => {
                return {
                    files: files.map((f, index) => ({ ...f, id: index + state.idCounter })),
                    loadState: LoadState.Loaded,
                    idCounter: state.idCounter + files.length
                };
            });
        }
        catch (error) {
            this.setState({ loadState: LoadState.Failed });
            console.log(error);
        }
    }

    /**
     * Render the FileList component.
     */
    render(): JSX.Element {
        switch (this.state.loadState) {
            case LoadState.Loaded:
                return this.renderLoaded(this.state.files);
            case LoadState.Loading:
                return this.renderLoading();
            default:
                return this.renderFailed();
        }
    }

    /**
     * Render the table in its 'loading' state.
     */
    private renderLoading(): JSX.Element {
        const { classes } = this.props;
        return this.renderTable(
            <TableBody />,
            <LinearProgress className={classes.progress} />);
    }

    /**
     * Render the table in its 'loaded' state.
     *
     * @param files The array of files to render to the table.
     */
    private renderLoaded(files: File[]): JSX.Element {
        const body = (
            <TableBody>
                {files.map(file => (
                    <TableRow key={file.id} onClick={e => this.handleRowClick(e, file)}>
                        <TableCell padding="checkbox">
                            <Checkbox checked={this.isSelected(file)} />
                        </TableCell>
                        <TableCell component="th" scope="row">{file.fileName}</TableCell>
                        <TableCell align="left">{file.songTitle}</TableCell>
                        <TableCell align="left">{file.artistName}</TableCell>
                        <TableCell align="left">{file.albumName}</TableCell>
                        <TableCell align="left">{file.trackNumber}</TableCell>
                        <TableCell align="left">{file.year}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        );
        return this.renderTable(body);
    }

    /**
     * Render the table in its 'failed' state.
    */
    private renderFailed(): JSX.Element {
        const { classes } = this.props;
        const message = (
            <Paper className={classes.error}>
                Failed to load the table.
            </Paper>
        )
        return this.renderTable(<TableBody />, message);
    }

    /**
     * Render the table's content using a template. The template includes the
     * table body content and an optional 'append' element, which is displayed
     * below the table.
     *
     * @param body The TableBody content.
     * @param append The optional appended element.
     */
    private renderTable(body: JSX.Element, append?: JSX.Element): JSX.Element {
        const { classes } = this.props;
        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <colgroup>
                        <col style={{ width: '5%' }} />
                        <col style={{ width: '25%' }} />
                        <col style={{ width: '30%' }} />
                        <col style={{ width: '15%' }} />
                        <col style={{ width: '15%' }} />
                        <col style={{ width: '5%' }} />
                        <col style={{ width: '5%' }} />
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox"></TableCell>
                            <TableCell>Filename</TableCell>
                            <TableCell align="left">Song</TableCell>
                            <TableCell align="left">Artist</TableCell>
                            <TableCell align="left">Album</TableCell>
                            <TableCell align="left">Track</TableCell>
                            <TableCell align="left">Year</TableCell>
                        </TableRow>
                    </TableHead>
                    {body}
                </Table>
                {append}
            </Paper>
        );
    }

    /**
     * Return true if the file is currently selected.
     *
     * @param file The file in question.
     */
    private isSelected(file: File) {
        return this.state.selection.contains(file.id);
    }

    /**
     * Handle a click on a file in the table.
     *
     * @param evt The mouse event.
     * @param file The file that was clicked.
     */
    private handleRowClick(evt: MouseEvent, file: File) {
        this.setState(state => {
            const { selection } = state;

            // Toggle the selection of the clicked file.
            let newSelection: Set<number>;
            if (selection.contains(file.id)) {
                newSelection = selection.remove(file.id);
            } else {
                newSelection = selection.add(file.id);
            }

            return { selection: newSelection };
        });
    }
}

export default withStyles(styles)(FileList);
