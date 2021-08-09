const { Schema, model } = require('mongoose')

const CategorySchema = new Schema({
    typeCategory: {
        type: String,
        required: true
    }
})

module.exports = model('category', CategorySchema)