const mongoose = require("mongoose");
const User = mongoose.model("user");

module.exports = (app) => {

    // Get all users
    app.get("/api/user", async (req, res) => {
        try {
            const users = await User.find({}).exec();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // Get user by ID
    app.get("/api/user/:id", async (req, res) => {
        try {
            if(req.params.id){
                const response = await User.find({student_id: req.params.id}).exec();
                res.send(response);
            }
        } catch (error){
            res.status(500).JSON({message: "No ID provided"});
        }   
    });

    // Create a new user
    app.post("/api/user", async (req, res) => {
        const types = (req.body.types)?req.body.types:'S';
        const student_id = (req.body.student_id)?req.body.student_id:"000";

        const {
            user_name,
            password
        } = req.body;

        const user = new User({
            user_name,
            student_id,
            password,
            types
        }).save();

        res.redirect("./redirect");
    });

    // Delete a user by Id
    app.delete("/api/user/:student_id", async (req, res) => {
        try {
            const studentId = req.params.student_id;
            const user = await User.findOneAndDelete({ student_id: studentId }).exec();
    
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            res.json({ message: "User deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
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