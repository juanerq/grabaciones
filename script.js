import postgres from './database/postgres.js'
import { queryGetRecordingName } from './query.js'
import { input } from '@inquirer/prompts';
import ShareFile from './shareFile.js';
import { exec } from 'child_process'
import fs from 'fs'
import { formatDate } from './utils/index.js';

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
    let { gestion_fecha, location, telefono, deudor_id } = gestion
    if(!location) continue

    const fileName = location.split('/').pop()
    const debtorString = deudor_id.toString().trim().padStart(19, '0')

    const { format, dateObj, day, month } = formatDate(gestion_fecha)


    const newNameFile = `cob_Lex_${deudor_id.trim()}_${telefono.trim()}_${dateObj.getTime()}`
    const newNameFileValid = (`COB_LEX_${debtorString}_${format}`).toUpperCase()

   
    let pathFile = `${pathMount}/${month}/${day}`
    let files = listFiles[pathFile]

    
    if(!listFiles[pathFile]) {
      files = await shareFile.readdir(pathFile)
      listFiles[pathFile] = files

      console.log('Num files', pathFile, files.length)
    }

    const fileExists = files.find(file => file.toUpperCase().includes(newNameFile.toUpperCase()))
    
    if(fileExists && fs.existsSync(`${pathFile}/${fileExists}`)) {
      console.log(`Rename: ${fileExists} => ${newNameFileValid}.mp3`)

      exec(`sudo mv ${pathFile}/${fileExists} ${pathFile}/${newNameFileValid}.mp3`, (error, stdout, stderr) => {
          if (error) {
              console.log(`error: ${error.message}`);
              return;
          }
          if (stderr) {
              console.log(`stderr: ${stderr}`);
              return;
          }
          console.log(`stdout: ${fileExists} => ${newNameFileValid}.mp3`);
      });
    } 
  }

/*   const json = await shareFile.readdir(pathMount)
  let notExists = []
  json.forEach(e => {
    const nameJson = e.split('_').slice(0, 4).join('_')
    const exists = listFilesAll.find(f => f.includes(nameJson))
    if(!exists) {
      notExists.push(nameJson)
    }
  });

  console.log(notExists);
  console.log(notExists.length) */
})()
