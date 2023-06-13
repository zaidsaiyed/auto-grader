const mongoose = require("mongoose");
const Course = mongoose.model("course");

module.exports = (app) => {
    // Get course by id
  app.get("/api/course/:id", async (req, res) => {
    try {
      if(req.params.id){
        const courses = await Course.find({course_id : req.params.id}).exec();
        res.json(courses);
      }


    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/course", async (req, res) => {
    const{
        course_id,
        course_name,
        prof
    } = req.body;

    const course = new Course({
      course_id,
      course_name,
      prof
    }).save();

    res.send(course);
  });
};
