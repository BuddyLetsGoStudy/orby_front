import React, { Component } from 'react'
import { loadSpace, deleteSpace, publishSpace } from '../../actions/SpaceCreation'
import { connect } from 'react-redux'
import { Redirect } from "react-router-dom"
import _ from 'lodash'
import './styles.css'
import SpaceCreate from '../SpaceCreate/SpaceCreate'


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
       deleted: false
    }

    publish = e => {
        this.setState(prevState => ({space:{...prevState.space, published: prevState.space.published ? false : true}}), () => this.props.publishSpace(this.props.match.params.spaceid, this.state.space.published))
    }

    componentDidMount() {
        this.props.loadSpace(this.props.match.params.spaceid)
            .then(space => {
                this.setState({space: {name: space.name, published: space.published, artobjects: space.artobjects, positions: JSON.parse(space.options).positions, avatar: space.avatar, date: space.date, geo: space.geo.split(','), options: JSON.parse(space.options), description: space.description.length >= 180 ? space.description.slice(0, 180) + '... <span>See more</span>' : space.description}}, 
                this.manageUI)
            })
    }

    manageUI = () => {
        const { positions, artobjects } = this.state.space;
        console.log(positions,'fdgfhj')
        positions.forEach((id, i) => {
            if(id !== 0){
                const artobject = _.find(artobjects, {id});
                document.getElementById(i + 1).style.backgroundImage = `url('${artobject.upload}')`
                document.getElementById(i + 1).classList.add('edit-card-row-wall-artobject-full')
            }
        })
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

    render() {
        const { space, edit, deleted } = this.state
        const { published, geo, name, description, date, avatar } = space;
        if (deleted) {
            return <Redirect to="/myspaces"/>
        }
        if (edit) {
            return <SpaceCreate step={edit} editpage={true} />
        } else {
            return (
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
                                        <div className="edit-card-row-wall-artobject-3d" id='13'/>
                                    </div>
                                    <div className="edit-card-row-wall">
                                        <div className="edit-card-row-wall-artobject" id='4'/>
                                        <div className="edit-card-row-wall-artobject" id='5'/>
                                        <div className="edit-card-row-wall-artobject" id='6'/>
                                        <div className="edit-card-row-wall-artobject-3d" id='14'/>
                                    </div>
                                </div>

                                <div className="edit-card-row edit-card-holo"/>

                                <div className="edit-card-row">
                                    <div className="edit-card-row-wall">
                                        <div className="edit-card-row-wall-artobject-3d" id='16'/>
                                        <div className="edit-card-row-wall-artobject" id='10'/>
                                        <div className="edit-card-row-wall-artobject" id='11'/>
                                        <div className="edit-card-row-wall-artobject" id='12'/>
                                    </div>
                                    <div className="edit-card-row-wall">
                                        <div className="edit-card-row-wall-artobject-3d" id='15'/>
                                        <div className="edit-card-row-wall-artobject" id='7'/>
                                        <div className="edit-card-row-wall-artobject" id='8'/>
                                        <div className="edit-card-row-wall-artobject" id='9'/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="edit-buttons-cont">
                        <div className="edit-button-2d not-ready">Preview 2D</div>
                        <div className="edit-button-3d not-ready">Preview 3D gallery</div>
                        <div className="edit-button-delete" onClick={this.deleteSpace}>Delete space</div>
                    </div>
                    <div className="edit-publish-cont">
                        <div className="edit-publish-marble"/>
                        <div className="edit-publish-text">Publish</div>
                        <div className={`edit-publish-switch ${ published ? 'edit-publish-switch-on' : ''}`} onClick={this.publish}/>
                    </div>
                </div>
            )
        }
    }
}

const mapDispatchToProps = dispatch => ({
    loadSpace: id => dispatch(loadSpace(id)),
    deleteSpace: id => dispatch(deleteSpace(id)),
    publishSpace: (id, param) => dispatch(publishSpace(id, param)),
    dispatch               
 })

export default connect(null, mapDispatchToProps)(SpaceEdit);
