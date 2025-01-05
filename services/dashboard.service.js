const Order = require('../models/order.model');

class DashboardService {
    async getDashboardStats(query = {}) {
        try {
            let { from, to, timeRange } = query;
            let startDate = new Date();
            let endDate = new Date();

            // Xử lý khoảng thời gian
            if (from && to) {
                startDate = new Date(from);
                startDate.setHours(0, 0, 0, 0);
                
                endDate = new Date(to);
                endDate.setHours(23, 59, 59, 999);
            } else {
                switch (timeRange) {
                    case 'week':
                        startDate.setDate(startDate.getDate() - 7);
                        startDate.setHours(0, 0, 0, 0);
                        endDate.setHours(23, 59, 59, 999);
                        break;
                    case 'month':
                        startDate.setMonth(startDate.getMonth() - 1);
                        startDate.setHours(0, 0, 0, 0);
                        endDate.setHours(23, 59, 59, 999);
                        break;
                    case 'year':
                        startDate.setFullYear(startDate.getFullYear() - 1);
                        startDate.setHours(0, 0, 0, 0);
                        endDate.setHours(23, 59, 59, 999);
                        break;
                    default: // today
                        startDate.setHours(0, 0, 0, 0);
                        endDate.setHours(23, 59, 59, 999);
                }
            }

            // Thống kê đơn hàng theo trạng thái
            const orderStats = await Order.aggregate([
                {
                    $match: {
                        createdAt: { 
                            $gte: startDate,
                            $lte: endDate 
                        }
                    }
                },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        totalAmount: { $sum: '$total' }
                    }
                }
            ]);

            // Lấy danh sách đơn hàng pending và cancelled
            const pendingOrders = await Order.find({
                createdAt: { 
                    $gte: startDate,
                    $lte: endDate 
                },
                status: 'pending'
            })
            .sort({ createdAt: -1 })
            .select('orderId customerName phone total status createdAt')
            .lean();

            const cancelledOrders = await Order.find({
                createdAt: { 
                    $gte: startDate,
                    $lte: endDate 
                },
                status: 'cancelled'
            })
            .sort({ createdAt: -1 })
            .select('orderId customerName phone total status createdAt')
            .lean();

            // Thống kê doanh thu theo thời gian
            const timeRangeRevenue = await Order.aggregate([
                {
                    $match: {
                        status: 'completed',
                        createdAt: { 
                            $gte: startDate,
                            $lte: endDate 
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: timeRange === 'today' ? '%Y-%m-%dT%H:%M:%S.000Z' : '%Y-%m-%d',
                                date: '$createdAt'
                            }
                        },
                        revenue: { $sum: '$total' }
                    }
                },
                {
                    $sort: { '_id': 1 }
                }
            ]);

            // Đơn hàng gần đây
            const recentOrders = await Order.find()
                .sort({ createdAt: -1 })
                .limit(5);

            // Tính tổng doanh thu và số đơn hàng
            const totalRevenue = orderStats.reduce((sum, stat) => {
                return sum + (stat._id === 'completed' ? stat.totalAmount : 0);
            }, 0);

            const totalOrders = orderStats.reduce((sum, stat) => sum + stat.count, 0);

            return {
                orderStats: {
                    pending: orderStats.find(s => s._id === 'pending')?.count || 0,
                    completed: orderStats.find(s => s._id === 'completed')?.count || 0,
                    cancelled: orderStats.find(s => s._id === 'cancelled')?.count || 0,
                    total: totalOrders
                },
                revenue: {
                    total: totalRevenue,
                    timeRange: timeRange || 'custom'
                },
                recentOrders,
                timeRangeRevenue,
                pendingOrders,
                cancelledOrders
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new DashboardService(); 