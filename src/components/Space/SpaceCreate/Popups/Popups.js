import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Popups extends Component {
    static propTypes = {
        type: PropTypes.string, //start
        show: PropTypes.bool,
        onClose: PropTypes.func,

    }

    render() {
        const { onClose } = this.props;
        return (
            <div className={'create-popup'}>
                <div className={'create-popup-cont'}>
                    <div className={'create-popup-header'}>Get started</div>
                    <div className={'create-popup-body'}>
                        <div className={'create-popup-body-step-1'}>
                            <div className={'create-popup-body-step-text'}>1. Fill the walls with your artworks</div>
                            <div className={'create-popup-body-step-1-img'}></div>
                        </div>
                        <div className={'create-popup-body-step-2'}>
                            <div className={'create-popup-body-step-text'}>2. Add 3D objects</div>
                            <div className={'create-popup-body-step-2-img'}></div>
                        </div>
                        <div className={'create-popup-body-step-3'}>
                            <div className={'create-popup-body-step-text'}>3. Edit, manage your works between walls</div>
                            <div className={'create-popup-body-step-3-img'}></div>
                        </div>
                        <div className={'create-popup-body-step-4'}>
                            <div className={'create-popup-body-step-text'}>4. Preview your gallery in 3D</div>
                            <div className={'create-popup-body-step-4-img'}></div>
                        </div>
                    </div>
                    <div className={'create-popup-btn-ok'} onClick={onClose}>Got it</div>
                </div>
            </div>
        )
    }
}
