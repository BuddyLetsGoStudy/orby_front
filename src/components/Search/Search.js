import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion"
import { pageAnimation } from '../../variables'
import { searchSpaces } from "../../actions/Search";
import { Link, useParams } from 'react-router-dom';
import SpaceCard from '../SpaceCard/SpaceCard'
import './styles.css'


const Search = () => {
    const dispatch = useDispatch();
    const [viewType, setViewType] = useState('list')
    const searchState = useSelector(state => state.Search);
    const { spaces, loading } = searchState;
    const { query } = useParams();

    useEffect(() => {
        dispatch({type: 'SEARCH_QUERY_CHANGE', payload: query})
        dispatch(searchSpaces(query))
    }, [])


    return (
        <motion.div className={'search-page'} {...pageAnimation}>
            <div className={'search-page-header-bg'}>
                <div className={'search-page-header'}>
                    <div className={'search-page-header-title'}>
                        Results for <span>{query}</span>
                    </div>
                    <div className={'search-page-header-amount'}>{spaces.length} galleries</div>
                </div>
            </div>

            {
                !loading &&
                <div className={'spaceslist'}>
                    <div className={'spaceslist-cont'}>
                        {
                            spaces.map(space => <SpaceCard space={space} />)
                        }
                    </div>
                </div>
            }
           
        </motion.div>
    )
}

export default Search
