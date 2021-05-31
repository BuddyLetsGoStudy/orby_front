import React, { useEffect } from 'react'
import { AnimatePresence, motion } from "framer-motion"
import Button from '../Button/Button'
import './styles.css'

// initial={{opacity: 0, scale: 0.1, translateY: '-20vh'}} animate={{opacity: 1, scale: 1, translateY: '0vh'}} exit={{opacity: 0, scale: 0.1, translateY: '-20vh'}} transition={{ ease: "easeOut", duration: 0.15 }}
const flickersAnimation = {
    initial: {opacity: 0, x: '-100px', y: '50px'},
    animate: {opacity: 1, x: '0', y: '0'},
    exit: {opacity: 0},
    transition: {delay: 1, duration: 0.5}
}

const SpaceCongrats = props => (
    <motion.div className={'space-congrats'} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
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
            <motion.div className={'space-congrats-body-flickers-left'} initial={{opacity: 0, x: '-100px', y: '50px'}} animate={{opacity: 1, x: '0', y: '0'}} exit={{opacity: 0}} transition={{delay: 1, duration: 0.5}}/>
            <motion.div className={'space-congrats-body-flickers-right'} initial={{opacity: 0, x: '100px', y: '50px', rotate: '-75deg'}} animate={{opacity: 1, x: '0', y: '0'}} exit={{opacity: 0}} transition={{delay: 1, duration: 0.5}}/>
        </div>
        <Button onClick={props.onClick} text={'Thanks!'} margin={'30px 0 0 0'}/>
    </motion.div>
);

export default SpaceCongrats