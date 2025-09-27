import { Message } from '@/types/chat';

// Define categories for better response matching
const CATEGORIES = {
  PREGNANCY: ['pregnancy', 'pregnant', 'trimester', 'birth', 'labor'],
  INFANT_CARE: ['baby', 'infant', 'newborn', 'feeding', 'vaccination'],
  HOSPITALS: ['hospital', 'doctor', 'emergency', 'clinic', 'medical'],
  GENERAL_HEALTH: ['health', 'wellness', 'nutrition', 'exercise'],
};

const RESPONSES = {
  GREETING: [
    "Hello! I'm your Navarah health assistant. How can I help you today?",
    "Welcome to Navarah! I'm here to assist you with health-related questions.",
    "Hi there! I'm your AI health companion. Feel free to ask me anything about maternal and child health.",
  ],
  
  PREGNANCY: {
    DEFAULT: "I can provide information about pregnancy stages, prenatal care, and common concerns. What would you like to know?",
    STAGES: "Pregnancy is divided into three trimesters, each lasting about 13 weeks. Would you like specific information about any trimester?",
    CARE: "Regular prenatal care, proper nutrition, and moderate exercise are essential during pregnancy. Would you like more detailed guidance?",
  },
  
  INFANT_CARE: {
    DEFAULT: "I can help you with newborn care, feeding schedules, and developmental milestones. What specific information do you need?",
    FEEDING: "Newborns typically feed every 2-3 hours. Would you like information about breastfeeding or formula feeding?",
    SLEEP: "Newborns sleep 14-17 hours a day in short periods. Would you like tips for establishing healthy sleep patterns?",
  },
  
  HOSPITALS: {
    DEFAULT: "I can help you find nearby hospitals and medical facilities. Would you like directions or contact information?",
    EMERGENCY: "If you're experiencing a medical emergency, please call emergency services immediately. Would you like the contact information for the nearest hospital?",
  },
  
  UNKNOWN: [
    "I'm not quite sure about that. Could you rephrase your question?",
    "I want to help you better. Could you provide more details about your question?",
    "I'm still learning. Could you ask that in a different way?",
  ]
};

function findCategory(input: string): string {
  const lowercaseInput = input.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some(keyword => lowercaseInput.includes(keyword))) {
      return category;
    }
  }
  
  return 'UNKNOWN';
}

function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}

export async function generateResponse(input: string): Promise<string> {
  // If input is empty or just whitespace
  if (!input.trim()) {
    return getRandomResponse(RESPONSES.GREETING);
  }

  // Check for greetings
  if (input.toLowerCase().match(/^(hi|hello|hey|greetings).*/)) {
    return getRandomResponse(RESPONSES.GREETING);
  }

  // Find relevant category
  const category = findCategory(input);
  
  // Get appropriate response
  switch (category) {
    case 'PREGNANCY':
      if (input.toLowerCase().includes('stage') || input.toLowerCase().includes('trimester')) {
        return RESPONSES.PREGNANCY.STAGES;
      }
      if (input.toLowerCase().includes('care') || input.toLowerCase().includes('health')) {
        return RESPONSES.PREGNANCY.CARE;
      }
      return RESPONSES.PREGNANCY.DEFAULT;
      
    case 'INFANT_CARE':
      if (input.toLowerCase().includes('feed')) {
        return RESPONSES.INFANT_CARE.FEEDING;
      }
      if (input.toLowerCase().includes('sleep')) {
        return RESPONSES.INFANT_CARE.SLEEP;
      }
      return RESPONSES.INFANT_CARE.DEFAULT;
      
    case 'HOSPITALS':
      if (input.toLowerCase().includes('emergency')) {
        return RESPONSES.HOSPITALS.EMERGENCY;
      }
      return RESPONSES.HOSPITALS.DEFAULT;
      
    default:
      return getRandomResponse(RESPONSES.UNKNOWN);
  }
}

// Function to analyze sentiment and adjust response tone
export function analyzeSentiment(input: string): 'urgent' | 'concerned' | 'neutral' | 'positive' {
  const lowercaseInput = input.toLowerCase();
  
  // Check for urgent keywords
  if (lowercaseInput.includes('emergency') || lowercaseInput.includes('help') || lowercaseInput.includes('urgent')) {
    return 'urgent';
  }
  
  // Check for concerned keywords
  if (lowercaseInput.includes('worried') || lowercaseInput.includes('scared') || lowercaseInput.includes('anxious')) {
    return 'concerned';
  }
  
  // Check for positive keywords
  if (lowercaseInput.includes('thank') || lowercaseInput.includes('great') || lowercaseInput.includes('good')) {
    return 'positive';
  }
  
  return 'neutral';
} 