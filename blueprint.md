
# Lotto Number Generator

## Overview

This project is a simple, visually appealing web application that generates and displays random lottery numbers. It's built using modern web standards, including HTML, CSS, and JavaScript, with an emphasis on a clean user interface and reusable components.

## Design and Features

### Visual Design
*   **Theme:** A clean and modern design with a playful feel.
*   **Colors:** A vibrant color palette to create an energetic look.
*   **Typography:** Clear and readable fonts, with a large heading for the title.
*   **Layout:** A centered layout that is responsive and works well on both desktop and mobile devices.
*   **Iconography:** Lotto ball icons to visually represent the numbers.
*   **Animation:** Subtle animations to make the number generation process more engaging.

### Features
*   **Number Generation:** Generates 6 unique random numbers between 1 and 45.
*   **Web Component:** Uses a custom HTML element (`<lotto-ball>`) to display each number, encapsulating its style and behavior.
*   **Interactivity:** A "Generate Numbers" button to trigger the lottery draw.

## Current Plan

*   **Objective:** Create a lottery number generator website.
*   **Steps:**
    1.  **Update `index.html`:** Set up the basic structure of the page with a title, a button, and a container for the lottery numbers.
    2.  **Update `style.css`:** Add styles for the overall layout, the button, and the lottery number display.
    3.  **Update `main.js`:**
        *   Create a `LottoBall` web component to display individual lottery numbers.
        *   Implement the logic to generate 6 unique random numbers.
        *   Add an event listener to the button to trigger the number generation and display.
