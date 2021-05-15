import React, { Component } from 'react'
import { connect } from 'react-redux'
import { YMaps, Map, Placemark } from 'react-yandex-maps'


import './styles.css'

class SpaceMeta extends Component {
    state = {
        submit: false,
        error: false
    }
    imageChange = e => {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];
        
        reader.onloadend = () => {
            const image = new Image();
            image.src = reader.result;
            image.onload = e => {
                this.props.dispatch({type: 'UPDATE_SPACE', payload: {field: 'avatar', value: reader.result}})
                this.props.dispatch({type: 'UPDATE_SPACE', payload: {field: 'avatarRaw', value: file}})
            }
        }
        reader.readAsDataURL(file);
    }

    mapClick = e => this.props.dispatch({type: 'UPDATE_SPACE', payload: {field: 'geo', value: e.get('coords')}})

    onChange = e => this.props.dispatch({type: 'UPDATE_SPACE', payload: {field: e.target.name, value: e.target.value}})

    submit = () => {
        const { space, onSubmit } = this.props;
        const { avatar, geo, name, date } = space;
        this.setState({submit: true})

        name && date && geo ? onSubmit() : this.setState({error: true})
    }

    render() {
        const { edit, space } = this.props;
        const { avatar, geo, name, date, description } = space;
        const { submit, error } = this.state;
        return (
            <div className={'create-meta-cont'}>
                <div className={'create-meta-avatar'} style={{backgroundImage: avatar ? `url('${avatar}')` : ''}}>
                    {
                        !avatar &&
                        <div className={'create-meta-avatar-text'}>
                            <span>Upload</span> your gallery avatar
                        </div>
                    }
                    <input type="file" className={'create-meta-avatar-input'} onChange={this.imageChange} name="avatar" accept="image/*, .glb"></input>
                </div>
                <div className={'create-meta-name-and-date'}>
                    <div className={'create-meta-name create-meta-input'}>
                        <div>Type your gallery name</div>
                        <input className={`${submit && !name ? 'input-error' : ''}`} name="name" placeholder='ex. Triumph Gallery' onChange={this.onChange} value={name}/>
                    </div>
                    <div className={'create-meta-date create-meta-input'}>
                        <div>Date of gallery est.</div>
                        <input className={`${submit && !date ? 'input-error' : ''}`} name='date' placeholder='ex. 2001' onChange={this.onChange} value={date}/>
                    </div>
                </div>
                <textarea className={'create-meta-description'} placeholder='Add a little story about your gallery,&#10;if you wanna do it later, just skip this step.' onChange={this.onChange} name="description" value={description}/>
                <div className={'create-meta-map-title'}>Set gallery location</div>
                <div className={`create-meta-map ${submit && geo[0] === 0 ? 'input-error' : ''}`}>
                    <YMaps
                        enterprise
                        query={{
                            apikey: '2e5ff6ae-71b4-4e26-baec-fbe0a49a07fd',
                        }}
                        >
                        <Map onClick={this.mapClick} defaultState={{ center: [55.75, 37.57], zoom: 9 }} width={530} height={320} className={"space-form-location-map-size"}>
                        <Placemark geometry={geo} />
                        </Map>
                    </YMaps>
                </div>
                <div className={`auth-modal-error-msg ${error && (!name || !date || geo[0] === 0) ? 'auth-modal-error-msg-visible space-meta-error' : ''}`}>{` ${!name || !date || geo[0] === 0 ? 'You must' : ''} ${ !name || !date ? `fill all the required fields ${geo[0] === 0 ? 'and' : ''}` : ''} ${geo[0] === 0 ? 'set gallery location to continue' : ''}`}</div>
                <div className={`create-meta-button ${!date || !name || geo[0] === 0 ? 'button-disabled' : ''}`} onClick={this.submit}>{edit ? 'Save' : 'Next'}</div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    space: state.Space.space, 
    edit: state.Space.edit
})

const mapDispatchToProps = dispatch => ({
    dispatch               
 })

export default connect(mapStateToProps, mapDispatchToProps)(SpaceMeta);
