import React, { Component } from 'react'
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

    closePopup = () => this.setState({showWelcome: false, showAddArtobject: false})

    hoverWall = e => this.setState({hoveredWall: parseInt(e.currentTarget.id[2], 10) || parseInt(e.currentTarget.id[1], 10)})
    unhoverWall = () => this.setState({hoveredWall: 0})

    hoverArtobject = e => this.setState({hoveredArtobject: parseInt(e.target.id, 10)})
    unhoverArtobject = () => this.setState({hoveredArtobject: 0})

    addArtobject = e => this.setState({showAddArtobject: true, clickedPosition: e.target.id})

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
                { showAddArtobject && <AddArtobject onClose={this.closePopup} positionID={clickedPosition} /> }
            </div>
        )
    }
}


export default SpaceCreate;
