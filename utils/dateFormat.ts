import { formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

export const formatTimeAgo = (date: string | Date): string => {
  const timeAgo = formatDistanceToNowStrict(new Date(date), {
    addSuffix: true,
    locale: ptBR,
  });
  return timeAgo.replace("há", "Há");
};
