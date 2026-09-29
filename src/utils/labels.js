// Traduções e listas usadas nos filtros e nos cards.

const CATEGORY_LABELS = {
  Beef: 'Carne bovina',
  Breakfast: 'Café da manhã',
  Chicken: 'Frango',
  Dessert: 'Sobremesa',
  Goat: 'Cabra',
  Lamb: 'Cordeiro',
  Miscellaneous: 'Diversos',
  Pasta: 'Massas',
  Pork: 'Porco',
  Seafood: 'Frutos do mar',
  Side: 'Acompanhamentos',
  Starter: 'Entradas',
  Vegan: 'Vegano',
  Vegetarian: 'Vegetariano',
}

export function categoryLabel(category) {
  return CATEGORY_LABELS[category] ?? category
}

// Por que a lista de origens não vem da API?
// O list.php?a=list devolve 195 origens, mas só ~30 têm receitas. Além
// disso, as receitas misturam nome do país ("India", "France") com
// gentílico ("Italian", "British"), e filter.php?a=Indian devolve vazio.
// Testando todas, o nome do país em inglês funciona sempre, então ele é
// o `value` usado no filtro. `aliases` são as outras formas que aparecem
// no campo strArea das receitas.
export const AREAS = [
  { value: 'Algeria', label: 'Argélia', aliases: ['Algerian'] },
  { value: 'Argentina', label: 'Argentina', aliases: ['Argentine'] },
  { value: 'Australia', label: 'Austrália', aliases: ['Australian'] },
  { value: 'Austria', label: 'Áustria', aliases: ['Austrian'] },
  { value: 'Belgium', label: 'Bélgica', aliases: ['Belgian'] },
  { value: 'Brazil', label: 'Brasil', aliases: ['Brazilian'] },
  { value: 'Canada', label: 'Canadá', aliases: ['Canadian'] },
  { value: 'Chile', label: 'Chile', aliases: ['Chilean'] },
  { value: 'China', label: 'China', aliases: ['Chinese'] },
  { value: 'Colombia', label: 'Colômbia', aliases: ['Colombian'] },
  { value: 'Croatia', label: 'Croácia', aliases: ['Croatian'] },
  { value: 'Cuba', label: 'Cuba', aliases: ['Cuban'] },
  { value: 'Denmark', label: 'Dinamarca', aliases: ['Danish'] },
  { value: 'Egypt', label: 'Egito', aliases: ['Egyptian'] },
  { value: 'Spain', label: 'Espanha', aliases: ['Spanish'] },
  { value: 'United States', label: 'Estados Unidos', aliases: ['American'] },
  { value: 'Philippines', label: 'Filipinas', aliases: ['Filipino'] },
  { value: 'France', label: 'França', aliases: ['French'] },
  { value: 'Greece', label: 'Grécia', aliases: ['Greek'] },
  { value: 'Netherlands', label: 'Holanda', aliases: ['Dutch'] },
  { value: 'India', label: 'Índia', aliases: ['Indian'] },
  { value: 'Ireland', label: 'Irlanda', aliases: ['Irish'] },
  { value: 'Italy', label: 'Itália', aliases: ['Italian'] },
  { value: 'Jamaica', label: 'Jamaica', aliases: ['Jamaican'] },
  { value: 'Japan', label: 'Japão', aliases: ['Japanese'] },
  { value: 'Malaysia', label: 'Malásia', aliases: ['Malaysian'] },
  { value: 'Morocco', label: 'Marrocos', aliases: ['Moroccan'] },
  { value: 'Mexico', label: 'México', aliases: ['Mexican'] },
  { value: 'Norway', label: 'Noruega', aliases: ['Norwegian'] },
  { value: 'Kenya', label: 'Quênia', aliases: ['Kenyan'] },
  { value: 'Poland', label: 'Polônia', aliases: ['Polish'] },
  { value: 'Portugal', label: 'Portugal', aliases: ['Portuguese'] },
  { value: 'United Kingdom', label: 'Reino Unido', aliases: ['British'] },
  { value: 'Russia', label: 'Rússia', aliases: ['Russian'] },
  { value: 'Saudi Arabia', label: 'Arábia Saudita', aliases: ['Saudi Arabian'] },
  { value: 'Slovakia', label: 'Eslováquia', aliases: ['Slovak'] },
  { value: 'Syria', label: 'Síria', aliases: ['Syrian'] },
  { value: 'Thailand', label: 'Tailândia', aliases: ['Thai'] },
  { value: 'Tunisia', label: 'Tunísia', aliases: ['Tunisian'] },
  { value: 'Turkey', label: 'Turquia', aliases: ['Turkish'] },
  { value: 'Ukraine', label: 'Ucrânia', aliases: ['Ukrainian'] },
  { value: 'Uruguay', label: 'Uruguai', aliases: ['Uruguayan'] },
  { value: 'Venezuela', label: 'Venezuela', aliases: ['Venezuelan'] },
  { value: 'Vietnam', label: 'Vietnã', aliases: ['Vietnamese'] },
].sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'))

function findArea(name) {
  if (!name) return null
  return AREAS.find((a) => a.value === name || a.aliases.includes(name)) ?? null
}

export function areaLabel(name) {
  return findArea(name)?.label ?? name
}

// "Italian" e "Italy" são a mesma origem
export function sameArea(a, b) {
  const found = findArea(a)
  return found ? found === findArea(b) : a === b
}
