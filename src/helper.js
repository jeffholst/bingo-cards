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

export {
  checkForBingo
}