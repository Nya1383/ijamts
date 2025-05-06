# IJAMTS Scripts

This directory contains utility scripts for the IJAMTS website administration.

## Available Scripts

### seed-board-members.js

Seeds the Editorial Board members data to Firestore.

**Usage:**
```bash
node scripts/seed-board-members.js
```

**What it does:**
1. Clears any existing data in the `boardMembers` collection
2. Adds 6 sample board members with predefined data
3. Each board member has:
   - `name`: The member's full name
   - `role`: Their position on the board
   - `bio`: A short biography
   - `order`: A number controlling display order (sorted ascending)
   - `timestamp`: When the record was created

**Customization:**
To modify the sample data, edit the `boardMembers` array in the script.

## Adding New Scripts

When adding new scripts to this directory:
1. Use proper error handling
2. Include usage comments at the top of the file
3. Add documentation to this README
4. Ensure scripts are idempotent (can be run multiple times safely) 