const express = require('express');
const app = express();
const apiRoutes = require('./src/routes/apiRoutes');

app.use(express.json());

// Mount routes
app.use('/api', apiRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));