const { ButtonBuilder, ButtonStyle, ActionRowBuilder, Attachment } = require("discord.js");

function dealCard() {
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const suits = ['♠', '♣', '♦', '♥'];
  const randomRanksIndex = Math.floor(Math.random() * ranks.length);
  const randomSuitsIndex = Math.floor(Math.random() * suits.length);

  return {rank: ranks[randomRanksIndex], suit: suits[randomSuitsIndex]};
}

function getCardValue(card) {
  const { rank } = card;
  if (['J', 'Q', 'K'].includes(rank)) {
    return 10;
  } else if (rank === 'A') {
    return 11;
  } else {
    return parseInt(rank);
  }
}

function calculateHandValue(hand) {
  let value = hand.reduce( (total, card) => total + getCardValue(card), 0);
  // Handle Aces (if total value > 21 and hand has Aces, convert Ace value from 11 to 1)
  let numAces = hand.filter((card) => card.rank === 'A').length;
  while (value > 21 && numAces > 0) {
    value -= 10;
    numAces--;
  }
  return value;
}

function displayHand(hand) {
  return hand.map( card => `${card.rank}${card.suit}`).join(' ');
}
async function game(message, playerHand, dealerHand, userStates, usuarioId){
	const playerHandValue = calculateHandValue(playerHand);
	
	let currentData = await message.edit({
		content: `Tus cartas:\`\`\`${displayHand(playerHand)} (${playerHandValue})\`\`\`Mano del Croupier:\`\`\`${dealerHand[0].rank}${dealerHand[0].suit} ❔\`\`\``,
		ephemeral: true,
	});
	if (playerHandValue === 21) {
		userStates.delete(usuarioId);	// Free the user from the game, this will allow the user to play again
		return await message.edit({
			content:`${currentData.content}\n**Blackjack! Ganaste!**`,
			components: []
		});
	} 
	else if (playerHandValue > 21) {
		userStates.delete(usuarioId);	// Free the user from the game, this will allow the user to play again
		return await message.edit({
			content: `${currentData.content}\n\n**Perdiste!** Tus cartas tienen un valor de ${playerHandValue} <:KEKW:815733223149010964>`,
			components: []
		});
	}
	//Create buttons for interactions
  	const btnMas = new ButtonBuilder()
        .setLabel("Otra ✅")
        .setStyle( ButtonStyle.Primary )
        .setCustomId("continue");
    const btnNo = new ButtonBuilder()
        .setLabel("❌")
        .setStyle( ButtonStyle.Danger )
        .setCustomId("stop");
    const btnRow = new ActionRowBuilder().addComponents( btnMas, btnNo );
	//Add buttons to the message
	message.edit({
		components: [ btnRow ],
		ephemeral: true,
	});
	const filter = (i) => i.user.id ===  message.mentions.users.first().id;	//Only the user who use the command can interact with it
	
	try{
		const userInteraction = await message.channel.awaitMessageComponent({
			filter: filter,
			time: 20000, // Time in milliseconds to wait for a button message 
		});
		userInteraction.deferUpdate();	// This is a 'preventDefault'

		if (userInteraction.customId === "continue") {	// If the user wants to continue deal a card and continue
			playerHand.push( dealCard() );
			await game( message, playerHand, dealerHand, userStates, usuarioId);
		} 
		else if (userInteraction.customId === "stop") { // Dealer's Turn
			let dealerHandValue = calculateHandValue(dealerHand);
			currentData = await message.edit({
				content: `Tus cartas:\`\`\`${displayHand(playerHand)} (${playerHandValue})\`\`\`Cartas del Croupier:\`\`\`${displayHand(dealerHand)} (${dealerHandValue})\`\`\``,
				components: []
			});
			// The dealer's Turn is over until the value of the hand is 17 or higher
			while (dealerHandValue < 17) {	
				dealerHand.push( dealCard() );
				dealerHandValue = calculateHandValue(dealerHand);
				currentData = await message.edit({
					content: currentData.content + `\nEl croupier saca ${dealerHand[dealerHand.length - 1].rank}${dealerHand[dealerHand.length - 1].suit} | Mano del Croupier: ${displayHand(dealerHand)} **(${dealerHandValue})**`
				});
				if (dealerHandValue > 21) {
					userStates.delete(usuarioId);	// Free the user from the game, this will allow the user to play again
					return await message.edit({
						content: currentData.content + `\n\nEl Croupier se pasó, **¡Ganaste!** <:EZ:901173179882565703>`
					});
				}
			}

			userStates.delete(usuarioId);	// Free the user from the game, this will allow the user to play again
			// Check all the possible endings...
			if (playerHandValue > dealerHandValue) // The user wins
				return await message.edit({
					content: currentData.content + `\n\n**¡Ganaste! <:EZ:901173179882565703>**`
				});
			else if (dealerHandValue > playerHandValue)	// The dealer wins
				return await message.edit({
					content: currentData.content + `\n\n**¡Perdiste! <:KEKW:815733223149010964>**`
				});
			else 
				return await message.edit({	// Tie
					content: currentData.content + `\n\n**¡Empate! <:o_:887001307444023367>**`
				});
		}
	}
	catch(e){
		userStates.delete(usuarioId);	// Free the user from the game, this will allow the user to play again
		return await message.edit({	// Tie
			content: `**JUEGO CANCELADO**\nTe tardaste un chingo en escoger`,
			components: []
		});
	}
}

module.exports = {
    name: "Blackjact",
    aliases: ["bj", "21", "veintiuno"],
    desc: "Jugar al veintiuno",
    run: async (client, message, args, userStates) => {
		if (userStates.has(message.author.id)) // If the user has already started a game and not finished
			return message.reply("Acaba el juego anterior, mamón");
		
		userStates.add(message.author.id);	// Add the user to the list, and prevent him to start a new game unless he finish this

		const playerHand = [], dealerHand = [];	// 
		// Get the cards
		playerHand.push( dealCard() );
		dealerHand.push( dealCard() );
		playerHand.push( dealCard() );
		dealerHand.push( dealCard() );

		message.reply({
			content: `Iniciando el juego...`,
		})
		.then( mensaje => {
			try{
				game( mensaje, playerHand, dealerHand, userStates, message.author.id );
			}
			catch(e){
				return message.edit({	// Tie
					content: `**HIJO DE LA VERGAAAAA** QUE NO HAGAS ESO KBRON <:REEeee:901173179106623538>`
				});
			}
		});
    }
};

