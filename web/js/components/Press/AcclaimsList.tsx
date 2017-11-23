import 'less/Press/acclaims-list.less';

import * as React from 'react';
import { connect } from 'react-redux';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, ListRowRenderer } from 'react-virtualized';

import { createFetchAcclaimsAction } from 'js/components/Press/actions';

import { AcclaimItemShape } from 'js/components/Press/types';
import { GlobalStateShape } from 'js/types';

import AcclaimsListItem from 'js/components/Press/AcclaimsListItem';

const cache = new CellMeasurerCache({ fixedWidth: true });

interface AcclaimsListStateToProps {
    acclaims: AcclaimItemShape[];
}

interface AcclaimsListDispatchToProps {
    createFetchAcclaimsAction: () => void;
}

type AcclaimsListProps = AcclaimsListStateToProps & AcclaimsListDispatchToProps;

class AcclaimsList extends React.Component<AcclaimsListProps> {
    componentWillMount() {
        this.props.createFetchAcclaimsAction();
    }

    render() {
        const numRows = this.props.acclaims.length;
        return (
            <div className='acclaims-list'>
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            height={height}
                            width={width}
                            rowCount={numRows}
                            rowHeight={cache.rowHeight}
                            deferredMeasurementCache={cache}
                            rowRenderer={this.rowItemRenderer}
                        />
                    )}
                </AutoSizer>
            </div>
        );
    }

    private renderAcclaimItem = (key: number | string, index: number, style: React.CSSProperties) => {
        const acclaim = this.props.acclaims[index];
        return <AcclaimsListItem acclaim={acclaim} key={key} style={style} />;
    }

    private rowItemRenderer: ListRowRenderer = ({key, index, parent, style}) => {
        return (
            <CellMeasurer
                cache={cache}
                key={key}
                columnIndex={0}
                rowIndex={index}
                parent={parent}
            >
                {() => this.renderAcclaimItem(key, index, style)}
            </CellMeasurer>
        );
    }
}

const mapStateToProps = (state: GlobalStateShape) => ({
    acclaims: state.press_acclaimsList.items,
});

export default connect<AcclaimsListStateToProps, AcclaimsListDispatchToProps, void>(
    mapStateToProps,
    { createFetchAcclaimsAction },
)(AcclaimsList);
