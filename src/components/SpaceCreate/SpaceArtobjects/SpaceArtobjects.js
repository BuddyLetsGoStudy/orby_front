import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { previewSpace, closePreviewSpace } from '../../../actions/SpaceCreation'
import { AnimatePresence, motion } from "framer-motion"
import { pageAnimation } from '../../../variables'
import AddArtobjects from './AddArtobjects/AddArtobjects'
import Space from '../../Space/Space'
import Welcome from './Popups/Welcome/Welcome'
import AddArtobject from './Popups/AddArtobject/AddArtobject'
import Wall from './Wall/Wall'
import Button from '../../Button/Button'

import './styles.css'


class SpaceArtobjects extends Component {
    state = {
        showWelcome: false,
        show2DHint: false,
        show3DHint: false,
        showAddArtobject: false,
        hoveredWall: 0,
        hoveredArtobject: 0,
        clickedPosition: 0,
        preview: false
    }
    
    componentDidMount() {
        const { space, hints } = this.props;
        const { artobjects, positions } = space;
        console.log(',OUNTEFD MAZAAFKAKAKAKAFDKSKA )))))', space)
        positions.forEach((id, i) => {
            id !== 0 && this.displayArtobject(i + 1, _.find(artobjects, {id}).upload)
        })
        hints && setTimeout(() => this.setState({showWelcome: true}), 1001)
    }

    componentDidUpdate(prevProps) {
        console.log('UODATED ==============', prevProps.edit, this.props.edit)
        if((this.props.edit !== prevProps.edit) || (prevProps.space !== this.props.space) ) {
            const { artobjects, positions } = this.props.space;
            console.log("POSITION", positions)
            positions.forEach((id, i) => {
                console.log('NOW IS ', i + 1)
                id !== 0 ? this.displayArtobject(i + 1, id !== 0 && _.find(artobjects, {id}).upload) : this.artobjectDeleted(i + 1)
            })
        }
    }

    closePopup = () => this.setState({showAddArtobject: false})

    closeWelcome = () => {
        setTimeout(() => this.setState({show2DHint: true, hoveredWall: 1, hoveredArtobject: 1}), 500)
        setTimeout(() => this.setState({show3DHint: true}), 1500)

        this.setState({showWelcome: false})
    }

    closeHint = e =>  this.setState({[e.target ? e.target.id : e]: false, hoveredWall: 0, hoveredArtobject: 0})

    hoverWall = e => this.setState({hoveredWall: parseInt(e.currentTarget.id[2], 10) || parseInt(e.currentTarget.id[1], 10)})
    unhoverWall = () => this.setState({hoveredWall: 0})

    hoverArtobject = e => {
        console.log('hovered:', e.currentTarget.id)
        this.setState({hoveredArtobject: parseInt(e.currentTarget.id, 10)})
    }

    unhoverArtobject = () => { 
        console.log('unhovered')
        this.setState({hoveredArtobject: 0})
    }

    addArtobject = e => this.setState({showAddArtobject: true, clickedPosition: e.currentTarget.id})

    artobjectAdded = (positionID, artobject) => {
        const { id, upload, category } = artobject;
        const { artobjects } = this.props.space;
        console.log(artobjects, id);
        this.closeHint(category == 1 ? 'show2DHint' : 'show3DHint')
        this.displayArtobject(positionID, upload, category == 2 && true)

        const findIndex = artobjects.findIndex(a => a.id === id)
        findIndex !== -1 && artobjects.splice(findIndex , 1)
        this.props.dispatch({type: 'UPDATE_SPACE', payload: {field: 'artobjects', value: [...artobjects, artobject]}})

        console.log([...this.props.space.artobjects, artobject])
        let newPositions = this.props.space.positions
        newPositions[positionID - 1] = id
        this.props.dispatch({type: 'UPDATE_SPACE', payload: {field: 'positions', value: newPositions}})
    }

    artobjectDeleted = positionID => this.displayArtobject(positionID)

    displayArtobject = (id, url=false, threeD=false) => {
        console.log(id, 'SUDUWPOPP========================HUI')
        const artobjCont = document.getElementById(`${id}`)
        if (artobjCont) {
            const artobjWallCont =  document.getElementById(`d${id}`)
            artobjCont.style.backgroundImage = url ? `url('${threeD ? 'baka' : url}')` : ``
            artobjWallCont.style.backgroundImage = url ? `url('${threeD ? 'baka' : url}')` : ``
            url ? artobjCont.classList.add('artobject-added') : artobjCont.classList.remove('artobject-added')
        }
    }

    onSubmit = () => _.isEmpty(this.props.space.artobjects) ? null : this.props.onSubmit()

    previewSpace = () => this.setState({preview: true})

    closePreviewSpace = () => this.setState({preview: false})


    render() {
        const { showWelcome, showAddArtobject, hoveredWall, hoveredArtobject, clickedPosition, show2DHint, show3DHint, preview } = this.state;
        const { edit, space, hints } = this.props;
        const { artobjects } = space;
        console.log(preview, 'hui', this.props)
        return (
            <>
                <motion.div className={`body-cont`} {...pageAnimation}>
                    <div className={'create-cont'}>
                        <div className={'create-cont-top'}>
                            <AddArtobjects num={1} hoveredWall={hoveredWall} hoverWall={this.hoverWall} unhoverWall={this.unhoverWall} hoverArtobject={this.hoverArtobject} unhoverArtobject={this.unhoverArtobject} addArtobject={this.addArtobject} show2D={show2DHint} show3D={show3DHint} hoveredArtobject={hoveredArtobject} closeHint={this.closeHint}/>
                            <AddArtobjects num={2} hoveredWall={hoveredWall} hoverWall={this.hoverWall} unhoverWall={this.unhoverWall} hoverArtobject={this.hoverArtobject} unhoverArtobject={this.unhoverArtobject} addArtobject={this.addArtobject} hoveredArtobject={hoveredArtobject}/>
                        </div>
                        <div className={'space-create-wall-cont'}>
                            <Wall num={1} hoveredWall={hoveredWall} hoveredArtobject={hoveredArtobject} hoverWall={this.hoverWall} unhoverWall={this.unhoverWall}/>
                            <Wall num={2} hoveredWall={hoveredWall} hoveredArtobject={hoveredArtobject} hoverWall={this.hoverWall} unhoverWall={this.unhoverWall}/>
                            <Wall num={4} hoveredWall={hoveredWall} hoveredArtobject={hoveredArtobject} hoverWall={this.hoverWall} unhoverWall={this.unhoverWall}/>
                            <Wall num={3} hoveredWall={hoveredWall} hoveredArtobject={hoveredArtobject} hoverWall={this.hoverWall} unhoverWall={this.unhoverWall}/>
                        </div>
                        <div className={'create-cont-bottom'}>
                            <AddArtobjects num={4} hoveredWall={hoveredWall} hoveredArtobject={hoveredArtobject} hoverWall={this.hoverWall} unhoverWall={this.unhoverWall} hoverArtobject={this.hoverArtobject} unhoverArtobject={this.unhoverArtobject} addArtobject={this.addArtobject} hoveredArtobject={hoveredArtobject}/>
                            <AddArtobjects num={3} hoveredWall={hoveredWall} hoveredArtobject={hoveredArtobject} hoverWall={this.hoverWall} unhoverWall={this.unhoverWall} hoverArtobject={this.hoverArtobject} unhoverArtobject={this.unhoverArtobject} addArtobject={this.addArtobject} hoveredArtobject={hoveredArtobject}/>
                        </div>
                    </div>
                    <div className={'create-btn-cont'}>
                        <Button onClick={this.previewSpace} text={'Preview 3D gallery'}fontSize={'16px'}/>
                        <Button onClick={this.onSubmit} color={_.isEmpty(artobjects) ? 'grey' : 'violet'} text={edit ? 'Save' : 'Create a space'} margin={'0 0 0 25px'} fontSize={'16px'} arrow={true}/>
                    </div>
                    <AnimatePresence exitBeforeEnter>{ hints && showWelcome && <Welcome onClose={this.closeWelcome} /> }</AnimatePresence>
                    <AnimatePresence exitBeforeEnter>{ showAddArtobject && <AddArtobject showAddArtobject={showAddArtobject} onClose={this.closePopup} onCreated={this.artobjectAdded} onDeleted={this.artobjectDeleted} positionID={clickedPosition} /> } </AnimatePresence>
                </motion.div>
                { preview && <Space preview={true} closePreview={this.closePreviewSpace}/> }
            </>
        )
    }
}



const mapStateToProps = state => ({
    loading: state.Space.loading,
    space: state.Space.space,
    edit: state.Space.edit,
    preview: state.Space.preview,
    hints: state.Auth.hints,
})

export default connect(mapStateToProps,  null)(SpaceArtobjects);
