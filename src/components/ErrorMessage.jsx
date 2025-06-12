import { AlertCircle } from "lucide-react"

const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6 rounded-md">
      <div className="flex items-center">
        <AlertCircle className="text-red-500 mr-3" size={24} />
        <p className="text-red-700">{message}</p>
      </div>
    </div>
  )
}

export default ErrorMessage
