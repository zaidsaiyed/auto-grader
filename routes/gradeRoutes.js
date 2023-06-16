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

    // Route to get all grades by course ID and assignment ID
    app.get('/api/grade/:courseId/:assignId', async (req, res) => {
        const { course_id, assign_id } = req.query;
        try {
            const grades = await Grade.find({ course_id, assign_id });
            res.json(grades);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Route to get a specific student's grades by course ID, assignment ID, and student ID
    app.get('/grade/:courseId/:assignId/:studentId', async (req, res) => {
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
};