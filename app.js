const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const DATA_FILE = 'users.json';

// Ensure the data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Utility functions to read/write user data
const readUsers = () => JSON.parse(fs.readFileSync(DATA_FILE));
const writeUsers = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// API to add a user
app.post('/add_user', (req, res) => {
  const { email, age } = req.body;
  if (!email || !age) return res.status(400).json({ error: 'Email and age are required!' });

  const users = readUsers();
  if (users.some((user) => user.email === email))
    return res.status(400).json({ error: 'User already exists!' });

  const newUser = { email, age };
  users.push(newUser);
  writeUsers(users);
  res.status(201).json({ message: 'User added successfully!', user: newUser });
});

// API to get user information
app.get('/get_user', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email is required!' });

  const users = readUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(404).json({ error: 'User not found!' });

  res.json(user);
});

// API to update user information
app.post('/add_user', (req, res) => {
  const { email, age } = req.body;
  console.log('Request Body:', req.body); // Debugging

  if (!email || !age) {
    console.error('Validation Error: Missing email or age');
    return res.status(400).json({ error: 'Email and age are required!' });
  }

  const users = readUsers();
  console.log('Existing Users:', users); // Debugging

  if (users.some((user) => user.email === email)) {
    console.error('Duplicate User Error:', email);
    return res.status(400).json({ error: 'User already exists!' });
  }

  const newUser = { email, age };
  users.push(newUser);
  writeUsers(users);
  console.log('New User Added:', newUser); // Debugging

  res.status(201).json({ message: 'User added successfully!', user: newUser });
});



// API to delete a user
app.delete('/delete_user', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required!' });

  const users = readUsers();
  const newUsers = users.filter((u) => u.email !== email);
  if (newUsers.length === users.length) return res.status(404).json({ error: 'User not found!' });

  writeUsers(newUsers);
  res.json({ message: 'User deleted successfully!' });
});

// Start the server if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Export the app for testing
module.exports = { app };
