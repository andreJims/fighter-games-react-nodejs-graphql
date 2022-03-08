import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

const GET_COMBATTANTS = gql`
  query combattants($created_by: String) {
    combattants(created_by: $created_by) {
        _id
        name
        hp
        mp
        st
        created_by,
        is_my_player
    }
}
`;

const SELECTED_COMBATTANT = gql`
    mutation SelectedCombattant(
        $id: String!,
        $created_by: String!) {
        selectedCombattant(
            id: $id, 
            created_by: $created_by
            ) {
            _id
        }
    }
`;

class App extends Component {

  constructor(props){
    super(props);
    if(!sessionStorage.getItem('user'))
       this.props.history.push('/login');
  
  }

  render() {
    return (
      <Query pollInterval={500} query={GET_COMBATTANTS} variables={{ created_by: sessionStorage.getItem('user')}}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;
    
          return (
            <div className="container">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <h3 className="panel-title">
                    LIST OF COMBATTANTS
                  </h3>
                  <h4><Link to="/create">Add Combattant</Link></h4>
                </div>
                <div className="panel-body">
                  <table className="table table-stripe">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>HP</th>
                        <th>MP</th>
                        <th>ST</th>
                        <th>IS_My_PLAYER</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.combattants.map((combattant, index) => (
                        <tr key={index}>
                          <td><Link to={`/show/${combattant._id}`}>{combattant.name}</Link></td>
                          <td>{combattant.hp}</td>
                          <td>{combattant.mp}</td>
                          <td>{combattant.st}</td>
                          <td>
                            { combattant.is_my_player && (
                              <button className="btn btn-success" onClick={() => this.props.history.push(`/game/${combattant._id}`)}>
                                    Jouer
                              </button>
                            )}
                            { !combattant.is_my_player && (
                              <Mutation mutation={SELECTED_COMBATTANT}>
                                {(selectedCombattant, { loading, error }) => (
                                <button className="btn btn-primary" 
                                onClick={() => {
                                    selectedCombattant({ variables:{ id: combattant._id, created_by: sessionStorage.getItem("user")
                                    } });
                                }}>
                                    Choisir combattant
                                </button>
                            
                                )}
                              </Mutation>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default App;
