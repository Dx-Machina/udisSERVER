const app = require('./app'); // Import the app

const PORT = process.env.PORT || 5001; // Define the port

app.listen(PORT, () => {  console.log(`Server running on port ${PORT}`); }); // Start the server