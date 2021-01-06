import { sign } from 'jsonwebtoken'

export const createFirebaseJWT = (id: number) => {
    const issuingTime = Math.round(Date.now() / 1000 - 60)
    const expirationTime = issuingTime + 3600 // Maximum expiration time is one hour
    const payload = {
        alg: 'RS256',
        iss: 'firebase-adminsdk-o2guq@theodercafe.iam.gserviceaccount.com',
        sub: 'firebase-adminsdk-o2guq@theodercafe.iam.gserviceaccount.com',
        aud: 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit',
        iat: issuingTime,
        exp: expirationTime,
        uid: id,
    }
    const secret = process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n')
    if (secret === undefined) {
        throw Error('no firebase service account secret in env')
    }

    return sign(payload, secret, { algorithm: 'RS256' })
}
