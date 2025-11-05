# Discord Skill Points Bot - Project Documentation

## Overview
A comprehensive Discord bot with Skill Points economy, XP leveling system, onboarding, profile customization, shop system, and admin controls. Built with Discord.js v14 and PostgreSQL.

## Recent Changes
- **2025-11-04**: Initial project setup with complete feature implementation
  - Created database schema with 11 tables for users, economy, skills, and configuration
  - Implemented 12 user commands and comprehensive admin controls
  - Built XP system with anti-spam protections and channel exclusions
  - Added onboarding system with 3-question modal
  - Created shop system with wallpaper purchases and level rewards
  - Integrated skill selection and resource recommendation system

## Project Architecture

### Directory Structure
```
src/
├── index.js                 # Main bot entry point
├── deploy-commands.js       # Slash command registration
├── database/
│   ├── db.js               # Database service layer
│   └── schema.sql          # PostgreSQL schema
├── handlers/
│   ├── commandHandler.js   # Command loading
│   ├── xpHandler.js        # XP gain logic
│   └── onboardingHandler.js # Onboarding modal handling
├── commands/
│   ├── daily.js            # Daily reward command
│   ├── train.js            # Training command
│   ├── balance.js          # Balance checker
│   ├── give.js             # Gift Skill Points
│   ├── level.js            # Level display
│   ├── profile.js          # Profile view/edit
│   ├── shop.js             # Shop display
│   ├── buy.js              # Purchase items
│   ├── setwp.js            # Equip wallpaper
│   ├── help.js             # Skill resources
│   ├── leaderboard.js      # Rankings
│   └── admin.js            # Admin controls
├── utils/
│   ├── leveling.js         # XP/level calculations
│   └── helpers.js          # Utility functions
└── data/
    └── resources.js        # Curated learning resources
```

### Key Features Implemented

1. **Economy System**
   - Daily rewards with streak bonuses (500-650 SP)
   - Training command with cooldown and daily caps
   - Peer-to-peer transfers with audit logging
   - Transaction history tracking

2. **Leveling System**
   - Nonlinear XP progression (levels 1-120+)
   - Activity-based XP from messages, emojis, stickers
   - Anti-spam: 45s cooldown, message validation
   - Channel exclusions for bot commands
   - New account protection (7-day minimum age)

3. **Profile & Customization**
   - Onboarding modal with 3 questions
   - Skill selection system (2 active skills)
   - Wallpaper inventory and equipment
   - Profile editing with privacy controls

4. **Shop System**
   - Static wallpapers (15,000 SP)
   - Animated wallpapers (25,000 SP)
   - Level milestone rewards (levels 15, 25)
   - Purchase tracking and ownership verification

5. **Learning Resources**
   - Curated guides for 5 skills
   - Beginner to advanced progression paths
   - Community recommendations

6. **Admin Controls**
   - Balance management
   - XP system configuration
   - Channel exclusion management
   - User statistics viewing

### Database Schema
- **users**: Core user data (SP, XP, level, streak)
- **onboarding**: User responses to onboarding questions
- **user_skills**: Active skill selections
- **skill_change_history**: Skill switch tracking for cooldown enforcement
- **transactions**: Complete audit log of all economy actions
- **wallpaper_inventory**: User wallpaper ownership
- **shop_items**: Available purchasable items
- **xp_cooldowns**: Per-user XP gain cooldowns
- **excluded_channels**: Channels excluded from XP
- **server_config**: Bot configuration (XP rates, toggles)
- **available_skills**: Master list of available skills

### Dependencies
- discord.js v14.14.1 - Discord API wrapper
- pg v8.11.3 - PostgreSQL client
- node-cron v3.0.3 - Scheduled task management

### Environment Variables Required
- `DISCORD_TOKEN` - Bot token from Discord Developer Portal
- `DISCORD_CLIENT_ID` - Application client ID
- `DATABASE_URL` - PostgreSQL connection string (auto-provided by Replit)

## Configuration

### XP System Defaults
- Message XP: 15
- Emoji XP: 5
- Sticker XP: 10
- Cooldown: 45 seconds
- Min message length: 5 characters
- Account age requirement: 7 days

### Economy Defaults
- Daily base: 500 SP
- Streak bonus: +1/day (max +150)
- Training: 150 SP per use
- Training cooldown: 30 minutes
- Daily training cap: 10 uses

## User Preferences
None specified yet.

## Next Steps
- Test bot with real Discord server
- Monitor XP progression balance
- Gather user feedback on economy rates
- Add achievement system (future enhancement)
- Implement skill-specific challenges (future enhancement)

## Notes
- Bot uses both prefix commands (S) and slash commands
- All commands have both prefix and slash fallbacks
- Database automatically initializes on first run
- Cron job resets daily training caps at midnight
- All transactions are logged for audit purposes
