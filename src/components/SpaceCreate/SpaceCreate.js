import React, { Component } from 'react'
import { connect } from 'react-redux'
import SpaceArtobjects from './SpaceArtobjects/SpaceArtobjects'
import { createSpace } from '../../actions/SpaceCreation'
import { Redirect } from "react-router-dom";
import SpaceMeta from './SpaceMeta/SpaceMeta'
import SpaceEdit from '../SpaceEdit/SpaceEdit';


class SpaceCreate extends Component {
    state = {
        redirectID: false
    }

    nextStep = () => {
        this.props.edit ? this.createSpace() : this.props.dispatch({type: "SPACE_CREATE_STEP", payload: 'meta'})
    }

    createSpace = () => {
        console.log(this.props.edit, 'FUUUUUCK')
        this.props.createSpace(this.props.edit)
            .then(id => {
                this.setState({redirectID: id})
            })
            .catch(() => console.log('some shit broken'))
    }

    componentDidMount() {
        !this.props.editpage && this.props.dispatch({type: "SPACE_EDIT_SUCCESS"})
    }


    render() {
        const { redirectID } = this.state;
        const { step, edit } = this.props;
        if (redirectID && edit) {
            console.log('GAVNOOOO')
            return(<SpaceEdit match={{params:{spaceid: edit}}}/>)
        } else {
            return (
                <>
                    {
                        redirectID ? 
                            <Redirect to={`/edit/${redirectID}`} />
                        : step === 'artobjects' ?
                            <SpaceArtobjects onSubmit={this.nextStep} />
                        :
                            <SpaceMeta onSubmit={this.createSpace} />
                    }
                </>
            )
        }
        
    }
}

const mapStateToProps = state => ({
    loading: state.Space.loading,
    space: state.Space.space,
    uploadedSpace: state.Space.uploadedSpace,
    step: state.Space.step,
    edit: state.Space.edit
})


const mapDispatchToProps = dispatch => ({
    createSpace: shit => dispatch(createSpace(shit)),
    dispatch               
 })

export default connect(mapStateToProps, mapDispatchToProps)(SpaceCreate);

