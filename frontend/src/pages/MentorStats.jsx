import React from 'react';
import "../styles/mentorstats.css";
import { totalMenteeMentored, menteesMentoredMonthWise, newMenteesMentoredPerMonth, getMentorRating, getTotalSessions, getSessionDistribution } from '../apis/mentorstats';
import { useState, useEffect } from 'react';

import { Container, Row, Col, Card, Badge, Image } from 'react-bootstrap';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend,
} from 'recharts';
import {
    Users,
    DollarSign,
    Calendar,
    TrendingUp,
    Star,
    Clock,
    Video,
    Award,
    UserPlus,
    Fingerprint,
    Tv,
} from 'lucide-react';


const revenueData = [
    { month: 'Jan', revenue: 2400 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 3600 },
    { month: 'Apr', revenue: 2800 },
    { month: 'May', revenue: 4000 },
    { month: 'Jun', revenue: 4400 },
];

const sessionData = [
    { name: 'Completed', value: 75, color: '#198754' },
    { name: 'Pending', value: 10, color: '#ffc107' },
    { name: 'Rescheduled', value: 8, color: '#0d6efd' },
    { name: 'Rejected', value: 7, color: '#dc3545' },
];



function StatCard({ icon: Icon, title, value, trend }) {
    return (
        <Card className="h-100 shadow-sm stat-card">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="icon-container">
                        <Icon size={24} />
                    </div>
                    {trend && (
                        <Badge bg="success">
                            +{trend}%
                        </Badge>
                    )}
                </div>
                <Card.Subtitle className="mb-1 text-muted">{title}</Card.Subtitle>
                <Card.Title as="h4" className="mb-0">{value}</Card.Title>
            </Card.Body>
        </Card>
    );
}

function MentorStats() {
    const [totalMentees, setTotalMentees] = useState(0);
    const [totalSessions, settotalSessions] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [menteesMonth, setmenteesMonth] = useState(0);
    const [mentorRating, setMentorRating] = useState(0);
    const [monthlyMenteeData, setMonthlyMenteeData] = useState([]);
    const [sessionData, setSessionData] = useState([]);

    useEffect(() => {
        const fetchSessionDistribution = async () => {
            try {
                const response = await getSessionDistribution();
                const data = [
                    { name: 'Completed', value: response.data.completed, color: '#198754' },
                    { name: 'Pending', value: response.data.pending, color: '#ffc107' },
                    { name: 'Rescheduled', value: response.data.rescheduled, color: '#0dcaf0' },
                    { name: 'Rejected', value: response.data.rejected, color: '#dc3545' },
                    { name: 'Cancelled', value: response.data.cancelled, color: '#ff6e00' }
                ];
                setSessionData(data);
            } catch (error) {
                console.error('Error fetching session distribution:', error);
            }
        };

        fetchSessionDistribution();
    }, []);


    useEffect(() => {
        const fetchMenteesData = async () => {
            try {
                const response = await menteesMentoredMonthWise();
                // Transform the data for the chart
                const chartData = Object.entries(response.data.menteesMonthWise).map(([month, count]) => {
                    const [year, monthNum] = month.split('-');
                    return {
                        month: `${monthNum}-${year.slice(2)}`, // Convert YYYY-MM to MM-YY
                        mentees: count
                    };
                });
                setMonthlyMenteeData(chartData);
            } catch (error) {
                console.error('Error fetching mentees data:', error);
            }
        };

        fetchMenteesData();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const response = await getMentorRating();
                setMentorRating(response.data.mentorRating?.rating || 0);
            } catch (error) {
                console.error("Error fetching mentor rating:", error);
            }
        })();
    }, []);



    useEffect(() => {
        // Define the async function
        const fetchTotalMentees = async () => {
            try {
                setLoading(true);
                const response = await totalMenteeMentored();
                setTotalMentees(response.data.totalMentees);
            } catch (err) {
                console.error('Error fetching total mentees:', err);
                setError('Failed to fetch total mentees');
            } finally {
                setLoading(false);
            }
        };

        // Call it
        fetchTotalMentees();
    }, []);
    useEffect(() => {
        // Define the async function
        const fetchTotalSessions = async () => {
            try {
                setLoading(true);
                const response = await getTotalSessions();
                settotalSessions(response.data.totalSessions);
            } catch (err) {
                console.error('Error fetching total mentees:', err);
                setError('Failed to fetch total sessions');
            } finally {
                setLoading(false);
            }
        };

        // Call it
        fetchTotalSessions();
    }, []);
    useEffect(() => {
        // Define the async function
        const fetchmenteesMonth = async () => {
            try {
                setLoading(true);
                const response = await newMenteesMentoredPerMonth();
                const sumOfNewMentees = Object.values(response.data.newMenteesPerMonth).reduce(
                    (acc, count) => acc + count,
                    0
                );
                setmenteesMonth(sumOfNewMentees);

            } catch (err) {
                console.error('Error fetching total mentees:', err);
                setError('Failed to fetch total mentees');
            } finally {
                setLoading(false);
            }
        };

        // Call it
        fetchmenteesMonth();
    }, []);


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    return (
        <div className="min-vh-100 bg-light">
            <Container className="py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h2 mb-0">Mentor Dashboard</h1>

                </div>

                <Row className="mb-4 g-4">
                    <Col xs={12} md={6} lg={3}>
                        <StatCard
                            icon={Users}
                            title="Total Mentees"
                            value={totalMentees}

                        />
                    </Col>
                    <Col xs={12} md={6} lg={3}>
                        <StatCard
                            icon={UserPlus}
                            title="New Mentees This Month"
                            value={menteesMonth}

                        />
                    </Col>

                    <Col xs={12} md={6} lg={3}>
                        <StatCard
                            icon={Tv}
                            title="Total Sessions"
                            value={totalSessions}

                        />
                    </Col>            <Col xs={12} md={6} lg={3}>
                        <StatCard
                            icon={Star}
                            title="Average Rating"
                            value={mentorRating}
                        />
                    </Col>
                </Row>

                <Row className="g-4 mb-4 mt-4">
                    <Col xs={12} lg={6}>
                        <Card className="h-100 shadow-sm">
                            <Card.Body>
                                <Card.Title as="h5" className="mb-4">Monthly Mentee Growth</Card.Title>
                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={monthlyMenteeData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis
                                                label={{
                                                    value: 'Number of Mentees',
                                                    angle: -90,
                                                    position: 'insideLeft',
                                                    offset: -5
                                                }}
                                                ticks={[0, 1, 2, 3, 4, 5]} // Specify the exact values you want to show
                                                domain={[0, 5]} // Set the range of the axis
                                                allowDecimals={false}
                                            />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="mentees" name="Total Mentees" fill="#0d6efd" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xs={12} lg={6}>
                        <Card className="h-100 shadow-sm">
                            <Card.Body>
                                <Card.Title as="h5" className="mb-4">Revenue Trend</Card.Title>
                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={revenueData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#198754"
                                                strokeWidth={2}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="g-4">


                    <Col xs={12} lg={4} style={{ marginLeft: '450px' }}>
                        <Card className="shadow-sm" >
                            <Card.Body>
                                <Card.Title as="h5" className="mb-4">Session Distribution</Card.Title>
                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={sessionData}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {sessionData.map((entry, index) => (
                                                    <Cell key={index} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default MentorStats;