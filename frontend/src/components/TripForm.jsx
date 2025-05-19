import { useState } from 'react'
import { useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const TripForm = ({ initialData, onSubmit, buttonText = 'Save Trip' }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      destination: '',
      startDate: null,
      endDate: null,
      budget: {
        amount: 0,
        currency: 'USD'
      },
      isPublic: false
    }
  })

  const [startDate, setStartDate] = useState(initialData?.startDate ? new Date(initialData.startDate) : null)
  const [endDate, setEndDate] = useState(initialData?.endDate ? new Date(initialData.endDate) : null)

  const handleStartDateChange = (date) => {
    setStartDate(date)
    setValue('startDate', date)

    // If end date is before start date, update end date
    if (endDate && date > endDate) {
      setEndDate(date)
      setValue('endDate', date)
    }
  }

  const handleEndDateChange = (date) => {
    setEndDate(date)
    setValue('endDate', date)
  }

  const submitHandler = (data) => {
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Trip Title *
        </label>
        <input
          id="title"
          type="text"
          className={`w-full px-3 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          {...register('title', { required: 'Trip title is required' })}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          {...register('description')}
        ></textarea>
      </div>

      <div>
        <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
          Destination *
        </label>
        <input
          id="destination"
          type="text"
          className={`w-full px-3 py-2 border rounded-md ${errors.destination ? 'border-red-500' : 'border-gray-300'}`}
          {...register('destination', { required: 'Destination is required' })}
        />
        {errors.destination && (
          <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date *
          </label>
          <DatePicker
            id="startDate"
            selected={startDate}
            onChange={handleStartDateChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select start date"
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date *
          </label>
          <DatePicker
            id="endDate"
            selected={endDate}
            onChange={handleEndDateChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select end date"
            minDate={startDate}
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="budgetAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Budget Amount
          </label>
          <input
            id="budgetAmount"
            type="number"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            {...register('budget.amount', { valueAsNumber: true })}
          />
        </div>

        <div>
          <label htmlFor="budgetCurrency" className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            id="budgetCurrency"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            {...register('budget.currency')}
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
            <option value="CAD">CAD</option>
            <option value="AUD">AUD</option>
          </select>
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="isPublic"
          type="checkbox"
          className="h-4 w-4 text-primary-600 border-gray-300 rounded"
          {...register('isPublic')}
        />
        <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
          Make this trip public
        </label>
      </div>

      <div>
        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition duration-200"
        >
          {buttonText}
        </button>
      </div>
    </form>
  )
}

export default TripForm
