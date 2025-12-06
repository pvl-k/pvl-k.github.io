// GitHub Metrics Fetcher
(function() {
  const GITHUB_USERNAME = 'pvl-k';
  const GITHUB_API_BASE = 'https://api.github.com';

  // Fetch GitHub user data
  async function fetchGitHubData() {
    try {
      const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`);
      if (!response.ok) {
        throw new Error('Failed to fetch GitHub data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
      return null;
    }
  }

  // Fetch contribution data from GitHub contribution graph
  async function fetchContributions() {
    try {
      // Note: GitHub doesn't provide a direct API for contribution counts
      // We'll use a workaround by fetching the user's events
      const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/events/public?per_page=100`);
      if (!response.ok) {
        throw new Error('Failed to fetch contributions');
      }
      const events = await response.json();
      
      // Count unique days with contributions in the last year
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      const contributionDays = new Set();
      events.forEach(event => {
        const eventDate = new Date(event.created_at);
        if (eventDate >= oneYearAgo) {
          contributionDays.add(eventDate.toDateString());
        }
      });
      
      return contributionDays.size;
    } catch (error) {
      console.error('Error fetching contributions:', error);
      return null;
    }
  }

  // Update followers and following count
  async function updateStats() {
    const data = await fetchGitHubData();
    
    if (data) {
      // Update followers and following
      const statsElement = document.querySelector('.sidebar-stats');
      if (statsElement) {
        const followersElement = statsElement.querySelector('strong:first-of-type');
        const followingElement = statsElement.querySelector('strong:last-of-type');
        
        if (followersElement) {
          followersElement.textContent = data.followers;
        }
        if (followingElement) {
          followingElement.textContent = data.following;
        }
      }
    }
  }

  // Update contribution count
  async function updateContributions() {
    // For contribution counts, we'll keep the static value from overview.yml
    // as GitHub doesn't provide a simple API for this
    // Alternative: Use GitHub GraphQL API (requires authentication)
    console.log('Contribution data loaded from static configuration');
  }

  // Initialize when DOM is ready
  function init() {
    updateStats();
    updateContributions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
