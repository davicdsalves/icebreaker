# Icebreaker HTML

A simple HTML page for generating icebreaker questions and managing a user list. Perfect for team building activities, social events, or any situation where you need fun and engaging icebreaker questions.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- Generate random icebreaker questions from a predefined list.
- Add users to a user list.
- Select a user from the list and display the selected user.
- Remove the selected user from the user list.

## Usage

1. Open the `index.html` file in a web browser.
2. Click the "Generate Question" button to display a random icebreaker question.
3. Click the "Add User" button to add a user to the user list.
4. Click the "Select User" button to select a user from the user list and display it.
5. The selected user will be shown below the generated question.

## Loading User List from Query Parameter
You can also load a user list from a query parameter.  
Simply add the query parameter userList to the URL when opening the index.html file in the browser.  
The user list should be comma-separated values.

Example:
```
index.html?users=user1,user2,user3
```
In this example, the page will load with the user list containing "user1", "user2", and "user3".****

## Customization

- Icebreaker Questions: You can customize the list of icebreaker questions by modifying the `questions` array in the JavaScript code.
- Styling: You can modify the CSS styles in the `<style>` tag to change the appearance of the page according to your preferences.

Feel free to explore and adapt the HTML code to suit your specific needs. Have fun!

