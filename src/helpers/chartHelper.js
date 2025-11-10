const categoryNameById = (categories = []) => {
  const map = new Map()
  for (const c of categories) map.set(c.id, c.name || 'Unnamed')
  return map
}

export { categoryNameById }