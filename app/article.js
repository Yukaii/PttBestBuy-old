import mongoose from 'mongoose';
var Schema   = mongoose.Schema;

var articleSchema = new Schema({
    title      : String,
    url        : String,
    author     : String,
    raw_html   : String,
    content    : String,
    updated_at : Date
});

var Article = mongoose.model( 'Article', articleSchema );

module.exports = Article;
