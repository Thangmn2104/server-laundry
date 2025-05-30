const Order = require('../models/order.model');

class DashboardService {
    async getDashboardStats(query = {}) {
        try {
            let { from, to, timeRange, userId } = query;
            let startDate = new Date();
            let endDate = new Date();
            // new ObjectId('67795fc55ad74ee19eac3aaf') -> convert to string
            userId = userId.toString();
            console.log(userId);
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

            // Create base filter with date range
            const baseFilter = {
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            };

            // Add userId filter if provided
            if (userId) {
                baseFilter.userId = userId;
            }

            // Thống kê đơn hàng theo trạng thái
            const orderStats = await Order.aggregate([
                {
                    $match: baseFilter
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
            const pendingFilter = {
                ...baseFilter,
                status: 'pending'
            };

            const pendingOrders = await Order.find(pendingFilter)
                .sort({ createdAt: -1 })
                .select('orderId customerName phone total status createdAt')
                .lean();

            const cancelledFilter = {
                ...baseFilter,
                status: 'cancelled'
            };

            const cancelledOrders = await Order.find(cancelledFilter)
                .sort({ createdAt: -1 })
                .select('orderId customerName phone total status createdAt')
                .lean();

            // Thống kê doanh thu theo thời gian
            const revenueFilter = {
                ...baseFilter,
                status: 'completed'
            };

            const timeRangeRevenue = await Order.aggregate([
                {
                    $match: revenueFilter
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
            const recentOrdersFilter = userId ? { userId } : {};

            const recentOrders = await Order.find(recentOrdersFilter)
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