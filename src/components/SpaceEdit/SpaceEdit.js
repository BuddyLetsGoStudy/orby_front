import React, { Component } from 'react'
import { loadSpace, deleteSpace, publishSpace } from '../../actions/SpaceCreation'
import { connect } from 'react-redux'
import { Redirect } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { pageAnimation } from '../../variables'
import _ from 'lodash'
import './styles.css'
import SpaceCreate from '../SpaceCreate/SpaceCreate'
import ThreeDPreview from '../SpaceCreate/SpaceArtobjects/Popups/AddArtobject/ThreeDPreview/ThreeDPreview'
import SpaceCongrats from '../SpaceCongrats/SpaceCongrats'
import Button from '../Button/Button'

class SpaceEdit extends Component {
    state = {
        space: {
            published: false,
            geo: [55.85982975066385, 37.56725341796876],
            positions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            name: '',
            description: '',
            date: '',
            artobjects: []
        },
       edit: false,
       deleted: false,
       showHint: false,
       showCongrats: false,
       redirectToMySpaces: false
    }

    publish = e => {
        const { hints } = this.props;
        this.setState(prevState => ({space:{...prevState.space, published: prevState.space.published ? false : true}, showHint: false, showCongrats: hints ? true : false}), () => this.props.publishSpace(this.props.match.params.spaceid, this.state.space.published))
    }

    componentDidMount() {
        this.props.loadSpace(this.props.match.params.spaceid)
            .then(space => {
                console.log(space)
                this.setState({space: {name: space.name, published: space.published, artobjects: space.artobjects, positions: JSON.parse(space.options).positions, avatar: space.avatar, date: space.date, geo: space.geo.split(','), options: JSON.parse(space.options), description: space.description.length >= 180 ? space.description.slice(0, 180) + '... <span>See more</span>' : space.description}}, 
                this.manageUI)
            })
        this.props.hints && setTimeout(() => this.setState({showHint: true}), 1000)
    }

    manageUI = () => {
        const { positions, artobjects } = this.state.space;
        if (_.isEmpty(artobjects)) {
            this.props.deleteSpace(this.props.match.params.spaceid)
            .then(() => this.setState({deleted: true})) // ГАВНО
        } else {
            console.log(positions,'fdgfhj')
            positions.forEach((id, i) => {
                if(id !== 0){
                    const artobject = _.find(artobjects, {id});
                    document.getElementById(i + 1).style.backgroundImage = `url('${artobject.upload}')`
                    document.getElementById(i + 1).classList.add('edit-card-row-wall-artobject-full')
                }
            })
        }
    }
    componentWillUnmount() {
        this.props.dispatch({type: "SPACE_CLOSE"})
    }


    editStart = type => {
        this.setState({edit: type})
        this.props.dispatch({type: "SPACE_EDIT_STEP", payload: {step: type, edit: this.props.match.params.spaceid}})
        this.props.dispatch({type: "UPDATE_WHOLE_SPACE", payload: this.state.space})
    }

    deleteSpace = () => {
        this.props.deleteSpace(this.props.match.params.spaceid)
            .then(() => this.setState({deleted: true}))
    }

    closeHint = () => this.setState({showHint: false})

    redirectToMySpaces = () => {
        this.props.hintsOff()
        this.setState({redirectToMySpaces: true})
    }

    render() {
        const { hints } = this.props;
        const { space, edit, deleted, showHint, showCongrats, redirectToMySpaces } = this.state
        const { published, geo, name, description, date, avatar, artobjects, positions } = space;
        if (deleted || redirectToMySpaces) {
            return  <AnimatePresence exitBeforeEnter><Redirect to="/myspaces"/></AnimatePresence>
        }
        if (edit) {
            return <SpaceCreate step={edit} editpage={true} />
        } else {
            return (
                <motion.div {...pageAnimation} >
                <div className={'edit-cont'}>
                    <div className={'edit-cards-cont'}>
                        <div className={'edit-card'} onClick={() => this.editStart('meta')}>
                            <div className={'edit-card-pencil'}/>
                            <div className={'edit-card-header'}>Gallery about info</div>
                            <div className={'edit-card-body'}>
                                <div className={'edit-card-avatar-cont'}>
                                    <div className={'edit-card-avatar'} style={{backgroundImage: `url('${avatar}')`}}/>
                                    <div className={'edit-card-avatar-text'}>
                                        {name} <br/>
                                        <span>{date}</span>
                                    </div>
                                </div>
                                <div className={'edit-card-description'} dangerouslySetInnerHTML={{__html: description}}/>
                                <div className={'edit-card-map-cont'} style={{backgroundImage: `url('https://static-maps.yandex.ru/1.x/?ll=${geo[1]},${geo[0]}&spn=0.01,0.01&size=360,140&l=map&pt=${geo[1]},${geo[0]},pm2dirm&lang=en_US')`}}/>
                            </div>
                        </div>
                        <div className={'edit-card'} onClick={() => this.editStart('artobjects')}>
                            <div className={'edit-card-header'}>Gallery artworks & objects</div>
                            <div className={'edit-card-pencil'}/>
                            <div className={'edit-card-body edit-card-walls'}>
                                <div className="edit-card-row">
                                    <div className="edit-card-row-wall">
                                        <div className="edit-card-row-wall-artobject" id='1'/>
                                        <div className="edit-card-row-wall-artobject" id='2'/>
                                        <div className="edit-card-row-wall-artobject" id='3'/>
                                        <div className="edit-card-row-wall-artobject-3d" id='13'>
                                            {
                                                positions[12] !== 0 &&
                                                <ThreeDPreview url={_.find(artobjects, {id: positions[12]})?.upload} size={'micro'} animate={false}/>
                                            }
                                        </div>
                                    </div>
                                    <div className="edit-card-row-wall">
                                        <div className="edit-card-row-wall-artobject" id='4'/>
                                        <div className="edit-card-row-wall-artobject" id='5'/>
                                        <div className="edit-card-row-wall-artobject" id='6'/>
                                        <div className="edit-card-row-wall-artobject-3d" id='14'>
                                            {
                                                positions[13] !== 0 &&
                                                <ThreeDPreview url={_.find(artobjects, {id: positions[13]})?.upload} size={'micro'} animate={false}/>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="edit-card-row edit-card-holo"/>

                                <div className="edit-card-row">
                                    <div className="edit-card-row-wall">
                                        <div className="edit-card-row-wall-artobject-3d" id='16'>
                                            {
                                                positions[15] !== 0 &&
                                                <ThreeDPreview url={_.find(artobjects, {id: positions[15]})?.upload} size={'micro'} animate={false}/>
                                            }
                                        </div>
                                        <div className="edit-card-row-wall-artobject" id='10'/>
                                        <div className="edit-card-row-wall-artobject" id='11'/>
                                        <div className="edit-card-row-wall-artobject" id='12'/>
                                    </div>
                                    <div className="edit-card-row-wall">
                                        <div className="edit-card-row-wall-artobject-3d" id='15'>
                                            {
                                                positions[14] !== 0 &&
                                                <ThreeDPreview url={_.find(artobjects, {id: positions[14]})?.upload} size={'micro'} animate={false}/>
                                            }
                                        </div>
                                        <div className="edit-card-row-wall-artobject" id='7'/>
                                        <div className="edit-card-row-wall-artobject" id='8'/>
                                        <div className="edit-card-row-wall-artobject" id='9'/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="edit-buttons-cont">
                        <Button size={'small'} text={'Preview 2D'} fontSize={'15px'} margin={'0 25px 0 0'}/>
                        <Button text={'Preview 3D gallery'} fontSize={'16px'} margin={'0 25px 0 0'}/>
                        <Button onClick={this.deleteSpace} size={'small'} color={'violet'} text={'Delete space'} fontSize={'15px'} />
                    </div>
                    <div className="edit-publish-cont">
                        <div className="edit-publish-marble"/>
                        <div className="edit-publish-text">Publish</div>
                        <div className={`edit-publish-switch ${ published ? 'edit-publish-switch-on' : ''}`} onClick={this.publish}/>
                        {/* <div className={`edit-publish-switch`} onClick={this.publish}></div> */}
                        <AnimatePresence exitBeforeEnter>
                            {
                                showHint &&  
                                <motion.div className={"edit-publish-hint"} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                                    <div className={"edit-publish-hint-text"}>{ hints ? <>You are almost done! Turn this switch ON, to make your space visible to others <sub>🙂</sub></> : <>You cant publish your space, because you don’t have any objects in your gallery <sub>☹️</sub> Add one, or more objects, and try again</>}</div>
                                    <div className={"edit-publish-hint-close"} onClick={this.closeHint}/>
                                </motion.div>
                            }
                       </AnimatePresence>
                    </div>
                </div>
                <AnimatePresence exitBeforeEnter>
                { hints && showHint && <motion.div className={'screen-fade'} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}/>}
                </AnimatePresence>
                { showCongrats && <SpaceCongrats onClick={this.redirectToMySpaces}/> }
                </motion.div>
            )
        }
    }
}


const mapStateToProps = state => ({
    hints: state.Auth.hints,
})

const mapDispatchToProps = dispatch => ({
    loadSpace: id => dispatch(loadSpace(id)),
    deleteSpace: id => dispatch(deleteSpace(id)),
    publishSpace: (id, param) => dispatch(publishSpace(id, param)),
    hintsOff: () => dispatch({type: 'HINTS_OFF'}),
    dispatch               
 })

export default connect(mapStateToProps, mapDispatchToProps)(SpaceEdit);
