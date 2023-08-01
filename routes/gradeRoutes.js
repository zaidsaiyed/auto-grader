const mongoose = require("mongoose");
const Grade = mongoose.model("grade");
const Assignment = mongoose.model("assignment");
const fs = require("fs");
const csv = require("csv-parser");

module.exports = (app) => {
  // Route to create a new grade
  app.post("/api/grade", async (req, res) => {
    try {
      const { name, student_id, course_id, assign_id, earned, comments } =
        req.body;

      // Get total_tests from assignment table
      const assignment = await Assignment.findOne({
        assign_id,
        course_id,
      }).exec();
      if (!assignment) {
        return res.status(404).json({ error: "Assignment not found" });
      }
      const { total_tests } = assignment;

      const grade = new Grade({
        name,
        student_id,
        course_id,
        assign_id,
        total_tests,
        earned,
        comments,
      });

      await grade.save();
      res.status(201).json(grade);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Route to get all grades
  app.get("/api/grade", async (req, res) => {
    try {
      const grades = await Grade.find({});
      res.json(grades);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Route to get all grades by course ID and assignment ID
  app.get("/api/grade/:courseId/:assignId", async (req, res) => {
    const { courseId, assignId } = req.params;
    try {
      const grades = await Grade.find({
        course_id: courseId,
        assign_id: assignId,
      });
      if (grades) {
        res.json(grades);
      } else {
        res.status(404).json({ message: "Grades not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Route to get a specific student's grades by course ID, assignment ID, and student ID
  app.get("/api/grade/:courseId/:assignId/:studentId", async (req, res) => {
    const { courseId, assignId, studentId } = req.params;
    try {
      const grade = await Grade.findOne({
        course_id: courseId,
        assign_id: assignId,
        student_id: studentId,
      });
      if (grade) {
        res.json(grade);
      } else {
        res.status(404).json({ error: "Grade not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Route to get all grades of a specific student
  app.get("/api/grade/:studentId", async (req, res) => {
    const studentID = req.params.studentId;
    try {
      const grades = await Grade.find({ student_id: studentID });
      if (grades.length > 0) {
        res.json(grades);
      } else {
        res.status(404).json({ message: "Grades not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Route to update a grade
  app.put("/api/grade/:courseId/:assignId/:studentId", async (req, res) => {
    const { courseId, assignId, studentId } = req.params;

    try {
      const gradeToUpdate = await Grade.findOne({
        course_id: courseId,
        assign_id: assignId,
        student_id: studentId,
      });

      if (!gradeToUpdate) {
        return res.status(404).json({ error: "Grade not found" });
      }

      gradeToUpdate.earned = parseFloat(req.body.earned);
      gradeToUpdate.comments = req.body.comments;

      await gradeToUpdate.save();
      res.json(gradeToUpdate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

   // Route to create or update grades from CSV
app.post('/api/grade/:courseId', async (req, res) => {
  const { courseId } = req.params;
  const csvFilePath = `./courses/${courseId}/${courseId}.csv`;

  try {
    const assignments = await Assignment.find({}).exec();
    const assignmentsMap = new Map();
    assignments.forEach((assignment) => {
      assignmentsMap.set(assignment.assign_id, assignment.total_tests);
    });

    const stream = fs.createReadStream(csvFilePath).pipe(csv());
    for await (const row of stream) {
      const studentId = row['OrgDefinedId'].replace("#", '');
      const fullName = `${row['First Name']} ${row['Last Name']}`;

      const grades = Object.keys(row).filter((key) => key.includes('Points Grade'));
      grades.forEach(async (gradeKey) => {
        const assignId = gradeKey.split(' Points Grade')[0];
        if (assignmentsMap.has(assignId)) {
          const earned = parseFloat(row[gradeKey]);

          // Check if 'earned' is NaN, if yes, set it to null
          const earnedValue = isNaN(earned) ? null : earned;
          console.log('Updated:', studentId, fullName, courseId, assignId, 'earned:', earnedValue);
          const grade = await Grade.findOneAndUpdate(
            { student_id: studentId, course_id: courseId, assign_id: assignId },
            { earned: earnedValue },
          ).exec();
        }
      });
    }

    console.log('CSV file successfully processed.');
    res.status(200).json({ message: 'Grades updated from CSV successfully.' });
  } catch (error) {
    console.error('Error updating grades from CSV:', error);
    res.status(500).json({ error: error.message });
  }
});

};
