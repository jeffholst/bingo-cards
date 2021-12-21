import { syncScoreAPI } from "./api"
import { useUserStore } from "./stores/user"

function checkForBingo(cardItems) {
  let l1, l2, index
  let won = false

  // Check Horizontals
  l1 = 0
  while (!won && l1 < 5) {
    won = true
    index = l1
    for (l2 = 0; l2 < 5; l2++) {
      if (!cardItems[index].selected) {
        won = false
        break
      }
      index += 5
    }
    l1++
  }

  // Check Verticals
  l1 = 0
  while (!won && l1 <= 20) {
    won = true
    index = l1
    for (l2 = 0; l2 < 5; l2++) {
      if (!cardItems[index].selected) {
        won = false
        break
      }
      index++
    }
    l1 += 5
  }

  // Check Diagonals
  const ary = [
    [4, 8, 12, 16, 20],
    [0, 6, 12, 18, 24],
  ]
  l1 = 0
  while (!won && l1 < 2) {
    won = true
    for (index = 0; index < 5; index++) {
      if (!cardItems[ary[l1][index]].selected) {
        won = false
        break
      }
    }
    l1++
  }
  if (won) console.log('BINGO!')
  return won
}

function reScore(userName, cardItems, hasBingo) {
  if (!hasBingo) hasBingo = checkForBingo(cardItems)
  const matches = cardItems.filter(({ selected }) => selected)
    const score = {
      id: userName,
      score: matches.length,
      bingo: hasBingo,
    }
    syncScoreAPI(score)
}

function shuffle(array) {
    let currentIndex = array.length,
        randomIndex

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        // And swap it with the current element.
        ;[array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
        ]
    }
}


function updateProfile() {
  const myUser = useUserStore()
  
  const tmp = localStorage.getItem(`${myUser.userName}-profile`)

  if (tmp) {
    let json = JSON.parse(tmp)
    json.firstName = myUser.firstName
    json.nickName = myUser.nickName
    json.lastName = myUser.lastName
    json.synced = false
    localStorage.setItem(`${myUser.userName}-profile`, JSON.stringify(json))
  } else {
    const score = {
      id: myUser.userName,
      firstName: myUser.firstName,
      nickName: myUser.nickName,
      lastName: myUser.lastName,
      synced: false,
    }
    localStorage.setItem(`${myUser.userName}-profile`, JSON.stringify(score))
  }
}

export {
  checkForBingo, shuffle, reScore, updateProfile
}