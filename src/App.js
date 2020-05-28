import React from 'react';
import Particles from 'react-particles-js';
import Signin from './components/Signin/Signin';
import Signup from './components/Signup/Signup';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';
import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 75,
      density: {
        enable: true,
        value_area: 800
      }
    }
  },
  interactivity: {
    detect_on: "window",
    events: {
        onhover: {
            enable: true,
            mode: "repulse"
        },
        resize: true
    }
  }
}

const initialState = {
    input: '',
    imageUrl: '',
    boxes: [],
    route: 'signin', 
    isSignedIn: false, 
    isProfileOpen: false,
    user: {
      id: '',
      name: '', 
      email: '', 
      entries: 0, 
      joined: '' 
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        email: data.email, 
        id: data.id,
        name: data.name, 
        entries: data.entries, 
        joined: data.joined
      }
    })
  }
 
  calculateFaceLocations = (data) => {
    return data.outputs[0].data.regions.map(face => {
      const clarifaiFace = face.region_info.bounding_box;
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
    })
  }

  displayFaceBoxes = (boxes) => {
    this.setState({ boxes });
  }

  onInputChange = (e) => {
    this.setState({
      input: e.target.value
    })
  }

  onSubmit = () => {
    this.setState({
      imageUrl: this.state.input
    })
    // fetch('https://enigmatic-badlands-69734.herokuapp.com/imageurl', {
      fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if (response) {
        // fetch('https://enigmatic-badlands-69734.herokuapp.com/image', {
          fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState({user: {...this.state.user,
            entries: count
          }})
        })
        .catch(console.log)
      } 
      this.displayFaceBoxes(this.calculateFaceLocations(response))
    })
    .catch(err => console.log(err))
    }

    onRouteChange = (route) => {
      if (route === 'signout') {
        return this.setState(initialState)
       } else if (route === 'home') {
          this.setState({
            isSignedIn: true
          })
        }
      this.setState({
        route
      })
    }

    toggleModal = () => {
      this.setState(prevState => ({
        ...prevState,
        isProfileOpen: !prevState.isProfileOpen
      }))
    }

  render() {
    const { isSignedIn, imageUrl, route, boxes, isProfileOpen } = this.state;
    return (
      <div className="App">
        <Particles className="particles"
          params={particlesOptions}
        />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}
        toggleModal={this.toggleModal} />
         {isProfileOpen && <Modal>
           <Profile isProfileOpen={isProfileOpen} toggleModal={this.toggleModal} />
          </Modal>}
        { route === 'home'
        ?<div>
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries}/> 
          <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onSubmit} />
          <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
        </div>
        :(
        route === 'signin' ?  <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        : <Signup loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )
        }
      </div>
    );
  }
}

export default App;
