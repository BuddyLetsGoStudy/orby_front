import React from 'react'
import { AnimatePresence, motion } from "framer-motion"
import { pageAnimation } from '../../variables'

import './styles.css'

const SpaceCard = props => {
    const { size, space } = props;

    return (
        <div className={'space-card-cont'}>
            <a href={`https://view.orby.space/${space.id}`} className={'space-card'}>
                <div className={'space-card-bg'} style={{backgroundImage: `url('${space.artobjects[0] && space.artobjects[0].upload}')`}} />
                <div className={'space-card-avatar'} style={{backgroundImage: `url('${space.avatar}')`}}/>
                <div className={'space-card-bottom'}>
                    <div className={'space-card-title'}>{space.name}</div>
                    <div className={'space-card-geo'}>{space.author}</div>
                </div>
            </a>
        </div>
    )
}

export default SpaceCard
