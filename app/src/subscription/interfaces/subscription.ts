export interface Payment {
  id: string
  status: string
  transactionAmount: string
  paymentMethodId: string
  dateApproved: string
  paymentTypeId: string
}

export interface MpSubscription {
  nextPaymentDate: string
}

export interface Plan {
  name: string
  description: string
  totalPrice: string
  duration: number
  durationType: string
  features: string[]
  accessLevel: string
  installments: number
  installmentPrice: string
  discountEvent?: DiscountEvent
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  startDate: string
  endDate: string
  status: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  plan: Plan
  mpSubscription: MpSubscription
  payments: Payment[]
}

export interface Invoice {
  id: string
  debit_date: string
  reason: string
  type: string
  payment_method_id: string
  transaction_amount: string
}


export interface DiscountEvent {
  description?: string;
  value: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  planId: number;
  event: string;
}
