
const baseUrl = 'https://api.tdameritrade.com/v1/marketdata/chains'
const apikey = 'GCYYKPI2DSHFCOE4TSDY7DRDMKVAVAQU'
const conType = 'PUT'
const inclQuotes = 'TRUE'

export async function getPutData(symbol) {
  try {
  const url = `${baseUrl}?apikey=${apikey}&symbol=${symbol}&contractType=${conType}&includeQuotes=${inclQuotes}`
  const response = await fetch(url);
  return response.json()
  } catch (e) {
    console.log(e)
  }
}