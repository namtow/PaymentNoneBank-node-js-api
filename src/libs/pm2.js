const { exec } = require('child_process')
const restartCommand = 'pm2 restart'
const listCommand = 'pm2 list'
const stopCommand = 'pm2 stop'

export const restartApp = () => {
  exec(restartCommand, (err, stdout, stderr) => {
    if (!err && !stderr) {
      console.log(new Date(), 'App restarted!!!')
      listApps()
    } else if (err || stderr) {
      console.log(new Date(), `Error in executing ${restartCommand}`, err || stderr)
    }
  })
}

export const listApps = () => {
  exec(listCommand, (err, stdout, stderr) => {
    // handle err if you like!
    console.log('pm2 list')
    return stdout
  })
}

export const restartAppByName = name => {
  if (!name) return
  exec(`${restartCommand} ${name}`, (err, stdout, stderr) => {
    if (!err && !stderr) {
      console.log(new Date(), 'App restarted!!!')
      console.log(listApps())
    } else if (err || stderr) {
      const errorRes = `${new Date()} Error in executing ${restartCommand} ${err || stderr}`
      console.log(errorRes)
    }
  })
}

export const stopAppByName = name => {
    if (!name) return
    exec(`${stopCommand} ${name}`, (err, stdout, stderr) => {
      if (!err && !stderr) {
        console.log(new Date(), 'App Stop!!!')
        console.log(listApps())
      } else if (err || stderr) {
        const errorRes = `${new Date()} Error in executing ${stopCommand} ${err || stderr}`
        console.log(errorRes)
      }
    })
  }
  