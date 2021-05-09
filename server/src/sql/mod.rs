mod account;
mod artist;
mod genre;
mod release;
mod release_artist;
mod release_genre_vote;
mod release_review;
mod release_type;
mod role;
mod track;
mod track_genre_vote;
mod track_review;

use crate::errors::Error;
use account::AccountDatabase;
use artist::ArtistDatabase;
use genre::GenreDatabase;
use release::ReleaseDatabase;
use release_artist::ReleaseArtistDatabase;
use release_genre_vote::ReleaseGenreVoteDatabase;
use release_review::ReleaseReviewDatabase;
use release_type::ReleaseTypeDatabase;
use role::RoleDatabase;
use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;
use track::TrackDatabase;
use track_genre_vote::TrackGenreVoteDatabase;
use track_review::TrackReviewDatabase;

#[derive(Debug, Clone)]
pub struct Database {
    pool: PgPool,
}

impl Database {
    pub async fn new(database_url: &str) -> Result<Self, Error> {
        let pool = PgPoolOptions::new()
            .max_connections(5)
            .connect(database_url)
            .await?;
        Ok(Self { pool })
    }

    pub fn account(&self) -> AccountDatabase {
        AccountDatabase::new(&self.pool)
    }

    pub fn release(&self) -> ReleaseDatabase {
        ReleaseDatabase::new(&self.pool)
    }

    pub fn release_review(&self) -> ReleaseReviewDatabase {
        ReleaseReviewDatabase::new(&self.pool)
    }

    pub fn track(&self) -> TrackDatabase {
        TrackDatabase::new(&self.pool)
    }

    pub fn track_review(&self) -> TrackReviewDatabase {
        TrackReviewDatabase::new(&self.pool)
    }

    pub fn artist(&self) -> ArtistDatabase {
        ArtistDatabase::new(&self.pool)
    }

    pub fn genre(&self) -> GenreDatabase {
        GenreDatabase::new(&self.pool)
    }

    pub fn release_genre_vote(&self) -> ReleaseGenreVoteDatabase {
        ReleaseGenreVoteDatabase::new(&self.pool)
    }

    pub fn track_genre_vote(&self) -> TrackGenreVoteDatabase {
        TrackGenreVoteDatabase::new(&self.pool)
    }

    pub fn role(&self) -> RoleDatabase {
        RoleDatabase::new(&self.pool)
    }

    pub fn release_type(&self) -> ReleaseTypeDatabase {
        ReleaseTypeDatabase::new(&self.pool)
    }

    pub fn release_artist(&self) -> ReleaseArtistDatabase {
        ReleaseArtistDatabase::new(&self.pool)
    }
}
