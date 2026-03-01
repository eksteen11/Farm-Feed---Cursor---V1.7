'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import Button from '@/shared/ui/Button'
import type { FeedCalculation } from '@/types'
import { Target, TrendingUp } from 'lucide-react'

export default function AnimalGoalCalculator() {
  const [animalType, setAnimalType] = useState('cattle')
  const [currentWeight, setCurrentWeight] = useState(0)
  const [targetWeight, setTargetWeight] = useState(0)
  const [targetDate, setTargetDate] = useState('')
  const [result, setResult] = useState<FeedCalculation | null>(null)

  const calculateGoal = () => {
    // TODO: Implement animal goal calculation
    console.log('Calculating animal goal...')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Animal Goal Calculator</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Animal Type</label>
            <select
              value={animalType}
              onChange={(e) => setAnimalType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="cattle">Cattle</option>
              <option value="pigs">Pigs</option>
              <option value="chickens">Chickens</option>
              <option value="sheep">Sheep</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Weight (kg)</label>
              <input
                type="number"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(parseFloat(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Target Weight (kg)</label>
              <input
                type="number"
                value={targetWeight}
                onChange={(e) => setTargetWeight(parseFloat(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Target Date</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <Button onClick={calculateGoal} className="w-full">
            <TrendingUp className="h-4 w-4 mr-2" />
            Calculate Feed Requirements
          </Button>

          {result && (
            <div className="mt-4 p-4 bg-blue-50 rounded">
              <h4 className="font-semibold mb-2">Results</h4>
              <div className="space-y-1 text-sm">
                <div>Daily Feed: {result.dailyFeedRequirementKg} kg/day</div>
                <div>Expected Gain: {result.expectedDailyGainKg} kg/day</div>
                <div>Total Feed Needed: {result.totalFeedNeededKg} kg</div>
                <div>Days to Target: {result.daysToTarget} days</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

