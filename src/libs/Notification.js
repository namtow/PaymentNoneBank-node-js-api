import fetch from 'node-fetch'
import { URLSearchParams } from 'url'
import config from 'config'

const lineapp = config.get('linenotification')

export const NotificationErrorService = async message => {
    try {
        const params = new URLSearchParams()
        const DataMessage = { project: lineapp.projectname, message: message }
        params.append('message', JSON.stringify(DataMessage))
        const res = await fetch('https://notify-api.line.me/api/notify', {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: lineapp.authorization
            }
        })
        const data = await res.json()
        if (data.status !== 200) {
            console.log('send notification to LINE APP is error.')
        }

        return true
    } catch (error) {
        throw error
    }
}
