export const DAYS = [
  { id: 'mon', label: 'Segunda', short: 'Seg' },
  { id: 'tue', label: 'Terça', short: 'Ter' },
  { id: 'wed', label: 'Quarta', short: 'Qua' },
  { id: 'thu', label: 'Quinta', short: 'Qui' },
  { id: 'fri', label: 'Sexta', short: 'Sex' },
  { id: 'sat', label: 'Sábado', short: 'Sáb' },
  { id: 'sun', label: 'Domingo', short: 'Dom' },
]

export const SLOTS = [
  { id: 'lunch', label: 'Almoço' },
  { id: 'dinner', label: 'Jantar' },
]

export const TOTAL_SLOTS = DAYS.length * SLOTS.length

export function todayId() {
  const index = (new Date().getDay() + 6) % 7
  return DAYS[index].id
}

export function dayLabel(dayId) {
  return DAYS.find((d) => d.id === dayId)?.label ?? dayId
}

export function slotLabel(slotId) {
  return SLOTS.find((s) => s.id === slotId)?.label ?? slotId
}
