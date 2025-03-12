const DashboardService = require('../services/dashboard.service');

class DashboardController {
    async getDashboardStats(req, res) {
        try {
            const { timeRange, from, to } = req.query;
            const stats = await DashboardService.getDashboardStats({ timeRange, from, to, userId: req.user._id });
            res.json(stats);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new DashboardController(); 