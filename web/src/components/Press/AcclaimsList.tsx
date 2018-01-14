import 'less/Press/acclaims-list.less';

import * as React from 'react';
import { connect } from 'react-redux';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';
import { List, ListRowRenderer } from 'react-virtualized/dist/es/List';

import { createFetchAcclaimsAction } from 'src/components/Press/actions';

import { AcclaimItemShape } from 'src/components/Press/types';
import { GlobalStateShape } from 'src/types';

import AcclaimsListItem from 'src/components/Press/AcclaimsListItem';

const cache = new CellMeasurerCache({ fixedWidth: true });

interface AcclaimsListStateToProps {
    readonly acclaims: AcclaimItemShape[];
}

interface AcclaimsListDispatchToProps {
    readonly createFetchAcclaimsAction: () => void;
}

type AcclaimsListProps = AcclaimsListStateToProps & AcclaimsListDispatchToProps;

class AcclaimsList extends React.Component<AcclaimsListProps> {
    componentWillMount() {
        this.props.createFetchAcclaimsAction();
    }

    render() {
        const numRows = this.props.acclaims.length;
        return (
            <div className="acclaims-list">
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
                parent={parent as any}
            >
                {() => this.renderAcclaimItem(key, index, style)}
            </CellMeasurer>
        );
    }
}

const mapStateToProps = (state: GlobalStateShape): AcclaimsListStateToProps => ({
    acclaims: state.press_acclaimsList.items,
});

const mapDispatchToProps: AcclaimsListDispatchToProps = {
    createFetchAcclaimsAction,
};

export default connect<AcclaimsListStateToProps, AcclaimsListDispatchToProps>(
    mapStateToProps,
    mapDispatchToProps,
)(AcclaimsList);
