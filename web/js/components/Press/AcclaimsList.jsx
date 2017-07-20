import '@/less/Press/acclaims-list.less';

import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { AutoSizer, CellMeasurer, List } from 'react-virtualized';

import AcclaimsListItem from '@/js/components/Press/AcclaimsListItem.jsx';

class ConnectedAcclaimsList extends React.Component {
    componentWillMount() { this.props.fetchAcclaims(); }

    _renderAcclaimItem(key, index, style) {
        const acclaim = this.props.acclaims[index];
        return <AcclaimsListItem acclaim={acclaim} key={key} style={style} />;
    }

    cellItemRenderer({columnIndex, rowIndex}) {
        return this._renderAcclaimItem(rowIndex, rowIndex);
    }

    rowItemRenderer({key, index, isScrolling, isVisible, style}) {
        return this._renderAcclaimItem(key, index, style);
    }

    render() {
        const numRows = this.props.acclaims.length;
        return (
            <div className="acclaims-list">
                <AutoSizer disableWidth>
                    {
                        ({height, width}) => {
                            return (
                                <CellMeasurer
                                    cellRenderer={this.cellItemRenderer.bind(this)}
                                    columnCount={1}
                                    rowCount={numRows}
                                    width={width}
                                >
                                    {
                                        ({getRowHeight}) => (
                                            <List
                                                height={height}
                                                width={width}
                                                rowCount={numRows}
                                                rowHeight={getRowHeight}
                                                rowRenderer={this.rowItemRenderer.bind(this)}
                                            />
                                        )
                                    }
                                </CellMeasurer>
                            );
                        }
                    }
                </AutoSizer>
            </div>
        );
    }
}

function getAcclaims() {
    return axios.get('/api/acclaims');
}

const mapStateToProps = state => ({ acclaims: state.press_acclaimsList.acclaims });

const mapDispatchToProps = (dispatch) => ({
    fetchAcclaims: () => {
        dispatch({ type: 'PRESS--FETCHING_ACCLAIMS' });

        getAcclaims().then(
            (response) => dispatch({
                type: 'PRESS--FETCH_ACCLAIMS_SUCCESS',
                acclaims: response.data,
            })
        );
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedAcclaimsList);
