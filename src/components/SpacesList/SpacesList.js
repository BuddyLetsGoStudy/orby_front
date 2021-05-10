import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
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
        <div className={'spaceslist'}>
            <div className={'spaceslist-cont'}>
                {
                    listSpacesState.spaces.map(space => (
                        <div className={'spaceslist-block'}>
                            <Link to={``} className={'spaceslist-block-card'} style={{backgroundImage: `url('${space.artobjects[0] && space.artobjects[0].upload}')`}}>
                                <div className={'spaceslist-block-card-avatar'} style={{backgroundImage: `url('${space.avatar}')`}}/>
                                <div className={'spaceslist-block-card-bottom'}>
                                    <div className={'spaceslist-block-card-title'}>{space.name}</div>
                                    <div className={'spaceslist-block-card-geo'}>Moscow, Russia</div>
                                </div>
                            </Link>
                        </div>
                    ))
                }
            

                
            </div>
        </div>
    )
}

export default SpacesList
