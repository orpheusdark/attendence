import { FRAUD_ALERT_THRESHOLD } from '../config/constants.js';
import { fraudRepository } from '../repositories/fraud.repository.js';
import { AttendanceRecordModel } from '../models/attendanceRecord.model.js';

export interface FraudSignals {
  gpsMismatch?: boolean;
  mockLocation?: boolean;
  emulator?: boolean;
  rooted?: boolean;
  duplicateDevice?: boolean;
  multiUserSameDevice?: boolean;
  qrReuse?: boolean;
  delayedConfirmation?: boolean;
  outsideGeofence?: boolean;
  ipAnomaly?: boolean;
}

const SIGNAL_WEIGHTS: Record<keyof FraudSignals, number> = {
  gpsMismatch: 40,
  mockLocation: 100,
  emulator: 70,
  rooted: 70,
  duplicateDevice: 80,
  multiUserSameDevice: 80,
  qrReuse: 90,
  delayedConfirmation: 25,
  outsideGeofence: 50,
  ipAnomaly: 20
};

export class FraudService {
  score(signals: FraudSignals): { riskScore: number; triggered: string[] } {
    const triggered = Object.entries(signals)
      .filter(([, value]) => Boolean(value))
      .map(([key]) => key);

    const riskScore = triggered.reduce((sum, key) => sum + SIGNAL_WEIGHTS[key as keyof FraudSignals], 0);
    return { riskScore, triggered };
  }

  async flagIfNeeded(input: {
    sessionId: string;
    userId: string;
    attendanceRecordId?: string;
    signals: FraudSignals;
    reason: string;
  }) {
    const { riskScore, triggered } = this.score(input.signals);
    if (riskScore < FRAUD_ALERT_THRESHOLD) {
      return null;
    }

    const document: Record<string, unknown> = {
      sessionId: input.sessionId,
      userId: input.userId,
      reason: input.reason,
      riskScore,
      signals: Object.fromEntries(triggered.map(trigger => [trigger, SIGNAL_WEIGHTS[trigger as keyof FraudSignals]])),
      status: 'open'
    };

    if (input.attendanceRecordId) {
      document.attendanceRecordId = input.attendanceRecordId;
    }

    return fraudRepository.create(document);
  }

  async flagRecord(recordId: string, riskScore: number) {
    return AttendanceRecordModel.findByIdAndUpdate(recordId, { status: riskScore >= FRAUD_ALERT_THRESHOLD ? 'flagged' : 'pending' });
  }
}

export const fraudService = new FraudService();