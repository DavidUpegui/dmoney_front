const NAME_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 255;

export function validateName(name: string): string | undefined {
  const value = name.trim();
  if (value.length === 0) {
    return 'Name is required';
  }
  if (value.length > NAME_MAX_LENGTH) {
    return `Name must be ${NAME_MAX_LENGTH} characters or fewer`;
  }
  return undefined;
}

export function validateDescription(description: string): string | undefined {
  if (description.trim().length > DESCRIPTION_MAX_LENGTH) {
    return `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer`;
  }
  return undefined;
}
