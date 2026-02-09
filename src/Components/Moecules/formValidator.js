// Name: only letters, spaces, hyphen, apostrophe (min 3 chars)
const NAME_REGEX = /^[A-Za-z\s\-']{3,}$/;
export const validateText = (text) => {
  if (!text || typeof text !== 'string') return false;
  return NAME_REGEX.test(text.trim());
};

export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
export function validateAadhaar(aadhaar) {
  if (!aadhaar || typeof aadhaar !== 'string') return false;
  const cleanAadhaar = aadhaar.replace(/[\s-]/g, '');
  const regex = /^[2-9][0-9]{11}$/;
  return regex.test(cleanAadhaar);
}

export function validatePan(pan) {
  if (!pan || typeof pan !== 'string') return false;
  const cleanPan = pan.replace(/[\s-]/g, '').toUpperCase();
  const regex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  return regex.test(cleanPan);
}

export function validateCheque(cheque) {
  if (!cheque || typeof cheque !== 'string') return false;
  const cleanCheque = cheque.replace(/[\s-]/g, '');
  const regex = /^[0-9]{6}$/;
  return regex.test(cleanCheque);
}

// Phone length by country code (digits only, excluding country code)
const PHONE_LENGTH_BY_CODE = {
  '+91': 10,   // India
  '+971': 9,   // UAE
  '+973': 8,   // Bahrain
  '+944': 9,   // Sri Lanka
};

export function validateMobileNumber(mobileNumber, countryCode = '+91') {
  if (!mobileNumber || typeof mobileNumber !== 'string') return false;
  const digitsOnly = mobileNumber.replace(/\D/g, '');
  const expectedLength = PHONE_LENGTH_BY_CODE[countryCode] ?? 10;
  return /^\d+$/.test(digitsOnly) && digitsOnly.length === expectedLength;
}

export function getPhoneMaxLength(countryCode = '+91') {
  return PHONE_LENGTH_BY_CODE[countryCode] ?? 10;
}

// Password: min 8 chars, at least one A-Z, one a-z, one 1-9, and one of $#&@
export function validatePassword(password) {
  if (!password || typeof password !== 'string') return false;
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[1-9])(?=.*[$#&@])(?=.{8,})/.test(password);
}

export const validateCustomerForm = (values) =>
  validateText(values.firstName) &&
  validateText(values.lastName) &&
  validateEmail(values.email) &&
  validateMobileNumber(values.phone, values.phone_code || '+91');