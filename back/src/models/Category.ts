import mongoose, { Schema } from 'mongoose';

const Category = new Schema({
    category_name: {
        type: String
    },
    category_url: {
        type: String,
        required: [true, 'categoryurlrequired'],
        index: {
            unique: true
        }
    },
    parent_category: {
        default: null,
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    },
    sub_categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    }]
});

export default Category;