import { GoogleProfile } from './google.strategy'

export const getEmailFromGoogleProfile = (profile: GoogleProfile) => {
    return profile.emails.length > 0 ? profile.emails[0].value : null
}
