const { Profile, JournalEntry, AIRecommendation } = require('../models');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Helper function to select relevant profile data
const getProfileContext = (profile, focusArea) => {
  const base = {
    handicap: profile.handicap,
    goals: profile.goals,
    playingFrequency: profile.playingFrequency,
  };

  switch (focusArea?.toLowerCase()) {
    case 'driving':
      return { ...base, driverMisses: profile.driverMisses, driverMissDescription: profile.driverMissDescription, driverStrengthRating: profile.driverStrengthRating, driverInfo: profile.driverInfo };
    case 'irons':
      return { ...base, ironMisses: profile.ironMisses, ironMissDescription: profile.ironMissDescription, ironStrengthRating: profile.ironStrengthRating, ironInfo: profile.ironInfo };
    case 'short game':
    case 'chipping':
    case 'pitching':
    case 'bunkers':
      return { ...base, shortGameMisses: profile.shortGameMisses, shortGameDescription: profile.shortGameDescription, chippingRating: profile.chippingRating, pitchingRating: profile.pitchingRating, bunkerRating: profile.bunkerRating, wedgeInfo: profile.wedgeInfo };
    case 'putting':
      return { ...base, puttingMisses: profile.puttingMisses, puttingDescription: profile.puttingDescription, shortPuttRating: profile.shortPuttRating, mediumPuttRating: profile.mediumPuttRating, lagPuttRating: profile.lagPuttRating, greenReadingRating: profile.greenReadingRating, putterInfo: profile.putterInfo };
    case 'mental game':
      return { ...base, mentalStrengths: profile.mentalStrengths, mentalWeaknesses: profile.mentalWeaknesses, mentalGameNotes: profile.mentalGameNotes, preShotRoutine: profile.preShotRoutine, favoriteThoughts: profile.favoriteThoughts };
    case 'course management':
       return { ...base, mentalStrengths: profile.mentalStrengths, mentalWeaknesses: profile.mentalWeaknesses, goals: profile.goals }; // Example
    case 'swing':
        return { ...base, swingFocus: profile.swingFocus, driverMisses: profile.driverMisses, ironMisses: profile.ironMisses, favoriteThoughts: profile.favoriteThoughts };
    default: // 'Overall' or unknown
      return { ...profile.toJSON() }; // Send everything for overall, strip meta fields
  }
};

// Helper function to format session context
const formatSessionContext = (sessions) => {
  if (!sessions || sessions.length === 0) return 'No recent sessions available.';
  // Format the latest 1-3 sessions concisely
  return sessions.slice(0, 3).map((s, i) =>
    `Session ${i + 1} (${new Date(s.createdAt).toLocaleDateString()}):\n${s.content || 'No detailed notes.'}`
  ).join('\n\n');
};

// Helper function to generate prompt instructions based on advice type
const getAdviceInstructions = (adviceType) => {
    switch (adviceType?.toLowerCase()) {
        case 'practice drills':
            return "Provide 2-3 specific, actionable practice drills related to the focus area. Explain the purpose of each drill and how to perform it. Suggest quantities or success metrics if applicable.";
        case 'swing thoughts':
            return "Suggest 2-3 simple, positive swing thoughts or feels relevant to the focus area and player's profile. Explain the intended effect of each thought.";
        case 'practice plan':
            return "Outline a structured practice plan (e.g., for a 60-minute session) targeting the focus area. Allocate time to different activities (warm-up, drills, feel practice, simulated play).";
        case 'mental strategy':
            return "Offer 2-3 practical mental game strategies or mindset adjustments for the focus area. This could include pre-shot routine elements, visualization, or ways to handle pressure/mistakes.";
        case 'analyze performance':
            return "Analyze the provided profile and session data. Identify 1-2 key strengths and 1-2 major areas for improvement related to the focus area. Suggest a priority for practice.";
        case 'quick tip':
             return "Provide one concise, actionable tip or reminder related to the focus area that the player can easily implement in their next round or practice session.";
        default:
            return "Provide general observations and actionable recommendations based on the player's profile and recent session notes for the specified focus area.";
    }
};


// --- Main Controller Function ---
exports.generateRecommendation = async (req, res) => {
  try {
    const { focusArea, adviceType } = req.body; // Get user request from POST body
    const userId = req.user.userId;

    if (!focusArea || !adviceType) {
      return res.status(400).json({ message: 'Focus Area and Advice Type are required.' });
    }

    // 1. Fetch Profile
    const profile = await Profile.findOne({ where: { userId: userId } });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    const relevantProfileData = getProfileContext(profile, focusArea);

    // 2. Fetch Recent Sessions (e.g., last 3)
    // TODO: Implement more complex contextSources logic if needed
    const recentSessions = await JournalEntry.findAll({
      where: { userId: userId },
      order: [['createdAt', 'DESC']],
      limit: 3
    });
    const formattedSessions = formatSessionContext(recentSessions);

    // 3. Construct the Dynamic Prompt
    const adviceInstructions = getAdviceInstructions(adviceType);
    const prompt = `
You are an expert AI Golf Coach. Analyze the following player information with a focus on '${focusArea}' and provide advice in the style of '${adviceType}'.

Player Profile Context (${focusArea}):
${JSON.stringify(relevantProfileData, null, 2)}

Recent Session Notes Summary:
${formattedSessions}

Instructions:
${adviceInstructions}

Format the response clearly using sections, headings, bullet points, or numbered lists as appropriate. Be encouraging and actionable.
    `;

    // 4. Make OpenAI API Call
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview", // Or your preferred model
    });

    const recommendationText = completion.choices[0].message.content;

    // 5. Save the New Recommendation to DB
    const newRecommendation = await AIRecommendation.create({
      userId: userId,
      focusArea: focusArea,
      adviceType: adviceType,
      recommendations: recommendationText,
      promptUsed: prompt, // Optional: save prompt for debugging
      profileContext: relevantProfileData, // Optional: save context used
      sessionContext: recentSessions.map(s => ({ id: s.id, date: s.createdAt, content: s.content })), // Optional: save context used
    });

    // 6. Return the result
    res.status(201).json(newRecommendation); // Return the full recommendation object

  } catch (error) {
    console.error('Error generating AI recommendation:', error);
    // Check for specific OpenAI errors if needed
    if (error.response) {
        console.error(error.response.status, error.response.data);
        return res.status(500).json({ message: 'Error communicating with AI service.' });
    }
    res.status(500).json({ message: 'Error generating recommendation' });
  }
};

// --- Optional History Endpoint ---
exports.getRecommendationHistory = async (req, res) => {
     try {
        const history = await AIRecommendation.findAll({
            where: { userId: req.user.userId },
            order: [['createdAt', 'DESC']],
            limit: 10 // Limit history length
        });
        res.json(history);
     } catch (error) {
        console.error('Error fetching recommendation history:', error);
        res.status(500).json({ message: 'Error fetching history' });
     }
};

// --- Latest Recommendation Endpoint ---
exports.getLatestRecommendation = async (req, res) => {
    try {
        const latest = await AIRecommendation.findOne({
            where: { userId: req.user.userId },
            order: [['createdAt', 'DESC']]
        });
        
        if (!latest) {
            return res.status(404).json({ message: 'No recommendations found' });
        }
        
        res.json(latest);
    } catch (error) {
        console.error('Error fetching latest recommendation:', error);
        res.status(500).json({ message: 'Error fetching latest recommendation' });
    }
}; 