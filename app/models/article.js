import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

var Schema   = mongoose.Schema;

var articleSchema = new Schema({
    title      : String,
    url        : { type: String, unique: true },
    author     : String,
    raw_html   : String,
    content    : String,
    price      : Number,
    product    : String,
    updated_at : Date
});

articleSchema.plugin(mongoosePaginate);

var Article = mongoose.model( 'Article', articleSchema );
module.exports = Article;
