// Sanitation and validation utility functions for Blinko backend data

export function validateUsername(username) {
  if (!username || typeof username !== "string") {
    return { isValid: false, message: "Username must be a text string." };
  }
  
  const cleanUsername = username.trim().toLowerCase();
  
  if (cleanUsername.length < 3 || cleanUsername.length > 15) {
    return { isValid: false, message: "Username must be between 3 and 15 characters." };
  }

  // Regex matches alphanumeric and underscores only
  const usernameRegex = /^[a-z0-9_]+$/;
  if (!usernameRegex.test(cleanUsername)) {
    return { isValid: false, message: "Username can only contain lowercase letters, numbers, and underscores." };
  }

  // Ban list of reserved subpages/slugs
  const reservedWords = ["api", "dashboard", "login", "signup", "pricing", "templates", "settings", "billing", "admin", "public", "verify-email", "verify_email", "privacy", "terms", "refund-policy", "contact"];
  if (reservedWords.includes(cleanUsername)) {
    return { isValid: false, message: "This username is reserved and cannot be used." };
  }

  return { isValid: true, cleanValue: cleanUsername };
}

export function validateDisplayName(name) {
  if (!name || typeof name !== "string") {
    return { isValid: false, message: "Display name must be a text string." };
  }

  const cleanName = name.trim();
  if (cleanName.length === 0) {
    return { isValid: false, message: "Display name cannot be empty." };
  }
  
  if (cleanName.length > 50) {
    return { isValid: false, message: "Display name cannot exceed 50 characters." };
  }

  return { isValid: true, cleanValue: cleanName };
}

export function validateBio(bio) {
  if (bio === undefined || bio === null) return { isValid: true, cleanValue: "" };
  if (typeof bio !== "string") return { isValid: false, message: "Bio must be a text string." };

  const cleanBio = bio.trim();
  if (cleanBio.length > 250) {
    return { isValid: false, message: "Bio cannot exceed 250 characters." };
  }

  return { isValid: true, cleanValue: cleanBio };
}

export function validateUrl(url) {
  if (!url || typeof url !== "string") {
    return { isValid: false, message: "URL must be a text string." };
  }

  const cleanUrl = url.trim();
  try {
    // Validate protocol
    const parsedUrl = new URL(cleanUrl);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return { isValid: false, message: "URL must start with http:// or https://" };
    }
    return { isValid: true, cleanValue: cleanUrl };
  } catch (err) {
    return { isValid: false, message: "Invalid URL structure." };
  }
}

export function validateLink(title, url) {
  const titleVal = validateDisplayName(title); // reuse length check (max 50, not empty)
  if (!titleVal.isValid) return { isValid: false, message: `Title Error: ${titleVal.message}` };

  const urlVal = validateUrl(url);
  if (!urlVal.isValid) return { isValid: false, message: `URL Error: ${urlVal.message}` };

  return { isValid: true, cleanTitle: titleVal.cleanValue, cleanUrl: urlVal.cleanValue };
}

export function validateEmail(email) {
  if (!email || typeof email !== "string") {
    return { isValid: false, message: "Email address is required." };
  }

  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(cleanEmail)) {
    return { isValid: false, message: "Invalid email address format." };
  }

  return { isValid: true, cleanValue: cleanEmail };
}

export function validateContactMessage(senderName, senderEmail, message) {
  const nameVal = validateDisplayName(senderName);
  if (!nameVal.isValid) return { isValid: false, message: `Sender Name: ${nameVal.message}` };

  const emailVal = validateEmail(senderEmail);
  if (!emailVal.isValid) return { isValid: false, message: `Sender Email: ${emailVal.message}` };

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return { isValid: false, message: "Message body cannot be empty." };
  }

  const cleanMsg = message.trim();
  if (cleanMsg.length > 1000) {
    return { isValid: false, message: "Message body cannot exceed 1000 characters." };
  }

  return {
    isValid: true,
    cleanName: nameVal.cleanValue,
    cleanEmail: emailVal.cleanValue,
    cleanMessage: cleanMsg
  };
}
