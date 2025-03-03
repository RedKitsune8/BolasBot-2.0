const glob = require('glob');
const path = require('path');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder, SlashCommandStringOption } = require('@discordjs/builders');
const { set_multi_settings_channel } = require('../datamgmt/db_utils');
const { crear_multiworld } = require('../archipelago/multi_utils');

const template_files = glob.sync('res/archipelago-yaml/*.yaml');
const plantillas = new SlashCommandStringOption();
plantillas.setName('juego')
	.setDescription('Juego del que obtener la plantilla de multiworld.')
	.setRequired(true);

for (const file of template_files) {
	const filename = path.basename(file, '.yaml');
	plantillas.addChoice(filename, filename);
}

const command = {};
command.data = new SlashCommandBuilder()
	.setName('multiworld')
	.setDescription('Manejo de Archipelago Multiworld')
	.addSubcommand(subcommand =>
		subcommand.setName('yaml_channel')
			.setDescription('Establecer canal en el que leer los archivos YAML.'))

	.addSubcommand(subcommand =>
		subcommand.setName('crear')
			.setDescription('Generar una partida de Archipelago Multiworld')
			.addStringOption(option =>
				option.setName('nombre')
					.setDescription('Nombre de la sesión de multiworld.'))
			.addBooleanOption(option =>
				option.setName('spoiler')
					.setDescription('¿Hacer visibles los spoiler logs de las seeds?')))

	.addSubcommand(subcommand =>
		subcommand.setName('plantilla')
			.setDescription('Obtener plantilla de ajustes para un juego de Archipelago Multiworld.')
			.addStringOption(plantillas));

command.execute = async function(interaction, db) {

	if (interaction.options.getSubcommand() == 'yaml_channel') {
		if (!interaction.inGuild()) {
			throw { 'message': 'Este comando no puede ser usado en mensajes directos.' };
		}
		await set_multi_settings_channel(db, interaction.channelId);
		const ans_embed = new MessageEmbed()
			.setColor('#0099ff')
			.setAuthor(interaction.client.user.username, interaction.client.user.avatarURL())
			.setDescription(`Fijado este canal (${interaction.channel}) para búsqueda de configuraciones YAML.`)
			.setTimestamp();
		await interaction.reply({ embeds: [ans_embed] });
		return;
	}
	else if (interaction.options.getSubcommand() == 'crear') {
		if (!interaction.inGuild()) {
			throw { 'message': 'Este comando no puede ser usado en mensajes directos.' };
		}
		await crear_multiworld(interaction, db);
		return;
	}
	else if (interaction.options.getSubcommand() == 'plantilla') {
		const game = interaction.options.getString('juego');
		const template_path = `res/archipelago-yaml/${game}.yaml`;
		await interaction.reply({ files: [template_path] });
		return;
	}
};

module.exports = command;