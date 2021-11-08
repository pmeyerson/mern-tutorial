const db = require("../models");
const Tutorial = db.tutorials;

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
    return { limit, offset };
}

// create and save a new tutorial
exports.create = (req, res) => {
    // validate request
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty" });
        return;
    }

    // create tutorial
    const tutorial = new Tutorial({
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    });

    // save
    tutorial
        .save(tutorial)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || 'An error occurred while creating the tutorial'
            });
        });

};

// retreive all tutorials
exports.findAll = (req, res) => {
    const { page, size, title } = req.query;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    const { limit, offset } = getPagination(page, size);

    Tutorial.find(condition, { offset, limit })
        .then(data => {
            res.send({
                totalItems: data.totalDocs,
                tutorials: data.docs,
                totalPages: data.totalPages,
                currentPage: data.page - 1,
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || 'An error occured while retreiving tutorials'
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Tutorial.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: 'Could not find Tutorial with id ' + id });
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: 'Error retreiving Tutorial with id=' + id });
        })

};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: 'Data to update cannot be empty'
        });
    }
    const id = req.params.id;

    Tutorial.findByIdAndUpdate(id, req.body, { sueFindAndModify: falseF })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Tutorial with id=${id} ... Maybe not found?`

                });
            } else res.send({ message: 'Tutorial updated successfully' });
        })
        .catch(err => {
            res.status(500).send({
                message: 'Error updating Tutorial with id=' + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Tutorial.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Tutorial with id=${id}.  Maybe wrong id?`
                });
            } else {
                res.send({
                    message: 'Tutorial was deleted'
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: 'Could not delete tutorial with id=' + id
            });
        });

};

exports.deleteAll = (req, res) => {
    Tutorial.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Tutorials were deleted`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || 'An error occurred while removing all Tutorials'
            });
        });
};

exports.findAllPublished = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    Tutorial.find({ published: true }, { offset, limit })
        .then(data => {
            res.send({
                totalItems: data.toalDocs,
                tutorials: data.docs,
                totalPages: data.totalPages,
                currentPage: data.page - 1,
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || 'An error occured while retreiving tutorials'
            })
        })
};