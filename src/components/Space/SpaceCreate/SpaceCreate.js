import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import AddArtobjects from './AddArtobjects/AddArtobjects'
import Welcome from './Popups/Welcome/Welcome'
import AddArtobject from './Popups/AddArtobject/AddArtobject'
import Wall from './Wall/Wall'

import './styles.css'


class SpaceCreate extends Component {
    state = {
        showWelcome: false,
        showAddArtobject: false,
        hoveredWall: 0,
        hoveredArtobject: 0,
        clickedPosition: 0
    }
    
    componentDidMount(){
        const { artobjects, positions } = this.props.space;
        positions.forEach((id, i) => {
            id !== 0 && this.displayArtobject(i + 1, _.find(artobjects, {id}).upload)
        })
    }

    closePopup = () => this.setState({showWelcome: false, showAddArtobject: false})

    hoverWall = e => this.setState({hoveredWall: parseInt(e.currentTarget.id[2], 10) || parseInt(e.currentTarget.id[1], 10)})
    unhoverWall = () => this.setState({hoveredWall: 0})

    hoverArtobject = e => this.setState({hoveredArtobject: parseInt(e.target.id, 10)})
    unhoverArtobject = () => this.setState({hoveredArtobject: 0})

    addArtobject = e => this.setState({showAddArtobject: true, clickedPosition: e.target.id})

    artobjectAdded = (positionID, artobject) => {
        const { id, upload } = artobject;
        console.log(this.props.space.artobjects, id);
        this.displayArtobject(positionID, upload)

        this.props.dispatch({type: 'UPDATE_SPACE', payload: {field: 'artobjects', value: [...this.props.space.artobjects, artobject]}})
        console.log([...this.props.space.artobjects, artobject])
        let newPositions = this.props.space.positions
        newPositions[positionID - 1] = id
        this.props.dispatch({type: 'UPDATE_SPACE', payload: {field: 'positions', value: newPositions}})
    }

    artobjectDeleted = positionID => this.displayArtobject(positionID)

    displayArtobject = (id, url=false) => {
        const artobjCont = document.getElementById(`${id}`)
        const artobjWallCont =  document.getElementById(`d${id}`)
        artobjCont.style.backgroundImage = url ? `url('${url}')` : ``
        artobjWallCont.style.backgroundImage = url ? `url('${url}')` : ``
        url ? artobjCont.classList.add('artobject-added') : artobjCont.classList.remove('artobject-added')
    }

    render() {
        const { showWelcome, showAddArtobject, hoveredWall, hoveredArtobject, clickedPosition } = this.state;
        return (
            <div className={`body-cont`}>
                <div className={'create-cont'}>
                    <div className={'create-cont-top'}>
                        <AddArtobjects num={1} hoveredWall={hoveredWall} hoverWall={this.hoverWall} unhoverWall={this.unhoverWall} hoverArtobject={this.hoverArtobject} unhoverArtobject={this.unhoverArtobject} addArtobject={this.addArtobject}/>
                        <AddArtobjects num={2} hoveredWall={hoveredWall} hoverWall={this.hoverWall} unhoverWall={this.unhoverWall} hoverArtobject={this.hoverArtobject} unhoverArtobject={this.unhoverArtobject} addArtobject={this.addArtobject}/>
                    </div>
                    <div className={'space-create-wall-cont'}>
                        <Wall num={1} hoveredWall={hoveredWall} hoveredArtobject={hoveredArtobject} hoverWall={this.hoverWall} unhoverWall={this.unhoverWall}/>
                        <Wall num={2} hoveredWall={hoveredWall} hoveredArtobject={hoveredArtobject} hoverWall={this.hoverWall} unhoverWall={this.unhoverWall}/>
                        <Wall num={4} hoveredWall={hoveredWall} hoveredArtobject={hoveredArtobject} hoverWall={this.hoverWall} unhoverWall={this.unhoverWall}/>
                        <Wall num={3} hoveredWall={hoveredWall} hoveredArtobject={hoveredArtobject} hoverWall={this.hoverWall} unhoverWall={this.unhoverWall}/>
                    </div>
                    <div className={'create-cont-bottom'}>
                        <AddArtobjects num={4} hoveredWall={hoveredWall} hoveredArtobject={hoveredArtobject} hoverWall={this.hoverWall} unhoverWall={this.unhoverWall} hoverArtobject={this.hoverArtobject} unhoverArtobject={this.unhoverArtobject} addArtobject={this.addArtobject}/>
                        <AddArtobjects num={3} hoveredWall={hoveredWall} hoveredArtobject={hoveredArtobject} hoverWall={this.hoverWall} unhoverWall={this.unhoverWall} hoverArtobject={this.hoverArtobject} unhoverArtobject={this.unhoverArtobject} addArtobject={this.addArtobject}/>
                    </div>
                </div>
                <div className={'create-btn-cont'}>
                    <div className={'create-btn-preview'}>Preview 3D gallery</div>
                    <div className={'create-btn-submit'}>Create a space</div>
                </div>
                { showWelcome && <Welcome onClose={this.closePopup} /> }
                { showAddArtobject && <AddArtobject onClose={this.closePopup} onCreated={this.artobjectAdded} onDeleted={this.artobjectDeleted} positionID={clickedPosition} /> }
            </div>
        )
    }
}



const mapStateToProps = state => ({
    loading: state.Space.loading,
    space: state.Space.space,
})

export default connect(mapStateToProps, null)(SpaceCreate);
