export const APP_MODE = process.env['APP_MODE'] || 'contributor';
export const NODE_ENV = process.env['NODE_ENV'] || 'development';

export const Environment = {
  isDesktop: APP_MODE === 'desktop',
  isContributor: APP_MODE === 'contributor',
  isDevelopment: NODE_ENV === 'development',
  isProduction: NODE_ENV === 'production',
};
