const Cat = require("./Cat");

module.exports = {
    Query: {
        hello: () => "hello",
        cats: async () => await Cat.find()
    },
    Mutation: {
        createCat: async (_, { name }) => {
            const kitty = new Cat({ name });
            return await kitty.save();
        },
    },
};
