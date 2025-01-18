import React, { useState, useEffect } from 'react';

const GameDetailsPage = () => {
    const [teams, setTeams] = useState([]); // Holds the list of teams
    const [selectedTeam, setSelectedTeam] = useState(null); // Holds the selected team
    const [schedule, setSchedule] = useState([]); // Holds the schedule for the selected team
    const [loading, setLoading] = useState(false); // Tracks loading state
    const [error, setError] = useState(null); // Tracks error state

    // Fetch the list of teams when the component mounts
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('http://localhost:5002/api/teams');
                const data = await response.json();
                setTeams(data); // Update the teams state with fetched data
            } catch (err) {
                console.error('Error fetching teams:', err);
                setError('Failed to fetch teams.');
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    // Fetch the schedule for a selected team
    const fetchTeamSchedule = async (teamId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`http://localhost:5002/api/schedule/${teamId}`);
            const data = await response.json();

            setSchedule(data); // Update the schedule state with fetched data
        } catch (err) {
            console.error('Error fetching schedule:', err);
            setError('Failed to fetch schedule.');
        } finally {
            setLoading(false);
        }
    };

    // Handle team selection
    const handleTeamClick = (team) => {
        setSelectedTeam(team);
        fetchTeamSchedule(team.id);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Game Details</h1>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div>
                <h2>Select a Team</h2>
                <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: 0 }}>
                    {teams.map((team) => (
                        <li
                            key={team.id}
                            style={{
                                listStyle: 'none',
                                cursor: 'pointer',
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                padding: '10px',
                                textAlign: 'center',
                                width: '150px',
                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                transition: 'transform 0.2s',
                            }}
                            onClick={() => handleTeamClick(team)}
                        >
                            <img
                                src={team.logo}
                                alt={`${team.name} logo`}
                                style={{ width: '100px', height: '100px', marginBottom: '10px' }}
                            />
                            <p>{team.name}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {selectedTeam && (
                <div>
                    <h2>{selectedTeam.name} Schedule</h2>
                    {schedule.length > 0 ? (
                        <table
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                marginTop: '20px',
                            }}
                        >
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid #ccc', padding: '10px' }}>Date</th>
                                    <th style={{ border: '1px solid #ccc', padding: '10px' }}>Opponent</th>
                                    <th style={{ border: '1px solid #ccc', padding: '10px' }}>Venue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedule.map((game, index) => (
                                    <tr key={index}>
                                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                                            {game.date || 'TBA'}
                                        </td>
                                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                                            {game.opponent || 'TBA'}
                                        </td>
                                        <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                                            {game.venue || 'TBA'}
                                        </td>
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