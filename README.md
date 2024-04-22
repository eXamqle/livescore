# Livescore
The primary goal of this project was to develop a dynamic and interactive web page that accurately calculates and displays the scores of sports matches in a league, in real time.
The web page is designed to handle multiple sports matches concurrently, all of which could be happening on the same match day. It showcases the team pairings for the current day and receives match events in real time. 
These events are then used to display and update live scores.

# Scoreboard component
The Scoreboard component is a part of a React application that displays live match scores. It retrieves match data from a server, updates the scores in real-time, and renders them in a responsive interface.

## Features
<b>Real-time Data Retrieval</b>: The component uses the MatchService to fetch match data from the server every 2 seconds.  
<b>Error Handling</b>: If there’s an error while retrieving data, it renders an error message.  
<b>Responsive Design</b>: The component adjusts its layout based on the window width it also displays long names if the screen size is wide enough.  
<b>Live Score Updates</b>: The component updates the scores in real-time for each match. It only adds goals for event IDs higher than the previous ones to avoid duplications.  
<b>Team Logos</b>: The component displays the home and away team logos next to the team names.  

## Install and run the project
Run the project with "npm install && npm start"

## Tests
To run test use "npm test" and press "a"