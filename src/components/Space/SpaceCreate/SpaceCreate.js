import React, { Component } from 'react'
import AddArtobjects from './AddArtobjects/AddArtobjects'
import Popups from './Popups/Popups'
import Wall from './Wall/Wall'
import './styles.css'


class SpaceCreate extends Component {
    state = {
        showWelcome: false
    }

    closeWelcome = () => this.setState({showWelcome: false})

    render() {
        const { showWelcome } = this.state;
        return (
            <div className={'body-cont'}>
                <div className={'create-cont'}>
                    <div className={'create-cont-top'}>
                        <AddArtobjects num={1} />
                        <AddArtobjects num={2} />
                    </div>
                    <Wall />
                    <div className={'create-cont-bottom'}>
                        <AddArtobjects num={3} />
                        <AddArtobjects num={4} />
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
