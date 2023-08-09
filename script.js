import postgres from './database/postgres.js'
import { queryGetRecordingName } from './query.js'
import { input } from '@inquirer/prompts';
import ShareFile from './shareFile.js';
import { exec } from 'child_process'

const shareFile = new ShareFile()
const pathMount = '/home/desarrollo/solicitudes'
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

    let pathFile = `${pathMount}/${monthGestion}/${dayGestion}`
    let files = listFiles[pathFile]


    if(!listFiles[pathFile]) {
      files = await shareFile.readdir(pathFile)
      listFiles[pathFile] = files
      console.log('Num files', pathFile, files.length)
    }

    const fileExists = files.find(file => file === fileName)

    if(fileExists) {
      console.log(`Rename: ${fileExists} => ${newNameFile}.mp3`)

      exec(`sudo mv /home/desarrollo/solicitudes/01/04/20220104-080459_3108205685_DAVIVI09_M1040804590009946164-all.mp3 /home/desarrollo/solicitudes/01/04/cob_Lex_3108205685_1641301992000.mp3`, (error, stdout, stderr) => {
          if (error) {
              console.log(`error: ${error.message}`);
              return;
          }
          if (stderr) {
              console.log(`stderr: ${stderr}`);
              return;
          }
          console.log(`stdout: ${stdout}`);
      });
      //await shareFile.rename(`${pathFile}/${fileExists}`, `${pathFile}/${newNameFile}.mp3`)
    }
  }

})()

//20220105-175908_3157471461_DAVIVI09_M1051759080009982928-all.mp3