"use client";

import { BoardList } from "./components/board-list";
import { useRouter } from "next/navigation";
import { Visibility } from "@/types";

// Mock data for demonstration
const mockWorkspace = {
  id: "1",
  name: "Ants",
  isPrivate: true,
};

const mockBoards = [
  {
    id: "1",
    title: "DEVELOPMENT",
    description: null,
    visibility: Visibility.PUBLIC,
    tenantId: "1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    title: "INNOVATION",
    description: null,
    visibility: Visibility.PUBLIC,
    tenantId: "1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    title: "MARKETING",
    description: null,
    visibility: Visibility.PUBLIC,
    tenantId: "1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    title: "GROWING",
    description: null,
    visibility: Visibility.PUBLIC,
    tenantId: "1",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export default function BoardsPage() {
  const router = useRouter();

  // Temporarily disable auth redirect for testing
  /*
  useEffect(() => {
    router.push('/login');
  }, [router]);
  */
  return (
    <div className="container mx-auto py-6">
    
      <BoardList 
        workspace={mockWorkspace}
        boards={mockBoards}
        remainingBoardsCount={6}
      />
    </div>
  );
}
