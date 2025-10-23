import React from 'react';
import { Music, Search, Heart, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className='flex justify-center mb-4'>
        {icon || (
          <Music size={48} className='text-gray-400 dark:text-gray-500' />
        )}
      </div>

      <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
        {title}
      </h3>

      <p className='text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto'>
        {description}
      </p>

      {action && <div className='flex justify-center'>{action}</div>}
    </div>
  );
};

export const NoArtistsFound: React.FC<{ searchQuery?: string }> = ({
  searchQuery,
}) => (
  <EmptyState
    icon={<Search size={48} className='text-gray-400 dark:text-gray-500' />}
    title='Nenhum artista encontrado'
    description={
      searchQuery
        ? `Não encontramos artistas para "${searchQuery}". Que tal tentar outro nome?`
        : 'Comece digitando o nome de um artista na busca.'
    }
  />
);

export const NoFavorites: React.FC = () => (
  <EmptyState
    icon={<Heart size={48} className='text-gray-400 dark:text-gray-500' />}
    title='Nenhum favorito ainda'
    description='Adicione artistas, álbuns ou músicas aos seus favoritos para vê-los aqui.'
  />
);

export const NoTracks: React.FC = () => (
  <EmptyState
    icon={<Music size={48} className='text-gray-400 dark:text-gray-500' />}
    title='Nenhuma música encontrada'
    description='Este artista ainda não tem músicas disponíveis.'
  />
);

export const ErrorState: React.FC<{
  title?: string;
  description?: string;
  onRetry?: () => void;
}> = ({
  title = 'Algo deu errado',
  description = 'Ocorreu um erro inesperado. Tente novamente.',
  onRetry,
}) => {
  return (
    <EmptyState
      icon={<AlertCircle size={48} className='text-red-400' />}
      title={title}
      description={description}
      action={
        onRetry && (
          <button onClick={onRetry} className='btn-primary'>
            Tentar novamente
          </button>
        )
      }
    />
  );
};
