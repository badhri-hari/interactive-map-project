# Interactive Student Map

## Project Overview

This project is an interactive web application designed to assist school bus drivers in efficiently locating and managing student pickup points and route planning. By utilizing a map interface, drivers can search for student information by name, grade, student ID, address, and area. The application visualizes student locations on a map, allowing drivers to easily navigate and access relevant details for each student.

## Key Features

* **Map Display** : The application features a dynamic map using Leaflet.js to visualize student locations.
* **Student Data Storage** : The student data is stored securely on a MongoDB Atlas Database, thus ensuring that only authorized members can access the data.
* **Search Functionality** : Drivers can search for students by name, grade, student ID, address, and area.
* **Marker Placement** : Each student's address is marked on the map with customizable icons.
* **Interactive Pop-ups** : Clicking on a marker reveals a popup with detailed student information.
* **Responsive Design** : The map and user interface are optimized for both desktop and mobile devices.

## Technologies Used

* **HTML5** : For structuring the web application.
* **CSS3** : For styling and responsive design.
* **JavaScript (React.js)** : For dynamic functionality and interactive features.
* **Leaflet.js** : For map integration and marker management.
* **Axios:** For handling server requests from the frontend and to fetch data from the database.
* **Express.js:** For working with APIs within the NodeJS framework.

## Project Structure

* **App.css** : The CSS file for styling the application.
* **App.jsx** : The main JavaScript file where the application logic and interactions are implemented.
* **main.jsx** : Used in conjunction with **index.html** to render the **App.jsx** into the DOM.

## Setup Instructions

1. Clone the repository from GitHub.
2. Run `npm install` in the terminal while in the main directory.
3. Run `npm run dev` in the terminal while in the main directory.
4. Navigate to **localhost:5173** in a browser.
5. Ensure you have an active internet connection for Leaflet.js to load the map tiles.

## Usage Instructions

1. Open the application in a web browser.
2. Use the search bar to find students by name, grade, student ID, address, or area.
3. Click on the markers on the map to view detailed information about each student.
4. Utilize the map controls to zoom in and out or navigate to different areas.

## Project Outcomes

This project provided practical experience in front-end web development, particularly in working with interactive maps and markers. The skills gained include:

* Implementing map functionality using Leaflet.js.
* Enhancing user experience through interactive elements such as popups and responsive design.
* Developing a full-stack application using HTML, CSS, and JavaScript.

## Contact Information

For any inquiries or further information, please contact me. **Email** : [badhrihari123@gmail.com](mailto:badhrihari123@gmail.com)
