import React, { Component } from 'react'
import './styles.css'

export default class AddArtobject extends Component {
    state = {
        file: '',
        upload: '',
        proportionOne: '',
        proportionTwo: ''
    }
    
    componentDidMount(){
        // document.body.classList.add('no-scroll');
    }

    imageChange = e => {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];
        
        reader.onloadend = () => {
            const image = new Image();
            image.src = reader.result;
            console.log(image.src, file);
          
            image.onload = e => {
                const { height, width } = e.srcElement;
                console.log(height, width);

                const proportionOne = height / width;
                const proportionTwo = width / height;
                console.log(proportionOne, proportionTwo)
                this.setState({
                    file: file,
                    upload: reader.result,
                    proportionOne,
                    proportionTwo
                })
            }
        }
        reader.readAsDataURL(file);
    }

    render() {
        const { onClose, positionID } = this.props;
        const { upload } = this.state;
        return (
            <div className={'create-popup background-transparent'}>
                <div className={'create-popup-cont'}>
                    <div className={'create-popup-header'}>
                        Add artwork
                        <div className={'create-popup-header-close'} onClick={onClose}></div>
                    </div>
                    <div className={'create-popup-body-add'}>
                        <div className={'create-popup-add-file'} style={{backgroundImage: upload ? `url('${upload}')` : ''}}>
                            {
                                !upload &&
                                <div className={'create-popup-add-file-text'}>
                                    Drag & drop your artwork here
                                    <div>
                                    or <span>Choose</span> from computer
                                    </div>
                                </div>
                            }
                            <input type="file" className={'create-popup-add-file-input'} onChange={this.imageChange} name="upload" accept="image/*, .glb"></input>
                        </div>
                        <div className={'create-popup-add-inputs'}>
                            <div className={'create-popup-add-input-cont'}>
                                <div className={'create-popup-add-input-text'}>Artwork name</div>
                                <input type="text" className={'create-popup-add-input'} placeholder={'Type artwork name'}></input>
                            </div>
                            <div className={'create-popup-add-input-cont'}>
                                <div className={'create-popup-add-input-text'}>Artist</div>
                                <input type="text" className={'create-popup-add-input'} placeholder={'Type Artist name'}></input>
                            </div>
                            <div className={'create-popup-add-input-cont '}>
                                <div className={'create-popup-add-input-text'}>Size</div>
                                <div className={'create-popup-add-input-short-cont'}>
                                    <input type="text" className={'create-popup-add-input create-popup-add-input-short'} placeholder={'Width (cm)'}></input>
                                    <div className={'create-popup-add-input-short-separator'}>X</div>
                                    <input type="text" className={'create-popup-add-input create-popup-add-input-short'} placeholder={'Height (cm)'}></input>
                                </div>
                            </div>
                            <div className={'create-popup-add-input-cont'}>
                                <div className={'create-popup-add-input-text'}>Date of creation</div>
                                <input type="text" className={'create-popup-add-input'} placeholder={'Type when work was created'}></input>
                            </div>
                            <textarea className={'create-popup-add-textarea'} placeholder='Add artwork description&#10;Tell a little story about this work'></textarea>
                        </div>
                    </div>
                    <div className={'create-popup-btn-ok create-popup-mrg-top'} onClick={onClose}>OK</div>
                </div>
            </div>
        )
    }
}
