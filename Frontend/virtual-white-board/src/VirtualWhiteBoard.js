import './VirtualWhiteBoard.css';
import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';


/**
 * The virtual whiteboard.
 */
class VirtualWhiteBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Access related
            access: null,
            username: this.props.username,
            password: this.props.password,
            displayedName: '',

            // Redirect when access is not true anymore
            redirect: false,

            // To select what to be posted
            toBePosted: ['text', 'link', 'video', 'image'],
            show: -1,


            // Text to be posted 
            textWhiteboard: '',
            linkWhiteboard: '',


            // all posted notes
            allWhiteBoard: [],
            testPosts: [],
        };
        // For making axios requests
        this.headers = { 'Content-Type': 'application/json' };

        // Binding some functions to this context. Others are called through arrow functions.
        this.setDisplayName = this.setDisplayName.bind(this);
        this.setPreferredName = this.setPreferredName.bind(this);

    }

    /**
     * Validate that user is allowed to view page
     */
    async componentDidMount() {
        const access = this.validUser()
        this.setState({ access: access })
        if (access) {
            this.setDisplayName();
        }

        let wait = await this.getPosts();
    }


    /**
     * Validate user. Waits for axios call. Returns true or false.
     * @returns true or false
     */
    async validUser() {
        const grantAcess = await this.verify();
        return grantAcess;
    }

    /**
     * Helper function for verifying user
     * @returns Axios promise
     */
    async verify() {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:5000/verify',
            data: { 'username': this.state.username, 'password': this.state.password },
            headers: this.headers
        }).catch(error => {
            console.log(error)
            return false
        });
        return res;
    }


    /**
     * Sets the user's preferred name to be displayed on the whiteboard.
     */
    async setDisplayName() {

        const newDisplayName = await this.getPreferredName();

        if (newDisplayName.data !== undefined) {
            this.setState({ displayedName: newDisplayName.data.preferredName });
        } else {
            this.setState({ redirect: true })
        }
    }


    /**
     * Get the preferred name of logged in user from database.
     */
    async getPreferredName() {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:5000/getPreferredName',
            data: { 'username': this.state.username },
            headers: this.headers
        }).catch(error => {
            console.log('Error', error);
            return 'false';
        });
        return res;
    }


    /**
     * Set the preferred name of logged in user in database.
     */
    setPreferredName(event) {
        axios({
            method: 'POST',
            url: 'http://localhost:5000/setPreferredName',
            data: {
                'username': this.state.username,
                'password': this.state.password,
                'preferredName': event.target.value
            },
            headers: this.headers
        }).then(res => {
            this.setDisplayName(res.data.preferredName);
            return true;
        }).catch(error => {
            console.log('Error', error)
            return false
        });
    }


    /**
     * Handle multiple state changes.
     * @param {*} event 
     */
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }


    /**
     * Upload text to whiteboard.
     * @param {*} event 
     */
    uploadText(event) {
        event.preventDefault();
        let postit = [[this.state.displayedName, this.state.textWhiteboard]]
        let tmp = this.state.allWhiteBoard.slice();
        tmp.unshift(postit);

        this.setState({ allWhiteBoard: tmp })
        this.savePost(JSON.stringify(tmp));
    }

    /**
     * Upload link to whiteboard.
     * @param {*} event 
     */
    uploadLink(event) {
        event.preventDefault();
        let postit = [[this.state.displayedName, [<a href={'http://www.' + this.state.linkWhiteboard} target="_blank" rel="noopener noreferrer">{this.state.linkWhiteboard}</a>]]]
        let tmp = this.state.allWhiteBoard.slice();
        tmp.unshift(postit);
        this.setState({ allWhiteBoard: tmp })

    }


    /**
     * Save post to database for later retrieval.
     * @param {*} posts 
     */
    savePost(posts) {
        axios({
            method: 'POST',
            url: 'http://localhost:5000/savePost',
            data: {
                'posts': posts
            },
            headers: this.headers
        }).catch(error => {
            console.log('Error', error)
            return false
        });
    }


    /**
     * Get posts from database if any exists.
     * @returns True if axios call does not throw an error. Otherwise, false.
     */
    async getPosts() {
        await axios({
            method: 'POST',
            url: 'http://localhost:5000/getPosts',
            data: {},
            headers: this.headers
        }).then((res) => {
            console.log('getpost call ', res.data.posts);
            let reloadPosts = res.data.posts === [[['']]] ? false : true;
            reloadPosts && this.setState({ allWhiteBoard: JSON.parse(res.data.posts) })
        }
        ).catch(error => {
            console.log(error)
            return false
        });
        return true;
    }


    /**
     * Delete a "post-it" note from the whiteboard.
     * Only allow the same displayed username to remove.  
     * @param {*} idx 
     * @returns void if user not allowed to remove.
     */
    deletePostit(idx) {
        let tmp = this.state.allWhiteBoard.slice();
        if (tmp[0][0][0] !== this.state.displayedName) {
            return;
        }

        tmp.splice(idx, 1);

        this.setState({ allWhiteBoard: tmp });
        this.savePost(JSON.stringify(tmp));
    }

    /**
     * Handle changing displayed username when clicking enter.
     * @param {*} event 
     * @returns 
     */
    handleKeyDownChangeName(event) {
        if (event.key === 'Enter') {
            if (this.state.searchValue === '') { return; };
            this.setPreferredName(event);
        }
    };


    /**
     * Render-helper method for choosing what to put on whiteboard.
     * @returns 
     */
    chooseUpload() {
        if (this.state.toBePosted[this.state.show] === 'text') {
            return (<div className="chooseUpload mb-3">
                <form className='form' onSubmit={(e) => this.uploadText(e)}>
                    <label htmlFor="text-whiteboard" className="form-label">Write to whiteboard</label>
                    <textarea className="form-control text-whiteboard" id="text-whiteboard" rows="4" name='textWhiteboard' onChange={(e) => this.handleChange(e)}></textarea>
                    <button className='btn btn-primary mt-2'>Submit</button>
                </form>
            </div>);
        }
        else if (this.state.toBePosted[this.state.show] === 'link') {
            return (<div className="chooseUpload mb-3">
                <form className='form' onSubmit={(e) => this.uploadLink(e)}>
                    <label htmlFor="link-whiteboard" className="form-label">Link</label>
                    <input placeholder='ibm.com' className="form-control link-whiteboard" id="link-whiteboard" rows="4" name='linkWhiteboard' onChange={(e) => this.handleChange(e)}></input>
                    <button className='btn btn-primary mt-2'>Submit</button>
                </form>
            </div>);
        }
    }


    render() {
        // If user has access to whiteboard..
        if (this.state.access) {
            // If access should have disappeared, redirect to loginpage
            if (this.state.redirect) {
                return (<Redirect to='/' />)
            }

            else {
                return (
                    <div>
                        <div className='container-fluid whiteboard'>
                            <div className='row top-bar'>
                                <div className='col-3 padding'></div>
                                <div className='col-3 top-bar-box'>
                                    <h5>Username</h5>
                                    {this.state.username}
                                </div>
                                <div className='col-3 top-bar-box'>
                                    <h5>Displayed username</h5>
                                    <input className='input-displayed-name'
                                        type='text'
                                        id='displayedName'
                                        name='displayedName'
                                        value={this.state.displayedName}
                                        onChange={() => { this.handleChange() }}
                                        onKeyDown={(e) => { this.handleKeyDownChangeName(e) }}
                                        // onBlur={() =>} Should have been for clearing. Needs work.  
                                        on
                                    />
                                </div>
                                <div className='col-3 padding'></div>
                            </div>

                            <div className='row options'>
                                <div className='col-4 padding'></div>
                                <div className='col-1 option'>
                                    <div className='row add add-text btn' onClick={() => { this.setState({ show: 0 }) }}>&#128441;</div>
                                    <div className='row option-text'>Add text</div>
                                </div>

                                <div className='col-1 option'>
                                    <div className='row add add-link btn' onClick={() => { this.setState({ show: 1 }) }}>&#128279;</div>
                                    <div className='row option-text'>Add link</div>
                                </div>

                                <div className='col-1 option'>
                                    <div className='row add add-video btn disabled'>&#128249;</div>
                                    <div className='row option-text disabled'>Add video</div>
                                </div>


                                <div className='col-1 option'>
                                    <div className='row add add-image btn disabled'>&#128443;</div>
                                    <div className='row option-text disabled'>Add image</div>
                                </div>

                                <div className='col-4 padding'></div>
                            </div>
                            <div className='row add-to-whiteboard'>{this.chooseUpload()} </div>
                        </div>
                        <div className='container content-whiteboard'>
                            <div className='row content-whiteboard-notes'>

                                {/* Map all content to whiteboard  */}
                                {this.state.allWhiteBoard.map((outer, idx) => {
                                    return (
                                        outer.map((val) => {
                                            return (
                                                <div key={val + idx} className='col-2.5 VirtualWhiteBoard-postit'>
                                                    <div className='row row-postit-top'>
                                                        <div className='col-3 padding'></div>
                                                        <div className='col-6 postit displayed-name-postit'>{val[0]}</div>
                                                        <div className='col-3 postit-close text-right'>
                                                            <button className='btn-dark' onClick={() => this.deletePostit(idx)}>
                                                                X
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className='row row-postit-content'>
                                                        <div className='col postit postit-value'>{val[1]}</div>
                                                    </div>
                                                </div>
                                            );

                                        })
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );
            }
        }

        // If loading takes time, show some text. Couldn't force this, so needs testing.
        else if (this.state.access === null) {
            return (
                <div><h1>Loading</h1></div>
            );
        }

        // If access is not granted to user, redirect to loginpage.
        else {
            return (<Redirect to='/' />)
        }
    }
}

export default VirtualWhiteBoard;