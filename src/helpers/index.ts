import crypto from 'crypto';

const SECRET = 'EDAARA';




// random():
// This function generates a random string of 128 bytes
// using the crypto.randomBytes() method provided by the crypto module in Node.js.
// It then encodes the byte string to base64 format using the.toString('base64') method and returns the resulting string.
// The purpose of this function is to generate a random string that can be used as a salt for password hashing.

export const random = () => crypto.randomBytes(128).toString('base64');





// authentication(salt, password):
// This function takes in two parameters, a salt and a password string.
// It uses the crypto.createHmac() method to create an HMAC object with the SHA-256 algorithm and a secret key derived from concatenating the salt and password strings
// with a forward slash ('/'). It then updates the HMAC object with a secret string SECRET
// which is defined as a constant at the top of the module. Finally, it returns the resulting digest of the HMAC object in hexadecimal format using the

// .digest('hex') method.
// The purpose of this function is to authenticate a password by hashing it with a salt using the HMAC-SHA256 algorithm.

export const authentication = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
};

