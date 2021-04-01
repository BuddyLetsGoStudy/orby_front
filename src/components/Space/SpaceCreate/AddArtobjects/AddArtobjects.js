import React, { Component } from 'react'
import './styles.css'

export default class AddArtobjects extends Component {
    render() {
        const { num, hoveredWall, hoveredArtobject, hoverWall, unhoverWall, hoverArtobject, unhoverArtobject } = this.props;
        return (
            <div className={'create-add-artobjects'}>
                <div className={num > 2 ? 'create-add-artobjects-order' : ''}>
                    <div className={'create-add-artobjects-title'}>Wall {num}</div>
                    <div 
                        className={`create-add-artobjects-cont ${hoveredWall == num ? 'create-add-artobjects-cont-hover' : ''}`} 
                        id={`w${num}`}
                        onMouseEnter={hoverWall}
                        onMouseLeave={unhoverWall}
                    >
                        <div className={'create-add-artobjects-add'} id={1 + 3 * (num - 1)} onMouseEnter={hoverArtobject} onMouseLeave={unhoverArtobject}></div>
                        <div className={'create-add-artobjects-add'} id={2 + 3 * (num - 1)} onMouseEnter={hoverArtobject} onMouseLeave={unhoverArtobject}></div>
                        <div className={'create-add-artobjects-add'} id={3 + 3 * (num - 1)} onMouseEnter={hoverArtobject} onMouseLeave={unhoverArtobject}></div>
                    </div>
                </div>
                <div className={num > 2 ? 'create-add-artobjects-order-3d' : ''}>
                    <div className={'create-add-artobjects-title create-add-artobjects-title-3d'}>3D object {num}</div>
                    <div className={'create-add-artobjects-add-3d'} id={12 + num} onMouseEnter={hoverArtobject} onMouseLeave={unhoverArtobject}></div>
                </div>
            </div>
        )
    }
}
