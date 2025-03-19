export const formatCurrency = (amount: string | number): string => {
  const numericAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(numericAmount)
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    authorized: "Activa",
    pending: "Pendiente",
    cancelled: "Cancelada",
    inactive: "Inactiva",
    approved: "Aprobado",
    rejected: "Rechazado",
    in_process: "En proceso",
  }

  return statusMap[status] || "Desconocido"
}

export const getPaymentMethodText = (methodId: string): string => {
  const methodMap: Record<string, string> = {
    account_money: "Dinero en cuenta",
    credit_card: "Tarjeta de crédito",
    debit_card: "Tarjeta de débito",
  }

  return methodMap[methodId] || methodId
}

