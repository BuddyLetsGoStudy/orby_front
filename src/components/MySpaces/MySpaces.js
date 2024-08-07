import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion"
import { pageAnimation } from '../../variables'
import { loadMySpaces, publishMySpaces } from "../../actions/SpaceCreation";
import { Link } from 'react-router-dom';
import SpaceCongrats from '../SpaceCongrats/SpaceCongrats'
import SpaceShare from '../SpaceShare/SpaceShare'

import './styles.css'

const MySpaces = () => {
    const dispatch = useDispatch();
    const profileState = useSelector(state => state.Profile);
    const authState = useSelector(state => state.Auth);
    const [ showCongrats, setShowCongrats ] = useState(false);
    const [ showShare, setShowShare ] = useState(false);

    useEffect(() => {
        dispatch(loadMySpaces())
    }, [authState.username])

    const publish = (id, published) => {
        authState.hints && setShowCongrats(true)
        dispatch(publishMySpaces(id, published ? false : true))
    }

    const closeCongrats = () => {
        setShowCongrats(false)
        dispatch({type: "HINTS_OFF"})
    }

    return (
        <motion.div className={'myspaces'} {...pageAnimation}>
            <div className={'myspaces-cont'}>
                {
                    !profileState.spaces[0] ?
                        <div className={'myspaces-none'}>
                            <div className={'myspaces-none-title'}>You don’t have any spaces yet. It’s time to create some! 🙂</div>
                            <Link to={'/create'} className={'myspaces-none-plus'}/>
                            <div className={'myspaces-none-text'}>Click here to Create a new space</div>
                        </div>
                    :
                    profileState.spaces.map(space => (
                        <div className={'myspaces-block'}>
                            <Link to={`/edit/${space.id}`} className={'myspaces-block-card'}>
                                <div className={'myspaces-block-card-bg'}  style={space.artobjects[0] && space.artobjects[0].category === 1 ? {backgroundImage: `url('${space.artobjects[0].upload}')`} : {}} />
                                <div className={'myspaces-block-card-avatar'} style={{backgroundImage: `url('${space.avatar}')`}}/>
                                <div className={'myspaces-block-card-bottom'}>
                                    <div className={'myspaces-block-card-title'}>{space.name}</div>
                                    <div className={'myspaces-block-card-geo'}>{space.author}</div>
                                </div>
                            </Link>
                            <div className={'myspaces-block-publish'}>
                                <div className={'myspaces-block-publish-share-cont'} onClick={() => setShowShare(space.id)}>
                                    <div className={'myspaces-block-publish-share-icon'}/>
                                    <div className={'myspaces-block-publish-share'}>Share</div>
                                </div>
                                <div className={'myspaces-block-publish-marble'}/>
                                <div className={'myspaces-block-publish-text'}>Publish</div>
                                <div className={`edit-publish-switch ${ space.published ? 'edit-publish-switch-on' : ''}`} onClick={() => publish(space.id, space.published)}/>
                            </div>
                        </div>
                    ))
                }
            </div>
            { showCongrats && <SpaceCongrats onClick={closeCongrats} />}
            { showShare && <SpaceShare onClose={() => setShowShare(false)} spaceID={showShare} />}
        </motion.div>
    )
}

export default MySpaces
