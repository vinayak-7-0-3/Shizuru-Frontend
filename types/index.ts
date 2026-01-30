export interface BaseTrack {
    created_at: string;
    updated_at: string;
    chat_id?: number;
    msg_id?: number;
    file_unique_id?: string;
    file_size?: number;
    file_name?: string;
    title: string;
    track_id?: string;
    artist: string;
    artist_id?: string;
    album?: string;
    album_id?: string;
    isrc?: string;
    track_no?: number;
    provider: string;
    duration?: number;
    tags?: string[];
    mime_type?: string;
    cover_url?: string;
}

export interface BaseArtist {
    created_at: string;
    updated_at: string;
    name: string;
    artist_id?: string;
    provider: string;
    tags?: string[];
    bio?: string;
    cover_url?: string;
}

export interface BaseAlbum {
    created_at: string;
    updated_at: string;
    title: string;
    album_id: string;
    artist: string;
    artist_id: string;
    provider: string;
    track_count: number;
    upc?: string;
    tags?: string[];
    cover_url?: string;
}

export interface PaginationParams {
    limit?: number;
    page?: number;
}

export interface ApiResponse<T> {
    data: T;
    error?: string;
    status: number;
}

export interface AlbumDetailed extends BaseAlbum {
    tracks: BaseTrack[];
}

export interface ArtistDetailed extends BaseArtist {
    albums: BaseAlbum[];
    tracks: BaseTrack[];
}

export interface SearchResponse {
    tracks: BaseTrack[];
    albums: BaseAlbum[];
    artists: BaseArtist[];
}