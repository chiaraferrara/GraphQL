var express = require('express');
var {
    graphqlHTTP
} = require('express-graphql');
var {
    buildSchema
} = require('graphql');
//questa è la sequenza.

var schema = buildSchema(`
type Query{
    user(id: Int!): Person
    users(party: String): [Person]
}

type Person{
id: Int
name: String
age: Int
party: String
}

type Mutation{
    updateUser(id: Int!, name: String!, age: Int!) : Person
}
`);

//users, funzioni etc IN QUESTA SEQUENZA è IMPORTANTE!

var users = [{
        id: 1,
        name: 'Giorgia Meloni',
        age: 46,
        party: "Fratelli d'Italia"
    },
    {
        id: 2,
        name: 'Matteo Renzi',
        age: 48,
        party: 'Italia Viva'
    },
    {
        id: 3,
        name: 'Elly Schlein',
        age: 38,
        party: 'Partito Democratico'
    }

]

var getUser = function (args) {
    var userID = args.id;
    return users.filter(user => user.id == userID)[0];
}

var retrieveUsers = function (args) {
    if (args.party) {
        var party = args.party;
        return users.filter(user => user.party === party);
    } else {
        return users;
    }
}

var updateUser = function ({
    id,
    name,
    age
}) {
    users.map(user => {
        if (user.id === id) {
            user.name = name;
            user.age = age;
            return user;
        }
    });
    return users.filter(user => user.id === id)[0];
}

//resolver
var root = {
    user: getUser,
    users: retrieveUsers,
    updateUser: updateUser
};

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,

}));


app.listen(4000, () => console.log('localhost:4000/graphql'));