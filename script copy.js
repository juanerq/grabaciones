import ShareFile from './shareFile.js';
import postgres from './database/postgres.js'
import { queryGetRecordingName } from './query.js'
import { input } from '@inquirer/prompts';


const shareFile = new ShareFile({
  share: '\\\\10.150.1.201\\solicitudes',
  domain: '',
  username: '',
  password: '',
})

//const regexSearchByMonth = RegExp(`2023-${config.month.toString().padStart(2, '0')}-([0-9][1-9])`, 'g');

;(async () => {

  const date = await input({ message: 'Enter date: year-month-day' });
  const [year, month, day] = date.split('-')

  const query = queryGetRecordingName({
    year: +year,
    month: month.toString().padStart(2, '0'),
    day: day.toString().padStart(2, '0')
  })
  const [gestiones] = await postgres.query(query, { raw: true })
  console.log('Num gestiones', date, gestiones.length);

  const listFiles = {}

  for(const gestion of gestiones) {
    let { gestion_fecha, location, telefono } = gestion
    if(!location) continue

    const fileName = location.split('/').pop()
    const date = new Date(gestion_fecha)
    const dayGestion = (date.getDate()).toString().padStart(2, '0')
    const monthGestion = (date.getMonth() + 1).toString().padStart(2, '0')

    const newNameFile = `cob_Lex_${telefono.trim()}_${date.getTime()}`

    let pathFile = `${monthGestion}/${dayGestion}`
    let files = listFiles[pathFile]

    if(!listFiles[pathFile]) {
      files = await shareFile.readdir(pathFile)
      listFiles[pathFile] = files
      console.log('Num files', pathFile, files.length)
    }

    const fileExists = files.find(file => file === fileName)

    if(fileExists) {
      console.log(`Rename: ${pathFile}/${fileExists} => ${pathFile}/${newNameFile}.mp3`)
      await shareFile.rename(`01/04/out-V1041859590009951029-3124274648-20220104-185959-1641340799.84793.gsm.mp3`, `01/04/test.mp3`)
    }
  }

})()