import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

const GET_COMBATTANT= gql`
    query combattant($combattantId: String) {
        combattant(id: $combattantId) {
            _id
            name
            hp
            mp
            st
            created_by
        }
    }
`;

const GET_COMBATTANT_ENEMY= gql`
    query combattantEnemy($created_by: String) {
        combattantEnemy(created_by: $created_by) {
            _id
            name
            hp
            mp
            st
            created_by
        }
    }
`;

const FRAPER_COMBATTANT= gql`
  mutation frapperCombattant($id: String!, $target: String!) {
    frapperCombattant(id:$id, target:$target) {
      _id
    }
  }
`;

const LANCER_UN_SORT_COMBATTANT= gql`
  mutation lancerUnSortCombattant($id: String!, $target: String!) {
    lancerUnSortCombattant(id:$id, target:$target) {
      _id
    }
  }
`;

class Game extends Component {

    constructor(props){
        super(props);
        if(!sessionStorage.getItem('user'))
           this.props.history.push('/login');
        
        this.state = {
            gameOver: false
        }
      
      }
  render() {
    return (
        <Query pollInterval={500} query={GET_COMBATTANT} variables={{ combattantId: this.props.match.params.id }}>
            {({ loading, error, data }) => {
                if (loading) return 'Loading...';
                if (error) return `Error! ${error.message}`;
                if(data && data.combattant && data.combattant.hp < 1){
                   return(
                        <div>
                             <br/>
                        <br/>
                        <span className="alert alert-danger">
                            Vous avez perdu
                        </span>
                        <br/>
                        <br/>
                        </div>
                        )
                }
                return (
                    <div className="container">
                        <h4><Link to="/">Quitter</Link></h4>
                        <div className="row">
                            <div className="col-md-6">
                            <div className="panel panel-default">
                            <div className="panel-heading">
                        
                                <h3 className="panel-title">
                                {data.combattant.name}
                                </h3>
                            </div>
                            <div className="panel-body">
                                <dl>
                                    <dt>HP:</dt>
                                    <dd>{data.combattant.hp}</dd>
                                    <dt>MP:</dt>
                                    <dd>{data.combattant.mp}</dd>
                                    <dt>ST:</dt>
                                    <dd>{data.combattant.st}</dd>
                                </dl>
                            
                            </div>
                        </div>
                            </div>

                         <div className="col-md-6">
                         <Query pollInterval={500} query={GET_COMBATTANT_ENEMY} variables={{ created_by: sessionStorage.getItem('user') === "john" ? "doe":"john"}}>
            {({ loading, error, data }) => {
                if (loading) return 'Loading...';
                if (error) return `Error! ${error.message}`;
                console.log(JSON.stringify(data))
                if(data && data.combattantEnemy && data.combattantEnemy.name)
                    return (
                            <div className="panel panel-default">
                            <div className="panel-heading">
                        
                                <h3 className="panel-title">
                                   {data.combattantEnemy.name} ({data.combattantEnemy.created_by})
                                </h3>
                            </div>
                            <div className="panel-body"> 
                            <dl>
                                    <dt>HP:</dt>
                                    <dd>{data.combattantEnemy.hp}</dd>
                                    <dt>MP:</dt>
                                    <dd>{data.combattantEnemy.mp}</dd>
                                    <dt>ST:</dt>
                                    <dd>{data.combattantEnemy.st}</dd>
                                </dl>
                            </div>
                           
                            <Mutation mutation={FRAPER_COMBATTANT} key={data.combattantEnemy._id}>
                                    {(frapperCombattant, { loading, error }) => (
                                        <div>
                                            <form
                                                onSubmit={e => {
                                                    e.preventDefault();
                                                    frapperCombattant({ variables: { id: this.props.match.params.id,target: data.combattantEnemy._id } });
                                                }}>
                                                   
                                                        <button className="btn btn-success">FRAPPER</button>
                                                
                                                &nbsp;
                                            
                                            </form>
                                        {loading && <p>Loading...</p>}
                                        {error && <p>Error :( Please try again</p>}
                                        </div>
                                    )}
                                </Mutation>
                                <Mutation mutation={LANCER_UN_SORT_COMBATTANT} key={data.combattantEnemy._id}>
                                    {(lancerUnSortCombattant, { loading, error }) => (
                                        <div>
                                            <br />
                                            <br />
                                            <form
                                                onSubmit={e => {
                                                    e.preventDefault();
                                                    lancerUnSortCombattant({ variables: { id: this.props.match.params.id,target: data.combattantEnemy._id  } });
                                                }}>
                                            
                                                
                                                        <button className="btn btn-success">LANCER UN SORT</button>
                                                
                                                &nbsp;
                                            </form>
                                        {loading && <p>Loading...</p>}
                                        {error && <p>Error :( Please try again</p>}
                                        </div>
                                    )}
                                </Mutation>
                            </div>
                            
                );
                else
                    return (<div>On attend de l'adversaire</div>)
                             }}
                             </Query>
                         </div>

                        </div>
                    </div>
                );
            }}
        </Query>
    );
  }
}

export default Game;