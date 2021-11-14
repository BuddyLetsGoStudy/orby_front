import React, { Component, Suspense } from 'react'
import { connect } from 'react-redux'
import { AnimatePresence, motion } from "framer-motion"
import _ from 'lodash'
import { ArtobjectUploadAndUpdate, deleteArtobject } from '../../../../../actions/Artobjects'
import './styles.css'
import imageCompression from 'browser-image-compression';
import { Canvas, useLoader } from "react-three-fiber";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import ThreeDPreview from './ThreeDPreview/ThreeDPreview'
import Button from '../../../../Button/Button'


function Asset({ url }) {
    const gltf = useLoader(GLTFLoader, url)
    return <primitive object={gltf.scene} />
  }

class AddArtobject extends Component {
    state = {
        file: '',
        upload: '',
        name: '',
        description: '',
        artist: '',
        date: '',
        width: '',
        height: '',
        length: '',
        proportionOne: '',
        proportionTwo: '',
        artobject: {},
        create: true,
        submit: false, 
        error: false,
        compressing: false,
        threeD: false,
        threeDChanged: false,
        deleteConfirmModal: false
    }

    imageToBase64 = (url, callback) => {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            var reader = new FileReader();
            reader.onloadend = function() {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
            // const { height, width } = xhr.response.srcElement;
            // console.log(height, width);
            // const proportionOne = height / width;
            // const proportionTwo = width / height;
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }
    
    componentDidMount(){
        // document.body.classList.add('no-scroll');
        const { positionID, positions, artobjects } = this.props;
        const artobjectID = positions[positionID - 1]
        if (artobjectID !== 0 && positionID < 13) {
            const artobject = _.find(artobjects, {id: artobjectID})
            const { name, description, upload, options } = artobject;
            const { width, height } = JSON.parse(options)
            const proportionOne = height / width;
            const proportionTwo = width / height;

            this.imageToBase64(upload, base64img => {
                this.setState({...JSON.parse(options), upload: base64img, name, description, create: false, artobjectID, file: false, proportionOne, proportionTwo})
            })
        } else if(artobjectID !== 0) {
            const artobject = _.find(artobjects, {id: artobjectID})
            const { name, description, upload, options } = artobject;
            const { width, height, length } = JSON.parse(options)
            this.setState({...JSON.parse(options), upload, name, description, create: false, artobjectID, file: false, threeD: true, width, height, length})
        }

        positionID > 12 && this.setState({threeD: true})

       
    }

    threeDChange = async e => {
        e.preventDefault();
        let file = e.target.files[0]
        this.setState({file: file, error: false})
   
        const formData = new FormData();
    
        formData.append("name", 1)
        formData.append("description", 1)
        formData.append("upload", file)
        formData.append("category", 1)
        formData.append("options", JSON.stringify(1))

        this.props.ArtobjectUploadAndUpdate(formData, false)
            .then(artobject => {
                this.setState({upload: artobject.upload, artobjectID: artobject.id, threeDChanged: true, file: ''})

                // this.props.onCreated(this.props.positionID, artobject)
                // this.props.onClose()
            })
            .catch(e => console.log('я ненавижу женщин', e))


    }

    threeDUploadError = () => {
        this.props.deleteArtobject(this.state.artobjectID)
        this.setState({error: true, errorMsg: 'Something wrong with your 3D object!', upload: '', artobjectID: '', threeDChanged: false})
    }

    imageChange = async e => {
        e.preventDefault();
        this.setState({compressing: true})
        let reader = new FileReader();
        let file = await imageCompression(e.target.files[0], { maxSizeMB: 9})
        this.setState({compressing: false})

        reader.onloadend = () => {
            const image = new Image();
            image.src = reader.result;
          
            image.onload = async e => {
                const { height, width } = e.srcElement;
                const proportionOne = height / width;
                const proportionTwo = width / height;

                this.setState({
                    file: file,
                    upload: reader.result,
                    proportionOne,
                    proportionTwo,
                    height: '',
                    width: ''
                })
            }
        }
        reader.readAsDataURL(file);
    }


    changeSize = e => {
        const { proportionOne, proportionTwo, threeD } = this.state;
       
        if (threeD) {
            this.setState({[e.target.name]: e.target.value})
            return null
        }

        if (e.target.value === '' || (!proportionOne && !proportionTwo)){
            this.setState({ 
                width: '',
                height: ''
            }) 
            return null
        }

        if (isNaN(e.target.value)) return null
      
        if (e.target.name === 'height') {
            let height = e.target.value;  
            let newHeight =  Math.round(height * 10) / 10
            let newWidth = Math.round(height * proportionTwo * 10) / 10
            if (newHeight >= 200 || newWidth >= 250) {
                newHeight = 200
                newWidth = Math.round(newHeight * proportionTwo * 10) / 10
                if (newWidth >= 250) {
                    newWidth = 250
                    newHeight =  Math.round(newWidth * proportionOne * 10) / 10
                }
            }
            
            this.setState({ 
                width: newWidth,
                height: newHeight
            })
        } else {
            let width = e.target.value;
            let newHeight = Math.round(width * proportionOne * 10) / 10
            let newWidth = Math.round(width * 10) / 10
            if (newWidth >= 250 || newHeight >= 200) {
                newWidth = 250
                newHeight = Math.round(newWidth * proportionOne * 10) / 10
                if (newHeight >= 200) {
                    newHeight = 200
                    newWidth =  Math.round(newHeight * proportionTwo * 10) / 10
                }
            }
            this.setState({ 
                width: newWidth,
                height: newHeight
            })
        }
    }

    submitArtobject = () => {
        this.setState({submit: true})
        const { name, file, description, artist, date, width, height, length, create, artobjectID, upload, threeD, threeDChanged } = this.state;
        if (name && upload && artist && date && width && height) {
            const options = { width, height, artist, date, length };

            const formData = new FormData();
    
            formData.append("name", name)
            formData.append("description", description)
            !threeDChanged && file && formData.append("upload", file)
            formData.append("category", threeD ? 2 : 1)
            formData.append("options", JSON.stringify(options))
            // for (var pair of formData.entries()) {
            //     console.log(pair[0]+ ', ' + pair[1]); 
            // }
    
            this.props.ArtobjectUploadAndUpdate(formData, create ? threeDChanged ? artobjectID : false : artobjectID)
                .then(artobject => {
                    this.props.onCreated(this.props.positionID, artobject)
                    this.props.onClose()

                })
                .catch(e => console.log('я ненавижу женщин', e))
        } else {
            this.setState({error: true, errorMsg: 'You must upload an artobject, and fill all fields to continue'})
        }
    }

    deleteArtobject = () => this.setState({deleteConfirmModal: true})
    closeDeleteArtobject = () => this.setState({deleteConfirmModal: false})


    deleteArtobjectConfirmed = () => {
        const spaceid = window.location.href.split('/')[window.location.href.split('/').length - 1]
        this.props.deleteArtobject(this.state.artobjectID, spaceid)
            .then(() => {
                this.props.onDeleted(this.props.positionID)
                this.props.onClose()
            })
            .catch(e => console.log('яя в говвмно', e))
    }

    updState = e => this.setState({[e.target.name]: e.target.value})

    render() {
        const { onClose, positionID} = this.props;
        const { name, description, artist, width, height, length, upload, date, create, submit, error, errorMsg, compressing, threeD, file, deleteConfirmModal } = this.state;
        return (
            // <motion.div className={'create-popup background-transparent'} initial={{opacity: 0, scale: 0.1, translateY: '-20vh'}} animate={{opacity: 1, scale: 1, translateY: '0vh'}} exit={{opacity: 0, scale: 0.1, translateY: '-20vh'}} transition={{ ease: "easeOut", duration: 0.15 }}>
            <motion.div className={'create-popup background-transparent'} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{ ease: "easeOut", duration: 0.15 }}>
                <div className={'create-popup-cont'}>
                    <div className={'create-popup-header'}>
                        { `${create ? 'Add' : 'Edit'} ${threeD ? '3D object' : 'artwork'}`}
                        
                        <div className={'create-popup-header-close'} onClick={onClose}></div>
                    </div>
                    <div className={'create-popup-body-add'}>
                        <div className={`create-popup-add-file ${threeD ? 'create-popup-add-file-3d' : ''}  ${submit && !upload ? 'input-error' : ''}  ${submit && !upload && threeD ? 'create-popup-add-file-3d-error' : ''} `}>
                
                            { upload && !threeD && 
                                <motion.div className={'create-popup-add-file-preview'} style={{backgroundImage: `url('${upload}')`}} initial={{opacity: 0}} animate={{opacity: 1}} transition={{ ease: "easeOut", duration: 0.5 }}/>
                            }
                        
                            {
                                !upload && !compressing &&
                                <div className={'create-popup-add-file-text'}>
                                    {`Drag & drop your ${ threeD ? '3D model' : 'artwork' } here`}
                                    <div>
                                    or <span>Choose</span> from computer<br></br> {threeD && <penis>.glb .gltf or .obj (max 20 mb)</penis>}
                                    </div>
                                </div>
                            }
                            {
                                upload && threeD && 
                                <ThreeDPreview url={upload} onError={this.threeDUploadError} size={'big'} animate={true} />
                            }
                            <div className={'create-popup-add-file-loader'} style={{opacity: compressing ? 1 : 0}}/>
                            {
                                threeD ? 
                                <input type="file" className={'create-popup-add-file-input'} onChange={this.threeDChange} name="upload" accept=".glb, .gltf, .obj"></input>
                                :
                                <input type="file" className={'create-popup-add-file-input'} onChange={this.imageChange} name="upload" accept="image/*"></input>
                            }
                        </div>
                        <div className={'create-popup-add-inputs'}>
                            <div className={'create-popup-add-input-cont'}>
                                <div className={'create-popup-add-input-text'}>Artwork name</div>
                                <input type="text" className={`create-popup-add-input ${submit && !name ? 'input-error' : ''}`} placeholder={'Type artwork name'} name={'name'} onChange={this.updState} value={name}></input>
                            </div>
                            <div className={'create-popup-add-input-cont'}>
                                <div className={'create-popup-add-input-text'}>Artist</div>
                                <input type="text" className={`create-popup-add-input ${submit && !artist ? 'input-error' : ''}`} placeholder={'Type Artist name'} name={'artist'} onChange={this.updState} value={artist}></input>
                            </div>
                            <div className={'create-popup-add-input-cont '}>
                                <div className={'create-popup-add-input-text'}>Size</div>
                                <div className={'create-popup-add-input-short-cont'}>
                                    <input type="text" className={`create-popup-add-input create-popup-add-input-short ${submit && !width ? 'input-error' : ''}`} placeholder={'Width (cm)'} name={'width'} onChange={this.changeSize} value={width} ref={ref => this.widthElem = ref}></input>
                                    {/* <div className={'create-popup-add-input-short-separator'}>X</div> */}
                                    <input type="text" className={`create-popup-add-input create-popup-add-input-short ${submit && !height ? 'input-error' : ''}`} placeholder={'Height (cm)'} name={'height'} onChange={this.changeSize} value={height} ref={ref => this.heightElem = ref}></input>
                                    { threeD && <input type="text" className={`create-popup-add-input create-popup-add-input-short ${submit && !length ? 'input-error' : ''}`} placeholder={'Length (cm)'} name={'length'} onChange={this.changeSize} value={length}></input> }
                                </div>
                            </div>
                            <div className={'create-popup-add-input-cont'}>
                                <div className={'create-popup-add-input-text'}>Date of creation</div>
                                <input type="text" className={`create-popup-add-input ${submit && !date ? 'input-error' : ''}`} placeholder={'Type when work was created'} name={'date'} onChange={this.updState} value={date}></input>
                            </div>
                            <textarea className={'create-popup-add-textarea'} placeholder='Add artwork description&#10;Tell a little story about this work' name={'description'} onChange={this.updState} value={description}></textarea>
                        </div>
                    </div>
                    <div className={`auth-modal-error-msg ${error ? 'auth-modal-error-msg-visible create-popup-error-msg' : ''}`}>{errorMsg}</div>
                    <div className={'create-popup-btn-cont'}>
                        {!create && <Button onClick={this.deleteArtobject} text={'Delete artwork'} margin={'0 25px 0 0'}/>}
                        <Button onClick={this.submitArtobject} text={'OK'}/>
                    </div>
                </div>
                {
                    deleteConfirmModal &&
                    <motion.div className={"create-popup-delete-bg"} initial={{opacity: 0}} animate={{opacity: 1}} transition={{ ease: "easeOut", duration: 0.5 }}>
                        <div className={"create-popup-delete"}>
                            <div className={"create-popup-delete-title"}>Are you sure?</div>
                            <div className={"create-popup-delete-btn-cont"}>
                                <Button onClick={this.deleteArtobjectConfirmed} text={'Delete'} margin={'0 25px 0 0'}/>
                                <Button onClick={this.closeDeleteArtobject} text={'Cancel'}/>
                            </div>
                            <div className={"create-popup-delete-close"} onClick={this.closeDeleteArtobject}/>
                        </div>
                    </motion.div>
                }
            </motion.div>
        )
    }
}


const mapStateToProps = state => ({
    loading: state.Artobjects.loading,
    artobject: state.Artobjects.artobject,
    artobjects: state.Space.space.artobjects,
    positions: state.Space.space.positions,
})

export default connect(mapStateToProps, { ArtobjectUploadAndUpdate, deleteArtobject })(AddArtobject);
