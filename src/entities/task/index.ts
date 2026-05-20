/**
 * Task Entity
 * Barrel export for task-related types, hooks, and components
 */

// Types
export type { TTask, TTaskCreate, TTaskUpdate } from './types'

// Hooks
export {
    useGetTasks,
    useGetTask,
    useCreateTask,
    useUpdateTask,
    useDeleteTask,
    useToggleTaskCompletion,
    TASK_QUERY_KEYS,
} from './hooks/use-task-queries'
