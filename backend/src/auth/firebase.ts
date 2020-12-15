import { sign } from 'jsonwebtoken'

const issuingTime = Date.now() / 1000
const expirationTime = issuingTime + 3600 // Maximum expiration time is one hour

export const createFirebaseJWT = (id: number) => {
    const payload = {
        iss: 'firebase-adminsdk-iglrm@maposaic-99785.iam.gserviceaccount.com',
        sub: 'firebase-adminsdk-iglrm@maposaic-99785.iam.gserviceaccount.com',
        aud: 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit',
        iat: issuingTime,
        exp: expirationTime,
        uid: id,
    }
    const secret = process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY
    if (secret === undefined) {
        throw Error('no firebase service account secret in env')
    }

    return sign(payload, secret)
}
