import './Login.css';
import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            reset: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.verify = this.verify.bind(this);

    }

    handleChange(event) {
        // event.preventDefault();
        this.setState({ [event.target.name]: event.target.value });
    }


    async handleSubmit(e) {
        e.preventDefault();
        const res = await this.verify()
        let access = false;

        access = res.data.access;

        if (access) {
            this.props.authorize(this.state.username, this.state.password)
        }
        else {
            alert('Either username did not exists or password was wrong')
        }
    }

    async verify() {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:5000/verify',
            data: { 'username': this.state.username, 'password': this.state.password },
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(error => {
            console.log(error)
            return false;
        });

        return res;
    }


    async resetPassword(event) {
        // let possibleCharacters = ['#', 'I', 'B', 'M', 'C', 'I', 'C'];
        // let newPassword = '';
        // let len = possibleCharacters.length;
        // for (let i = 0; i < possibleCharacters.length; i++) {
        //     newPassword += possibleCharacters[Math.floor(Math.random() * len)];
        // }
        event.preventDefault();
        axios({
            method: 'POST',
            url: 'http://localhost:5000/resetPassword',
            data: { 'username': this.state.username },
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            prompt('You\'re new password is:', res.data.newPassword);
            this.setState({ reset: false })
        }).catch(error => {
            alert("Username did not exists");
            console.log(error)
            return false;
        });
    }

    loginForm() {
        return (
            <form className='form' onSubmit={this.handleSubmit}>
                <div className='row Login-section'>
                    <input type='text'
                        name='username'
                        placeholder={'username'}
                        value={this.state.username}
                        onChange={this.handleChange}
                    />

                    <input type='password'
                        name='password'
                        placeholder='password'
                        value={this.state.password}
                        onChange={this.handleChange}
                    />
                </div>
                <div className='row Login-section'>
                    <div className='col-3'></div>
                    <div className='col-6'>
                        <button type="submit" className="btn btn-primary mx-2 Login-buttons">Login</button>
                        <button onClick={() => this.setState({ reset: true })} type="button" className="btn btn-secondary Login-buttons">Reset password</button>
                    </div>
                    <div className='col-3'></div>
                </div>
            </form>
        );
    }

    resetForm() {
        return (
            <div>
                <form className='form' onSubmit={(e) => { this.resetPassword(e) }}>
                    <div className='row Login-section'>
                        <input type='text'
                            name='username'
                            placeholder={'username'}
                            value={this.state.username}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className='row Login-section'>
                        {/* <div className='col-2'></div> */}
                        <div className='col-3'></div>
                        <div className='col-6'>
                            <button onClick={() => this.resetPassword()} type='button' className='btn btn-primary Login-buttons'>Reset password</button>
                            <button onClick={() => this.setState({ reset: false })} type='button' className='btn btn-secondary Login-buttons'>Go back</button>
                        </div>
                        <div className='col-3'></div>
                        {/* <div className='col-2'></div> */}
                    </div>
                </form>
            </div>
        );
    }

    render() {
        return (
            <div className={'Login container-fluid'}>
                <h1>IBM CIC - Virtual white board</h1>
                {this.state.reset ? this.resetForm() : this.loginForm()}
            </div>
        );
    }
}

export default Login;