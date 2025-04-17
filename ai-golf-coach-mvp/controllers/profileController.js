const { Profile } = require('../models');

exports.getProfile = async (req, res) => {
  const profile = await Profile.findOrCreate({
    where: { userId: req.user.userId },
    defaults: { userId: req.user.userId },
  }).then(p => p[0]);
  res.json(profile);
};

exports.upsertProfile = async (req, res) => {
  const profile = await Profile.findOne({ where: { userId: req.user.userId } });
  await profile.update(req.body);
  res.json(profile);
};

module.exports = {
  getProfile: exports.getProfile,
  upsertProfile: exports.upsertProfile
};
