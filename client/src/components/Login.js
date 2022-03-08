import React, { Component } from 'react';

class Login extends Component{

    constructor(props){
        super(props)
        this.state = {
            login: "",
            errorMessage: false
        }
    }

    onLoginChanged = (e) => {
        this.setState({
            errorMessage: false
        })
        const login = e.target.value;
        this.setState({
            login
        });
    };

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-4"></div>
                    <div className="col-md-4">
                    <div className="panel panel-primary">
                        <div className="panel-heading">
                            <h3 className="panel-title">
                                
                            </h3>
                        </div>
                        <div className="panel-body">
            <form  onSubmit={e => {
                                                    e.preventDefault();
                                                    if(this.state.login === "john" || this.state.login === "doe")
                                                    {
                                                        sessionStorage.setItem("user", this.state.login);
                                                        this.props.history.push('/')
                                                    }
                                                    this.setState({
                                                        errorMessage: true
                                                    })
                                                }}>
                {this.state.errorMessage && (
                    <div>
                         <br/>
                    <br/>
                    <span className="alert alert-danger">Indentifiant erronée</span>
                    <br/>
                    <br/>
                    </div>
                )}
            <div className="form-group">
                <label htmlFor="login">Login:</label>
                <input type="text" className="form-control" name="login" laceholder="Login" 
                    onChange={e => this.onLoginChanged(e)} />
            </div>
            <button type="submit" className="btn btn-success"
            >Se connecter</button>
            </form>
            </div>
            </div>
                    </div>
                    <div className="col-md-4"></div>
                </div>
            </div>
        );
    }
}

export default Login;