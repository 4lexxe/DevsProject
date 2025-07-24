// Define the plan type
export interface Plan {
  name: string;
  description: string;
  totalPrice: number;
  durationType: string;
  duration: number;
  features: string[];
  accessLevel: string;
  installments: number;
  installmentPrice: number;
  discountEvent: DiscountEvent;
  mpSubPlan: MPSubPlan;
}


// Define the discount type
export interface DiscountEvent {
  description?: string;
  value: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  planId: number;
  event: string;
}

interface MPSubPlan{
  initPoint: string;
}