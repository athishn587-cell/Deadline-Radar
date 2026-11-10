const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '50kb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/workload', require('./routes/workload'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
