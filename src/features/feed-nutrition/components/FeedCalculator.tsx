'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card'
import Button from '@/shared/ui/Button'
import type { FeedRecipe, NutritionalProfile, Product } from '@/types'
import { Calculator, Beaker } from 'lucide-react'

export default function FeedCalculator() {
  const [selectedIngredients, setSelectedIngredients] = useState<Product[]>([])
  const [targetProfile, setTargetProfile] = useState({
    proteinPct: 16,
    energyMjPerKg: 12,
    fibreMaxPct: 8
  })
  const [result, setResult] = useState<FeedRecipe | null>(null)

  const calculateRation = () => {
    // TODO: Implement feed ration calculation
    console.log('Calculating feed ration...')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Beaker className="h-5 w-5" />
            <span>Feed Ration Calculator</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Ingredients
              </label>
              <p className="text-sm text-gray-500">
                Choose available feed ingredients to mix
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Target Nutritional Profile
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Protein %</label>
                  <input
                    type="number"
                    value={targetProfile.proteinPct}
                    onChange={(e) => setTargetProfile({
                      ...targetProfile,
                      proteinPct: parseFloat(e.target.value)
                    })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Energy (MJ/kg)</label>
                  <input
                    type="number"
                    value={targetProfile.energyMjPerKg}
                    onChange={(e) => setTargetProfile({
                      ...targetProfile,
                      energyMjPerKg: parseFloat(e.target.value)
                    })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Fibre Max %</label>
                  <input
                    type="number"
                    value={targetProfile.fibreMaxPct}
                    onChange={(e) => setTargetProfile({
                      ...targetProfile,
                      fibreMaxPct: parseFloat(e.target.value)
                    })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>

            <Button onClick={calculateRation} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Optimal Mix
            </Button>

            {result && (
              <div className="mt-4 p-4 bg-green-50 rounded">
                <h4 className="font-semibold mb-2">Calculated Recipe</h4>
                <div className="space-y-2">
                  {result.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{ing.product?.name}</span>
                      <span>{ing.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

