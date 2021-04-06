import React, { Component } from 'react'
import './styles.css'

export default class AddArtobjects extends Component {
    render() {
        const { num, hoveredWall, hoveredArtobject, hoverWall, unhoverWall, hoverArtobject, unhoverArtobject, addArtobject } = this.props;
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
                    <div className={'create-add-artobjects-add-3d'} id={12 + num} onMouseOver={hoverArtobject} onMouseOut={unhoverArtobject} onClick={addArtobject}></div>
                </div>
            </div>
        )
    }
}
