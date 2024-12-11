import React from 'react';

const StarRating = ({ rating }) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span key={i} className={i <= rating ? 'text-warning' : 'text-muted'}>
                ★
            </span>
        );
    }

    return <div>{stars}</div>;
};

export default StarRating;