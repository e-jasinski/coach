const { Profile, JournalEntry, AIRecommendation } = require('../models');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.getRecommendations = async (req, res) => {
  try {
    // Get user's profile
    const profile = await Profile.findOne({
      where: { userId: req.user.userId }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Get latest journal entry
    const latestEntry = await JournalEntry.findOne({
      where: { userId: req.user.userId },
      order: [['createdAt', 'DESC']]
    });

    // Get existing recommendation
    const existingRecommendation = await AIRecommendation.findOne({
      where: { userId: req.user.userId }
    });

    // If there's an existing recommendation and no new request, return it
    if (existingRecommendation && !req.query.refresh) {
      return res.json({
        recommendations: existingRecommendation.recommendations,
        context: existingRecommendation.context
      });
    }

    // Construct the prompt
    const prompt = `As an AI golf coach, analyze the following information and provide specific recommendations:

Player Profile:
- Miss Description: ${profile.missDescription || 'Not provided'}
- Pre-shot Routine: ${profile.preShotRoutine || 'Not provided'}
- Favorite Thoughts: ${profile.favoriteThoughts || 'Not provided'}
- Handicap: ${profile.handicap || 'Not provided'}

Latest Session Notes:
${latestEntry ? latestEntry.content : 'No recent sessions recorded'}

Please provide:
1. Specific drills to work on at the range, focusing on addressing the player's miss pattern
2. Key swing thoughts to keep in mind during practice
3. Suggestions for improving their pre-shot routine
4. Any additional observations or recommendations based on their latest session

Format the response in a clear, structured way that's easy to read.`;

    // Make OpenAI API call
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
    });

    const recommendations = completion.choices[0].message.content;
    const context = {
      profile: {
        missDescription: profile.missDescription,
        preShotRoutine: profile.preShotRoutine,
        favoriteThoughts: profile.favoriteThoughts,
        handicap: profile.handicap
      },
      latestSession: latestEntry ? {
        content: latestEntry.content,
        date: latestEntry.createdAt
      } : null
    };

    // Save or update the recommendation
    if (existingRecommendation) {
      await existingRecommendation.update({
        recommendations,
        context
      });
    } else {
      await AIRecommendation.create({
        userId: req.user.userId,
        recommendations,
        context
      });
    }

    res.json({
      recommendations,
      context
    });

  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    res.status(500).json({ message: 'Error getting recommendations' });
  }
}; 