import { FraudReportModel, type FraudReportDocument } from '../models/fraudReport.model.js';
import { BaseRepository } from './base.repository.js';

class FraudRepository extends BaseRepository<FraudReportDocument> {
  constructor() {
    super(FraudReportModel);
  }
}

export const fraudRepository = new FraudRepository();