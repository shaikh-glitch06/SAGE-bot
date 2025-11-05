import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getUser, createUser, getShopItem, updateUserSkillPoints, addWallpaper, getWallpaperInventory, logTransaction } from '../database/db.js';
import { formatNumber } from '../utils/helpers.js';
import { sendResponse } from '../utils/responseHelper.js';

export default {
  name: 'buy',
  description: 'Purchase an item from the shop',
  aliases: ['purchase'],
  data: new SlashCommandBuilder()
    .setName('buy')
    .setDescription('Purchase an item from the shop')
    .addStringOption(option =>
      option.setName('item_id')
        .setDescription('ID of the item to purchase')
        .setRequired(true)
    ),
  
  async execute(message, args) {
    const itemId = args[0];
    
    if (!itemId) {
      return message.reply('Please specify an item ID. Usage: `Sbuy <item_id>`');
    }
    
    await purchaseItem(message.author, itemId, message);
  },
  
  async executeSlash(interaction) {
    await interaction.deferReply();
    const itemId = interaction.options.getString('item_id');
    await purchaseItem(interaction.user, itemId, interaction);
  }
};

async function purchaseItem(user, itemId, context) {
  try {
    let userData = await getUser(user.id);
    if (!userData) {
      userData = await createUser(user.id, user.username);
    }
    
    const item = await getShopItem(itemId);
    
    if (!item) {
      await sendResponse(context, '❌ Item not found. Use `Sshop` to see available items.');
      return;
    }
    
    if (!item.is_available) {
      await sendResponse(context, '❌ This item is currently unavailable.');
      return;
    }
    
    if (userData.skill_points < item.price) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Insufficient Funds')
        .setDescription(`You don't have enough Skill Points to purchase **${item.name}**!`)
        .addFields(
          { name: 'Your Balance', value: `${formatNumber(userData.skill_points)} SP`, inline: true },
          { name: 'Item Price', value: `${formatNumber(item.price)} SP`, inline: true },
          { name: 'Needed', value: `${formatNumber(item.price - userData.skill_points)} SP`, inline: true }
        );
      
      await sendResponse(context, { embeds: [embed] });
      return;
    }
    
    const inventory = await getWallpaperInventory(user.id);
    const alreadyOwned = inventory.some(w => w.wallpaper_id === itemId);
    
    if (alreadyOwned) {
      await sendResponse(context, '❌ You already own this item!');
      return;
    }
    
    await updateUserSkillPoints(user.id, -item.price);
    await addWallpaper(user.id, itemId, 'purchased');
    await logTransaction(user.id, null, item.price, 'purchase', `Purchased ${item.name}`);
    
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('✅ Purchase Successful!')
      .setDescription(`${user} has purchased **${item.name}**!`)
      .addFields(
        { name: '💰 Cost', value: `${formatNumber(item.price)} SP`, inline: true },
        { name: '💵 Remaining Balance', value: `${formatNumber(userData.skill_points - item.price)} SP`, inline: true }
      )
      .setFooter({ text: `Use Ssetwp ${itemId} to equip this wallpaper` })
      .setTimestamp();
    
    await sendResponse(context, { embeds: [embed] });
    
  } catch (error) {
    console.error('Error purchasing item:', error);
    await sendResponse(context, 'There was an error processing your purchase.');
  }
}
