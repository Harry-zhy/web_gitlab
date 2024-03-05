import { IBusinessInformation, NewBusinessInformation } from './business-information.model';

export const sampleWithRequiredData: IBusinessInformation = {
  id: 57603,
};

export const sampleWithPartialData: IBusinessInformation = {
  id: 9605,
  information: 'contingency integrate Namibia',
  specialServicesAvailable: 'supply-chains',
};

export const sampleWithFullData: IBusinessInformation = {
  id: 33130,
  information: 'payment Delaware interface',
  businessHours: 'Vermont SCSI',
  specialServicesAvailable: 'magnetic invoice Accounts',
};

export const sampleWithNewData: NewBusinessInformation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
