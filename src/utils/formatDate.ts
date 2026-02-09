import i18n from "../locales/i18n";

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };