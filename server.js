const express = require("express");
const expressGraphQL = require("express-graphql");
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require("graphql");
const app = express();

const  authors =[
    {id: 1, name:"JRR Tolkien" },
    {id: 2, name:"Neal Stephenson" },
    {id: 3, name:"Paolo Bacigalupi" }
];
const books = [
    {id: 1, name: "Lord of the Rings", authorId: 1 },
    {id: 2, name: "Two Towers", authorId: 1},
    {id: 3, name: "Return of the King", authorId: 1},
    {id: 4, name: "The Hobbit", authorId: 1},
    {id: 5, name: "Seveneves", authorId: 2},
    {id: 6, name: "Reamde", authorId: 2},
    {id: 7, name: "Pump 6", authorId: 3},
    {id: 8, name: "The Windup Girl", authorId: 3}
] ;

const BookType =  new GraphQLObjectType({
    name: "Book" ,
    description:  "This represents a book written by an author",
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)} ,
        name: { type: GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLNonNull(GraphQLInt)},
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
});

const AuthorType =  new GraphQLObjectType({
    name: "Author" ,
    description:  "This represents an author of a book",
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)} ,
        name: { type: GraphQLNonNull(GraphQLString)}
    })
});

const RootQueryType = new GraphQLObjectType({
    name: "query",
    description: "Root Query",
    fields: () => ({
        books: {
            type: new  GraphQLList(BookType),
            description: "a list of books",
            resolve: () => books
            //if you had a datbase you would query the database here
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: "a list of authors",
            resolve: () => authors
            //if you had a datbase you would query the database here
        }
    })
});

const schema = new GraphQLSchema({
        query: RootQueryType
});

app.use("/graphql", expressGraphQL({
    schema: schema,
    graphql: true
}))
app.listen(5000., () => console.log("server running"));
