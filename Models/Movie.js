const { Schema, model } = require('mongoose')

const MovieSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imdb: {
        type: Number,
        required: true
    },
    directedYear: {
        type: Number,
        required: true
    },
    categoryId: {
        ref: 'Categories',
        type: Schema.Types.ObjectId,
        required: true
    }
})

module.exports = model('movie', MovieSchema)