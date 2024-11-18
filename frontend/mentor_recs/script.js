document.getElementById('recommendForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    let menteeId = document.getElementById('menteeId').value.trim();
    const topN = document.getElementById('topN').value;

    // Convert menteeId to integer
    menteeId = parseInt(menteeId);

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<p>Loading recommendations...</p>';

    try {
        const response = await fetch('/api/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ menteeId, topN })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const mentorIds = await response.json(); // Updated to handle an array of mentor IDs

        if (mentorIds.error) {
            resultsDiv.innerHTML = `<p>${mentorIds.error}</p>`;
        } else {
            resultsDiv.innerHTML = `
                <h2>Recommended Mentor IDs:</h2>
                <ul>
                    ${mentorIds.map(id => `<li>${id}</li>`).join('')}
                </ul>
            `;
        }
    } catch (error) {
        resultsDiv.innerHTML = `<p>Error fetching recommendations: ${error.message}</p>`;
    }
});
