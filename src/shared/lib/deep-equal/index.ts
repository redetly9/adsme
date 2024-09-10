export const deepEqual = (obj1: any, obj2: any): boolean => {
  // Если оба объекта — не объекты (например, примитивы), сравниваем их напрямую
  if (obj1 === obj2) return true

  // Если типы разные или один из них не объект, возвращаем false
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false
  }

  // Сравниваем количество ключей в объектах
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  if (keys1.length !== keys2.length) return false

  // Рекурсивно сравниваем каждое свойство объектов
  for (const key of keys1) {
    if (!deepEqual(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}
