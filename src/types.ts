export interface SurveyFormData {
  perfil: string;
  comoSoube: string;
  outroComoSoubeText?: string;
  veioOutraCidade: 'Sim' | 'Não' | '';
  hospedagem?: string;
  outroHospedagemText?: string;
  gasto: string;
  outroGastoText?: string;
  beneficiosEconomicos: 'Sim' | 'Não' | 'Não sei dizer' | '';
  maiorImpacto?: string;
  outroImpactoText?: string;
  organizacao: 'Excelente' | 'Boa' | 'Regular' | 'Ruim' | 'Péssima' | '';
  acessibilidade: 'Sim' | 'Parcialmente' | 'Não' | '';
  turismo: 'Sim' | 'Não' | 'Não sei dizer' | '';
  impactoAmbiental: 'Sim' | 'Não' | '';
  sustentabilidade: 'Sim' | 'Não' | 'Não sei dizer' | '';
  visitaTuristica: 'Sim' | 'Não' | '';
  recomendaria: 'Sim' | 'Não' | '';
}