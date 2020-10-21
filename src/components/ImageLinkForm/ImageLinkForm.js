import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({onInputChange, onButtonSubmit}) => {
    return(
        <div>
        <p className="f3">
            This React application will detect faces in the images you upload... Try it out...
        </p>
            <div className="center">
                <div className=" form center pa4 br3 shadow-5">
                    <input onChange={onInputChange} type="text" className='f4 pa2 w-70 center' ></input>
                    <button onClick={onButtonSubmit} className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'>Find Faces!</button>
                </div>
            </div>
        </div>
    );
}
export default ImageLinkForm;