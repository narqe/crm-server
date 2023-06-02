const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: false,
    },
    summary: {
        type: String,
        required: true,
        maxLength: 500
    },
    category: {
        type: Array,
        required: false,
        default: ['OTHER']
    },
    createdOn: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = Blog = mongoose.model("blog", BlogSchema);