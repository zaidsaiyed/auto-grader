const mongoose = require('mongoose');
const Grade = mongoose.model('grade');

module.exports = (app) => {
        
    // Route to create a new grade
    app.post('/api/grade', async (req, res) => {
        try {
            const grade = new Grade(req.body);
            await grade.save();
            res.status(201).json(grade);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    // Route to get all grades
    app.get('/api/grade', async (req, res) => {
        try {
            const grades = await Grade.find({});
            res.json(grades);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }   
    });

    // Route to get all grades by course ID and assignment ID
    app.get('/api/grade/:courseId/:assignId', async (req, res) => {
        const { courseId, assignId } = req.params;
        try {
            const grades = await Grade.find({ course_id : courseId, assign_id: assignId });
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
    app.get('/api/grade/:courseId/:assignId/:studentId', async (req, res) => {
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
            res.status(404).json({ error: 'Grade not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Route to get all grades of a specific student
    app.get('/api/grade/:studentId', async (req, res) => {
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
};