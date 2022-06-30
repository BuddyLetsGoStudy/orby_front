import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import ThreeDPreview from '../Popups/AddArtobject/ThreeDPreview/ThreeDPreview'
import './styles.css'

class Wall extends Component {
    render() {
        const { num, hoveredWall, hoveredArtobject, hoverWall, unhoverWall, space, hoverArtobject, unhoverArtobject, addArtobject } = this.props;
        const { positions, artobjects } = space;
        return (
            <div className={'space-create-wall-and-cube'}>
                <div className={`space-create-wall space-create-wall-${num} ${hoveredWall === num ? 'space-create-wall-hover' : ''}`} id={`dw${num}`}>
                    <div className={`space-create-wall-artobject ${hoveredArtobject === 1 + 3 * (num - 1) ? 'space-create-wall-artobject-hover': ''}`} id={`d${1 + 3 * (num - 1)}`}></div>
                    <div className={`space-create-wall-artobject ${hoveredArtobject === 2 + 3 * (num - 1) ? 'space-create-wall-artobject-hover': ''}`} id={`d${2 + 3 * (num - 1)}`}></div>
                    <div className={`space-create-wall-artobject ${hoveredArtobject === 3 + 3 * (num - 1) ? 'space-create-wall-artobject-hover': ''}`} id={`d${3 + 3 * (num - 1)}`}></div>
                </div>
                <div className={`space-create-cube space-create-cube-${num} ${hoveredArtobject === 12 + num ? 'space-create-cube-hover' : ''}`} id={`d${12 + num}`}>
                    {
                        positions[12 + num - 1] !== 0 &&
                        <ThreeDPreview url={_.find(artobjects, {id: positions[12 + num - 1]}).upload} size={'smaller'} animate={hoveredArtobject === 12 + num ? true : false}/>
                    }
                </div>
                {
                    num === 1 && 
                    <>
                    <div className={'create-add-artobjects-add-3d create-add-artobjects-add-3d-hui'} id={17} onMouseOver={hoverArtobject} onMouseOut={unhoverArtobject} onClick={addArtobject}>
                    {
                        positions[16] !== 0 &&
                        <ThreeDPreview url={_.find(artobjects, {id: positions[16]}).upload} size={'small'} animate={false}/>
                    }
                    </div>
                    <div className={`space-create-cube space-create-cube-${5} ${hoveredArtobject === 17 ? 'space-create-cube-hover' : ''}`} id={`d${17}`}>
                    {
                        positions[16] !== 0 &&
                        <ThreeDPreview url={_.find(artobjects, {id: positions[16]}).upload} size={'smaller'} animate={hoveredArtobject === 17 ? true : false}/>
                    }
                    </div>
                    </>
                }
               
            </div>
        )
    }
}

const mapStateToProps = state => ({
    space: state.Space.space,
})

export default connect(mapStateToProps, null)(Wall);



