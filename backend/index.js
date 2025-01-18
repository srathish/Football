const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Constants
const API_HOST = 'sports.core.api.espn.com';
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
/**
 * GET /api/teams
 * Fetch the list of NFL teams
 */
app.get('/api/teams', async (req, res) => {
    try {
        const response = await axios.get(`https://${API_HOST}/v2/sports/football/leagues/nfl/seasons/2024/teams`);

        // Simplify the response data
        const teams = response.data.items.map((team) => ({
            id: team.$ref.split('/').pop(), // Extract the team ID from the URL
            ref: team.$ref
        }));

        res.json(teams);
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ error: 'Failed to fetch teams.' });
    }
});

/**
 * GET /api/schedule/:teamId
 * Fetch the schedule for a specific team
 */
app.get('/api/schedule/:teamId', async (req, res) => {
    const { teamId } = req.params;

    try {
        const response = await axios.get(`https://${API_HOST}/v2/sports/football/leagues/nfl/seasons/2021/teams/${teamId}/schedule`);

        // Simplify the response data
        const schedule = response.data.events.map((game) => ({
            date: game.date || 'TBA',
            opponent: game.competitors.find((c) => c.id !== teamId)?.displayName || 'TBD',
            venue: game.venue?.fullName || 'TBA'
        }));

        res.json(schedule);
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ error: 'Failed to fetch schedule.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});