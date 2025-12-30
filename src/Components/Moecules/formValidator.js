export const validateText = (text) => {
  const regex = /^[A-Za-z\s]{3,}$/; 
  return regex.test(text);
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
  const cleanPan = pan.replace(/[\s-]/g, '');
  const regex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  return regex.test(cleanPan);
}

export function validateCheque(cheque) {
  if (!cheque || typeof cheque !== 'string') return false;
  const cleanCheque = cheque.replace(/[\s-]/g, '');
  const regex = /^[0-9]{6}$/;
  return regex.test(cleanCheque);
}

export function validateMobileNumber(mobileNumber) {
  // 1. Check if the format is valid using your regex
  const isFormatValid = /^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(mobileNumber);
  
  if (!isFormatValid) return false; // Early exit if format is bad

  // 2. Remove all non-digit characters and check length
  const digitsOnly = mobileNumber.replace(/\D/g, '');
  
  // 3. Validate length (adjust min/max as needed)
  const isLengthValid = digitsOnly.length ===10;

  return isLengthValid;
}

export const validateCustomerForm = (values) =>
  validateText(values.firstName) &&
  validateText(values.lastName) &&
  validateEmail(values.email) &&
  validateMobileNumber(values.phone);