// Helper function to validate field presence
const isFieldMissing = (fields: string[]): boolean => {
  return fields.some((field) => !field);
};

export default isFieldMissing;