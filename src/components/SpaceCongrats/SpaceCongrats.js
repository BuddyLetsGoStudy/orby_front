import React, { useEffect } from 'react'
import './styles.css'

const SpaceCongrats = props => {

    // useEffect(() => document.body.classList.add('no-scroll'), [])

    return(
        <div className={'space-congrats'}>
            <div className={'space-congrats-body'}/>
            <div className={'button-blue space-congrats-button'}/>
        </div>
    );
}

export default SpaceCongrats