import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import ThreeDPreview from '../Popups/AddArtobject/ThreeDPreview/ThreeDPreview'

import './styles.css'

class AddArtobjects extends Component {
    render() {
        const { num, hoveredWall, hoveredArtobject, hoverWall, unhoverWall, hoverArtobject, unhoverArtobject, addArtobject, space, hints, show2D, show3D, closeHint } = this.props;
        const { positions, artobjects } = space;
        return (
            <div className={'create-add-artobjects'}>
                <div className={num > 2 ? 'create-add-artobjects-order' : ''}>
                    <div className={'create-add-artobjects-title'}>Wall {num}</div>
                    <div 
                        className={`create-add-artobjects-cont ${hoveredWall === num ? 'create-add-artobjects-cont-hover' : ''}`} 
                        id={`w${num}`}
                        onMouseOver={hoverWall}
                        onMouseOut={unhoverWall}
                    >
                        <div className={`create-add-artobjects-add ${num === 1 && hints && show2D && hoveredArtobject === 1 && 'create-add-artobjects-add-hovered'}`} id={1 + 3 * (num - 1)} onMouseOver={hoverArtobject} onMouseOut={unhoverArtobject} onClick={addArtobject}></div>
                        <div className={'create-add-artobjects-add'} id={2 + 3 * (num - 1)} onMouseOver={hoverArtobject} onMouseOut={unhoverArtobject} onClick={addArtobject}></div>
                        <div className={'create-add-artobjects-add'} id={3 + 3 * (num - 1)} onMouseOver={hoverArtobject} onMouseOut={unhoverArtobject} onClick={addArtobject}></div>
                        {
                            num === 1 && hints && show2D &&
                            <div className={'create-add-artobjects-hint create-add-artobjects-hint-2d'}>
                                Click here to add artwork
                                <div className={'create-add-artobjects-hint-close'} id={'show2DHint'} onClick={closeHint} />
                            </div>
                        }
                    </div>
                </div>
                <div className={`create-add-artobjects-3d-cont ${num > 2 ? 'create-add-artobjects-order-3d' : ''}`}>
                    <div className={'create-add-artobjects-title create-add-artobjects-title-3d'}>3D object {num}</div>
                    <div className={'create-add-artobjects-add-3d'} id={12 + num} onMouseOver={hoverArtobject} onMouseOut={unhoverArtobject} onClick={addArtobject}>
                        {
                            positions[12 + num - 1] !== 0 &&
                            <ThreeDPreview url={_.find(artobjects, {id: positions[12 + num - 1]}).upload} size={'small'} animate={false}/>
                        }
                    </div>
                    {
                        num === 1 && hints && show3D &&
                        <div className={'create-add-artobjects-hint'}>
                            Click here to add 3D object
                            <div className={'create-add-artobjects-hint-close'} id={'show3DHint'} onClick={closeHint}/>
                        </div>
                    }
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => ({
    space: state.Space.space,
    hints: state.Auth.hints,

})

export default connect(mapStateToProps, null)(AddArtobjects);
