export type NutritionixItem = {
  name: string
  calories: number
  servingSize: string
  protein: number
  carbs: number
  fat: number
}

export const fetchFoodByUPC = async (upc: string): Promise<NutritionixItem> => {
  const res = await fetch(`https://trackapi.nutritionix.com/v2/search/item?upc=${upc}`, {
    headers: {
      'x-app-id': process.env.NUTRITIONIX_APP_ID ?? '',
      'x-app-key': process.env.NUTRITIONIX_APP_KEY ?? '',
    },
  })
  if (!res.ok) {
    throw new Error('Request failed')
  }
  const json = await res.json()
  const food = json.foods && json.foods[0]
  return {
    name: food?.food_name ?? 'Unknown',
    calories: food?.nf_calories ?? 0,
    servingSize: `${food?.serving_qty ?? ''} ${food?.serving_unit ?? ''}`,
    protein: food?.nf_protein ?? 0,
    carbs: food?.nf_total_carbohydrate ?? 0,
    fat: food?.nf_total_fat ?? 0,
  }
}
