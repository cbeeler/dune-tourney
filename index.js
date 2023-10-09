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

const markThePlayersInTheGameOfThree = (round) => {
  model.rounds[round][0].forEach((player) => {
    model.players[player].inThreePlayerGame = true;
  });
}

const createRound = (round, roundPlayerList) => {
  tableConfig.forEach(({ players }, tableIndex) => {
    model.rounds[round][tableIndex] = [];
    let playerIndex = 0;

    while(model.rounds[round][tableIndex].length < players) {
      const opponents = model.rounds[round][tableIndex];
      const player = model.players[roundPlayerList[playerIndex]];
      const playerName = roundPlayerList[playerIndex];

      if(alreadyPlayedOpponents(player.opponents, opponents) || 
        (players === 3 && player.inThreePlayerGame)) {
        playerIndex++;
        if(playerIndex === roundPlayerList.length) {
          throw 'invalid';
        }
      }
      else {
        model.rounds[round][tableIndex].push(playerName)
        roundPlayerList.splice(playerIndex, 1);
        playerIndex = 0;
      }
    }
  });

  return true;
};


for(let round = 0; round < rounds; round++) {
  let roundGenerated = false;

  do
  {
    const roundPlayerList = copyPlayersList();
    model.rounds[round] = [];

    try {
      createRound(round, roundPlayerList);
      roundGenerated = true
    }
    catch(e) {}
  } while(!roundGenerated);

  recordOpponentsForThisRound(round);
  markThePlayersInTheGameOfThree(round);
}

console.log(model.rounds)