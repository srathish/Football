import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GameDetailsPage.css';

const GameDetailsPage = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch teams on load
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get('http://localhost:5002/api/teams');
                setTeams(response.data);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };

        fetchTeams();
    }, []);

    // Fetch schedule for the selected team
    const fetchSchedule = async (team) => {
        setLoading(true);
        setSelectedTeam(team);
        setSchedule([]); // Clear previous schedule
        try {
            const response = await axios.get(`http://localhost:5002/api/schedule/${team.id}`);
            const formattedSchedule = response.data.map((game) => ({
                date: game.game.date.date || 'TBA',
                opponent: game.teams.home.id === team.id ? game.teams.away.name : game.teams.home.name,
                venue: game.game.venue.name || 'TBA',
            }));
            setSchedule(formattedSchedule);
        } catch (error) {
            console.error('Error fetching schedule:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="game-details-container">
            <h1>Game Details</h1>
            <h2>Select a Team</h2>
            <div className="team-grid">
                {teams.map((team) => (
                    <div
                        key={team.id}
                        className={`team-card ${selectedTeam?.id === team.id ? 'selected' : ''}`}
                        onClick={() => fetchSchedule(team)}
                    >
                        <img src={team.logo} alt={team.name} className="team-logo" />
                        <p className="team-name">{team.name}</p>
                    </div>
                ))}
            </div>

            {loading && <p>Loading schedule...</p>}

            {selectedTeam && !loading && (
                <div className="schedule-container">
                    <h2>{selectedTeam.name} Schedule</h2>
                    {schedule.length > 0 ? (
                        <table className="schedule-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Opponent</th>
                                    <th>Venue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedule.map((game, index) => (
                                    <tr key={index}>
                                        <td>{game.date}</td>
                                        <td>{game.opponent}</td>
                                        <td>{game.venue}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No schedule available for this team.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default GameDetailsPage;