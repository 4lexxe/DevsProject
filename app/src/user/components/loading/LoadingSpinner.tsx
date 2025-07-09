const LoadingSpinner = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <img
          src="https://i.ibb.co/dQ09SsH/logoDev2.png"
          alt="DEVs Project Logo"
          className="w-48 h-auto mb-8"
        />
        <div className="flex gap-2 justify-center items-center">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-3 h-3 bg-cyan-400 rounded loading-dot"
              style={{
                animationDelay: `${index * 0.16}s`,
              }}
            />
          ))}
        </div>
        <p className="mt-4 text-gray-700">Verificando</p>
      </div>
    </div>
  )
}

export default LoadingSpinner