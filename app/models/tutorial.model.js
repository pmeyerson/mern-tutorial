const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

module.exports = (mongoose, mongoosePaginate) => {
    var schema = mongoose.Schema(
            {
                title: String,
                description: String,
                published: Boolean
            },
            { timestamps: true }
        );
       
    schema.plugin(mongoosePaginate);

    var Tutorial = mongoose.model("tutorial", schema);
   //Tutorial.paginate(query, options)
   //        .then(result => {})
   //        .catch(error => {});

    return Tutorial;
};