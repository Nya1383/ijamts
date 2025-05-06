# Editorial Board Page

This page displays the editorial board members of the journal. It fetches data from Firestore and has fallback mechanisms in case of errors or slow loading.

## Setup Instructions

### 1. Create Firestore Collection

The page expects a collection named `boardMembers` in your Firestore database. Each document should have the following fields:

```typescript
{
  name: string;       // Name of the board member
  role: string;       // Role in the editorial board
  bio: string;        // Short biography
  order: number;      // Display order (used for sorting)
  imageUrl?: string;  // Optional profile image URL
}
```

### 2. Create Firestore Index

The query in this component uses `orderBy("order", "asc")` which requires a Firestore index. If you encounter a "requires index" error, follow the link in the error message or manually create an index:

1. Go to the Firebase Console
2. Navigate to your project > Firestore Database > Indexes tab
3. Click "Add Index"
4. Collection ID: `boardMembers`
5. Fields to index:
   - Field path: `order`, Order: `Ascending`
6. Click "Create index"

### 3. Seed Data (Optional)

We've provided a script to populate the collection with sample data:

```bash
# Make sure you're in the project root
node scripts/seed-board-members.js
```

### 4. Troubleshooting

If the page gets stuck loading:

1. **Check Firebase Console Logs**: Look for any error messages
2. **Verify Collection Name**: Make sure the collection is named `boardMembers`
3. **Check Firestore Rules**: Ensure read access is allowed
4. **Create/Update Index**: If you see an index error, follow the instructions to create it
5. **Network Issues**: The page has a fallback mechanism that kicks in after 5 seconds

### 5. Performance Optimizations

The page includes several performance optimizations:

- Timeout mechanism with fallback to static data after 5 seconds
- Memoized fetch function to prevent unnecessary re-renders
- Limited query results (max 20 items)
- Error boundary with user-friendly recovery options
- Cleanup on component unmount to prevent state updates on unmounted components

## Customization

To change the fallback data, edit the `fallbackBoardMembers` array in the component. To modify the timeout duration, change the values in the `setTimeout` calls. 