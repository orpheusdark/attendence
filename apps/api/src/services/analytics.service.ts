import { AttendanceRecordModel } from '../models/attendanceRecord.model.js';
import { AttendanceSessionModel } from '../models/attendanceSession.model.js';
import { FraudReportModel } from '../models/fraudReport.model.js';

export class AnalyticsService {
  attendanceOverview() {
    return AttendanceRecordModel.aggregate([
      {
        $group: {
          _id: '$status',
          total: { $sum: 1 }
        }
      }
    ]);
  }

  departmentTrends(departmentId?: string) {
    const matchStage = departmentId ? [{ $match: { departmentId } }] : [];
    return AttendanceRecordModel.aggregate([
      ...matchStage,
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          attendance: { $sum: 1 },
          avgRiskScore: { $avg: '$riskScore' }
        }
      },
      { $sort: { '_id.month': 1 } }
    ]);
  }

  fraudOverview() {
    return FraudReportModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          averageRisk: { $avg: '$riskScore' }
        }
      }
    ]);
  }

  liveSummary() {
    return Promise.all([
      AttendanceSessionModel.countDocuments({ status: 'active', isDeleted: false }),
      AttendanceRecordModel.countDocuments({ status: 'confirmed', isDeleted: false }),
      AttendanceRecordModel.countDocuments({ status: 'flagged', isDeleted: false }),
      FraudReportModel.countDocuments({ status: 'open', isDeleted: false })
    ]).then(([activeSessions, confirmed, flagged, openFraud]) => ({
      activeSessions,
      confirmed,
      flagged,
      openFraud
    }));
  }

  attendanceMomentum() {
    return AttendanceRecordModel.aggregate([
      {
        $group: {
          _id: { day: { $dayOfMonth: '$createdAt' } },
          confirmed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0]
            }
          },
          flagged: {
            $sum: {
              $cond: [{ $eq: ['$status', 'flagged'] }, 1, 0]
            }
          }
        }
      },
      { $sort: { '_id.day': 1 } }
    ]);
  }

  fraudHeatmap() {
    return FraudReportModel.aggregate([
      {
        $group: {
          _id: { reason: '$reason', status: '$status' },
          count: { $sum: 1 },
          averageRisk: { $avg: '$riskScore' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
  }

  departmentComparison() {
    return AttendanceSessionModel.aggregate([
      {
        $group: {
          _id: '$departmentId',
          sessions: { $sum: 1 },
          attendanceCount: { $sum: '$attendanceCount' },
          confirmedCount: { $sum: '$confirmedCount' }
        }
      },
      {
        $addFields: {
          confirmedRate: {
            $cond: [
              { $gt: ['$attendanceCount', 0] },
              { $multiply: [{ $divide: ['$confirmedCount', '$attendanceCount'] }, 100] },
              0
            ]
          }
        }
      },
      { $sort: { confirmedRate: -1 } }
    ]);
  }
}

export const analyticsService = new AnalyticsService();