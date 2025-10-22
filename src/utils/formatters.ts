export const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const formatDurationFromSeconds = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return 'Hoje';
  }
  if (diffInDays === 1) {
    return 'Ontem';
  }
  if (diffInDays < 7) {
    return `${diffInDays} dias atrás`;
  }
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} semana${weeks > 1 ? 's' : ''} atrás`;
  }
  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} mês${months > 1 ? 'es' : ''} atrás`;
  }
  const years = Math.floor(diffInDays / 365);
  return `${years} ano${years > 1 ? 's' : ''} atrás`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const getImageUrl = (
  images: Array<{ url: string; height: number; width: number }>,
  preferredSize: 'small' | 'medium' | 'large' = 'medium'
): string => {
  if (!images || images.length === 0) {
    return '/placeholder-album.png';
  }

  const sizeMap = {
    small: 64,
    medium: 300,
    large: 640,
  };

  const targetSize = sizeMap[preferredSize];
  const sortedImages = images.sort(
    (a, b) => Math.abs(a.height - targetSize) - Math.abs(b.height - targetSize)
  );

  return sortedImages[0].url;
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
