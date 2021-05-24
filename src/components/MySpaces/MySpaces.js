import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { loadMySpaces, publishMySpaces } from "../../actions/SpaceCreation";
import { Link } from 'react-router-dom';
import './styles.css'

const MySpaces = () => {
    const dispatch = useDispatch();
    const profileState = useSelector(state => state.Profile);

    useEffect(() => {
        dispatch(loadMySpaces())
    }, [])

    const publish = (id, published) => {
        dispatch(publishMySpaces(id, published ? false : true))
    }

    return (
        <div className={'myspaces'}>
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
                                <div className={'myspaces-block-card-bg'}  style={{backgroundImage: `url('${space.artobjects[0] && space.artobjects[0].upload}')`}} />
                                <div className={'myspaces-block-card-avatar'} style={{backgroundImage: `url('${space.avatar}')`}}/>
                                <div className={'myspaces-block-card-bottom'}>
                                    <div className={'myspaces-block-card-title'}>{space.name}</div>
                                    <div className={'myspaces-block-card-geo'}>Moscow, Russia</div>
                                </div>
                            </Link>
                            <div className={'myspaces-block-publish'}>
                                <div className={'myspaces-block-publish-marble'}/>
                                <div className={'myspaces-block-publish-text'}>Publish</div>
                                <div className={`edit-publish-switch ${ space.published ? 'edit-publish-switch-on' : ''}`} onClick={() => publish(space.id, space.published)}/>
                            </div>
                        </div>
                    ))
                }
            

                
            </div>
        </div>
    )
}

export default MySpaces
