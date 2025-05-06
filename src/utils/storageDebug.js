import { storage } from "../../lib/firebase";
import { ref, getDownloadURL, uploadString } from "firebase/storage";

// Function to test if Firebase Storage is correctly configured
export async function testStorageConnection() {
  console.log("Testing Firebase Storage connection...");
  console.log("Storage bucket:", storage.app.options.storageBucket);
  
  try {
    // Create a test file in the storage bucket
    const testData = "Test data " + new Date().toISOString();
    const testPath = `test/storage-debug-${Date.now()}.txt`;
    const testRef = ref(storage, testPath);
    
    console.log("Uploading test file to:", testPath);
    
    // Upload the test string
    const uploadResult = await uploadString(testRef, testData);
    console.log("Test file uploaded successfully:", uploadResult);
    
    // Get the download URL for the file
    const downloadURL = await getDownloadURL(testRef);
    console.log("Test file download URL:", downloadURL);
    
    // Parse URL to check the bucket domain
    const urlObj = new URL(downloadURL);
    const hostname = urlObj.hostname;
    
    console.log("Storage URL hostname:", hostname);
    
    if (hostname.includes('firebasestorage.googleapis.com')) {
      console.log("✅ Firebase Storage is correctly configured with googleapis.com domain");
      
      // Check which bucket domain is used in the URL
      if (downloadURL.includes('ijamts.appspot.com')) {
        console.log("⚠️ URL contains ijamts.appspot.com - you may need to use this bucket name in your config");
      } else if (downloadURL.includes('ijamts.firebasestorage.app')) {
        console.log("⚠️ URL contains ijamts.firebasestorage.app - you may need to use this bucket name in your config");
      }
    } else {
      console.error("❌ Unexpected storage URL hostname:", hostname);
    }
    
    return {
      success: true,
      downloadURL,
      hostname,
      bucket: storage.app.options.storageBucket
    };
  } catch (error) {
    console.error("❌ Error testing storage connection:", error);
    return {
      success: false,
      error: error.message,
      bucket: storage.app.options.storageBucket
    };
  }
}

// Function to fetch all storage URL domains from approved files
export async function checkExistingFileURLs(files) {
  if (!files || !files.length) {
    console.log("No files to check URL domains");
    return { appspot: 0, firebasestorage: 0, other: 0, urls: [] };
  }
  
  const results = {
    appspot: 0,
    firebasestorage: 0,
    other: 0,
    urls: []
  };
  
  console.log(`Checking URL domains for ${files.length} files...`);
  
  files.forEach(file => {
    const url = file.downloadURL;
    results.urls.push({
      name: file.name,
      url: url
    });
    
    if (url.includes('ijamts.appspot.com')) {
      results.appspot++;
    } else if (url.includes('ijamts.firebasestorage.app')) {
      results.firebasestorage++;
    } else {
      results.other++;
    }
  });
  
  console.log("URL domain check results:", results);
  return results;
} 