document.addEventListener('DOMContentLoaded', function () {
  function updateVerse() {
    const options = { method: 'GET', headers: { accept: 'application/json' } };

    fetch('https://beta.ourmanna.com/api/v1/get?format=json&order=daily', options)
      .then(response => response.json())
      .then(response => {
        const verseText = response.verse.details.text;
        const verseReference = response.verse.details.reference;
        document.getElementById('verse-text').textContent = verseText;
        document.getElementById('verse-reference').textContent = verseReference;
      })
      .catch(err => console.error(err));
  }

  // Function to calculate the time remaining until midnight PST
  function getTimeRemainingUntilMidnight() {
    const now = new Date();
    const midnightPST = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      8, // 8 AM UTC is midnight PST
      0,
      0,
      0
    );
    const timeRemaining = midnightPST - now;
    return timeRemaining > 0 ? timeRemaining : 0;
  }

  // Initial update
  updateVerse();

  // Update the verse every day starting at 00:00 AM PST
  setInterval(updateVerse, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
});
