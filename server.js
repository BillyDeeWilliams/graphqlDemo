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
        name: { type: GraphQLNonNull(GraphQLString)},
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => book.authorId === author.id)
            }
        }
    })
});

const RootQueryType = new GraphQLObjectType({
    name: "query",
    description: "Root Query",
    fields: () => ({
        book: {
            type: BookType,
            description: "a single book",
            args:{
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
            //if you had a datbase you would query the database here
        },
        books: {
            type: new  GraphQLList(BookType),
            description: "a list of books",
            resolve: () => books
            //if you had a datbase you would query the database here
        },
        author: {
            type: AuthorType,
            description: "the author of a book",
            args: {
                id: {type: GraphQLInt }
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
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

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook:{
            type: BookType,
            description: 'add a book',
            args:{
                name: {type: GraphQLNonNull(GraphQLString) },
                authorId: {type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                const book = {
                    id: books.length + 1,
                    name : args.name,
                    authorId: args.authorId
                }
                books.push(book);
                return book
            }
        },
        addAuthor:{
            type: AuthorType,
            description: 'add an author',
            args:{
                name: {type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const author = {
                    id: authors.length + 1,
                    name : args.name,
                }
                authors.push(author);
                return author
            }
        }
    })
})


const schema = new GraphQLSchema({
        query: RootQueryType,
        mutation: RootMutationType
});

app.use("/graphql", expressGraphQL({
    schema: schema,
    graphql: true
}))
app.listen(5000., () => console.log("server running"));
