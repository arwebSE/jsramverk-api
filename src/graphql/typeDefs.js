const { gql } = require("apollo-server-express");

module.exports = gql`
    type Query {
        resetDocs: DeleteResponse!
        getRefreshTokens: [RefreshToken!]!
        documents(user: String!): [Document!]!
        openDoc(docid: ID!): Document
    }

    type DeleteResponse {
        deletedCount: Int
    }

    type Document {
        _id: ID!
        name: String!
        data: String
        users: [String]
        comments: [String]
        type: String
    }

    type RefreshToken {
        token: String!
    }

    type Mutation {
        createDoc(name: String!, users: [String], type: String): Document!
        updateDoc(docid: ID!, data: String! comments: [String] type: String): Document!
        deleteDoc(docid: ID!): Boolean
    }
`;
