const players  = require('./players');
const rounds = 3;
const tableConfig = [
  { players: 3 },
  { players: 4 },
  { players: 4 },
  { players: 4 }
];

const model = {
  rounds: [],
  players: {}
};

players.forEach((name) => {
  model.players[name] = {
    opponents: [],
    inThreePlayerGame: false
  }
});

const copyPlayersList = () => [...players].sort(() => (Math.random() > .5) ? 1 : -1);

const recordOpponentsForThisRound = (round) => {
  model.rounds[round].forEach((table) => {
    table.forEach((player, i) => {
      model.players[player].opponents = model.players[player].opponents.concat(table.toSpliced(i, 1))
    });
  });
};

const alreadyPlayedOpponents = (alreadyPlayed, opponents) => {
  let played = false;
  
  alreadyPlayed.forEach((opponent) => {
    if(opponents.includes(opponent)) {
      played = true;
    }
  });

  return played;
};


for(let round = 0; round < rounds; round++) {
  const roundPlayerList = copyPlayersList();
  model.rounds[round] = [];
  // console.log(roundPlayerList);

  tableConfig.forEach(({ players }, tableIndex) => {
    // console.log('new table', players, tableIndex)
    model.rounds[round][tableIndex] = [];
    let playerIndex = 0;

    while(model.rounds[round][tableIndex].length < players) {
      const opponents = model.rounds[round][tableIndex];
      const player = model.players[roundPlayerList[playerIndex]];
      const playerName = roundPlayerList[playerIndex];

      console.log(roundPlayerList)
      console.log(playerName, playerIndex, roundPlayerList.length)
      // console.log(player)

      if(alreadyPlayedOpponents(player.opponents, opponents)) {
        console.log('Not Allowing', roundPlayerList[playerIndex])
        playerIndex++;
        if(playerIndex === roundPlayerList.length) {
          // playerIndex = 0;
          // console.log(player.inThreePlayerGame)
          console.log(JSON.stringify(model, null, 2))
          throw 'invalid'
        }
        // console.log(playerIndex, roundPlayerList.length)
      }
      else {
        console.log('adding')
        model.rounds[round][tableIndex].push(playerName)
        roundPlayerList.splice(playerIndex, 1);
        playerIndex = 0;
      }


      // console.log('player selected')
    }
  });

  recordOpponentsForThisRound(round);
}

console.log(model.rounds)
console.log(model)
// console.log(JSON.stringify(model, null, 2))