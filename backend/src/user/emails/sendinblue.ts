import { IS_DEV, OWNER_EMAIL, SENDINBLUE_API_KEY } from 'src/constants'

const SibApiV3Sdk = require('@sendinblue/client')

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
const apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = SENDINBLUE_API_KEY

const sendEmail = async (recipients: string[], cc: string[], subject: string, htmlContent: string) => {
    let to_emails: string[] = []
    let cc_emails: string[] = []

    to_emails = recipients
    if (to_emails.length === 0) {
        to_emails = [OWNER_EMAIL]
    }
    cc_emails = cc
    cc.push(OWNER_EMAIL)

    const sendSmtpEmail = {
        sender: {
            name: 'Asakai San',
            email: 'theodercafe@gmail.com',
        },
        to: to_emails.map((recipient) => ({ email: recipient })),
        cc: cc_emails.map((recipient) => ({ email: recipient })),
        htmlContent,
        subject,
    }
    if (IS_DEV) {
        console.log('An email would be sent with sensinblue sendTransacEmail', sendSmtpEmail)
        return true
    }

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
        console.log('successfully sent email', JSON.stringify(data))
        return data?.response?.statusCode === 201
    } catch (e) {
        console.log('error while sending email', e)
        return false
    }
}

export default sendEmail
