import React, { Component } from 'react';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { Link } from 'react-router-dom';

const ADD_COMBATTANT = gql`
    mutation AddCombattant(
        $name: String!,
        $hp: Int!,
        $mp: Int!,
        $st: Int!,
        $is_my_player: Boolean!,
        $created_by: String!) {
        addCombattant(
            name: $name,
            hp: $hp,
            mp: $mp,
            st: $st,
            created_by: $created_by,
            is_my_player: $is_my_player) {
            _id
        }
    }
`;

class Create extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            mp: 30,
            st: 30
        }
        if(!sessionStorage.getItem('user'))
            this.props.history.push('/login');
    }

    onChangeMp = (e) => {
        const mp = e.target.value;
        if(mp <= 100)
            this.setState({mp})
    };

    onChangeSt = (e) => {
        const st = e.target.value;
        if(st <= 100)
            this.setState({st})
    };

    render() {
      let name;
      return (
        <Mutation mutation={ADD_COMBATTANT} onCompleted={() => this.props.history.push('/')}>
            {(addCombattant, { loading, error }) => (
                <div className="container">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3 className="panel-title">
                                ADD COMBATTANT
                            </h3>
                        </div>
                        <div className="panel-body">
                            <h4><Link to="/" className="btn btn-primary">Combattant List</Link></h4>
                            <form onSubmit={e => {
                                e.preventDefault();
                                addCombattant({ variables: { name: name.value, hp: 100, mp: parseInt(this.state.mp), st: parseInt(this.state.st), created_by: sessionStorage.getItem("user"), is_my_player: false} });
                                name.value = "";
                                this.setState({
                                    mp: 30,
                                    st: 30
                                })
                            }}>
                                <div className="form-group">
                                    <label htmlFor="name">Nom:</label>
                                    <input type="text" className="form-control" name="name" ref={node => {
                                        name = node;
                                    }} placeholder="Nom" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mp">MP:</label>
                                    <input type="number" className="form-control" name="mp" placeholder="MP" value={this.state.mp}
                                    onChange={(e) => this.onChangeMp(e)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="st">ST:</label>
                                    <input type="number" className="form-control" name="st" placeholder="ST" cols="80" rows="3" 
                                    value={this.state.st} onChange={(e) => this.onChangeSt(e)}  />
                                </div>
                                <button type="submit" className="btn btn-success">Submit</button>
                            </form>
                            {loading && <p>Loading...</p>}
                            {error && <p>Error :( Please try again</p>}
                        </div>
                    </div>
                </div>
            )}
        </Mutation>
      );
    }
  }
  
  export default Create;