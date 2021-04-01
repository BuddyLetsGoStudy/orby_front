import React, { Component } from 'react'
import AddArtobjects from './AddArtobjects/AddArtobjects'
import Popups from './Popups/Popups'
import Wall from './Wall/Wall'
import './styles.css'


class SpaceCreate extends Component {
    state = {
        showWelcome: false,
        hoveredWall: 0,
        hoveredArtobject: 0
    }

    closeWelcome = () => this.setState({showWelcome: false})

    hoverWall = e => this.setState({hoveredWall: e.target.id[2] || e.target.id[1]})
    unhoverWall = () => this.setState({hoveredWall: 0})

    hoverArtobject = e => this.setState({hoveredArtobject: e.target.id})
    unhoverArtobject = () => this.setState({hoveredArtobject: 0})

    render() {
        const { showWelcome, hoveredWall, hoveredArtobject } = this.state;
        return (
            <div className={'body-cont'}>
                <div className={'create-cont'}>
                    <div className={'create-cont-top'}>
                        <AddArtobjects num={1} hoveredWall={hoveredWall} hoverWall={this.hoverWall} unhoverWall={this.unhoverWall} hoverArtobject={this.hoverArtobject} unhoverArtobject={this.unhoverArtobject}/>
                        <AddArtobjects num={2} hoveredWall={hoveredWall} hoverWall={this.hoverWall} unhoverWall={this.unhoverWall} hoverArtobject={this.hoverArtobject} unhoverArtobject={this.unhoverArtobject}/>
                    </div>
                    <div className={'space-create-wall-cont'}>
                        <Wall num={1} hoveredWall={hoveredWall} hoveredArtobject={hoveredArtobject} hoverWall={this.hoverWall} unhoverWall={this.unhoverWall}/>
                        <Wall num={2} hoveredWall={hoveredWall} hoveredArtobject={hoveredArtobject} hoverWall={this.hoverWall} unhoverWall={this.unhoverWall}/>
                        <Wall num={4} hoveredWall={hoveredWall} hoveredArtobject={hoveredArtobject} hoverWall={this.hoverWall} unhoverWall={this.unhoverWall}/>
                        <Wall num={3} hoveredWall={hoveredWall} hoveredArtobject={hoveredArtobject} hoverWall={this.hoverWall} unhoverWall={this.unhoverWall}/>
                    </div>
                    <div className={'create-cont-bottom'}>
                        <AddArtobjects num={4} hoveredWall={hoveredWall} hoveredArtobject={hoveredArtobject} hoverWall={this.hoverWall} unhoverWall={this.unhoverWall} hoverArtobject={this.hoverArtobject} unhoverArtobject={this.unhoverArtobject}/>
                        <AddArtobjects num={3} hoveredWall={hoveredWall} hoveredArtobject={hoveredArtobject} hoverWall={this.hoverWall} unhoverWall={this.unhoverWall} hoverArtobject={this.hoverArtobject} unhoverArtobject={this.unhoverArtobject}/>
                    </div>
                </div>
                <div className={'create-btn-cont'}>
                    <div className={'create-btn-preview'}>Preview 3D gallery</div>
                    <div className={'create-btn-submit'}>Create a space</div>
                </div>
                { showWelcome && <Popups show={showWelcome} onClose={this.closeWelcome} /> }
            </div>
        )
    }
}


export default SpaceCreate;
