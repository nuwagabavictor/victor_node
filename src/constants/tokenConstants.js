const REFRESH_TOKEN_EXPIRY =     3 * 24 * 60 * 60 * 1000; // 3 days
const TWO_FACTOR_EXPIRY = 15 * 60 * 1000;

const refreshCookieOptions ={
    httpOnly: true,
    secure: false,
    // sameSite: 'none',
    maxAge: this.REFRESH_TOKEN_EXPIRY
}

const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

module.exports = { REFRESH_TOKEN_EXPIRY, refreshCookieOptions, TWO_FACTOR_EXPIRY, generateOtp };