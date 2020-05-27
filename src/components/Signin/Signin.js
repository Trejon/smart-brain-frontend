import React from 'react';
import './Signin.css'

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }

  onChange = (e) => {
    const {name, value} = e.target
    this.setState({
      [name]: value
    })
  }

  onSubmitSignIn = () => {
    // fetch('https://enigmatic-badlands-69734.herokuapp.com/signin', {
    fetch('http://localhost:3000/signin', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
    .then(response => response.json())
    .then(user => {
      if(user.id){
        this.props.loadUser(user);
        this.props.onRouteChange('home');
      }
    })
  }

  render() {
    const { onRouteChange } = this.props;
    return (
      <div>
        <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email">Email</label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black"
                  type="email" name="email"
                  id="email"
                  onChange={this.onChange}
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                <input
                   className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black"
                   type="password" name="password"
                   id="password"
                   onChange={this.onChange}
                />
              </div>
            </fieldset>
            <div className="">
              <input
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit"
                value="Sign in"

                onClick={this.onSubmitSignIn}
              />
            </div>
            <div className="lh-copy mt3">
              <p onClick={() => onRouteChange('signup')} className="f6 link dim black db pointer">Sign up</p>
            </div>
          </div>
        </main>
        </article>
      </div>
    );
  }
}

export default Signin;
