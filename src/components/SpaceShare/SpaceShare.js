import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "framer-motion"
import Button from '../Button/Button'
import { API_DOMAIN } from '../../variables'
import './styles.css'

const SpaceShare = props => {
    const [ isCopied, setIsCopied ] = useState(false);


    const copyLink = () => {
        navigator.clipboard.writeText(`${API_DOMAIN}/space/${props.spaceID}`)
        setIsCopied(true)
    }

    return (
        <motion.div className={'space-share'} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
            <div className={'space-share-body'}>
                <div className={'space-share-title'}>Share space to...</div>
                <div className={'space-share-icon-cont'}>
                    <div className={'space-share-icon-ig'}/>
                    <div className={'space-share-icon-fb'}/>
                    <div className={'space-share-icon-vk'}/>
                    <div className={'space-share-link'} onClick={copyLink}>
                        <div className={`space-share-link-icon ${isCopied ? 'space-share-link-icon-grey' : ''}`}/>
                        <div className={`space-share-link-text ${isCopied ? 'space-share-link-text-grey' : ''}`}>{isCopied ? 'Link copied' : 'Copy link'}</div>
                    </div>
                </div>
                <Button onClick={props.onClose} text={'Cancel'} margin={'40px 0 0 0'}/>
                <div className={'space-share-close'} onClick={props.onClose}/>
            </div>
        </motion.div>
    )

};

export default SpaceShare