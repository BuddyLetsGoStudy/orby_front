import React, { Component } from 'react'
import { connect } from 'react-redux'
import SpaceArtobjects from './SpaceArtobjects/SpaceArtobjects'
import SpaceMeta from './SpaceMeta/SpaceMeta'


class SpaceCreate extends Component {
    state = {
        step: 'artobjects'
    }

    nextStep = () => this.setState({step: 'meta'})

    render() {
        const { step } = this.state
        return (
            <>
                {
                    step === 'artobjects' ?
                    <SpaceArtobjects onSubmit={this.nextStep} />
                    :
                    <SpaceMeta />
                }
            </>
        )
    }
}

const mapStateToProps = state => ({
    loading: state.Space.loading,
    space: state.Space.space,
})

export default connect(mapStateToProps, null)(SpaceCreate);

