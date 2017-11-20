import 'less/Press/acclaims-list.less';

import React from 'react';
import { connect } from 'react-redux';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized';
import { createFetchAcclaimsAction } from 'js/components/Press/actions.js'

import AcclaimsListItem from 'js/components/Press/AcclaimsListItem.jsx';

const cache = new CellMeasurerCache({ fixedWidth: true });

class ConnectedAcclaimsList extends React.Component {
    componentWillMount() { this.props.createFetchAcclaimsAction(); }

    _renderAcclaimItem = (key, index, style, measure) => {
        const acclaim = this.props.acclaims[index];
        return <AcclaimsListItem acclaim={acclaim} key={key} style={style} measure={measure}/>;
    };

    rowItemRenderer = ({key, index, isScrolling, isVisible, parent, style}) => {
        return (
            <CellMeasurer
                cache={cache}
                key={key}
                columnIndex={0}
                rowIndex={index}
                parent={parent}
            >
                {({ measure }) => this._renderAcclaimItem(key, index, style, measure)}
            </CellMeasurer>
        );
    };

    render() {
        const numRows = this.props.acclaims.length;
        return (
            <div className="acclaims-list">
                <AutoSizer>
                    {
                        ({ height, width }) => (
                            <List
                                height={height}
                                width={width}
                                rowCount={numRows}
                                rowHeight={cache.rowHeight}
                                deferredMeasurementCache={cache}
                                rowRenderer={this.rowItemRenderer}
                            />
                        )
                    }
                </AutoSizer>
            </div>
        );
    }
}

const mapStateToProps = state => ({ acclaims: state.press_acclaimsList.items });

export default connect(
    mapStateToProps,
    { createFetchAcclaimsAction }
)(ConnectedAcclaimsList);
