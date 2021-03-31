import React, { Component } from 'react'
import './styles.css'

export default class Wall extends Component {
    render() {
        const { num } = this.props;
        return (
            <div>
                <div className={'space-create-wall'}>
                    <div className={'space-create-wall-artobject'} id={`d${1 + 3 * (num - 1)}`}></div>
                    <div className={'space-create-wall-artobject'} id={`d${2 + 3 * (num - 1)}`}></div>
                    <div className={'space-create-wall-artobject'} id={`d${3 + 3 * (num - 1)}`}></div>
                </div>
            </div>
        )
    }
}
