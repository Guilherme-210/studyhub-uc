/**
 * Group Entity
 * Barrel export for group-related types, hooks, and components
 */

// Types
export type {
    TStudyGroup,
    TGroupCreate,
    TGroupUpdate,
    TGroupType,
    TGroupPrivacy,
    TGroupStatus,
    TMemberRole,
    TActivityLevel,
    TGroupCategory,
    TGroupMember,
    TJoinRequest,
    TGroupStudySession,
    TGroupNotification,
} from './types'

export { GROUP_CATEGORIES, ROLE_PERMISSIONS } from './types'

// Hooks
export {
    useGetGroups,
    useGetGroup,
    useCreateGroup,
    useUpdateGroup,
    useDeleteGroup,
    useJoinGroup,
    useLeaveGroup,
    GROUP_QUERY_KEYS,
} from './hooks/use-group-queries'
