
export enum AlertMessage {
    GenreError = 'INSUFFICIENT_GENRES',
    TokenError = 'TOKEN_EXPIRED',
    SaveSuccess = 'SAVE_SUCCESS'
}

export const AlertVariant = {
    INSUFFICIENT_GENRES: 'error',
    TOKEN_EXPIRED: 'error',
    SAVE_SUCCESS: 'success'
}

export enum AlertString {
    GenreError = 'Please select at least one genre',
    TokenError = 'Your token has expired.',
    SaveSuccess = 'Playlist saved successfully!'
}