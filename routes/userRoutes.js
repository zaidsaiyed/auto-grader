const mongoose = require("mongoose");
const User = mongoose.model("user");

module.exports = (app) => {
    app.get("/api/user/:id", async (req, res) => {
        const response = await User.find({}).exec();
        console.log(response);
        res.send(await User.find({}).exec());
    });

    app.post("/api/user", async (req, res) => {
        const types = (req.body.types)?req.body.types:'S';

        const {
            user_name,
            student_id,
            password
        } = req.body;

        const user = new User({
            user_name,
            student_id,
            password,
            types
        }).save();

        res.send(user);
    });


    // Find all users

    //Find Product details using Barcode_ID
    app.get("/api/barcode/:barcode/product", (req, res) => {
        Barcode.findOne({
            barcode_id: req.params.barcode,
        })
            .exec()
            .then(barcode => Product.findById(barcode._product)
                .then(result => res.send(result))
                .catch(err => res.status(500).send(err))
            )
            .catch(err => res.status(500).send(err));
    });
};