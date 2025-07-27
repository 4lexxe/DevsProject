interface TabNavigationProps {
  activeTab: "details" | "payments"
  onTabChange: (tab: "details" | "payments") => void
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="mb-6">
      <div className="border-b border-[#eff6ff]">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => onTabChange("details")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "details"
                ? "border-[#1d4ed8] text-[#1d4ed8]"
                : "border-transparent text-gray-500 hover:text-[#0c154c] hover:border-[#42d7c7]"
            }`}
          >
            Detalles de Suscripción
          </button>
          <button
            onClick={() => onTabChange("payments")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "payments"
                ? "border-[#1d4ed8] text-[#1d4ed8]"
                : "border-transparent text-gray-500 hover:text-[#0c154c] hover:border-[#42d7c7]"
            }`}
          >
            Historial de Pagos
          </button>
        </nav>
      </div>
    </div>
  )
}

