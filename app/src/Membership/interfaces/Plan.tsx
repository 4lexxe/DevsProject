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
  initialPoint?: string;
}
