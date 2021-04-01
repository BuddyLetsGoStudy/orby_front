import React, { Component } from 'react'
import './styles.css'

export default class Wall extends Component {
    render() {
        const { num, hoveredWall, hoveredArtobject, hoverWall, unhoverWall } = this.props;
        return (
            <div className={'space-create-wall-and-cube'}>
                <div 
                    className={`space-create-wall space-create-wall-${num} ${hoveredWall == num ? 'space-create-wall-hover' : ''}`} id={`dw${num}`}
                    onMouseEnter={hoverWall}
                    onMouseLeave={unhoverWall}
                >
                    <div className={`space-create-wall-artobject ${hoveredArtobject == 1 + 3 * (num - 1) ? 'space-create-wall-artobject-hover': ''}`} id={`d${1 + 3 * (num - 1)}`}></div>
                    <div className={`space-create-wall-artobject ${hoveredArtobject == 2 + 3 * (num - 1) ? 'space-create-wall-artobject-hover': ''}`} id={`d${2 + 3 * (num - 1)}`}></div>
                    <div className={`space-create-wall-artobject ${hoveredArtobject == 3 + 3 * (num - 1) ? 'space-create-wall-artobject-hover': ''}`} id={`d${3 + 3 * (num - 1)}`}></div>
                </div>
                <div className={`space-create-cube space-create-cube-${num} ${hoveredArtobject == 12 + num ? 'space-create-cube-hover' : ''}`} id={`d${12 + num}`}></div>
            </div>
        )
    }
}


