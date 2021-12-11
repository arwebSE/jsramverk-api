const Document = require("../db/Document");
const RefreshToken = require("../db/RefreshToken");

module.exports = {
    Query: {
        resetDocs: async () => {
            console.log("=> DB: resetting DB!");
            return await Document.deleteMany({});
        },
        getRefreshTokens: async () => await RefreshToken.find(),
        documents: async (_, { user }) => {
            console.log("=> DB: listing all docs belonging to:", user);
            return await Document.find({ users: user }).exec();
        },
        openDoc: async (_, { docid }) => {
            console.log("=> DB: opening doc:", docid);
            return await Document.findById(docid);
        }
    },
    Mutation: {
        createDoc: async (_, { name, users = [] }) => {
            console.log("=> DB: creating doc:", name, "for users:", users);
            const doc = await Document.create({ name, users }) // Create empty doc
            return doc;
        },
        updateDoc: async (_, { docid, data }) => {
            console.log("=> DB: updating document:", docid);
            return await Document.findByIdAndUpdate(docid, { data }, { new: true });
        },
    },
};
