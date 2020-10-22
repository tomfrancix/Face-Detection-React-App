import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import './App.css';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register'

const app = new Clarifai.App({
 apiKey: '5639ad22ad4b449a9732ed1bcd1c3af7'
});

const particlesOptions = {
    particles: {
        number: {
            value: 30,
            density: {
                enable:true,
                value_are: 800
            }
        },
        line_linked: {
            shadow: {
                enable:true,
                color:"#3CA901",
                blur: 5
            }
        }
    }
}

class App extends Component {
    
    constructor() {
        super()
        this.state = {
            input: '',
            imageUrl: '',
            box: {},
            route: 'signin',
            isSignedIn: false,
            user: {
                id: '',
                name: '',
                email: '',
                entries: 0,
                joined:''
            }
        }
    }
    
    loadUser = (data) => {
        this.setState({user: {
            id: data.id,
            name: data.name,
            email: data.email,
            entries: data.entries,
            joined: data.joined
        }})
    }

    
    calculateFaceLocation = (data) => {
        console.log('hello');
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputImage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
        }
    }
    
    displayFaceBox = (box) => {
        console.log(box);
        this.setState({box: box});
    }
    
    onInputChange = (event) => {
        this.setState({input: event.target.value});
    }
     
    onButtonSubmit = () => {
        this.setState({imageUrl: this.state.input});
        app.models
        .predict(
            Clarifai.FACE_DETECT_MODEL, 
            this.state.input)
         .then(response => {
        console.log('hi', response)
        if (response) {
          fetch('http://localhost:3002/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
    }
    
    onRouteChange = (route) => {
        //Changes the 'signin' ROUTE to home
        
        if(route === 'signin') {
            this.setState({isSignedIn: false})
        } else if (route === 'home') {
            this.setState({isSignedIn: true})
        }
        
        this.setState({route: route});
    }
    
    
    
    render() {
      return (
        <div className="App">
          <Particles params={particlesOptions} className='particles' />
          <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        { this.state.route === 'home' 
            ?
              <div>
                <Logo />
                <Rank name={this.state.user.name} entries={this.state.user.entries} />
                <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
                <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/> 
              </div>
            : 
            ( 
            this.state.route === 'signin' 
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            ) 
        }
        </div>
      );
    }
}

export default App;
