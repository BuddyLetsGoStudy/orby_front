import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import ThreeDPreview from '../Popups/AddArtobject/ThreeDPreview/ThreeDPreview'

import './styles.css'

class AddArtobjects extends Component {
    render() {
        const { num, hoveredWall, hoveredArtobject, hoverWall, unhoverWall, hoverArtobject, unhoverArtobject, addArtobject, space } = this.props;
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
                        <div className={'create-add-artobjects-add'} id={1 + 3 * (num - 1)} onMouseOver={hoverArtobject} onMouseOut={unhoverArtobject} onClick={addArtobject}></div>
                        <div className={'create-add-artobjects-add'} id={2 + 3 * (num - 1)} onMouseOver={hoverArtobject} onMouseOut={unhoverArtobject} onClick={addArtobject}></div>
                        <div className={'create-add-artobjects-add'} id={3 + 3 * (num - 1)} onMouseOver={hoverArtobject} onMouseOut={unhoverArtobject} onClick={addArtobject}></div>
                    </div>
                </div>
                <div className={num > 2 ? 'create-add-artobjects-order-3d' : ''}>
                    <div className={'create-add-artobjects-title create-add-artobjects-title-3d'}>3D object {num}</div>
                    <div className={'create-add-artobjects-add-3d'} id={12 + num} onMouseOver={hoverArtobject} onMouseOut={unhoverArtobject} onClick={addArtobject}>
                        {
                            positions[12 + num - 1] !== 0 &&
                            <ThreeDPreview url={_.find(artobjects, {id: positions[12 + num - 1]}).upload} size={'small'} animate={false}/>
                        }
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => ({
    space: state.Space.space,
})

export default connect(mapStateToProps, null)(AddArtobjects);
