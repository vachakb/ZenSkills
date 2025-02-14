import React from 'react';
import { Card } from 'react-bootstrap';
import '../styles/StatCard.css';  // Add this import at the top

const StatCard = ({ icon: Icon, title, value }) => {
    return (
        <Card className="h-100 shadow-sm stat-card">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="icon-container">
                        <Icon size={24} />
                    </div>
                </div>
                <Card.Subtitle className="mb-1 text-muted">{title}</Card.Subtitle>
                <Card.Title as="h4" className="mb-0">{value}</Card.Title>
            </Card.Body>
        </Card>
    );
};

export default StatCard;