const express = require('express');
const cors = require('cors');
const { Permit } = require('permitio');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const permit = new Permit({
  token: process.env.PERMIT_API_KEY,
  pdp: process.env.PDP_URL
});

// User sync endpoint
app.post('/api/auth/sync-user', async (req, res) => {
  try {
    const { userId, email, department } = req.body;
    
    const user = await permit.api.users.sync({
      key: userId,
      email: email,
      attributes: { department }
    });
    
    await permit.api.roleAssignments.assign({
      user: userId,
      role: "Attendee",
      tenant: 'default'
    });
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Permission check endpoint
app.post('/api/auth/check-permission', async (req, res) => {
  try {
    const { userId, action, resource } = req.body;
    
    const allowed = await permit.check(userId, action, resource);
    
    res.json({ allowed });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Role assignment endpoint
app.post('/api/auth/assign-role', async (req, res) => {
  try {
    const { userId, role } = req.body;
    
    const result = await permit.api.roleAssignments.assign({
      user: userId,
      role: role,
      tenant: 'default'
    });
    
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/get-user-attributes', async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Get user from Permit IO
    const user = await permit.api.users.get(userId);
    
    res.json({
      success: true,
      attributes: user.attributes || {}
    });
  } catch (error) {
    console.error('Error getting user attributes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Authorization server running on port ${port}`);
  console.log(`Connected to Permit.io PDP at ${process.env.PDP_URL || 'http://localhost:7766'}`);
});
