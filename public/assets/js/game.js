$(document).ready(() => {

const cards = {
  numbers: ["2", "3", "4", "5", "6", "7", "8", "9", "1", "j", "q", "k", "a"],
  scores: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1],
  suits: ["clubs", "hearts", "diamonds", "spades"]
}
let deck = [];
let deckCount = 0;
let playerHand = [];
let dealerHand = [];
let wager = 0;
let playerHitCount = 2;
let dealerHitCount = 2;
let playerScore = 0;
let dealerScore = 0;
let lowAceScore = 0;
let playerFunds;
let insuraceBoolean = false;
let evenMoneyBoolean = false;
let dealerBlackjack = false;
let userBlackjack = false;


const makeDeck = (cardsObject) => {
  for (let i = 0; i < cardsObject.numbers.length; i++) {
    let diamond = cardsObject.numbers[i] + cardsObject.suits[0];
    let clubs = cardsObject.numbers[i] + cardsObject.suits[1];
    let hearts = cardsObject.numbers[i] + cardsObject.suits[2];
    let spades = cardsObject.numbers[i] + cardsObject.suits[3];
    deck.push(diamond, clubs, hearts, spades);
    deck.push(diamond, clubs, hearts, spades);
    deck.push(diamond, clubs, hearts, spades);
    deck.push(diamond, clubs, hearts, spades);
    deck.push(diamond, clubs, hearts, spades);
    deck.push(diamond, clubs, hearts, spades);
  }
}
const shuffle = (arr) => {
  let a;
  let b;
  let c;
  for (c = arr.length; c; c--) {
    a = Math.floor(Math.random() * c);
    b = arr[c - 1];
    arr[c - 1] = arr[a];
    arr[a] = b;
  }
}


const firstDeal = () => {
  playerHand.push(deck[deckCount]);
  deckCount++
  dealerHand.push(deck[deckCount]);
  deckCount++
  playerHand.push(deck[deckCount]);
  deckCount++
  dealerHand.push(deck[deckCount]);
  for (var x = 0; x < playerHand.length; x++ ){
    var newImg = $("<img class='cards'>");
    newImg.attr("src", "/../assets/images/cards/" + playerHand[x] + ".png");
    newImg.attr("height", "150");
    $(".playerHand").append(newImg);
  }
  for (var j = 0; j < dealerHand.length; j++ ){
    var newImg = $("<img>");
    if (j === 0) {
      newImg.attr("src", "/../assets/images/cards/cardback.png");
      newImg.attr("height", "150");
      newImg.attr('id', "dealerDownCard");
      $(".dealerHand").append(newImg);
    }
    else {
      newImg.attr("src", "/../assets/images/cards/" + dealerHand[j] + ".png");
      newImg.attr("height", "150");
      $(".dealerHand").append(newImg);
    }
  }
}

const removeDealButton = () => {
  $('.stuffToDelete').remove();
}

const addPlayerActions = () => {
  $(".playerActionButtons").append("<button id='hit' class='btn btn-danger btn-md hit'>Hit</button>");
  $(".playerActionButtons").append("<button class='btn btn-danger btn-md stand'>Stand</button>");
  $(".playerActionButtons").append("<button class='btn btn-danger btn-md double'>Double</button>");
  $(".playerActionButtons").append("<button class='btn btn-danger btn-md split'>Split</button>");
}

const hit = () => {
  deckCount++;
  playerHand.push(deck[deckCount]);
  var newImg = $("<img class='cards'>");
  newImg.attr("src", "/../assets/images/cards/" + playerHand[playerHitCount] + ".png");
  newImg.attr("height", "150");
  $(".playerHand").append(newImg);
  playerHitCount++;
  evaluateScore(playerHand);
  $(".double").prop("disabled",true);
  $(".split").prop("disabled",true);

}

const dealerPlay = () => {
  if(dealerScore <= 16 || $('#score2').text() === '7 / 17'){
    deckCount++;
    dealerHand.push(deck[deckCount]);
    var newImg = $("<img class='cards'>");
    newImg.attr("src", "/../assets/images/cards/" + dealerHand[dealerHitCount] + ".png");
    newImg.attr("height", "150");
    $(".dealerHand").append(newImg);
    dealerHitCount++;
    evaluateDealerScore(dealerHand);
  }
  if (dealerScore <= 16 || $('#score2').text() === '7 / 17'){
    setTimeout(dealerPlay, 1500);
    
  }
  else {
    setTimeout(winLoss, 1000);
  }
}

const evaluateScore = (arr) => {
  //check for aces as that will change stuff
  let acePresent = false;
  for (let i = 0; i < arr.length; i++) {
    if(arr[i].charAt(0) === "a") {
      acePresent = true;
    } 
  }
  playerScore = 0;
  for (let x = 0; x < arr.length; x++) {
    let currentCard = arr[x].charAt(0);
    let scoreIndex = cards.numbers.indexOf(currentCard);
    playerScore += cards.scores[scoreIndex];
  }
  if(acePresent && playerScore <= 11) {
    lowAceScore = playerScore
    playerScore += 10;
    $('#score').text(lowAceScore + " / " + playerScore);
  }
  else {
    $('#score').text(playerScore); 
  }
}

const evaluateDealerScore = (arr) => {
  //check for aces as that will change stuff
  let acePresent = false;
  for (let i = 0; i < arr.length; i++) {
    if(arr[i].charAt(0) === "a") {
      acePresent = true;
    } 
  }
  dealerScore = 0;
  for (let x = 0; x < arr.length; x++) {
    let currentCard = arr[x].charAt(0);
    let scoreIndex = cards.numbers.indexOf(currentCard);
    dealerScore += cards.scores[scoreIndex];
  }
  if(acePresent && dealerScore <= 11) {
    lowAceScore = dealerScore
    dealerScore += 10;
    $('#score2').text(lowAceScore + " / " + dealerScore);
  }
  else {
    $('#score2').text(dealerScore); 
  }
}
const stand = () => {
  $('#hit').prop('disabled',true);
  $('.stand').prop('disabled',true);
  $(".double").prop("disabled",true);
  $(".split").prop("disabled",true);
  $('#dealerDownCard').attr('src', "/../assets/images/cards/" + dealerHand[0] + ".png" );
  $("#dealerScore").append("<div><strong id='score2'></strong></div>");
  evaluateDealerScore(dealerHand);
  setTimeout(dealerPlay, 1500); 
}

const winLoss = () => {
  if(insuraceBoolean && dealerBlackjack){
    swal({
      title: "The Dealer had Blackjack!",
      text: "You took insurance and didn't lose anything!",
      icon: "warning",
      buttons: ["Make new bet?", "Quit and Logout?"],
      closeOnClickOutside: false,
    })
    .then(results => {
       if(!results) {
         location.reload();
       }
       else {
         window.location = "../auth/logout";
       }
      });
       
  }
  else if(userBlackjack && dealerBlackjack) {
    swal({
      title: "The dealer had Blackjack too!",
      text: "However, you still win even money becuase you surrendered your hand!",
      icon: "warning",
      buttons: ["Make new bet?", "Quit and Logout?"],
      closeOnClickOutside: false,
    })
    .then(results => {
      let newFunds = parseInt(playerFunds) + parseInt(wager);
      let playerData = {
        funds: newFunds
      }
      $.ajax({
        method: "PUT",
        url: '/game/update',
        data: playerData
      }).then(data => {
        if(!results) {
          location.reload();
        }
        else {
          window.location = "../auth/logout";
        }
      })
    });  
  }
  else if(insuraceBoolean && !dealerBlackjack && playerScore < dealerScore && dealerScore <= 21) {
    swal({
      title: "Double Trouble!",
      text: "You took insurance and the dealer did not have Blackjack. You also lost the hand. You lost 1.5 times your original wager",
      icon: "error",
      buttons: ["Make new bet?", "Quit and Logout?"],
      closeOnClickOutside: false,
    })
    .then(results => {
      let newFunds = playerFunds - (1.5 * wager);
      let playerData = {
        funds: newFunds
      }
      $.ajax({
        method: "PUT",
        url: '/game/update',
        data: playerData
      }).then(data => {
        if(!results) {
          location.reload();
        }
        else {
          window.location = "../auth/logout";
        }
      })
    });  
  }
  else if(insuraceBoolean && !dealerBlackjack && playerScore > dealerScore && playerScore <= 21) {
    swal({
      title: "Half victory!",
      text: "You took insurance and the dealer did not have Blackjack. You then won the hand. You only won half as much as you would have!",
      icon: "warning",
      buttons: ["Make new bet?", "Quit and Logout?"],
      closeOnClickOutside: false,
    })
    .then(results => {
      let newFunds = playerFunds + (0.5 * wager);
      let playerData = {
        funds: newFunds
      }
      $.ajax({
        method: "PUT",
        url: '/game/update',
        data: playerData
      }).then(data => {
        if(!results) {
          location.reload();
        }
        else {
          window.location = "../auth/logout";
        }
      })
    });  
  }
  else if(insuraceBoolean && dealerScore === playerScore) {
    swal({
      title: "You pushed but...",
      text: "You took insurance and the dealer did not have Blackjack, you've lost half your wager",
      icon: "error",
      buttons: ["Make new bet?", "Quit and Logout?"],
      closeOnClickOutside: false,
    })
    .then(results => {
      let newFunds = playerFunds - (0.5 * wager);
      let playerData = {
        funds: newFunds
      }
      $.ajax({
        method: "PUT",
        url: '/game/update',
        data: playerData
      }).then(data => {
        if(!results) {
          location.reload();
        }
        else {
          window.location = "../auth/logout";
        }
      })
    });  
  }
  else if (dealerScore > playerScore && dealerScore <= 21) {
    swal({
      title: "Oh no!!",
      text: "You lost!",
      icon: "error",
      buttons: ["Make new bet?", "Quit and Logout?"],
      closeOnClickOutside: false,
    })
    .then(results => {
      let newFunds = playerFunds - wager;
      let playerData = {
        funds: newFunds
      }
      $.ajax({
        method: "PUT",
        url: '/game/update',
        data: playerData
      }).then(data => {
        if(!results) {
          location.reload();
        }
        else {
          window.location = "../auth/logout";
        }
      })
    }); 
  }
  else if(dealerScore > 21 && playerScore <= 21) {
    swal({
      title: "You win!",
      text: "The dealer busted!",
      icon: "success",
      buttons: ["Make new bet?", "Quit and Logout?"],
      closeOnClickOutside: false,
    })
    .then(results => {
      console.log(wager);
      let newFunds = parseInt(playerFunds) + parseInt(wager);
      let playerData = {
        funds: parseInt(newFunds)
      }
      $.ajax({
        method: "PUT",
        url: '/game/update',
        data: playerData
      }).then(data => {
        if(!results) {
          location.reload();
        }
        else {
          window.location = "../auth/logout";
        }
      })
    }); 
  }
  else if($("#score").text() === "Blackjack!!" && dealerScore !== 21) {
    swal({
      title: "Blackjack!",
      text: "You win at 3:2 odds!",
      icon: "success",
      buttons: ["Make new bet?", "Quit and Logout?"],
      closeOnClickOutside: false,
    })
    .then(results => {
      let newFunds = parseInt(playerFunds) + (parseInt(wager) * 1.5);
      let playerData = {
        funds: parseInt(newFunds)
      }
      $.ajax({
        method: "PUT",
        url: '/game/update',
        data: playerData
      }).then(data => {
        if(!results) {
          location.reload();
        }
        else {
          window.location = "../auth/logout";
        }
      })
    }); 
  }
  else if(dealerScore < playerScore && playerScore <= 21) {
    swal({
      title: "Good Play!",
      text: "Winner, Winner, Chicken Dinner!!!",
      icon: "success",
      buttons: ["Make new bet?", "Quit and Logout?"],
      closeOnClickOutside: false,
    })
    .then(results => {
      console.log(wager);
      let newFunds = parseInt(playerFunds) + parseInt(wager);
      let playerData = {
        funds: parseInt(newFunds)
      }
      $.ajax({
        method: "PUT",
        url: '/game/update',
        data: playerData
      }).then(data => {
        if(!results) {
          location.reload();
        }
        else {
          window.location = "../auth/logout";
        }
      })
    }); 
  }
  else if (insuraceBoolean && playerScore > 21) {
    swal({
      title: "Well, that was as bad as it can get....",
      text: "You busted and you took insurance when the dealer didn't have Blackjack, you have lost 1.5 times your original wager!",
      icon: "error",
      buttons: ["Make new bet?", "Quit and Logout?"],
      closeOnClickOutside: false
    })
    .then(results => {
      let newFunds = playerFunds - (1.5 * wager);
      let playerData = {
        funds: newFunds
      }
      $.ajax({
        method: "PUT",
        url: '/game/update',
        data: playerData
      }).then(data => {
        if(!results) {
          location.reload();
        }
        else {
          window.location = "../auth/logout";
        }
      })
    }); 
  }
  else if(insuraceBoolean && dealerScore > 21) {
    swal({
      title: "Small Victories...",
      text: "The dealer busted, but you took insurance when the dealer did not have Blackjack, you've only won half your wager!",
      icon: "warning",
      buttons: ["Make new bet?", "Quit and Logout?"],
      closeOnClickOutside: false
    })
    .then(results => {
      let newFunds = playerFunds - (0.5 * wager);
      let playerData = {
        funds: newFunds
      }
      $.ajax({
        method: "PUT",
        url: '/game/update',
        data: playerData
      }).then(data => {
        if(!results) {
          location.reload();
        }
        else {
          window.location = "../auth/logout";
        }
      })
    });  
  }
  else if(playerScore > 21) {
    swal({
      title: "Oh no!!",
      text: "You busted, better luck next time!",
      icon: "error",
      buttons: ["Make new bet?", "Quit and Logout?"],
      closeOnClickOutside: false
    })
    .then(results => {
      let newFunds = playerFunds - wager;
      let playerData = {
        funds: newFunds
      }
      $.ajax({
        method: "PUT",
        url: '/game/update',
        data: playerData
      }).then(data => {
        if(!results) {
          location.reload();
        }
        else {
          window.location = "../auth/logout";
        }
      })
    }); 
  }
  else if(playerScore === dealerScore) {
    swal({
      title: "Push",
      text: "You have tied the dealer",
      icon: "info",
      buttons: ["Make new bet?", "Quit and Logout?"],
      closeOnClickOutside: false,
    })
    .then(results => {
      console.log(results);
      if(!results) {
        location.reload();
      }
      else {
        window.location = "../auth/logout";
      }
    });   
  }
}

const insurace = () => {
  if(dealerHand[1].charAt(0) === "a" && playerScore !== 21) {
    swal({
      title: "Insurance?",
      text: "The dealer is showing an ace, would you like insurance?",
      icon: "info",
      buttons: ["Yes", "No"]
    })
    .then (response => {
      if (response === null) {
        insuraceBoolean = true;
        if(dealerScore === 21 && playerScore !== 21) {
          dealerBlackjack = true;
          $('#dealerDownCard').attr('src', "/../assets/images/cards/" + dealerHand[0] + ".png" );
          setTimeout(dealerPlay, 500);
        }
        else{
          swal({
            title: "Dealer does not have blackjack!",
            text: "You've lost your insurance money, but you can still play the hand",
            icon: "info",
            button: "Return"
          }) 
        }
      }
      else {
        if(dealerScore === 21 && playerScore !== 21) {
          dealerBlackjack = true;
          $('#dealerDownCard').attr('src', "/../assets/images/cards/" + dealerHand[0] + ".png" );
          setTimeout(dealerPlay, 500);
        } 
      }
    })
  }
  else if(dealerHand[1].charAt(0) === "a" && playerScore === 21) {
    swal({
      title: "Even Money?",
      text: "The dealer is showing an ace, but you have blackjack. You can take your chances that the dealer does not have blackjack and win at 3:2 odds or you can surrender your hand and take even money.",
      icon: "info",
      buttons: ["Yes", "No"]
    })
    .then (response => {
      if (response === null) {
        evenMoneyBoolean = true;
        if (dealerScore === 21 && playerScore === 21) {
          dealerBlackjack = true;
          userBlackjack = true;
          $('#dealerDownCard').attr('src', "/../assets/images/cards/" + dealerHand[0] + ".png" );
          setTimeout(dealerPlay, 500);
        }
        else{
          swal({
            title: "Dealer does not have blackjack!",
            text: "But you simply win at even odds due to taking even money",
            icon: "warning",
            buttons: ["Make new bet?", "Quit and Logout?"],
            closeOnClickOutside: false
          }) 
          .then(result =>{
            let newFunds = parseInt(playerFunds) + parseInt(wager);
            let playerData = {
              funds: parseInt(newFunds)
            }
            $.ajax({
              method: "PUT",
              url: '/game/update',
              data: playerData
            }).then(data => {
              if(!result) {
                location.reload();
              }
              else {
                window.location = "../auth/logout";
              }
            })  
          });
          
        }
      }
      else {
        $('#dealerDownCard').attr('src', "/../assets/images/cards/" + dealerHand[0] + ".png" );
        console.log("What Up")
        $("#score").text("Blackjack!!");
        setTimeout(dealerPlay, 500); 
      }
    });  
  } 
}





makeDeck(cards);
shuffle(deck);

$('#deal').on('click', (event) => {
  event.preventDefault();
  $("#reset").prop("disabled",true);
  wager = $('#wager').val().trim();
  let rawPlayerFunds = $("#funds").text();
  let playerFundsArray = rawPlayerFunds.split("$");
  playerFunds = parseInt(playerFundsArray[1]);
  if(wager === "") {
    swal({
      title: "You didn't wager anything!",
      text: "Please enter a bet to proceed.",
      icon: "error",
      button: "Return"
    }); 
  }
  else if( wager > playerFunds) {
    swal({
      title: "You don't have that much money!",
      text: "Decrease your bet to proceed.",
      icon: "error",
      button: "Return"
    });  
  }
  else if (wager < 5 || wager > 500) {
    swal({
      title: "Bet outside of table limits!",
      text: "Wager must be between $5 and $500",
      icon: "error",
      button: "Return"
    });    
  }
  else {
  firstDeal();
  addPlayerActions();
  removeDealButton();
  $("#bustMessage").append("<div><strong id='score'></strong></div>");
  evaluateScore(playerHand);
  evaluateDealerScore(dealerHand);
  setTimeout (insurace, 500);
  
  
  if(playerScore === 21 && dealerScore !== 21 && dealerHand[1].charAt(0) !== "a"){
    $('#dealerDownCard').attr('src', "/../assets/images/cards/" + dealerHand[0] + ".png" );
    $("#hit").prop("disabled",true);
    $("#score").text("Blackjack!!");
    $('.stand').prop('disabled',true);
    $(".double").prop("disabled",true);
    $(".split").prop("disabled",true);
    setTimeout(winLoss, 1000);
  }
  //hit button, relies on user selection, can hit as many times as they like, but will disable
  //if they reach or exceed 21.
  $(".hit").on("click", (event) => {
    event.preventDefault();
    hit();
    if(playerScore >= 21){
      $('#hit').prop('disabled',true);
      $('.stand').prop('disabled',true);
      if(playerScore > 21) {
        $("#score").append("<div>You Busted!</div>");
        setTimeout(winLoss, 1000);
      }
      else{
        stand();
      }
    }
    
  });
  $('.double').on('click', (event) => {
    event.preventDefault();
    wager = wager * 2;
    if(wager > playerFunds) {
      swal({
        title: "You don't have enough money to do that!",
        text: "Hopefully you do next time!",
        icon: "error",
        button: "Return"
      }) 
      wager = wager / 2; 
    }
    else {
    $("#hit").prop("disabled",true);
    $('.stand').prop('disabled',true);
    $(".double").prop("disabled",true);
    $(".split").prop("disabled",true);
    hit();
    stand();
    }
  });

  $('.split').on('click', (event) => {
    swal({
      title: "Feature coming soon!",
      text: "Splitting is for hipsters anyway",
      icon: "warning",
      button: "Return"
    });  
  });
  
  //Stand button, initiates dealer side
  $('.stand').on('click', (event) => {
    event.preventDefault();
    stand();
  });



}
});

$('#stats').on('click', event => {
  event.preventDefault();
  swal({
    title: "Stat tracking in beta",
    text: "Check back later!!",
    icon: "warning",
    button: "Return"
  });  
});
$('#reset').on('click', event => {
  event.preventDefault();
  swal({
    title: "Are you sure...",
    text: "This will reset your funds to $1000, this cannot be undone.",
    icon: "warning",
    buttons: ["Yes", "No"]
  }).then(response => {
    if (response === null) {
      let playerData = {
        funds: 1000
      }
      $.ajax({
        method: "PUT",
        url: "/game/resetfunds",
        data: playerData
      }).then(data => {
        location.reload();
      })
    }
    else {
      null;
    }
  })  
});


});
