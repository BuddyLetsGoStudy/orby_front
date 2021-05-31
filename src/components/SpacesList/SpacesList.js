import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion"
import { pageAnimation } from '../../variables'
import { loadAllSpaces } from "../../actions/SpaceCreation";
import { Link } from 'react-router-dom';
import './styles.css'

const SpacesList = () => {
    const dispatch = useDispatch();
    const listSpacesState = useSelector(state => state.ListSpaces);

    useEffect(() => {
        dispatch(loadAllSpaces())
    }, [])

    return (
        <motion.div className={'spaceslist'} {...pageAnimation}>
            <div className={'spaceslist-cont'}>
                {
                    listSpacesState.spaces.map(space => (
                        <div className={'spaceslist-block'}>
                            <a href={`https://view.orby.space/${space.id}`} className={'spaceslist-block-card'}>
                                <div className={'spaceslist-block-card-bg'} style={{backgroundImage: `url('${space.artobjects[0] && space.artobjects[0].upload}')`}} />
                                <div className={'spaceslist-block-card-avatar'} style={{backgroundImage: `url('${space.avatar}')`}}/>
                                <div className={'spaceslist-block-card-bottom'}>
                                    <div className={'spaceslist-block-card-title'}>{space.name}</div>
                                    <div className={'spaceslist-block-card-geo'}>Moscow, Russia</div>
                                </div>
                            </a>
                        </div>
                    ))
                }
            

                
            </div>
        </motion.div>
    )
}

export default SpacesList
