# **App Name**: Fancode Lite

## Core Features:

- Data Fetching and Sorting: Fetch match data from the provided JSON URL and sort it based on status (LIVE, UPCOMING) and start time.
- Status Filtering: Filter matches by status ('All Matches', 'LIVE Now', 'UPCOMING') using a button group.
- Category Filtering: Filter matches by category using a dropdown menu populated with unique event categories from the JSON data.
- Match Card Rendering: Render match cards in a responsive grid, displaying the image, category, team names, and status/schedule.
- Live Stream Playback: Play live streams from the `dai_url` in a modal using Clappr player.
- Stream Cleanup: Ensure video stream is paused/stopped and source unloaded when the modal is closed.
- Last Update Display: Display the 'last update time' string from the JSON data in the header/footer.

## Style Guidelines:

- Dark monochrome background using #16161a to create a dark and immersive viewing experience.
- Light gray (#A9A9A9) for text and key elements to ensure readability against the dark background.
- Soft white (#F5F5F5) is used for interactive elements and highlights to draw attention without causing harsh contrast, maintaining a subtle visual hierarchy.
- Use 'Bebas Neue', a sporty sans-serif font, for headings to convey energy and excitement.
- Use 'Roboto', a readable sans-serif font, for body text to ensure clarity on mobile devices.
- Mobile-first design implemented using Bootstrap 5's responsive grid system.
- Match cards are stacked vertically on smaller screens for easy scrolling and viewing.
- Navigation and filtering options are optimized for touch interaction on mobile devices.
- Simple, monochromatic icons for filters and actions to maintain a consistent dark monochrome aesthetic.
- No CSS transitions, complex shadows, or hover/focus animations as specified. Interactions are purely functional with button state changes and modal appearances only.