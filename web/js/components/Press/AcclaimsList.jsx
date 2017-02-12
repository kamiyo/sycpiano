import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import AcclaimsListItem from '@/js/components/Press/AcclaimsListItem.jsx';

class AcclaimsListPresentation extends React.Component {
    componentWillMount() { this.props.fetchAcclaims(); }

    render() {
        return (
            <div className="acclaims-list">
                {this.props.acclaims.map((acclaim, index) => {
                    return <AcclaimsListItem acclaim={acclaim} key={index} />
                })}
            </div>
        );
    }
}

function getAcclaims() {
    return axios.get('/api/acclaims', { params: { includeFullQuote: true } });
}

const mapStateToProps = state => {
    return { acclaims: state.acclaims };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAcclaims: () => {
            dispatch({ type: 'PRESS--FETCHING_ACCLAIMS' });
            getAcclaims().then(
                response => {
                    dispatch({
                        type: 'PRESS--FETCH_ACCLAIMS_SUCCESS',
                        acclaims: response.data,
                    });
                }
            );
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AcclaimsListPresentation);
