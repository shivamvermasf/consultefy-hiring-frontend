const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const Activity = require('../models/Activity');
const Invoice = require('../models/Invoice');

// Get dashboard statistics
router.get('/stats', auth, async (req, res) => {
  try {
    // Get total candidates
    const totalCandidates = await Candidate.countDocuments();

    // Get active jobs
    const activeJobs = await Job.countDocuments({ status: { $ne: 'closed' } });

    // Get total revenue
    const totalRevenue = await Invoice.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Get monthly revenue
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyRevenue = await Invoice.aggregate([
      {
        $match: {
          status: 'paid',
          createdAt: { $gte: startOfMonth }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      totalCandidates,
      activeJobs,
      totalRevenue: totalRevenue[0]?.total || 0,
      monthlyRevenue: monthlyRevenue[0]?.total || 0
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent activities
router.get('/activities/recent', auth, async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ created_at: -1 })
      .limit(10)
      .populate('user', 'name')
      .populate('entity', 'title name');

    res.json(activities);
  } catch (err) {
    console.error('Error fetching recent activities:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent jobs
router.get('/jobs/recent', auth, async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ created_at: -1 })
      .limit(10)
      .select('title clientCompany status');

    res.json(jobs);
  } catch (err) {
    console.error('Error fetching recent jobs:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 