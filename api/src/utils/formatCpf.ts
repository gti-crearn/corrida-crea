//Mascará para mostrar apenas os 6 primeiros digitos 
export const formatarCPF = (cpf: string) => {
    // Remove caracteres não numéricos do CPF
    const numerosCPF = cpf.replace(/\D/g, '');
  
    // Verifica se o CPF tem pelo menos 6 caracteres
    if (numerosCPF.length >= 6) {
      // Pega os 3 primeiros dígitos
      const tresPrimeirosDigitos = numerosCPF.substring(0, 3);
  
      // Pega os 3 dígitos seguintes
      const tresDigitosSeguintes = numerosCPF.substring(3, 6);
  
      // Completa o restante com pontos
      const cpfFormatado = `${tresPrimeirosDigitos}.${tresDigitosSeguintes}.....`;
  
      return cpfFormatado;
    } else {
      // Se o CPF não tiver pelo menos 6 caracteres, retorna o CPF original
      return cpf;
    }
  };