import { useQuery } from '@tanstack/react-query';
import { getImageSrc } from '@/lib/server-actions';

export function useImageUrl(folderName: string, fileName: string) {
  return useQuery({
    queryKey: ['image', folderName, fileName],
    queryFn: () => getImageSrc({ folderName, fileName }),
    staleTime: 1000 * 60 * 60, 
    retry: 2,
  });
}