const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require("graphql");


//Hardcoded Data

// const customers = [
//   { id: "1", name: "Jon Papa", email: "jpap@gmail.com", age: 35 },
//   { id: "2", name: "Steve Papa", email: "spap@gmail.com", age: 25 },
//   { id: "3", name: "Karl Papa", email: "kpap@gmail.com", age: 15 }
// ];

//Customer type

const CustomerType = new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt }
  })
});

//Root Query

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parent, args) {
        return axios.get('http://localhost:3000/customers/' + args.id)
          .then(res => res.data)
        // FOR LOOP IS ONLY NECESSARY FOR HARDCODED DATA
        // for (let i = 0; i < customers.length; i++) {
        //   if (customers[i].id == args.id) {
        //     return customers[i];
        //   }
        // }
      }
    },
    customers:{
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args){
        return axios.get('http://localhost:3000/customers/')
          .then(res => res.data)
      }
    }
  }
});

//Mutations

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCustomer:{
      type:CustomerType,
      args:{
        name: {type: new GraphQLNonNull (GraphQLString)},
        email: {type: new GraphQLNonNull (GraphQLString)},
        age: {type: new GraphQLNonNull (GraphQLInt)}
      },
      resolve(parentValue, args) {
        return axios.post('http://localhost:3000/customers', {
          name: args.name,
          email: args.email,
          age: args.age
        })
          .then(res => res.data);
      }
    },
    deleteCustomer:{
      type:CustomerType,
      args:{
        id: {type: new GraphQLNonNull (GraphQLString)},
      },
      resolve(parentValue, args) {
        return axios.delete('http://localhost:3000/customers/'+ args.id)
          .then(res => res.data);
      }
    },
    editCustomer:{
      type:CustomerType,
      args:{
        id: {type: new GraphQLNonNull (GraphQLString)},
        name: {type:GraphQLString},
        email: {type:GraphQLString},
        age: {type:GraphQLInt}
      },
      resolve(parentValue, args) {
        return axios.patch('http://localhost:3000/customers/' + args.id, args)
          .then(res => res.data);
      }
    },
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation
});
