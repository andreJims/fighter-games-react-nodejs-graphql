var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
const { GraphQLBoolean } = require('graphql');
var GraphQLDate = require('graphql-date');
var CombattantModel = require('../models/Combattant');

var combattantType = new GraphQLObjectType({
    name: 'combattant',
    fields: function () {
      return {
        _id: {
          type: GraphQLString
        },
        name: {
          type: GraphQLString
        },
        hp: {
          type: GraphQLInt
        },
        mp: {
          type: GraphQLInt
        },
        st: {
          type: GraphQLInt
        },
        created_by: {
          type: GraphQLString
        },
        updated_date: {
          type: GraphQLDate
        },
        is_my_player: {
          type: GraphQLBoolean
        }
      }
    }
  });

  var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function () {
      return {
        combattants: {
          type: new GraphQLList(combattantType),
          args: {
            created_by: {
              name: 'created_by',
              type: GraphQLString
            }
          },
          resolve: function (root, params) {
            const combattants = CombattantModel.find({created_by: params.created_by}).exec()
            if (!combattants) {
              throw new Error('Error')
            }
            return combattants
          }
        },
        combattant: {
          type: combattantType,
          args: {
            id: {
              name: '_id',
              type: GraphQLString
            }
          },
          resolve: function (root, params) {
            const combattantDetails = CombattantModel.findById(params.id).exec()
            if (!combattantDetails) {
              throw new Error('Error')
            }
            return combattantDetails
          }
        },
        combattantEnemy: {
          type: combattantType,
          args: {
            created_by: {
              name: 'created_by',
              type: GraphQLString
            }
          },
          resolve: function (root, params) {
            const combattantDetails = CombattantModel.findOne({created_by: params.created_by, is_my_player: true}).exec()
            if (!combattantDetails) {
              throw new Error('Error')
            }
            return combattantDetails
          }
        }
      }
    }
  });

  var mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function () {
      return {
        addCombattant: {
          type: combattantType,
          args: {
            name: {
              type: new GraphQLNonNull(GraphQLString)
            },
            hp: {
              type: new GraphQLNonNull(GraphQLInt)
            },
            mp: {
              type: new GraphQLNonNull(GraphQLInt)
            },
            st: {
              type: new GraphQLNonNull(GraphQLInt)
            },
            created_by: {
              type: new GraphQLNonNull(GraphQLString)
            },
            is_my_player: {
              type: new GraphQLNonNull(GraphQLBoolean)
            }
          },
          resolve: function (root, params) {
            const combattantModel = new CombattantModel(params);
            const newCombattant = combattantModel.save();
            if (!newCombattant) {
              throw new Error('Error');
            }
            return newCombattant
          }
        },
        frapperCombattant: {
          type: combattantType,
          args: {
            id: {
              type: new GraphQLNonNull(GraphQLString)
            },
            target: {
              type: new GraphQLNonNull(GraphQLString)
            }
          },
          resolve(root, params) {
            CombattantModel.findById(params.id, function(err, combattant){
              if(combattant){
                 CombattantModel.findById(params.target, function(err, combattantTarget){
                    if(combattantTarget){
                      const hp = combattantTarget.hp - combattant.st;
                      return CombattantModel.findOneAndUpdate({_id: params.target}, { hp: hp, updated_date: new Date() }, function (err) {
                        if (err) return next(err);
                      });
                    }
                 })
              }
            });
          }
        },
        lancerUnSortCombattant: {
          type: combattantType,
          args: {
            id: {
              type: new GraphQLNonNull(GraphQLString)
            },
            target: {
              type: new GraphQLNonNull(GraphQLString)
            }
          },
          resolve(root, params) {
            CombattantModel.findById(params.id, function(err, combattant){
                if(combattant){
                   CombattantModel.findById(params.target, function(err, combattantTarget){
                      if(combattantTarget){
                        const hp = combattantTarget.hp - combattant.mp;
                        return CombattantModel.findOneAndUpdate({_id: params.target}, { hp: hp, updated_date: new Date() }, function (err) {
                          if (err) return next(err);
                        });
                      }
                   })
                }
            });
          }
        },
        selectedCombattant: {
          type: combattantType,
          args: {
            id: {
              type: new GraphQLNonNull(GraphQLString)
            },
            created_by: {
              type: new GraphQLNonNull(GraphQLString)
            }
          },
          resolve(root, params) {
           CombattantModel.findOne({created_by: params.created_by, is_my_player: true}, function(err, data){
             
            if(data){
      
                  CombattantModel.updateMany({created_by: params.created_by, is_my_player: false, updated_date: new Date() }, function (err) {
                    if (err) return next(err);
                    return CombattantModel.findOneAndUpdate({_id: params.id}, { is_my_player: true, updated_date: new Date() }, function (err) {
                      if (err) return next(err);
                   });
                  });
               }
               return CombattantModel.findOneAndUpdate({_id: params.id}, { is_my_player: true, updated_date: new Date() }, function (err) {
                if (err) return next(err);
             });
           });
           
          }
        }
      }
    }
  });

  module.exports = new GraphQLSchema({query: queryType, mutation: mutation});