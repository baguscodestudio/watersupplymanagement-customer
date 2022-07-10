export default interface BillType {
  billId: string;
  customerId: string;
  month: number;
  year: number;
  rate: number;
  totalUsage: number;
  title: string;
  createdAt: string;
  deadline: string;
  payment: {
    transactionID: string;
    createdAt: string;
    cardNumber: string;
  };
  isDeleted: boolean;
}
