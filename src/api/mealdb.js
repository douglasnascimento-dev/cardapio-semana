// Camada de acesso à TheMealDB (https://www.themealdb.com/api.php)
// Todas as funções aceitam { signal } para permitir cancelar a requisição
// (útil no cleanup do useEffect com AbortController).

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

async function request(path, { signal } = {}) {
  const response = await fetch(`${BASE_URL}/${path}`, { signal })
  if (!response.ok) {
    throw new Error(`Erro ${response.status} ao acessar a TheMealDB`)
  }
  return response.json()
}

// A API devolve os ingredientes "achatados" em strIngredient1..20 e
// strMeasure1..20, com valores vazios, só com espaços ou null.
// Aqui viram um array limpo: [{ name, measure }].
export function normalizeMeal(raw) {
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const name = raw[`strIngredient${i}`]?.trim()
    const measure = raw[`strMeasure${i}`]?.trim() ?? ''
    if (name) {
      ingredients.push({ name, measure })
    }
  }

  return {
    id: raw.idMeal,
    name: raw.strMeal,
    thumb: raw.strMealThumb,
    category: raw.strCategory || null,
    area: raw.strArea || null,
    instructions: raw.strInstructions || '',
    tags: raw.strTags
      ? raw.strTags.split(',').map((tag) => tag.trim()).filter(Boolean)
      : [],
    youtube: raw.strYoutube || null,
    source: raw.strSource || null,
    ingredients,
  }
}

// filter.php devolve só id, nome e foto (sem ingredientes)
function normalizeSummary(raw) {
  return {
    id: raw.idMeal,
    name: raw.strMeal,
    thumb: raw.strMealThumb,
  }
}

export async function searchMealsByName(name, options) {
  const data = await request(`search.php?s=${encodeURIComponent(name)}`, options)
  // Sem resultados a API devolve { meals: null }, não um array vazio
  return (data.meals ?? []).map(normalizeMeal)
}

export async function getMealById(id, options) {
  const data = await request(`lookup.php?i=${encodeURIComponent(id)}`, options)
  return data.meals ? normalizeMeal(data.meals[0]) : null
}

export async function getRandomMeal(options) {
  const data = await request('random.php', options)
  return normalizeMeal(data.meals[0])
}

export async function getCategories(options) {
  const data = await request('categories.php', options)
  return (data.categories ?? []).map((c) => ({
    name: c.strCategory,
    thumb: c.strCategoryThumb,
    description: c.strCategoryDescription,
  }))
}

export async function listAreas(options) {
  const data = await request('list.php?a=list', options)
  return (data.meals ?? []).map((a) => a.strArea)
}

export async function listIngredients(options) {
  const data = await request('list.php?i=list', options)
  return (data.meals ?? []).map((i) => i.strIngredient)
}

// A versão gratuita só aceita UM filtro por requisição. Para combinar
// categoria + área + ingrediente, fazemos uma requisição por filtro (em
// paralelo) e mantemos só as receitas presentes em todos os resultados.
export async function filterMeals({ category, area, ingredient } = {}, options) {
  const paths = []
  if (category) paths.push(`filter.php?c=${encodeURIComponent(category)}`)
  if (area) paths.push(`filter.php?a=${encodeURIComponent(area)}`)
  if (ingredient) {
    // A API usa "_" no lugar de espaços: "chicken breast" -> "chicken_breast"
    const value = ingredient.trim().toLowerCase().replaceAll(' ', '_')
    paths.push(`filter.php?i=${encodeURIComponent(value)}`)
  }

  if (paths.length === 0) {
    return []
  }

  const responses = await Promise.all(paths.map((path) => request(path, options)))
  const lists = responses.map((data) => (data.meals ?? []).map(normalizeSummary))

  const [first, ...rest] = lists
  return first.filter((meal) =>
    rest.every((list) => list.some((other) => other.id === meal.id)),
  )
}
