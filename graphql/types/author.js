import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList
} from 'graphql';

import models from '../../models/index.js';

export default new GraphQLObjectType({
    name: 'author',
    description: 'author of some quote',
    fields () {
        return {
            id: {
                type: GraphQLID,
                description: "author's ID",
                resolve (author) {
                    return author.id;
                }
            },
            name: {
                type: GraphQLString,
                description: "author's name",
                resolve (author) {
                    return author.name;
                }
            }
        };
    }
});
