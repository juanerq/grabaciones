import fs from 'fs'

class ShareFile {
  constructor(config) {
  }

  readdir(path = '') {
    return new Promise((resolve, reject ) => {
      fs.readdir(path, (err, files) => {
        if(err) reject(err)

        resolve(files)
      })
    })
  }

  writeFile(file, addressee) {
    return new Promise((resolve, reject ) => {
      this.smb2Client.writeFile(addressee, file, (err) => {
        if(err) reject(err)

        resolve('It\'s saved!')
      })
    })
  }

  rename(oldPath, newPath) {
    return new Promise((resolve, reject ) => {
      fs.rename(oldPath, newPath, (err) => {
        if(err) reject(err)

        resolve('file has been renamed')
      })
    })
  }
}

export default ShareFile