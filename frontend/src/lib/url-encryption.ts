const ENCRYPTION_KEY = 'municipality-service-2024'
const SEPARATOR = '-'

export function encryptServiceId(serviceId: string): string {
  try {
    let encrypted = ''
    for (let i = 0; i < serviceId.length; i++) {
      const charCode = serviceId.charCodeAt(i)
      const keyChar = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
      const encryptedChar = charCode ^ keyChar
      encrypted += encryptedChar.toString(16).padStart(2, '0')
    }
    
    const hash = simpleHash(serviceId)
    return `${encrypted}${SEPARATOR}${hash}`
  } catch (error) {
    console.error('Encryption failed:', error)
    return serviceId 
  }
}

export function decryptServiceId(encryptedId: string): string | null {
  try {
    const parts = encryptedId.split(SEPARATOR)
    if (parts.length !== 2) {
      return null
    }
    
    const [encrypted, hash] = parts
    
    let decrypted = ''
    for (let i = 0; i < encrypted.length; i += 2) {
      const hexChar = encrypted.substr(i, 2)
      const encryptedChar = parseInt(hexChar, 16)
      const keyChar = ENCRYPTION_KEY.charCodeAt((i / 2) % ENCRYPTION_KEY.length)
      const decryptedChar = encryptedChar ^ keyChar
      decrypted += String.fromCharCode(decryptedChar)
    }
    
    const expectedHash = simpleHash(decrypted)
    if (hash !== expectedHash) {
      return null
    }
    
    return decrypted
  } catch (error) {
    console.error('Decryption failed:', error)
    return null
  }
}

function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash 
  }
  return Math.abs(hash).toString(16)
}

export function isEncryptedServiceId(id: string): boolean {
  return id.includes(SEPARATOR) && id.split(SEPARATOR).length === 2
}

export function getServiceIdFromUrl(urlParam: string): string | null {
  if (isEncryptedServiceId(urlParam)) {
    return decryptServiceId(urlParam)
  }
  return urlParam
}
