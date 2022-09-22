import { UserLocale } from 'src/user/user.types'

const ALTERODO_LUNCH_FR = `
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

const ALTERODO_LUNCH_EN = `
<html><body>
    <p>
      Congrats, you are today's Alterodos !
    </p>
    <p>
      As the tradition requires, a lunch is to be organized to get to know each other better.
    </p>
    <p>
      Unless you prefer having an afternoon tea with biscuits ?
    </p>
    <p>
      It's up to you to find a date ⛳️
    </p>
    <p>
      See you in a while crocodile or Best regards ?
    </p>
    <p>
      Asakai San
    </p>

</body></html>
`

const WELCOME_EMAIL_FR = `
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
      Je te laisse avec cette reco de designer non professionnel : re-clique sur ta réponse pour passer à la question suivante, pas besoin d'utiliser les flèches.
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
const WELCOME_EMAIL_EN = `
    <html><body>
    <h2> Welcome to Theodercafe !</h2>
    <p>
      Your account has juste been created, visit theodercafe.com !
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
      As a non professional designer, I recommend you to click again on your answer to go to the next question. No need to use arrows.
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

export const WELCOME_EMAIL_TEMPLATE = {
    [UserLocale.en]: WELCOME_EMAIL_EN,
    [UserLocale.fr]: WELCOME_EMAIL_FR,
}
export const ALTERODO_LUNCH_TEMPLATE = {
    [UserLocale.en]: ALTERODO_LUNCH_EN,
    [UserLocale.fr]: ALTERODO_LUNCH_FR,
}
