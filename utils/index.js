const formatNumLength = (num) => (num).toString().padStart(2, '0')

export function formatDate(date) {
  const dateObj = new Date(date)

  const year = dateObj.getFullYear()
  const day = formatNumLength(dateObj.getDate())
  const month = formatNumLength(dateObj.getMonth() + 1)
  const hour = formatNumLength(dateObj.getHours())
  const minutes = formatNumLength(dateObj.getMinutes())
  const seconds = formatNumLength(dateObj.getSeconds())

  return {
    format: `${year}${month}${day}${hour}${minutes}${seconds}`,
    month, day, dateObj
  } 
}


