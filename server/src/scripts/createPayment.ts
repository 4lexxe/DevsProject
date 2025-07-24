import Payment from "../modules/billing/models/Payment";

const createPayment = async () => {
  try {
    const payment = await Payment.create({
      id: "payment123",
      mpSubscriptionId: "subscription123", // No se comprobará la existencia en MPSubscription
      dateApproved: new Date(),
      status: "approved",
      transactionAmount: 100.00,
      paymentMethodId: "visa",
      paymentTypeId: "credit_card",
      data: { some: "data" },
    });

    console.log("Pago creado:", payment);
  } catch (error) {
    console.error("Error al crear el pago:", error);
  }
};

createPayment();