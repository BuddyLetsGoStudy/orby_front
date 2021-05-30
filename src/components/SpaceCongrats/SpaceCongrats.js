import React, { useEffect } from 'react'
import Button from '../Button/Button'
import './styles.css'

const SpaceCongrats = props => (
    <div className={'space-congrats'}>
        <div className={'space-congrats-body'}>
            <div className={'space-congrats-body-title'}>Congratulations!</div>
            <div className={'space-congrats-body-earth'}/>
            <div className={'space-congrats-body-text'}>You’ve just published your gallery! <br/>Now it can be visible to other users of Betrede world!</div>
            <div className={'space-congrats-body-share-text'}>Dont forget to share <sub>🙂</sub></div>
            <div className={'space-congrats-body-share-cont'}>
                <a className={'space-congrats-body-share-ig'} href="#"/>
                <a className={'space-congrats-body-share-fb'} href="#"/> 
                <a className={'space-congrats-body-share-vk'} href="#"/> 
            </div>
            <div className={'space-congrats-body-flickers-left'} />
            <div className={'space-congrats-body-flickers-right'} />
        </div>
        <Button onClick={props.onClick} text={'Thanks!'} margin={'30px 0 0 0'}/>
    </div>
);

export default SpaceCongrats