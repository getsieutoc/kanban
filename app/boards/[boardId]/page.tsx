import { getListsFromBoard } from '@/actions/lists';
import { PageProps } from '@/types';

export default async function BoardPage({
  params,
}: PageProps<{ boardId: string }>) {
  const { boardId } = await params;

  const lists = await getListsFromBoard(boardId);
  console.log('### lists: ', lists);

  return <div>BoardPage</div>;
}
