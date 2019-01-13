import * as React from 'react';

import { css } from '@emotion/core';
import { connect } from 'react-redux';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';
import { List, ListRowRenderer } from 'react-virtualized/dist/es/List';

import { createFetchAcclaimsAction } from 'src/components/About/Press/actions';

import { AcclaimItemShape } from 'src/components/About/Press/types';
import { GlobalStateShape } from 'src/types';

import AcclaimsListItem from 'src/components/About/Press/AcclaimsListItem';
import { screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';

interface AcclaimsListStateToProps {
    readonly acclaims: AcclaimItemShape[];
}

interface AcclaimsListDispatchToProps {
    readonly createFetchAcclaimsAction: typeof createFetchAcclaimsAction;
}

type AcclaimsListProps = (
    AcclaimsListStateToProps
    & AcclaimsListDispatchToProps
    & {
        className?: string;
        isMobile?: boolean;
    }
);

const listStyle = css({
    [screenXSorPortrait]: {
        paddingTop: navBarHeight.mobile,
    },
});

class AcclaimsList extends React.Component<AcclaimsListProps> {
    cache = new CellMeasurerCache({ fixedWidth: true });

    componentDidMount() {
        this.props.createFetchAcclaimsAction();
    }

    componentDidUpdate(prevProps: AcclaimsListProps) {
        if (prevProps.isMobile !== this.props.isMobile) {
            this.cache.clearAll();
        }
    }

    render() {
        const numRows = this.props.acclaims.length;
        return (
            <div css={css` height: 100%; `} >
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            height={height}
                            width={width}
                            rowCount={numRows}
                            rowHeight={this.cache.rowHeight}
                            deferredMeasurementCache={this.cache}
                            rowRenderer={this.rowItemRenderer}
                            css={listStyle}
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
                cache={this.cache}
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
