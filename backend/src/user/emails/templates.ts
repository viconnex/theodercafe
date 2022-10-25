import { UserLocale } from 'src/user/user.types'

const ALTERODO_LUNCH_FR = `
<html><body>
    <p>
      Félicitations, vous êtes les Alterodos et Varietos du jour !
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
      Congrats, you are today's Alterodos and Varietos !
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
      Ton compte vient d'être créé sur <a href="https://theodercafe.com">theodercafe.com</a>
    </p>
    <p>
      Pour faire vivre le jeu, n'hésite pas à ajouter des questions ! Cherche le + en bas à droite de l'écran.
      Une fois ta question approuvée par un admin, elle pourra tomber en asakai.
    </p>
    <h3>Mode d'emploi</h3>
    <p>
     Pour voir toutes les questions, désactive le mode Live. Les filtres te permettent d'afficher les questions validées ou non, celles auxquelles tu n'as pas encore répondu...
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
      Je te laisse avec cette astuce de designer amateur : re-clique sur ta réponse pour passer à la question suivante, pas besoin d'utiliser les flèches.
    </p>

    <p>
      A+ ou Cordialement ?
    </p>

    <p>
      Asakai San
    </p>

    <p>
      PS : Theodercafe vient de 'The oder Cafe' en Allemand.
    </p>

    </body></html>
`
const WELCOME_EMAIL_EN = `
    <html><body>
    <h2> Welcome to Theodercafe !</h2>
    <p>
      Your account has juste been created on theodercafe.com !
    </p>
    <p>
      For a better life, don't hesitate to add questions ! Look for the '+' on the bottom right of the screen.
      Once approved by an admin, it will have a chance to be displayed in the live mode.
    </p>
    <p>
      If you turn 'live mode' off, you will see all the questions. Use left pannel filters to display
      validated or not validated questions, questions you dit not answer yet...
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
      Today's non professional designer tip: click again on your answer to go to the next question. No need to use arrows.
    </p>

    <p>
      See you later aligator or Best regards ?
    </p>

    <p>
      Asakai San
    </p>

    <p>
      PS: Did you know Theodercafe stood for 'The oder Cafe' in german ?
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
