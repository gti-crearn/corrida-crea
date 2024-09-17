import crypto from 'crypto' 

export function convertToMD5(password) {
  // Crie um objeto hash MD5
  const md5Hash = crypto.createHash('md5');

  // Atualize o objeto hash com a senha em formato de string
  md5Hash.update(password, 'utf-8');

  // Gere a hash MD5 em formato hexadecimal
  const md5Password = md5Hash.digest('hex');

  return md5Password;
}

