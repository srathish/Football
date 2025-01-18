const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Constants
const API_HOST = 'api-american-football.p.rapidapi.com';
const API_KEY = process.env.RAPIDAPI_KEY || '9c399ae893msha515ae0a544ad67p1845c6jsn345c43dd920b';
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
        const response = await axios.get(`https://${API_HOST}/teams`, {
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': API_HOST
            },
            params: { league: 1, season: 2023 }
        });

        // Simplify the response data
        const teams = response.data.response.map((team) => ({
            id: team.id,
            name: team.name,
            logo: team.logo
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
        const response = await axios.get(`https://${API_HOST}/games`, {
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': API_HOST
            },
            params: { team: teamId, season: 2023 }
        });

        // Simplify the response data
        const schedule = response.data.response.map((game) => ({
            date: game.date || 'TBA',
            opponent: game.teams.away.name === game.teams.home.name ? 'TBD' : game.teams.away.name,
            venue: game.venue.name || 'TBA'
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