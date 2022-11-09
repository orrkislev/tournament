import { onSnapshot } from "firebase/firestore"
import { getDocRef, newDoc } from "../utils/firebaseConfig"

const ids = [['ofrilany@gmail.com', 'tOa6Stl9hcMN2UmLKYZmKsZ6wVe2'],
['dekelbobrov@gmail.com', 'b89trVfRM4eL7d87QapbfIofsRe2'],
['sivan636@gmail.com', 'I7d7fgQhSVhTlkAG9YS3SDbicJz1'],
['tehila.sinn1@gmail.com', 'NeUQ2BpeeKUrsJUbIkEoGlsxPy03'],
['roni.kim1@gmail.com', 'ksorc7PdOTh3RWbrfFIZt3uqEDt2'],
['liza.zalkind@gmail.com', 'CigL8YZvvWQQIkWvvxUHZkAg5lZ2'],
['barakbit00@gmail.com', 'NM9VZVpUxJXCgbhBfuGbLEGzhEx2'],
['yair.natanshon@gmail.com', 'Cq8Ot4KiOTZ3s5pvkmAAlBXO5ya2'],
['elnatanart@gmail.com', 'RzPAwdHIZWXJ7BWYmtOcp4FAlyl2'],
['eladozeri10@gmail.com', 'jZdkKXAgYkbvpCEzKAgrY9IYrO52'],
['danielletsuker@gmail.com', 'iHBN6IcacuWVXrCWWbG8RBH2qCX2'],
['cbxs704@gmail.com', '2VjsfDeMU2R9QuvHvWvstoO6xtR2'],
['yotam1999@gmail.com', 'TAnP1BncemdCv1Q5LKVT5OLCgDz2'],
['amiron35@gmail.com', 'cSEnY1gTIrOgBBAyAFjvMr3ELxJ3'],
['eyalhochberger@gmail.com', 'OiwT2szDG0M731QL7fFO9y2XxHv2'],
['lera1009@gmail.com', 'ql0PvaW5fchIbNPNZ1XwPX1muph1'],
['lianweinstein4@gmail.com', '44r97F3IamYe3hEJvGMEFFE5Dz03'],
['jonathanmandel11@gmail.com', 'EAFl8JHkHlOSVstONLItYADxrDH3'],
['odejag@gmail.com', 'Ti1XgRxkNNbaCMPoZ0Wkbi2tgud2'],
['ahrz10@gmail.com', 'ZAidIV78zzfAn9BKgTd5UJN95We2'],
['jonathan.ventura@mail.huji.ac.il', 'ysKwEWTZDVcFQ2xKs0xc3AwcMad2'],
['yanaitoister@gmail.com', 'K3KNWe6QNGYp6HTAk2kJk7H95XL2'],
['hannush1@gmail.com', 'eEDNmVCePEPi6BnQGkSy55AdPZ73'],
['roniraviv2@gmail.com', 'LCyjk7Yxohhpz1VrO7QES0TC8He2'],
['efratgilboa28@gmail.com', 'QhYpVnZicyND4V3Ht9tmsuVOz912'],
['amir.yonatan@gmail.com', 'V9S7NfJtwTfpxTEmuNpaxOzzscl1'],
['nir@yennok.com', '2bUTgkiyhtcN4pIWSaF1lWznyG32'],
['oded.chai@gmail.com', 'izytdtj263R1pFa72ZTf1ZI4Qso1'],
['sheizaf@rafaeli.net', 'LQaMmQelRCd3Hu3rjaANP03kkas2'],
['arikmen77@gmail.com', 'oqcVvrRF9GQ9hvaImterbmU8r8w1'],
['yonirp@gmail.com', 'aZfqXCEO3fZO90k8Qk6orvR62eT2'],
['michal.pauzner@gmail.com', 'f3dzlQnFW7YpyksGg6ej5xkWXCt1'],
['sfkislev@gmail.com', 'cam5TslAMjTLxrxYK7ZmehLFlvg2'],
['freddy2000@gmail.com', 'Y0OLAeqDEyRb8M57GR9uLQglLr42'],
['orrkislev@gmail.com', 'y1qeyXvaOMhlb0g6pyvKZc3N0ln1']]

const emailToId = new Map(ids)

export default function SpecialPage() {

    const docId = 'qwEaHeo4I0xzola8s5CF'
    // const docId = 'X7pSJqQD7eM0Nfeoo8Px'
    onSnapshot(getDocRef('tasks', docId), (doc) => {
        const docData = { ...doc.data(), id: doc.id }
        console.log(docData)
        const newData = { ...docData }
        newData.author = ids.find(id => id[0] === docData.author)[1]
        newData.answers = {}
        Object.keys(docData.answers).forEach(key => {
            const userId = ids.find(id => id[0] === key)[1]
            newData.answers[userId] = { ...docData.answers[key], 'email': key }
        })
        if (docData.phase == 2) {
            newData.games = docData.games.map(game => {
                const newGame = { ...game }
                newGame.judge = ids.find(id => id[0] === game.judge)[1]
                newGame.participant1 = ids.find(id => id[0] === game.participant1)[1]
                newGame.participant2 = ids.find(id => id[0] === game.participant2)[1]
                return newGame
            })
        }
        delete newData.id
        console.log(newData)
        newDoc('tasks', newData)
    })


    return null
}