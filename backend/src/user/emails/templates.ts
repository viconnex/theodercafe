import { UserLocale } from 'src/user/user.types'

export const alterodosLunch = `
<html><body>
    <p>
      Félicitations, vous êtes les Alterodos du jour !
    </p>
    <p>
      Comme le veut la tradition, un déjeuner est à organiser pour faire plus ample connaissance.
    </p>
    <p>
      A moins que vous ne soyez plutôt goûter ?
    </p>
    <p>
      A vos agendas ⛳️
    </p>
    <p>
      A+ ou Cordialement ?
    </p>
    <p>
      Asakai San
    </p>

</body></html>
`

export const WELCOME_EMAIL_FR = `
    <html><body>
    <h2> Bienvenue sur Theodercafe !</h2>
    <p>
      Ton compte vient d'être créé, rends-toi sur theodercafe.com.
    </p>
    <p>
      Tu pourras faire ou refaire tes choix à tête reposée.

      Utilise les filtres pour afficher les questions validées ou non, celles auxquelles tu n'as pas encore répondu...
    </p>
    <p>
      N'hésite pas à ajouter des questions ! C'est la clé de la réussite de Theodercafe. Cherche le bouton '+' en bas à droite de l'écran.
    </p>
    <p>
      Sur theodercafe.com/alterodo, retrouve la personne qui a le plus de similarité avec toi. 👨‍🌾
    </p>
    <p>
      Sur theodercafe.com/mbti, tu peux voir les profils MBTI de Theodo. 🦑
    </p>
    <p>
      Et sur theodercafe.com/carte, retrouve les réponses des Theodoers projetées sur une carte en 2d. 🗺
    </p>

    <p>
      A+ ou Cordialement ?
    </p>

    <p>
      Asakai San
    </p>

    <p>
      Le savais-tu ? Theodercafe vient de 'The oder Cafe' en Allemand.
    </p>

    </body></html>
`
export const WELCOME_EMAIL_EN = `
    <html><body>
    <h2> Welcome to Theodercafe !</h2>
    <p>
      Your account has juste been created. Visit theodercafe.com.
    </p>
    <p>
      If you turn 'live mode' off, you can see and answer all the questions. Use left pannel filters to display
      validated or not validated questions, questions you have not answered yet...
    </p>
    <p>
      Don't hesitate to add questions ! This is the key of the app. Look for the '+' button on the bottom right of the screen.
    </p>
    <p>
      On theodercafe.com/alterodo, find the Alterodo with greatest similarity with you. 👨‍🌾
    </p>
    <p>
      On theodercafe.com/mbti, you can fill your MBTI profile and see your company's profiles. 🦑
    </p>
    <p>
      And on theodercafe.com/carte, find a projection of Theodoer's answers on a 2D map. 🗺
    </p>

    <p>
      See you later aligator or Best regards ?
    </p>

    <p>
      Asakai San
    </p>

    <p>
      PS: Did you know Theodercafe stand for 'The oder Cafe' in german ?
    </p>

    </body></html>
`

export const computeWelcomeEmail = ({ userLocale }: { userLocale: UserLocale }) => {
    if (userLocale === UserLocale.en) {
        return WELCOME_EMAIL_EN
    }
    return WELCOME_EMAIL_FR
}
