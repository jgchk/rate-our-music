mod account;
mod artist;
mod descriptor;
mod descriptor_vote;
mod genre;
mod genre_vote;
mod log;
mod release;
mod release_review;
mod tag;
mod track;
mod track_review;

use crate::errors::Error;
use account::AccountDatabase;
use artist::ArtistDatabase;
use descriptor::DescriptorDatabase;
use descriptor_vote::DescriptorVoteDatabase;
use genre::GenreDatabase;
use genre_vote::GenreVoteDatabase;
use log::LogDatabase;
use release::ReleaseDatabase;
use release_review::ReleaseReviewDatabase;
use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;
use tag::TagDatabase;
use track::TrackDatabase;
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

    pub fn genre_vote(&self) -> GenreVoteDatabase {
        GenreVoteDatabase::new(&self.pool)
    }

    pub fn descriptor(&self) -> DescriptorDatabase {
        DescriptorDatabase::new(&self.pool)
    }

    pub fn descriptor_vote(&self) -> DescriptorVoteDatabase {
        DescriptorVoteDatabase::new(&self.pool)
    }

    pub fn tag(&self) -> TagDatabase {
        TagDatabase::new(&self.pool)
    }

    pub fn log(&self) -> LogDatabase {
        LogDatabase::new(&self.pool)
    }
}
