# Security Specification (Payload-First TDD)

## 1. Data Invariants
- Every user-owned document (`users`, `savedSearches`, `savedProperties`, `applications`, `conversations`, `messages`) must strictly match `request.auth.uid == resource.data.userId` (or `uid` on `/users/{userId}`).
- Document IDs must match `^[a-zA-Z0-9_\-]+$` and be at most 128 characters.
- `createdAt` and `updatedAt` timestamps must match `request.time` on creation, and `createdAt` + `userId` must remain immutable on update.
- `PropertyApplication` documents locked in terminal states (`Approved & Closing`, `Withdrawn`) cannot be mutated further by the client.
- Messages inside `/conversations/{conversationId}/messages/{messageId}` must verify parent conversation ownership via `get()` (`Master Gate`).

## 2. Adversarial "Dirty Dozen" Payloads
1. Unauthenticated read/write to `/savedSearches/{id}` -> `PERMISSION_DENIED`
2. Spoofed `userId` on create in `/applications/{id}` (`userId != request.auth.uid`) -> `PERMISSION_DENIED`
3. Shadow/ghost field injection (`isAdmin: true`) on `/users/{uid}` -> `PERMISSION_DENIED`
4. Oversized string ID (`1500` chars) in `/savedProperties/{id}` -> `PERMISSION_DENIED`
5. Invalid enum value (`status: "InstantApprove"`) in `/applications/{id}` -> `PERMISSION_DENIED`
6. Mutating immutable `createdAt` or `userId` on `/applications/{id}` update -> `PERMISSION_DENIED`
7. Updating a terminal application (`status == "Approved & Closing"`) -> `PERMISSION_DENIED`
8. Reading another user's `/users/{otherUid}` PII (`email`) -> `PERMISSION_DENIED`
9. Unfiltered list query on `/applications` without `userId == request.auth.uid` -> `PERMISSION_DENIED`
10. Creating a message in a `/conversations/{convId}/messages/{msgId}` owned by another user -> `PERMISSION_DENIED`
11. Client-forged `createdAt` timestamp not equal to `request.time` -> `PERMISSION_DENIED`
12. Unverified email user attempting write (`email_verified == false`) -> `PERMISSION_DENIED`
