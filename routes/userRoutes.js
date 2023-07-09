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

    // Get user by Student ID
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
        try {
        const types = (req.body.types)?req.body.types:'S';
        const student_id = (req.body.student_id)?req.body.student_id:"0";
        const name = (req.body.name)?req.body.name:"";
        const {
            user_name,
            password
        } = req.body;

        const user = new User({
            user_name,
            student_id,
            password,
            name,
            types
        }).save();

        res.send(user);

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    // Delete a user by Id
    app.delete("/api/user/del/:student_id", async (req, res) => {
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
};