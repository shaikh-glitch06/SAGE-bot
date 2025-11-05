# Discord Skill Points Bot

A comprehensive Discord bot featuring a Skill Points economy, XP leveling system, onboarding, skill management, shop system, and extensive admin controls.

## Features

### 💰 Economy System
- **Daily Rewards**: Claim 500 base Skill Points daily with streak bonuses (+1 SP per day up to +150 at day 100)
- **Training**: Earn 150 SP per training session (30-minute cooldown, 10 uses per day)
- **Transfers**: Gift Skill Points to other users with full transaction logging
- **Balance Tracking**: View your current Skill Points balance and stats

### ⭐ Leveling System
- **XP Progression**: Levels 1-120+ with nonlinear progression curve
- **Activity Rewards**: Earn XP from messages, emojis, and stickers
- **Anti-Spam Protection**: 30-60s cooldown between XP gains
- **Channel Exclusions**: Admins can exclude specific channels from XP gains
- **New Account Protection**: Minimum 7-day account age requirement

### 🎨 Profile & Customization
- **Onboarding**: 3-question modal on server join (skill interest, proficiency, goals)
- **Skill Selection**: Choose up to 2 active skills from 5 options (chess, art, writing, fitness, coding)
- **Profile Display**: View comprehensive user stats, streaks, wallpapers, and more
- **Profile Editing**: Update your information anytime with privacy controls

### 🏪 Shop System
- **Wallpapers**: Purchase static (15,000 SP) and animated (25,000 SP) wallpapers
- **Level Rewards**: Free wallpapers at levels 15 and 25
- **Inventory**: Track owned items and equip wallpapers on your profile

### 📚 Learning Resources
- **Help Command**: Curated resource lists for each skill
- **Skill-Specific Guides**: Beginner to advanced resources for chess, art, writing, fitness, and coding

### 🏆 Leaderboards
- **Multiple Rankings**: Skill Points, Level, and Streak leaderboards
- **Top 10 Display**: See the top performers in each category

### 🛠️ Admin Controls
- **Balance Management**: Set user Skill Points balances
- **XP Configuration**: Toggle XP system, adjust XP rates
- **Channel Management**: Exclude/include channels for XP gains
- **User Stats**: View detailed user statistics and activity
- **Shop Management**: Toggle item availability

## Commands

### User Commands (Prefix: `S`)

#### Economy
- `Sdaily` - Claim your daily Skill Points reward
- `Strain` - Train to earn 150 SP (30min cooldown, 10/day)
- `Sbalance [@user]` - Check Skill Points balance
- `Sgive @user <amount>` - Gift Skill Points to another user
- `Sgift @user <amount>` - Alias for give

#### Leveling & Profile
- `Slevel [@user]` - Check current level and XP progress
- `Sprofile view [@user]` - View user profile
- `Sprofile edit` - Edit your profile (slash command only)

#### Shop
- `Sshop` - View available items for purchase
- `Sbuy <item_id>` - Purchase an item from the shop
- `Ssetwp <wallpaper_id>` - Equip a wallpaper on your profile

#### Learning
- `Shelp <skill>` - Get curated resources for a skill
  - Available skills: chess, art, writing, fitness, coding

#### Leaderboards
- `Sleaderboard [type]` - View leaderboards
  - Types: points, level, streak

### Admin Commands (Slash only, requires Administrator)

- `/admin setbalance <user> <amount>` - Set user's Skill Points
- `/admin togglexp <enabled>` - Enable/disable XP system
- `/admin setxprate <type> <amount>` - Configure XP rates
- `/admin excludechannel <channel>` - Exclude channel from XP
- `/admin includechannel <channel>` - Re-enable XP in channel
- `/admin listexcluded` - List excluded channels
- `/admin viewstats <user>` - View detailed user statistics

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- A Discord Bot Token
- PostgreSQL database (provided by Replit)

### Installation

1. **Set up your Discord Bot**:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Go to the "Bot" section and create a bot
   - Copy the bot token
   - Enable these Privileged Gateway Intents:
     - Server Members Intent
     - Message Content Intent

2. **Configure Environment Variables**:
   - The bot needs a `DISCORD_TOKEN` and `DISCORD_CLIENT_ID`
   - You'll be prompted to add these when running the bot

3. **Invite the Bot**:
   - Go to OAuth2 > URL Generator in Discord Developer Portal
   - Select scopes: `bot` and `applications.commands`
   - Select permissions: 
     - Send Messages
     - Embed Links
     - Read Message History
     - Use Slash Commands
     - Manage Roles (if using role rewards)
   - Copy the generated URL and open it to invite the bot

4. **Run the Bot**:
   - The database will initialize automatically
   - Commands will be registered on startup
   - The bot is ready to use!

## Database Schema

The bot uses PostgreSQL with the following tables:
- `users` - Core user data (balance, XP, level, streak)
- `onboarding` - User onboarding responses
- `user_skills` - Active skill selections
- `skill_change_history` - Skill switch tracking for cooldowns
- `transactions` - Complete transaction audit log
- `wallpaper_inventory` - User-owned wallpapers
- `shop_items` - Available shop items
- `xp_cooldowns` - XP gain cooldown tracking
- `excluded_channels` - Channels excluded from XP
- `server_config` - Bot configuration settings
- `available_skills` - List of available skills

## Configuration

### Default XP Settings
- Per Message: 15 XP
- Per Emoji: 5 XP
- Per Sticker: 10 XP
- Cooldown: 45 seconds
- Min Message Length: 5 characters
- Min Account Age: 7 days

### Economy Settings
- Daily Base Reward: 500 SP
- Daily Streak Bonus: +1 SP per day (max +150)
- Training Reward: 150 SP
- Training Cooldown: 30 minutes
- Daily Training Cap: 10 uses

### Shop Items
- Static Wallpapers: 15,000 SP
- Animated Wallpapers: 25,000 SP
- Free wallpapers at levels 15 and 25

## Support

For issues or questions, please contact the server administrators.

## License

ISC
