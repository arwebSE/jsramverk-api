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
    }

    type RefreshToken {
        token: String!
    }

    type Mutation {
        createDoc(name: String!, users: [String]): Document!
        updateDoc(docid: ID!, data: String!): Document!
    }
`;
