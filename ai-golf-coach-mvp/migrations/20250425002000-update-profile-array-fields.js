'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // First, change the column types to JSONB
    await queryInterface.sequelize.query(`
      ALTER TABLE profiles 
      ALTER COLUMN "driverMisses" TYPE JSONB USING to_jsonb(COALESCE("driverMisses", ARRAY[]::text[])),
      ALTER COLUMN "ironMisses" TYPE JSONB USING to_jsonb(COALESCE("ironMisses", ARRAY[]::text[])),
      ALTER COLUMN "shortGameMisses" TYPE JSONB USING to_jsonb(COALESCE("shortGameMisses", ARRAY[]::text[])),
      ALTER COLUMN "puttingMisses" TYPE JSONB USING to_jsonb(COALESCE("puttingMisses", ARRAY[]::text[])),
      ALTER COLUMN "mentalStrengths" TYPE JSONB USING to_jsonb(COALESCE("mentalStrengths", ARRAY[]::text[])),
      ALTER COLUMN "mentalWeaknesses" TYPE JSONB USING to_jsonb(COALESCE("mentalWeaknesses", ARRAY[]::text[]))
    `);

    // Then set default values
    await queryInterface.sequelize.query(`
      ALTER TABLE profiles 
      ALTER COLUMN "driverMisses" SET DEFAULT '[]'::jsonb,
      ALTER COLUMN "ironMisses" SET DEFAULT '[]'::jsonb,
      ALTER COLUMN "shortGameMisses" SET DEFAULT '[]'::jsonb,
      ALTER COLUMN "puttingMisses" SET DEFAULT '[]'::jsonb,
      ALTER COLUMN "mentalStrengths" SET DEFAULT '[]'::jsonb,
      ALTER COLUMN "mentalWeaknesses" SET DEFAULT '[]'::jsonb
    `);
  },

  async down(queryInterface, Sequelize) {
    // First, change the column types back to text[]
    await queryInterface.sequelize.query(`
      ALTER TABLE profiles 
      ALTER COLUMN "driverMisses" TYPE text[] USING ARRAY(SELECT jsonb_array_elements_text("driverMisses")),
      ALTER COLUMN "ironMisses" TYPE text[] USING ARRAY(SELECT jsonb_array_elements_text("ironMisses")),
      ALTER COLUMN "shortGameMisses" TYPE text[] USING ARRAY(SELECT jsonb_array_elements_text("shortGameMisses")),
      ALTER COLUMN "puttingMisses" TYPE text[] USING ARRAY(SELECT jsonb_array_elements_text("puttingMisses")),
      ALTER COLUMN "mentalStrengths" TYPE text[] USING ARRAY(SELECT jsonb_array_elements_text("mentalStrengths")),
      ALTER COLUMN "mentalWeaknesses" TYPE text[] USING ARRAY(SELECT jsonb_array_elements_text("mentalWeaknesses"))
    `);

    // Then remove default values
    await queryInterface.sequelize.query(`
      ALTER TABLE profiles 
      ALTER COLUMN "driverMisses" DROP DEFAULT,
      ALTER COLUMN "ironMisses" DROP DEFAULT,
      ALTER COLUMN "shortGameMisses" DROP DEFAULT,
      ALTER COLUMN "puttingMisses" DROP DEFAULT,
      ALTER COLUMN "mentalStrengths" DROP DEFAULT,
      ALTER COLUMN "mentalWeaknesses" DROP DEFAULT
    `);
  }
}; 