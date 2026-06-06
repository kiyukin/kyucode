require('dotenv').config();

const config = {
    MODE: process.env.KYUCODE_MODE || 'mock',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    IMAGE_DETAIL: process.env.IMAGE_DETAIL || 'low',
    SCREENSHOT_DIR: 'data/screenshots/',
    OUTPUT_DIR: 'output/',
};

module.exports = config;