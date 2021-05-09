mod account;
mod artist;
mod genre;
mod release;
mod release_review;
mod release_type;
mod track;
mod track_review;

use account::AccountQuery;
use artist::ArtistQuery;
use async_graphql::*;
use genre::GenreQuery;
use release::ReleaseQuery;
use release_review::ReleaseReviewQuery;
use release_type::ReleaseTypeQuery;
use track::TrackQuery;
use track_review::TrackReviewQuery;

pub struct Query;

#[Object]
impl Query {
    async fn account(&self) -> AccountQuery {
        AccountQuery
    }

    async fn artist(&self) -> ArtistQuery {
        ArtistQuery
    }

    async fn release(&self) -> ReleaseQuery {
        ReleaseQuery
    }

    async fn track(&self) -> TrackQuery {
        TrackQuery
    }

    async fn genre(&self) -> GenreQuery {
        GenreQuery
    }

    async fn release_review(&self) -> ReleaseReviewQuery {
        ReleaseReviewQuery
    }

    async fn track_review(&self) -> TrackReviewQuery {
        TrackReviewQuery
    }

    async fn release_type(&self) -> ReleaseTypeQuery {
        ReleaseTypeQuery
    }
}
