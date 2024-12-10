import React, { useState } from 'react';
import { Tabs, Tab, Card, Row, Col } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

const AdminPage = () => {
  const [key, setKey] = useState('mentors');

  const sampleChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Data',
        backgroundColor: 'rgba(75,192,192,0.6)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        data: [10, 20, 30, 40, 50],
      },
    ],
  };

  const stats = {
    mentors: { count: 25, chartData: sampleChartData },
    workshops: { count: 12, chartData: sampleChartData },
    jobs: { count: 45, chartData: sampleChartData },
  };

  const renderTabContent = (tabKey) => (
    <div>
      <Row className="mb-3">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Total {tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}</Card.Title>
              <Card.Text>{stats[tabKey].count}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>{tabKey.charAt(0).toUpperCase() + tabKey.slice(1)} Statistics</Card.Title>
              <Bar data={stats[tabKey].chartData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Admin Dashboard</h2>
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="mentors" title="Mentors">
          {renderTabContent('mentors')}
        </Tab>
        <Tab eventKey="workshops" title="Workshops">
          {renderTabContent('workshops')}
        </Tab>
        <Tab eventKey="jobs" title="Job Applications">
          {renderTabContent('jobs')}
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdminPage;
