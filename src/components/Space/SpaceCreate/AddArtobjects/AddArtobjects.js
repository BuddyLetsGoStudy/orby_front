import React, { Component } from 'react'

export default class AddArtobjects extends Component {
    render() {
        const { num } = this.props;
        return (
            <div className={'create-add-artobjects'}>
                <div className={'create-add-artobjects-title'}>Wall {num}</div>
                <div className={'create-add-artobjects-cont'}>
                    <div className={'create-add-artobjects-add'} id={1 + 3 * (num - 1)}></div>
                    <div className={'create-add-artobjects-add'} id={2 + 3 * (num - 1)}></div>
                    <div className={'create-add-artobjects-add'} id={3 + 3 * (num - 1)}></div>
                </div>
            </div>
        )
    }
}
