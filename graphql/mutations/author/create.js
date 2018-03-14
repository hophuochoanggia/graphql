import models from '../../../models/index.js';
import Author from '../../types/author.js';
import AuthorInput from '../../inputs/author.js';

export default {
    type: Author,
    args: {
        author: {
            type: AuthorInput
        }
    },
    resolve (source, args) {
        return models.author.create({
            name: args.author.name
        }).then(function(newAuthor) {
            return models.author.findById(newAuthor.id);
        });
    }
};
