import React, { useEffect } from 'react'
import Button from '../../../../Button/Button'
import './styles.css'

const Welcome = props => {

    useEffect(() => document.body.classList.add('no-scroll'), [])

    return(
        <div className={'create-popup'}>
            <div className={'create-popup-cont'}>
                <div className={'create-popup-header'}>Get started</div>
                <div className={'create-popup-body'}>
                    <div className={'create-popup-body-step-1'}>
                        <div className={'create-popup-body-step-text'}><span>1</span> Fill the walls with your artworks</div>
                        <div className={'create-popup-body-step-1-img'}></div>
                    </div>
                    <div className={'create-popup-body-step-2'}>
                        <div className={'create-popup-body-step-text'}><span>2</span> Add 3D objects</div>
                        <div className={'create-popup-body-step-2-img'}></div>
                    </div>
                    <div className={'create-popup-body-step-3'}>
                        <div className={'create-popup-body-step-text'}><span>3</span> Edit, manage your works between walls</div>
                        <div className={'create-popup-body-step-3-img'}></div>
                    </div>
                    <div className={'create-popup-body-step-4'}>
                        <div className={'create-popup-body-step-text'}><span>4</span> Preview your gallery in 3D</div>
                        <div className={'create-popup-body-step-4-img'}></div>
                    </div>
                </div>
                <Button onClick={props.onClose} text={'Got it'} margin={'50px auto 0 auto'}/>
            </div>
        </div>
    );
}

export default Welcome