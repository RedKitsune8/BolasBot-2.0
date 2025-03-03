const fs = require('fs');
const { MessageEmbed } = require('discord.js');

const { preset_file } = require('./seedgen');

const extra_alttp = `**spoiler: **Hace que el spoiler log de la seed esté disponible.
**noqs: **Impide que se pueda activar quickswap. Esta opción no está disponible en modos mystery.
**pistas: **Las casillas telepáticas pueden dar pistas sobre localizaciones de ítems.
**ad: **All Dungeons, Ganon solo será vulnerable al completar todas las mazmorras del juego, incluyendo Torre de Agahnim.
**hard: **Cambia el item pool a hard, reduciendo el número máximo de corazones, espadas e ítems de seguridad.
**botas: **Las Botas de Pegaso estarán equipadas al inicio de la partida.`;

const extra_sm = `**spoiler: **Hace que el spoiler log de la seed esté disponible.
**split: **Cambia el algoritmo de randomización a Major/Minor Split.
**hard: **Cambia a lógica de torneo.`;

const extra_smz3 = `**spoiler: **Hace que el spoiler log de la seed esté disponible.
**hard: **Establece la lógica de Super Metroid a Hard.
**keys: **Habilita el modo Keysanity.`;

const extra_varia = '**spoiler: **Permite que la seed pueda ser resuelta por el solucionador en la web de VARIA.';

function preset_help(interaction) {
	const preset = interaction.options.getString('preset');
	if (preset) {
		const file = preset_file(preset);
		if (file) {
			const content = JSON.parse(fs.readFileSync(file));
			return new MessageEmbed()
				.setColor('#0099ff')
				.setTitle(content['goal_name'])
				.setAuthor(interaction.client.user.username, interaction.client.user.avatarURL())
				.setDescription(content['description'])
				.setTimestamp();
		}
	}

	const categories = ['alttp', 'mystery', 'sm', 'smz3', 'varia'];
	const output = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Lista de presets')
		.setAuthor(interaction.client.user.username, interaction.client.user.avatarURL())
		.setTimestamp();

	for (const cat of categories) {
		const files = fs.readdirSync(`rando-settings/${cat}`);
		for (let i = 0; i < files.length; i++) {
			files[i] = files[i].slice(0, -5);
		}
		output.addField(cat, files.join(', '));
	}
	return output;
}

function extra_help(interaction) {
	return new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Opciones extra')
		.setAuthor(interaction.client.user.username, interaction.client.user.avatarURL())
		.addField('ALTTP y Mystery', extra_alttp)
		.addField('SM', extra_sm)
		.addField('SMZ3', extra_smz3)
		.addField('VARIA', extra_varia)
		.setTimestamp();
}

module.exports = { preset_help, extra_help };