import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { ArtobjectUploadAndUpdate, deleteArtobject } from '../../../../../actions/Artobjects'
import './styles.css'
import imageCompression from 'browser-image-compression';
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
        proportionOne: '',
        proportionTwo: '',
        artobject: {},
        create: true,
        submit: false, 
        error: false,
        compressing: false
    }

    imageToBase64 = (url, callback) => {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            var reader = new FileReader();
            reader.onloadend = function() {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }
    
    componentDidMount(){
        // document.body.classList.add('no-scroll');
        const { positionID, positions, artobjects } = this.props;
        const artobjectID = positions[positionID - 1]
        if (artobjectID !== 0) {
            const artobject = _.find(artobjects, {id: artobjectID})
            const { name, description, upload, options } = artobject;
            
            this.imageToBase64(upload, base64img => {
                this.setState({...JSON.parse(options), upload: base64img, name, description, create: false, artobjectID, file: false})
            })
        }
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
            console.log(image.src, file);
          
            image.onload = async e => {
                const { height, width } = e.srcElement;
                console.log(height, width);

                const proportionOne = height / width;
                const proportionTwo = width / height;
                console.log(proportionOne, proportionTwo)

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
        const { proportionOne, proportionTwo } = this.state;
       
        if (e.target.value === '' || (!proportionOne && !proportionTwo)){
            this.setState({ 
                width: '',
                height: ''
            }) 
            return null
        }
      
        if (e.target.name === 'height') {
            const height = e.target.value;  

            this.setState({ 
                width: Math.round(height * proportionTwo * 10) / 10,
                height: Math.round(height * 10) / 10
            })
        } else {
            const width = e.target.value;
            console.log('changedSize', width * proportionOne);
            // widthElem.value = width;
            // heightElem.value = width * proportionOne
            this.setState({ 
                width: Math.round(width * 10) / 10,
                height: Math.round(width * proportionOne * 10) / 10
            })
        }
        
    }

    submitArtobject = () => {
        this.setState({submit: true})
        const { name, file, description, artist, date, width, height, create, artobjectID, upload } = this.state;
        if (name && upload && artist && date && width && height) {
            const options = { width, height, artist, date };

            const formData = new FormData();
    
            formData.append("name", name)
            formData.append("description", description)
            file && formData.append("upload", file)
            formData.append("category", 1)
            formData.append("options", JSON.stringify(options))
            for (var pair of formData.entries()) {
                console.log(pair[0]+ ', ' + pair[1]); 
            }
    
            this.props.ArtobjectUploadAndUpdate(formData, create ? false : artobjectID)
                .then(artobject => {
                    console.log(artobject, 'che blyat')
                    this.props.onCreated(this.props.positionID, artobject)
                    this.props.onClose()
                })
                .catch(e => console.log('я ненавижу женщин', e))
        } else {
            this.setState({error: true})
        }
    }
    // submitArtobject = () => {
    //     const { name, file, description, artist, date, width, height, create, artobjectID, upload } = this.state;
    //     const options = { width, height, artist, date };

    //     const formData = new FormData();

    //     formData.append("name", name)
    //     formData.append("description", description)
    //     fetch(upload)
    //     .then(res => res.blob())
    //     .then(blob => {
    //         file ? formData.append("upload", file) : formData.append("upload", new File([blob], "File name",{ type: "image/png" }))
    //         formData.append("category", 1)
    //         formData.append("options", JSON.stringify(options))
    //         for (var pair of formData.entries()) {
    //             console.log(pair[0]+ ', ' + pair[1]); 
    //         }
    
    //         this.props.ArtobjectUploadAndUpdate(formData, create ? false : artobjectID)
    //             .then(artobject => {
    //                 console.log(artobject, 'che blyat')
    //                 this.props.onCreated(this.props.positionID, artobject)
    //                 this.props.onClose()
    //             })
    //             .catch(e => console.log('я ненавижу женщин', e))
    //     })
    // }
    deleteArtobject = () => {
        this.props.deleteArtobject(this.state.artobjectID)
            .then(() => {
                this.props.onDeleted(this.props.positionID)
                this.props.onClose()
            })
            .catch(e => console.log('яя в говвмно', e))
    }

    updState = e => this.setState({[e.target.name]: e.target.value})

    render() {
        const { onClose, positionID } = this.props;
        const { name, description, artist, width, height, upload, date, create, submit, error, compressing } = this.state;
        return (
            <div className={'create-popup background-transparent'}>
                <div className={'create-popup-cont'}>
                    <div className={'create-popup-header'}>
                        Add artwork
                        <div className={'create-popup-header-close'} onClick={onClose}></div>
                    </div>
                    <div className={'create-popup-body-add'}>
                        <div className={`create-popup-add-file ${submit && !upload ? 'input-error' : ''}`} style={{backgroundImage: upload ? `url('${upload}')` : ''}}>
                            {
                                !upload && !compressing &&
                                <div className={'create-popup-add-file-text'}>
                                    Drag & drop your artwork here
                                    <div>
                                    or <span>Choose</span> from computer
                                    </div>
                                </div>
                            }
                            <div className={'create-popup-add-file-loader'} style={{opacity: compressing ? 1 : 0}}/>
                            <input type="file" className={'create-popup-add-file-input'} onChange={this.imageChange} name="upload" accept="image/*, .glb"></input>
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
                                </div>
                            </div>
                            <div className={'create-popup-add-input-cont'}>
                                <div className={'create-popup-add-input-text'}>Date of creation</div>
                                <input type="text" className={`create-popup-add-input ${submit && !date ? 'input-error' : ''}`} placeholder={'Type when work was created'} name={'date'} onChange={this.updState} value={date}></input>
                            </div>
                            <textarea className={'create-popup-add-textarea'} placeholder='Add artwork description&#10;Tell a little story about this work' name={'description'} onChange={this.updState} value={description}></textarea>
                        </div>
                    </div>
                    <div className={`auth-modal-error-msg ${error ? 'auth-modal-error-msg-visible create-popup-error-msg' : ''}`}>You must upload a picture (jpg or png), and fill all fields to continue</div>
                    <div className={'create-popup-btn-cont'}>
                        {!create && <div className={'create-popup-btn-ok create-popup-mrg-top'} onClick={this.deleteArtobject}>Delete artwork</div>}
                        <div className={'create-popup-btn-ok create-popup-mrg-top'} onClick={this.submitArtobject}>OK</div>
                    </div>
                </div>
            </div>
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
