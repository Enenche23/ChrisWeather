const Loading = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      <p className="ml-3 text-lg text-blue-800 font-medium">Loading weather data...</p>
    </div>
  )
}

export default Loading
