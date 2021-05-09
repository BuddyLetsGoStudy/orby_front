import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { loadMySpaces, publishMySpaces } from "../../actions/SpaceCreation";
import { Link } from 'react-router-dom';
import './styles.css'

const MySpaces = () => {
    const dispatch = useDispatch();
    const [ spaces, updSpaces ] = useState([])
    const profileState = useSelector(state => state.Profile);

    useEffect(() => {
        // updSpaces([{"id":1,"author":"test@test.com","name":"1","description":"1","created":"2021-05-05T18:28:18.593703Z","avatar":"1","geo":"55.725206655970766, 37.531547851562514","published":false,"views":0,"options":"{\"positions\":[0,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0]}","date":"1","artobjects":[]},{"id":2,"author":"test@test.com","name":"1","description":"1","created":"2021-05-05T18:29:19.442215Z","avatar":"1","geo":"[55.97704947181426, 37.22393066406251]","published":false,"views":0,"options":"{\"positions\":[0,6,5,0,0,0,0,0,0,0,0,0,0,0,0,0]}","date":"1","artobjects":[]},{"id":3,"author":"test@test.com","name":"1","description":"1","created":"2021-05-05T18:38:27.578169Z","avatar":"1","geo":"55.749999999993705, 37.29534179687499","published":false,"views":0,"options":"{\"positions\":[0,8,7,0,0,0,0,0,0,0,0,0,0,0,0,0]}","date":"1","artobjects":[{"id":7,"name":"1","description":"1","created":"2021-05-05T18:37:25.554704Z","upload":"http://localhost:8000/media/artobjects/11MYXX0dPlY_0h3WbuC.png","options":"{\"width\":\"1\",\"height\":\"1\",\"artist\":\"1\",\"date\":\"1\"}","date":"","category":1,"author":1},{"id":8,"name":"1","description":"1","created":"2021-05-05T18:37:35.441085Z","upload":"http://localhost:8000/media/artobjects/139980541_839629040152350_1443537334060242660_n.jpg","options":"{\"width\":\"1\",\"height\":\"11\",\"artist\":\"1\",\"date\":\"1\"}","date":"","category":1,"author":1}]},{"id":5,"author":"test@test.com","name":"fuck","description":"1","created":"2021-05-05T18:55:10.731797Z","avatar":"http://localhost:8000/media/avatars/d142408f12c67d9e93f5d6f2663e3ac7--leather-texture-makeup-class.jpg","geo":"55.760842114831846,37.53978759765625","published":false,"views":0,"options":"{\"positions\":[0,12,11,0,0,0,0,0,0,0,0,0,0,0,0,0]}","date":"1","artobjects":[{"id":11,"name":"1","description":"11","created":"2021-05-05T18:54:52.943441Z","upload":"http://localhost:8000/media/artobjects/photo_2020-02-19_17-45-13_2O2dRc7.jpg","options":"{\"width\":\"1\",\"height\":\"1\",\"artist\":\"1\",\"date\":\"1\"}","date":"","category":1,"author":1},{"id":12,"name":"1","description":"1","created":"2021-05-05T18:55:02.481444Z","upload":"http://localhost:8000/media/artobjects/%D0%B0%D1%8B%D0%B2_Th6umNy.png","options":"{\"width\":\"1\",\"height\":\"1\",\"artist\":\"1\",\"date\":\"1\"}","date":"","category":1,"author":1}]},{"id":7,"author":"test@test.com","name":"1","description":"1","created":"2021-05-05T21:13:45.898720Z","avatar":"http://localhost:8000/media/avatars/11MYXX0dPlY_u2EWxEc.png","geo":"55.78096944186873,37.454643554687514","published":false,"views":0,"options":"{\"positions\":[0,16,15,0,0,0,0,0,0,0,0,0,0,0,0,0]}","date":"1","artobjects":[]},{"id":9,"author":"test@test.com","name":"1","description":"1","created":"2021-05-05T21:19:51.734863Z","avatar":"http://localhost:8000/media/avatars/11MYXX0dPlY_u2EWxEc.png","geo":"55.78096944186873,37.454643554687514","published":false,"views":0,"options":"{\"positions\":[0,16,15,0,0,0,0,0,0,0,0,0,0,0,0,0]}","date":"1","artobjects":[{"id":15,"name":"1","description":"1","created":"2021-05-05T21:13:31.681246Z","upload":"http://localhost:8000/media/artobjects/photo_2020-02-19_17-45-13_GG1Lkd0.jpg","options":"{\"width\":\"1\",\"height\":\"1\",\"artist\":\"1\",\"date\":\"1\"}","date":"","category":1,"author":1},{"id":16,"name":"1","description":"1","created":"2021-05-05T21:13:38.819796Z","upload":"http://localhost:8000/media/artobjects/maxresdefault_gBQRwhD.jpg","options":"{\"width\":\"1\",\"height\":\"1\",\"artist\":\"1\",\"date\":\"1\"}","date":"","category":1,"author":1}]},{"id":10,"author":"test@test.com","name":"1","description":"1","created":"2021-05-05T21:20:25.249933Z","avatar":"http://localhost:8000/media/avatars/11MYXX0dPlY_u2EWxEc.png","geo":"55.78096944186873,37.454643554687514","published":false,"views":0,"options":"{\"positions\":[0,16,15,0,0,0,0,0,0,0,0,0,0,0,0,0]}","date":"1","artobjects":[{"id":15,"name":"1","description":"1","created":"2021-05-05T21:13:31.681246Z","upload":"http://localhost:8000/media/artobjects/photo_2020-02-19_17-45-13_GG1Lkd0.jpg","options":"{\"width\":\"1\",\"height\":\"1\",\"artist\":\"1\",\"date\":\"1\"}","date":"","category":1,"author":1},{"id":16,"name":"1","description":"1","created":"2021-05-05T21:13:38.819796Z","upload":"http://localhost:8000/media/artobjects/maxresdefault_gBQRwhD.jpg","options":"{\"width\":\"1\",\"height\":\"1\",\"artist\":\"1\",\"date\":\"1\"}","date":"","category":1,"author":1}]},{"id":11,"author":"test@test.com","name":"1","description":"1","created":"2021-05-05T22:54:43.577878Z","avatar":"http://localhost:8000/media/avatars/photo_2020-02-19_17-45-13.jpg","geo":"55.85982975066385,37.57000000000001","published":false,"views":0,"options":"{\"positions\":[0,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0]}","date":"1","artobjects":[{"id":19,"name":"1","description":"1","created":"2021-05-05T22:54:08.023215Z","upload":"http://localhost:8000/media/artobjects/photo_2021-03-27_15-38-19.jpg","options":"{\"width\":\"1\",\"height\":\"1\",\"artist\":\"1\",\"date\":\"1\"}","date":"","category":1,"author":1}]},{"id":12,"author":"test@test.com","name":"1","description":"1","created":"2021-05-05T22:54:43.579425Z","avatar":"http://localhost:8000/media/avatars/photo_2020-02-19_17-45-13_xtdbS9t.jpg","geo":"55.85982975066385,37.57000000000001","published":false,"views":0,"options":"{\"positions\":[0,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0]}","date":"1","artobjects":[]},{"id":13,"author":"test@test.com","name":"PENIS","description":"CHTTOOOO SUKA","created":"2021-05-05T22:58:34.564116Z","avatar":"http://localhost:8000/media/avatars/139980541_839629040152350_1443537334060242660_n.jpg","geo":"55.677124528487354,37.61394531250001","published":false,"views":0,"options":"{\"positions\":[0,0,20,0,0,0,0,0,0,0,0,0,0,0,0,0]}","date":"SUKA","artobjects":[{"id":20,"name":"1","description":"1","created":"2021-05-05T22:58:22.242497Z","upload":"http://localhost:8000/media/artobjects/V0xRIH3N230_96spgM9.jpg","options":"{\"width\":\"1\",\"height\":\"1\",\"artist\":\"1\",\"date\":\"1\"}","date":"","category":1,"author":1}]}])
        dispatch(loadMySpaces())
    }, [])

    const publish = (id, published) => {
        dispatch(publishMySpaces(id, published ? false : true))
    }

    return (
        <div className={'myspaces'}>
            <div className={'myspaces-cont'}>
                {
                    profileState.spaces.map(space => (
                        <div className={'myspaces-block'}>
                            <Link to={`/edit/${space.id}`} className={'myspaces-block-card'} style={{backgroundImage: `url('${space.artobjects[0] && space.artobjects[0].upload}')`}}>
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
