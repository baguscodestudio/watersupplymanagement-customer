import SensorDataType from './SensorData';

export default interface WaterUsageType {
  waterUsageId: string;
  customerId: string;
  date: string;
  data: SensorDataType[];
}
