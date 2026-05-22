import { getAllProjects } from '../models/projects.js';
import db from '../models/db.js';

// Projects list page
const showProjectsPage = async (req, res) => {
    const projects = await getAllProjects();
    const title = 'Projects';

    res.render('projects', { title, projects });
};

// Project details page (MISSING FUNCTION)
const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;

    try {
        const result = await db.query(
            `SELECT * FROM public.project WHERE project_id = $1`,
            [projectId]
        );

        const project = result.rows[0];

        res.render('project-details', {
            title: 'Project Details',
            project
        });

    } catch (error) {
        console.error('PROJECT DETAILS ERROR:', error.message);
        res.status(500).send('Server Error');
    }
};

export {
    showProjectsPage,
    showProjectDetailsPage
};