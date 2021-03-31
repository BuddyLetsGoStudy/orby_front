import React, { Component } from 'react'

export default class Navbar extends Component {
    render() {
        return (
            <div className={'navbar'}>
                <div className={'navbar-cont'}>
                    <div className={'navbar-logo'}></div>
                    <div className={'navbar-icons'}>
                        <div className={'navbar-icons-globus'}></div>
                        <div className={'navbar-icons-squares'}></div>
                        <div className={'navbar-icons-search'}></div>
                    </div>
                    <div className={'navbar-ul'}>
                        <div className={'navbar-ul-li'}>
                            <div className={'navbar-ul-li-plus'}></div>
                            <div className={'navbar-ul-li-text'}>
                                Create a space
                            </div>
                        </div>
                        <div className={'navbar-ul-li'}>
                            <div className={'navbar-ul-li-text'}>
                                My spaces
                            </div>
                        </div>
                        <div className={'navbar-ul-li'}>
                            <div className={'navbar-ul-li-text'}>
                                Log In
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
